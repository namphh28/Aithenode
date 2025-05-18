import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const Community = () => {
  useEffect(() => {
    document.title = "Community | Aithenode";
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Community Hub</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Forums Section */}
          <Card>
            <CardHeader>
              <CardTitle>Discussion Forums</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Popular Topics</h3>
                  <ul className="space-y-2">
                    <li>
                      <Link href="/community/forums/programming">
                        <a className="text-primary hover:underline">Programming & Development</a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/community/forums/languages">
                        <a className="text-primary hover:underline">Language Learning</a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/community/forums/academic">
                        <a className="text-primary hover:underline">Academic Support</a>
                      </Link>
                    </li>
                  </ul>
                </div>
                <Button variant="outline" className="w-full">View All Forums</Button>
              </div>
            </CardContent>
          </Card>

          {/* Events Section */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="border-l-4 border-primary pl-4">
                    <h3 className="font-semibold">Web Development Workshop</h3>
                    <p className="text-sm text-gray-600">June 15, 2024 • Virtual</p>
                  </div>
                  <div className="border-l-4 border-primary pl-4">
                    <h3 className="font-semibold">Language Exchange Meetup</h3>
                    <p className="text-sm text-gray-600">June 20, 2024 • Virtual</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">View All Events</Button>
              </div>
            </CardContent>
          </Card>

          {/* Study Groups Section */}
          <Card>
            <CardHeader>
              <CardTitle>Study Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold">Python Beginners Group</h3>
                    <p className="text-sm text-gray-600">15 members • Active</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold">IELTS Preparation</h3>
                    <p className="text-sm text-gray-600">23 members • Active</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">Find Study Groups</Button>
              </div>
            </CardContent>
          </Card>

          {/* Community Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>Community Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Our community thrives on mutual respect, collaboration, and shared learning. 
                  Please review our guidelines to help maintain a positive environment for everyone.
                </p>
                <Button variant="outline" className="w-full">Read Guidelines</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Community; 