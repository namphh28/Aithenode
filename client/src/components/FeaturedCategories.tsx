import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Category } from "@/lib/types";
import { fallbackCategories } from "@/lib/data";
import CategoryCard from "./CategoryCard";

const FeaturedCategories = () => {
  const { data: categories, isLoading, error } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    initialData: fallbackCategories
  });

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Explore Categories</h2>
          <p className="mt-4 text-lg text-gray-600">
            Discover educators across a diverse range of disciplines and subjects.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {!isLoading && !error && categories?.slice(0, 7).map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}

          {/* All Categories card */}
          <Link href="/categories">
            <a className="group relative block h-40 rounded-lg overflow-hidden shadow-md bg-primary">
              <div className="absolute inset-0 bg-primary/80 bg-opacity-0 group-hover:bg-opacity-20 transition-all"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-white text-lg font-semibold">All Categories</span>
                  <p className="text-white text-sm">View All Subjects</p>
                  <i className="fas fa-arrow-right text-white mt-2"></i>
                </div>
              </div>
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
