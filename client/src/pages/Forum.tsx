import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Search, MessageSquare, Users } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { ForumPost, searchPosts, createPost } from "@/lib/forum";
import { User } from "@/lib/types";

// Form validation schema
const createDiscussionSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  tags: z.array(z.string()).min(1, "Select at least one tag"),
});

type CreateDiscussionValues = z.infer<typeof createDiscussionSchema>;

const Forum = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Get current user
  const { data: currentUser } = useQuery<User | null>({
    queryKey: ["/api/auth/current-user"],
  });

  // Create discussion form
  const form = useForm<CreateDiscussionValues>({
    resolver: zodResolver(createDiscussionSchema),
    defaultValues: {
      title: "",
      content: "",
      level: "Beginner",
      tags: [],
    },
  });

  // Mock tags - in real app, fetch from API
  const availableTags = [
    "JavaScript",
    "Python",
    "React",
    "Machine Learning",
    "Web Development",
    "Data Science",
  ];

  // Fetch posts with search and filters
  const { data: posts, isLoading, refetch } = useQuery<ForumPost[]>({
    queryKey: ["forum-posts", searchQuery, selectedLevel, selectedTag],
    queryFn: () => searchPosts(searchQuery, selectedLevel, selectedTag),
  });

  // Handle form submission
  const onSubmit = async (data: CreateDiscussionValues) => {
    try {
      if (!currentUser) {
        toast({
          title: "Not signed in",
          description: "Please sign in to create a discussion.",
          variant: "destructive",
        });
        return;
      }

      // Create the post
      await createPost(data, currentUser);
      
      // Show success message
      toast({
        title: "Discussion created",
        description: "Your discussion has been posted successfully.",
      });
      
      // Close dialog and reset form
      setIsDialogOpen(false);
      form.reset();
      
      // Refetch posts to show the new one
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create discussion. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold">Community Forum</h1>
              <p className="mt-2 text-gray-600">
                Join discussions, ask questions, and share your knowledge with fellow learners
              </p>
            </div>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search discussions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  {availableTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Create Discussion Button and Dialog */}
            <div className="flex justify-end">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Start Discussion
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <DialogHeader>
                        <DialogTitle>Create New Discussion</DialogTitle>
                        <DialogDescription>
                          Share your question or start a discussion with the community.
                        </DialogDescription>
                      </DialogHeader>

                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="What's your question or topic?" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe your question or topic in detail..."
                                className="min-h-[150px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="level"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Difficulty Level</FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Beginner">Beginner</SelectItem>
                                <SelectItem value="Intermediate">Intermediate</SelectItem>
                                <SelectItem value="Advanced">Advanced</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <div className="flex flex-wrap gap-2">
                              {availableTags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant={field.value.includes(tag) ? "default" : "outline"}
                                  className="cursor-pointer"
                                  onClick={() => {
                                    const newTags = field.value.includes(tag)
                                      ? field.value.filter((t) => t !== tag)
                                      : [...field.value, tag];
                                    field.onChange(newTags);
                                  }}
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <DialogFooter>
                        <Button type="submit">Create Discussion</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Discussion List */}
            <div className="space-y-4">
              {isLoading ? (
                <div>Loading discussions...</div>
              ) : posts?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No discussions found matching your criteria
                </div>
              ) : (
                posts?.map((post) => (
                  <Link key={post.id} href={`/forum/${post.id}`}>
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-xl">
                          {post.title}
                        </CardTitle>
                        <CardDescription>
                          <div className="flex items-center space-x-2 text-sm">
                            <span>Posted by {post.author.name}</span>
                            <span>•</span>
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 line-clamp-2">{post.content}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                          <Badge variant="outline">{post.level}</Badge>
                        </div>
                      </CardContent>
                      <CardFooter className="text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <MessageSquare className="mr-1 h-4 w-4" />
                            {post.replies} replies
                          </div>
                          <div className="flex items-center">
                            <Users className="mr-1 h-4 w-4" />
                            {post.views} views
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Forum; 