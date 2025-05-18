import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, Session, EducatorProfile } from "@/lib/types";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { insertEducatorProfileSchema } from "@shared/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, StarIcon } from "@/lib/icons";
import EducatorProfileTips from "@/components/EducatorProfileTips";
import { Checkbox } from "@/components/ui/checkbox";
import SubjectSelector from "@/components/SubjectSelector";

// Modified educator profile schema for the form
const educatorProfileSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  hourlyRate: z.coerce.number().min(5, { message: "Hourly rate must be at least 5" }),
  experience: z.string().optional(),
  education: z.string().optional(),
  teachingMethod: z.string().min(10, { message: "Please describe your teaching method in at least 10 characters" }),
  videoIntroduction: z.string().url().optional().or(z.literal('')),
  specialties: z.array(z.string()).min(1, { message: "Select at least one specialty" }),
});

type EducatorProfileFormValues = z.infer<typeof educatorProfileSchema>;

const Dashboard = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("sessions");
  
  // Get query parameters
  const searchParams = new URLSearchParams(window.location.search);
  const setupParam = searchParams.get("setup");
  
  // If setup=educator and user is an educator, pre-select profile tab
  useEffect(() => {
    if (setupParam === "educator") {
      setActiveTab("profile");
    }
  }, [setupParam]);
  
  // Fetch current user
  const { data: currentUser, isLoading: userLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/current-user"],
  });
  
  // Redirect to sign in if not logged in
  useEffect(() => {
    if (!userLoading && !currentUser) {
      navigate("/signin?redirect=/dashboard");
    }
  }, [currentUser, userLoading, navigate]);
  
  // Set page title
  useEffect(() => {
    document.title = "Dashboard | Aithenode";
  }, []);
  
  // If loading or no user, show loading state
  if (userLoading || !currentUser) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-lg text-gray-600">
                Welcome back, {currentUser.firstName}!
              </p>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="sessions">My Sessions</TabsTrigger>
              {currentUser.userType === "educator" && (
                <TabsTrigger value="profile">Educator Profile</TabsTrigger>
              )}
              <TabsTrigger value="account">Account Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sessions">
              <SessionsTab currentUser={currentUser} />
            </TabsContent>
            
            {currentUser.userType === "educator" && (
              <TabsContent value="profile">
                <EducatorProfileTab currentUser={currentUser} />
              </TabsContent>
            )}
            
            <TabsContent value="account">
              <AccountTab currentUser={currentUser} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const SessionsTab = ({ currentUser }: { currentUser: User }) => {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [userSessions, setUserSessions] = useState<Session[]>([]);
  
  // Fetch student or educator sessions based on user type
  const { data: sessions, isLoading: sessionsLoading } = useQuery<Session[]>({
    queryKey: [
      `/api/sessions?type=${currentUser.userType === "educator" ? "educator" : "student"}`,
    ],
  });
  
  // Mutation for updating session status
  const updateSessionStatus = useMutation({
    mutationFn: async ({
      sessionId,
      status,
    }: {
      sessionId: number;
      status: string;
    }) => {
      return apiRequest("PATCH", `/api/sessions/${sessionId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
      toast({
        title: "Session updated",
        description: "The session status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update the session status. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Mutation for updating payment status
  const updatePaymentStatus = useMutation({
    mutationFn: async ({
      sessionId,
      status,
    }: {
      sessionId: number;
      status: string;
    }) => {
      return apiRequest("PATCH", `/api/sessions/${sessionId}/payment`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
      toast({
        title: "Payment updated",
        description: "The payment status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update the payment status. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Update sessions when they change
  useEffect(() => {
    if (sessions) {
      // Sort sessions by date (newest first)
      const sortedSessions = [...sessions].sort(
        (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      );
      setUserSessions(sortedSessions);
    }
  }, [sessions]);
  
  // Handle session status update
  const handleStatusUpdate = (sessionId: number, status: string) => {
    updateSessionStatus.mutate({ sessionId, status });
  };
  
  // Handle payment status update
  const handlePaymentUpdate = (sessionId: number, status: string) => {
    updatePaymentStatus.mutate({ sessionId, status });
  };
  
  // Get appropriate action buttons based on session status and user type
  const getActionButtons = (session: Session) => {
    const isEducator = currentUser.userType === "educator";
    const isStudent = currentUser.userType === "student";
    
    switch (session.status) {
      case "requested":
        if (isEducator) {
          return (
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-green-600 border-green-600 hover:bg-green-50"
                onClick={() => handleStatusUpdate(session.id, "confirmed")}
              >
                Confirm
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-600 border-red-600 hover:bg-red-50"
                onClick={() => handleStatusUpdate(session.id, "cancelled")}
              >
                Decline
              </Button>
            </div>
          );
        } else if (isStudent) {
          return (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-600 border-red-600 hover:bg-red-50"
              onClick={() => handleStatusUpdate(session.id, "cancelled")}
            >
              Cancel
            </Button>
          );
        }
        return null;
        
      case "confirmed":
        if (isEducator) {
          return (
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-green-600 border-green-600 hover:bg-green-50"
                onClick={() => handleStatusUpdate(session.id, "completed")}
              >
                Mark Completed
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-600 border-red-600 hover:bg-red-50"
                onClick={() => handleStatusUpdate(session.id, "cancelled")}
              >
                Cancel
              </Button>
            </div>
          );
        } else if (isStudent && session.paymentStatus === "pending") {
          return (
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-green-600 border-green-600 hover:bg-green-50"
                onClick={() => handlePaymentUpdate(session.id, "paid")}
              >
                Pay Now
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-600 border-red-600 hover:bg-red-50"
                onClick={() => handleStatusUpdate(session.id, "cancelled")}
              >
                Cancel
              </Button>
            </div>
          );
        } else if (isStudent) {
          return (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-600 border-red-600 hover:bg-red-50"
              onClick={() => handleStatusUpdate(session.id, "cancelled")}
            >
              Cancel
            </Button>
          );
        }
        return null;
        
      case "completed":
        if (isEducator && session.paymentStatus === "paid") {
          return <Badge className="bg-green-100 text-green-800 border-green-200">Completed & Paid</Badge>;
        } else if (isEducator) {
          return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Awaiting Payment</Badge>;
        } else if (isStudent && session.paymentStatus === "pending") {
          return (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-green-600 border-green-600 hover:bg-green-50"
              onClick={() => handlePaymentUpdate(session.id, "paid")}
            >
              Pay Now
            </Button>
          );
        } else if (isStudent && session.paymentStatus === "paid") {
          return <Badge className="bg-green-100 text-green-800 border-green-200">Paid</Badge>;
        }
        return null;
        
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Cancelled</Badge>;
        
      default:
        return null;
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "requested":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Requested</Badge>;
      case "confirmed":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Confirmed</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-primary-100 text-primary-800 border-primary-200">Completed</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Cancelled</Badge>;
      default:
        return null;
    }
  };
  
  // Get payment status badge
  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case "paid":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Paid</Badge>;
      case "refunded":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Refunded</Badge>;
      default:
        return null;
    }
  };
  
  if (sessionsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Sessions</CardTitle>
          <CardDescription>
            View and manage your learning sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-full"></div>
            <div className="h-20 bg-gray-200 rounded w-full"></div>
            <div className="h-20 bg-gray-200 rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Sessions</CardTitle>
        <CardDescription>
          {currentUser.userType === "student" 
            ? "View and manage your learning sessions with educators"
            : "View and manage your teaching sessions with students"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {userSessions && userSessions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>{currentUser.userType === "student" ? "Educator" : "Student"}</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userSessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                      <div>
                        <div>{session.formattedStartTime}</div>
                        <div className="text-xs text-gray-500">
                          {session.formattedEndTime}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {currentUser.userType === "student" 
                      ? session.educator?.user.firstName + " " + session.educator?.user.lastName
                      : session.student?.firstName + " " + session.student?.lastName}
                  </TableCell>
                  <TableCell>{getStatusBadge(session.status)}</TableCell>
                  <TableCell>{getPaymentBadge(session.paymentStatus)}</TableCell>
                  <TableCell>${session.totalPrice}</TableCell>
                  <TableCell>{getActionButtons(session)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions yet</h3>
            <p className="text-gray-500 mb-6">
              {currentUser.userType === "student" 
                ? "Book a session with an educator to get started with your learning journey."
                : "You don't have any teaching sessions yet. When students book sessions with you, they'll appear here."}
            </p>
            {currentUser.userType === "student" && (
              <Button onClick={() => navigate("/find-educators")}>
                Find Educators
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const EducatorProfileTab = ({ currentUser }: { currentUser: User }) => {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<number[]>([]);
  
  // Fetch educator profile
  const { data: profile, isLoading: profileLoading } = useQuery<EducatorProfile>({
    queryKey: [`/api/educator-profiles/byUser/${currentUser.id}`],
    retry: false,
    onSuccess: (data) => {
      console.log("Loaded educator profile with subjects:", data?.subjects);
    }
  });
  
  // Check if we need to create a new profile
  useEffect(() => {
    if (!profileLoading && !profile) {
      setIsEditMode(true);
    }
  }, [profile, profileLoading]);
  
  // Fetch educator's current subjects when profile is loaded
  useEffect(() => {
    if (profile && profile.subjects) {
      setSelectedSubjectIds(profile.subjects.map(subject => subject.id));
    }
  }, [profile]);
  
  // Pre-defined specialties for the form
  const specialtyOptions = [
    "Calculus", "Statistics", "Algebra", "Geometry", "Trigonometry",
    "JavaScript", "Python", "Web Development", "Machine Learning", "Data Science",
    "Spanish", "French", "English Literature", "Grammar", "Conversation",
    "Piano", "Guitar", "Music Theory", "Violin", "Singing",
    "Physics", "Chemistry", "Biology", "Astronomy", "Environmental Science",
    "Drawing", "Painting", "Graphic Design", "Photography", "Sculpture",
    "Economics", "Finance", "Marketing", "Accounting", "Management"
  ];
  
  const form = useForm<EducatorProfileFormValues>({
    resolver: zodResolver(educatorProfileSchema),
    defaultValues: {
      title: profile?.title || "",
      hourlyRate: profile?.hourlyRate || 40,
      experience: profile?.experience || "",
      education: profile?.education || "",
      teachingMethod: profile?.teachingMethod || "",
      videoIntroduction: profile?.videoIntroduction || "",
      specialties: profile?.specialties || [],
    },
  });
  
  // Update form when profile data loads
  useEffect(() => {
    if (profile) {
      form.reset({
        title: profile.title,
        hourlyRate: profile.hourlyRate,
        experience: profile.experience || "",
        education: profile.education || "",
        teachingMethod: profile.teachingMethod || "",
        videoIntroduction: profile.videoIntroduction || "",
        specialties: profile.specialties || [],
      });
    }
  }, [profile, form]);
  
  // Create/update profile mutation
  const profileMutation = useMutation({
    mutationFn: async (data: EducatorProfileFormValues) => {
      console.log("Submitting profile data:", data);
      if (profile) {
        // Update profile
        const result = await apiRequest("PATCH", `/api/educator-profiles/${profile.id}`, data);
        console.log("Profile update response:", result);
        return result;
      } else {
        // Create new profile
        return apiRequest("POST", "/api/educator-profiles", data);
      }
    },
    onSuccess: async (data) => {
      // After profile is created/updated, save the selected subjects
      try {
        if (selectedSubjectIds.length > 0) {
          const result = await apiRequest("POST", "/api/educator-subjects", {
            subjectIds: selectedSubjectIds
          });
          
          // Invalidate all profile-related queries to ensure they refresh
          queryClient.invalidateQueries({ queryKey: ["/api/educator-profiles"] });
          queryClient.invalidateQueries({ queryKey: [`/api/educator-profiles/byUser/${currentUser.id}`] });
          queryClient.invalidateQueries({ queryKey: [`/api/educator-profiles/${profile?.id}`] });
        }
        
        // Invalidate both the general educator profiles list and the specific user profile
        queryClient.invalidateQueries({ queryKey: ["/api/educator-profiles"] });
        queryClient.invalidateQueries({ queryKey: [`/api/educator-profiles/byUser/${currentUser.id}`] });
        
        toast({
          title: profile ? "Profile updated" : "Profile created",
          description: profile 
            ? "Your educator profile has been updated successfully." 
            : "Your educator profile has been created successfully.",
        });
        setIsEditMode(false);
      } catch (error) {
        toast({
          title: "Warning",
          description: "Profile saved but there was an issue updating your teaching subjects.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: profile 
          ? "Failed to update your profile. Please try again." 
          : "Failed to create your profile. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: EducatorProfileFormValues) => {
    profileMutation.mutate(data);
  };
  
  if (profileLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Educator Profile</CardTitle>
          <CardDescription>
            Manage your educator profile and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-20 bg-gray-200 rounded w-full"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-20 bg-gray-200 rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (isEditMode) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{profile ? "Edit" : "Create"} Educator Profile</CardTitle>
          <CardDescription>
            {profile 
              ? "Update your educator profile to attract more students"
              : "Set up your educator profile to start teaching on Aithenode"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Mathematics Tutor, Programming Instructor" {...field} />
                    </FormControl>
                    <FormDescription>
                      This will be displayed prominently on your profile
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="hourlyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hourly Rate ($)</FormLabel>
                    <FormControl>
                      <Input type="number" min="5" step="5" {...field} />
                    </FormControl>
                    <FormDescription>
                      Set your hourly rate for teaching sessions
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience & Skills</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Detail your work experience, teaching achievements (years of experience, institutions, student achievements), projects, and relevant soft skills (communication, teaching ability, patience)"
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide specific details about your teaching background, achievements, and relevant skills. 
                      The more specific and credible this information is, the more trust it builds with potential students.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="education"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Education</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="List your degrees, certifications, and educational background"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="teachingMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teaching Method</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your teaching approach, philosophy, or unique methods that help students learn effectively"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Explain how you teach, your educational philosophy, or what makes your teaching style unique. 
                      This helps students understand how your classes will be conducted.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="videoIntroduction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video Introduction (URL)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://www.youtube.com/watch?v=example"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Add a link to a short 1-3 minute video introduction. This significantly increases student interest.
                      Upload your video to YouTube, Vimeo, or another hosting platform and paste the link here.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="specialties"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialties</FormLabel>
                    <FormControl>
                      <div className="flex flex-wrap gap-2 border rounded-md p-4 max-h-48 overflow-y-auto">
                        {specialtyOptions.map((specialty) => (
                          <div key={specialty} className="flex items-center space-x-2">
                            <Checkbox
                              id={specialty}
                              checked={field.value.includes(specialty)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...field.value, specialty]);
                                } else {
                                  field.onChange(field.value.filter(item => item !== specialty));
                                }
                              }}
                            />
                            <label
                              htmlFor={specialty}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {specialty}
                            </label>
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Select your areas of specialty within your teaching subjects
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Teaching Subjects</label>
                <SubjectSelector 
                  selectedSubjectIds={selectedSubjectIds}
                  onChange={setSelectedSubjectIds}
                />
                <p className="text-sm text-gray-500">
                  These are the subjects you'll be listed under in searches
                </p>
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline" type="button" onClick={() => setIsEditMode(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={profileMutation.isPending}>
                  {profile ? "Update" : "Create"} Profile
                </Button>
              </div>
            </form>
          </Form>
          
          {!profile && <EducatorProfileTips />}
        </CardContent>
      </Card>
    );
  }
  
  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Educator Profile</CardTitle>
          <CardDescription>
            Set up your educator profile to start teaching on Aithenode
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No profile set up yet</h3>
          <p className="text-gray-500 mb-6">
            Create your educator profile to start accepting students and teaching sessions.
          </p>
          <Button onClick={() => setIsEditMode(true)}>
            Create Educator Profile
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Educator Profile</CardTitle>
          <CardDescription>
            Manage your educator profile and preferences
          </CardDescription>
        </div>
        <Button variant="outline" onClick={() => setIsEditMode(true)}>
          Edit Profile
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Professional Title</h3>
            <p className="text-gray-700">{profile.title}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Hourly Rate</h3>
            <p className="text-gray-700">${profile.hourlyRate}</p>
          </div>
          
          {profile.experience && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Experience & Skills</h3>
              <p className="text-gray-700">{profile.experience}</p>
            </div>
          )}
          
          {profile.education && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Education</h3>
              <p className="text-gray-700">{profile.education}</p>
            </div>
          )}
          
          {profile.teachingMethod && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Teaching Method</h3>
              <p className="text-gray-700">{profile.teachingMethod}</p>
            </div>
          )}
          
          {profile.videoIntroduction && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Video Introduction</h3>
              <div className="aspect-video">
                <iframe 
                  src={profile.videoIntroduction.replace('watch?v=', 'embed/')}
                  className="w-full h-full rounded-md"
                  title="Video Introduction"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
          
          {profile.specialties && profile.specialties.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {profile.specialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {profile.subjects && profile.subjects.length > 0 ? (
            <div>
              <h3 className="text-lg font-semibold mb-2">Teaching Subjects</h3>
              <div className="space-y-4">
                {Array.from(new Set(profile.subjects.map(subject => subject.category?.id))).map(categoryId => {
                  if (!categoryId) return null;
                  const categorySubjects = profile.subjects!.filter(subject => subject.category?.id === categoryId);
                  const categoryName = categorySubjects[0]?.category?.name || "Other";
                  
                  return (
                    <div key={categoryId} className="space-y-1">
                      <h4 className="text-sm text-gray-500">{categoryName}</h4>
                      <div className="flex flex-wrap gap-2">
                        {categorySubjects.map(subject => (
                          <Badge key={subject.id} variant="secondary" className="text-sm">
                            {subject.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold mb-2">Teaching Subjects</h3>
              <p className="text-gray-500">No teaching subjects selected. Click Edit Profile to add subjects you teach.</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-6">
        <div className="w-full">
          <h3 className="text-md font-semibold mb-2">Profile Visibility</h3>
          <p className="text-sm text-gray-500 mb-4">
            Your profile is visible to students searching for educators in your specialties.
          </p>
          <Button className="w-full md:w-auto" onClick={() => navigate(`/educators/${profile.id}`)}>
            View Public Profile
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const AccountTab = ({ currentUser }: { currentUser: User }) => {
  const { toast } = useToast();
  
  const handleSignOut = async () => {
    try {
      await apiRequest("POST", "/api/auth/signout", {});
      window.location.href = "/";
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>
          Manage your account preferences and personal information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-md font-semibold mb-2">Personal Information</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Name</span>
                <p>{currentUser.firstName} {currentUser.lastName}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Email</span>
                <p>{currentUser.email}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Username</span>
                <p>{currentUser.username}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Account Type</span>
                <p className="capitalize">{currentUser.userType}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-semibold mb-2">Account Actions</h3>
            <div className="space-y-4">
              <Button variant="outline" className="w-full" disabled>
                Change Password
              </Button>
              <Button variant="outline" className="w-full" disabled>
                Edit Profile
              </Button>
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
