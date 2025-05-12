import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const CallToAction = () => {
  return (
    <section className="py-12 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Learning?</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of students who are already enhancing their skills with personalized education.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="/find-educators">
            <Button className="px-6 py-3 bg-primary hover:bg-primary/90">
              Find an Educator
            </Button>
          </Link>
          <Link href="/categories">
            <Button variant="outline" className="px-6 py-3 text-primary border-primary hover:bg-primary/5">
              Browse Subjects
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
