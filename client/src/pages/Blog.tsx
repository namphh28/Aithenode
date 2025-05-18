import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BlogEventNav } from "@/components/BlogEventNav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Search, Heart, MessageSquare, PenSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { BlogPost, User } from "@/lib/types";
import { searchBlogPosts, createBlogPost, toggleBlogLike } from "@/lib/blog";

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Get current user
  const { data: currentUser } = useQuery<User | null>({
    queryKey: ["/api/auth/current-user"],
  });

  // Available categories and tags
  const categories = [
    "Technology",
    "Programming",
    "Data Science",
    "Web Development",
    "Career",
    "Education"
  ];

  const tags = [
    "JavaScript",
    "Python",
    "React",
    "Machine Learning",
    "Web Development",
    "Data Science",
    "Career Growth",
    "Learning Tips"
  ];

  // Fetch posts with search and filters
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["blog-posts", searchQuery, selectedCategory, selectedTag],
    queryFn: () => searchBlogPosts(searchQuery, selectedCategory, selectedTag),
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <BlogEventNav />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold">Blog</h1>
              <p className="mt-2 text-gray-600">
                Discover insights, tutorials, and stories from our community
              </p>
            </div>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  {tags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Create Post Button */}
            <div className="flex justify-end">
              <Button onClick={() => setIsDialogOpen(true)}>
                <PenSquare className="mr-2 h-4 w-4" />
                Write Article
              </Button>
            </div>

            {/* Blog Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                // Loading skeletons
                Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : posts?.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No articles found</p>
                </div>
              ) : (
                posts?.map((post) => (
                  <Card key={post.id} className="overflow-hidden">
                    <Link href={`/blog/${post.id}`}>
                      <a>
                        {post.coverImage && (
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-48 object-cover"
                          />
                        )}
                        <CardHeader>
                          <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                          <CardDescription className="flex items-center space-x-2">
                            <img
                              src={post.author.avatar}
                              alt={post.author.name}
                              className="w-6 h-6 rounded-full"
                            />
                            <span>{post.author.name}</span>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
                        </CardContent>
                        <CardFooter className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Heart className="w-4 h-4 mr-1" />
                              {post.likes}
                            </div>
                            <div className="flex items-center">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              {post.comments}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {post.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CardFooter>
                      </a>
                    </Link>
                  </Card>
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

export default Blog; 