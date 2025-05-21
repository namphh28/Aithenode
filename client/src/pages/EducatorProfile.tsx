import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useRoute } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { EducatorProfile as EducatorProfileType } from "@/lib/types";
import { StarIcon, CalendarIcon } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatRating } from "@/lib/data";
import ReviewForm from "@/components/ReviewForm";

const EducatorProfile = () => {
  const [match, params] = useRoute("/educators/:id");
  const educatorId = match ? parseInt(params.id) : null;
  
  const { data: educator, isLoading, error } = useQuery<EducatorProfileType>({
    queryKey: [`/api/educator-profiles/${educatorId}`],
    enabled: !!educatorId,
  });
  
  // Set page title
  useEffect(() => {
    if (educator) {
      document.title = `${educator.user.firstName} ${educator.user.lastName} | Aithenode`;
    } else {
      document.title = "Educator Profile | Aithenode";
    }
  }, [educator]);
  
  // Generate stars based on rating
  const renderStars = (rating: number = 0) => {
    const stars = [];
    const roundedRating = Math.round(rating * 2) / 2; // Round to nearest 0.5
    
    for (let i = 1; i <= 5; i++) {
      if (i <= roundedRating) {
        // Full star
        stars.push(<StarIcon key={i} className="text-yellow-400" filled />);
      } else if (i - 0.5 === roundedRating) {
        // Half star
        stars.push(<i key={i} className="fas fa-star-half-alt text-yellow-400"></i>);
      } else {
        // Empty star
        stars.push(<StarIcon key={i} className="text-yellow-400" />);
      }
    }
    
    return stars;
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-t-lg"></div>
              <div className="bg-white p-6 rounded-b-lg shadow-md">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-gray-200 h-24 w-24"></div>
                  <div className="flex-1">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (error || !educator) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Educator Not Found</h1>
            <p className="text-lg text-gray-600 mb-8">
              We couldn't find the educator you're looking for.
            </p>
            <Link href="/find-educators">
              <Button>Browse Educators</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const { user, title, hourlyRate, experience, education, specialties, availability, subjects = [], reviews = [], averageRating = 0, reviewCount = 0, teachingMethod, videoIntroduction } = educator;
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero section */}
        <div className="bg-primary text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="md:flex items-center space-y-6 md:space-y-0 md:space-x-8">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img 
                  src={user.profileImage || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random&size=200`} 
                  alt={`${user.firstName} ${user.lastName}`} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold flex items-center">
                  {user.firstName} {user.lastName}
                  {user.isVerified && (
                    <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-200">
                      Verified
                    </Badge>
                  )}
                </h1>
                <p className="text-xl mt-1">{title}</p>
                
                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    {renderStars(averageRating)}
                  </div>
                  <span className="ml-2 text-white">
                    {formatRating(averageRating)} ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {specialties?.map((specialty, index) => (
                    <Badge key={index} className="bg-white/20 hover:bg-white/30 text-white border-none">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column: About, subjects, reviews */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="about">
                <TabsList className="mb-6">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="subjects">Subjects</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                
                <TabsContent value="about">
                  <Card>
                    <CardHeader>
                      <CardTitle>About {user.firstName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Bio</h3>
                          <p className="text-gray-700">{user.bio || "No bio provided."}</p>
                        </div>
                        
                        {experience && (
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Experience & Skills</h3>
                            <p className="text-gray-700">{experience}</p>
                          </div>
                        )}
                        
                        {education && (
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Education</h3>
                            <p className="text-gray-700">{education}</p>
                          </div>
                        )}
                        
                        {teachingMethod && (
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Teaching Method</h3>
                            <p className="text-gray-700">{teachingMethod}</p>
                          </div>
                        )}
                        
                        {videoIntroduction && (
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Video Introduction</h3>
                            <div className="aspect-video">
                              <iframe 
                                src={videoIntroduction.replace('watch?v=', 'embed/')}
                                className="w-full h-full rounded-md"
                                title="Video Introduction"
                                allowFullScreen
                              ></iframe>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="subjects">
                  <Card>
                    <CardHeader>
                      <CardTitle>Subjects {user.firstName} Teaches</CardTitle>
                      <CardDescription>
                        Browse the subjects and disciplines {user.firstName} specializes in.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {subjects && subjects.length > 0 ? (
                        <div className="space-y-6">
                          {/* Group subjects by category */}
                          {Array.from(new Set(subjects.map(subject => subject.category?.id))).map(categoryId => {
                            if (!categoryId) return null;
                            const categorySubjects = subjects.filter(subject => subject.category?.id === categoryId);
                            const categoryName = categorySubjects[0]?.category?.name || "Other";
                            
                            return (
                              <div key={categoryId}>
                                <h3 className="text-lg font-semibold mb-2">{categoryName}</h3>
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
                      ) : (
                        <p className="text-gray-500">No subjects listed.</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="reviews">
                  <Card>
                    <CardHeader>
                      <CardTitle>Student Reviews</CardTitle>
                      <CardDescription>
                        Read what students have to say about {user.firstName}'s teaching.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {reviews.length > 0 ? (
                        <div className="space-y-6">
                          {reviews.map(review => (
                            <div key={review.id} className="border-b border-gray-200 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                                    <img 
                                      src={review.student?.profileImage || `https://ui-avatars.com/api/?name=${review.student?.firstName}+${review.student?.lastName}&background=random`} 
                                      alt={`${review.student?.firstName} ${review.student?.lastName}`} 
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <div className="font-medium">{review.student?.firstName} {review.student?.lastName}</div>
                                    <div className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</div>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  {renderStars(review.rating)}
                                </div>
                              </div>
                              {review.comment && (
                                <p className="mt-2 text-gray-700">{review.comment}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-gray-500 mb-4">No reviews yet. Be the first to leave a review!</p>
                          <ReviewForm educatorId={educator.id} />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Right column: Booking card, availability */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">${hourlyRate}<span className="text-sm font-normal text-gray-500">/hour</span></CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Link href={`/book/${educator.id}`}>
                    <Button className="w-full flex items-center justify-center">
                      <CalendarIcon className="mr-2" />
                      Book a Session
                    </Button>
                  </Link>
                  
                  <div>
                    <h3 className="text-md font-semibold mb-3">Availability</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Day</TableHead>
                          <TableHead>Times</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {availability && Object.keys(availability).length > 0 ? (
                          Object.entries(availability).map(([day, times]) => (
                            <TableRow key={day}>
                              <TableCell className="font-medium capitalize">{day}</TableCell>
                              <TableCell>
                                {Array.isArray(times) && times.map((time, i) => (
                                  <span key={i}>
                                    {time}{i < times.length - 1 ? ', ' : ''}
                                  </span>
                                ))}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={2} className="text-center text-gray-500">
                              No availability information provided.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {reviews.length > 0 && (
                    <ReviewForm educatorId={educator.id} />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EducatorProfile;
