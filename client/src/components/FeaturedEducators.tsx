import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { EducatorProfile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import EducatorCard from "./EducatorCard";
import { ArrowRightIcon } from "@/lib/icons";

const FeaturedEducators = () => {
  const { data: educators, isLoading, error } = useQuery<EducatorProfile[]>({
    queryKey: ["/api/educator-profiles?limit=3"],
  });

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Educators</h2>
            <p className="mt-2 text-lg text-gray-600">Top-rated professionals ready to help you learn</p>
          </div>
          <Link href="/find-educators">
            <Button variant="link" className="hidden md:inline-flex items-center text-primary hover:text-primary/80">
              View all educators
              <ArrowRightIcon className="ml-2" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 h-64 animate-pulse">
                <div className="flex h-full">
                  <div className="bg-gray-200 md:w-48 w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">Failed to load educators. Please try again later.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {educators && educators.length > 0 ? (
              educators.map((educator) => (
                <EducatorCard key={educator.id} educator={educator} />
              ))
            ) : (
              <div className="text-center py-8 col-span-3">
                <p>No educators found. Check back soon!</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link href="/find-educators">
            <Button variant="link" className="inline-flex items-center text-primary hover:text-primary/80">
              View all educators
              <ArrowRightIcon className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEducators;
