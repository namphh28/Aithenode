import { CheckIcon, CalendarIcon, CreditCardIcon, StarIcon } from "@/lib/icons";

const AppFeatures = () => {
  const features = [
    {
      icon: <CheckIcon className="text-primary text-xl" />,
      title: "Verified Educators",
      description: "All educators are thoroughly vetted to ensure quality teaching experience.",
    },
    {
      icon: <CalendarIcon className="text-primary text-xl" />,
      title: "Flexible Scheduling",
      description: "Book sessions that fit your schedule with our easy-to-use calendar system.",
    },
    {
      icon: <CreditCardIcon className="text-primary text-xl" />,
      title: "Secure Payments",
      description: "Pay securely through our platform with various payment options.",
    },
    {
      icon: <StarIcon className="text-primary text-xl" />,
      title: "Ratings & Reviews",
      description: "Read authentic reviews to help you choose the right educator for your needs.",
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Why Choose EduConnect</h2>
          <p className="mt-4 text-lg text-gray-600">
            Our platform offers everything you need for a seamless learning experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AppFeatures;
