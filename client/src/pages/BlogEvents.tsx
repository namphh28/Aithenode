import { useEffect } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BlogEventNav } from "@/components/BlogEventNav";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const BlogEvents = () => {
  const [, navigate] = useLocation();

  useEffect(() => {
    document.title = "Blog & Events | Aithenode";
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <BlogEventNav />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold">Blog & Events</h1>
              <p className="mt-2 text-gray-600">
                Discover insights and join live learning sessions
              </p>
            </div>

            {/* Blog and Events Cards */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Blog Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Blog</CardTitle>
                  <CardDescription>
                    Read articles, tutorials, and insights from our community
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Explore a wide range of topics including:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      <li>Programming tutorials and best practices</li>
                      <li>Learning tips and study techniques</li>
                      <li>Career development advice</li>
                      <li>Industry insights and trends</li>
                    </ul>
                    <Button 
                      className="w-full mt-4"
                      onClick={() => navigate("/blog")}
                    >
                      Visit Blog
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Events Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Events</CardTitle>
                  <CardDescription>
                    Join live webinars and interactive workshops
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Participate in various events including:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      <li>Live coding sessions and workshops</li>
                      <li>Expert-led webinars</li>
                      <li>Q&A sessions with industry professionals</li>
                      <li>Group learning activities</li>
                    </ul>
                    <Button 
                      className="w-full mt-4"
                      onClick={() => navigate("/events")}
                    >
                      Browse Events
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
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

export default BlogEvents; 