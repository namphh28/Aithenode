import { useQuery } from "@tanstack/react-query";
import { Testimonial } from "@/lib/types";
import { fallbackTestimonials } from "@/lib/data";
import TestimonialCard from "./TestimonialCard";
import { StarIcon } from "@/lib/icons";

const Testimonials = () => {
  const { data: testimonials, isLoading, error } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
    initialData: fallbackTestimonials as Testimonial[],
  });

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">What Our Users Say</h2>
          <p className="mt-4 text-lg text-gray-600">
            Success stories from students who found the perfect educator on our platform.
          </p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
                <div className="flex items-center mb-4">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div key={star} className="w-5 h-5 bg-gray-200 rounded-full"></div>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-200 h-24 mb-6 rounded"></div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="ml-3">
                    <div className="bg-gray-200 h-4 w-24 rounded mb-1"></div>
                    <div className="bg-gray-200 h-3 w-32 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">Failed to load testimonials. Please try again later.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials && testimonials.length > 0 ? (
              testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))
            ) : (
              <div className="text-center py-8 col-span-3">
                <p>No testimonials found. Check back soon!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
