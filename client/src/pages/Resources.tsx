import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const Resources = () => {
  useEffect(() => {
    document.title = "Learning Resources | Aithenode";
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Learning Resources</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Learning Materials */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Materials</CardTitle>
              <CardDescription>Access free educational content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ul className="space-y-2">
                  <li>
                    <Link href="/resources/programming">
                      <a className="text-primary hover:underline">Programming Tutorials</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/resources/language">
                      <a className="text-primary hover:underline">Language Learning Resources</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/resources/academic">
                      <a className="text-primary hover:underline">Academic Study Materials</a>
                    </Link>
                  </li>
                </ul>
                <Button variant="outline" className="w-full">Browse All Materials</Button>
              </div>
            </CardContent>
          </Card>

          {/* Study Guides */}
          <Card>
            <CardHeader>
              <CardTitle>Study Guides</CardTitle>
              <CardDescription>Expert-created learning paths</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold">Web Development Path</h3>
                    <p className="text-sm text-gray-600">From basics to advanced concepts</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold">Language Proficiency Guide</h3>
                    <p className="text-sm text-gray-600">Structured learning approach</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">View All Guides</Button>
              </div>
            </CardContent>
          </Card>

          {/* Tools & Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Tools & Templates</CardTitle>
              <CardDescription>Resources to enhance your learning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ul className="space-y-2">
                  <li>
                    <Link href="/resources/tools/study-planner">
                      <a className="text-primary hover:underline">Study Planner Template</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/resources/tools/flashcards">
                      <a className="text-primary hover:underline">Flashcard Generator</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/resources/tools/progress-tracker">
                      <a className="text-primary hover:underline">Progress Tracker</a>
                    </Link>
                  </li>
                </ul>
                <Button variant="outline" className="w-full">Explore Tools</Button>
              </div>
            </CardContent>
          </Card>

          {/* Video Library */}
          <Card>
            <CardHeader>
              <CardTitle>Video Library</CardTitle>
              <CardDescription>Watch and learn from experts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold">Programming Tutorials</h3>
                    <p className="text-sm text-gray-600">Step-by-step video guides</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold">Language Practice Sessions</h3>
                    <p className="text-sm text-gray-600">Interactive learning videos</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">Browse Videos</Button>
              </div>
            </CardContent>
          </Card>

          {/* Practice Exercises */}
          <Card>
            <CardHeader>
              <CardTitle>Practice Exercises</CardTitle>
              <CardDescription>Test your knowledge</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ul className="space-y-2">
                  <li>
                    <Link href="/resources/exercises/programming">
                      <a className="text-primary hover:underline">Coding Challenges</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/resources/exercises/language">
                      <a className="text-primary hover:underline">Language Exercises</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/resources/exercises/quizzes">
                      <a className="text-primary hover:underline">Subject Quizzes</a>
                    </Link>
                  </li>
                </ul>
                <Button variant="outline" className="w-full">Start Practicing</Button>
              </div>
            </CardContent>
          </Card>

          {/* E-Books & PDFs */}
          <Card>
            <CardHeader>
              <CardTitle>E-Books & PDFs</CardTitle>
              <CardDescription>Downloadable learning materials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold">Programming Books</h3>
                    <p className="text-sm text-gray-600">Comprehensive guides</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold">Language Workbooks</h3>
                    <p className="text-sm text-gray-600">Practice materials</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">View Library</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Resources; 