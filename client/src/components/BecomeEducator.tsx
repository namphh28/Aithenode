import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const BecomeEducator = () => {
  return (
    <section className="py-16 bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="lg:w-3/5">
            <h2 className="text-3xl font-bold">Are You an Educator?</h2>
            <p className="mt-4 text-lg text-blue-100">
              Join our platform to connect with students, share your expertise, and grow your teaching business. 
              Set your own rates and schedule while we handle the bookings and payments.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row sm:space-x-4">
              <Link href="/signup?type=educator">
                <Button className="bg-white text-primary hover:bg-gray-100 mb-4 sm:mb-0">
                  Apply as an Educator
                </Button>
              </Link>
              <Button variant="outline" className="bg-primary-700 text-white hover:bg-primary-800 border border-white/20">
                Learn More
              </Button>
            </div>
          </div>
          <div className="mt-10 lg:mt-0 lg:w-2/5">
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400" 
                alt="Become an educator on our platform" 
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BecomeEducator;
