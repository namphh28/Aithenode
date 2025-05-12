import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SearchIcon, CalendarIcon, BookIcon, ArrowRightIcon } from "@/lib/icons";

const HowItWorks = () => {
  const steps = [
    {
      icon: <SearchIcon className="text-primary text-2xl" />,
      title: "1. Find an Educator",
      description:
        "Search our database of qualified educators by subject, price range, availability, and reviews.",
    },
    {
      icon: <CalendarIcon className="text-primary text-2xl" />,
      title: "2. Book a Session",
      description:
        "Select your preferred time slots and request a booking with your chosen educator.",
    },
    {
      icon: <BookIcon className="text-primary text-2xl" />,
      title: "3. Start Learning",
      description:
        "Once confirmed, connect with your educator and begin your personalized learning journey.",
    },
  ];

  return (
    <section id="how-it-works" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">How Aithenode Works</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Find the perfect educator, book your sessions, and accelerate your learning journey in three simple steps.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/find-educators">
            <Button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90">
              Get Started
              <ArrowRightIcon className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
