import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Category, Subject } from "@/lib/types";
import CategoryCard from "@/components/CategoryCard";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const Categories = () => {
  const [matchCategory, params] = useRoute("/categories/:id");
  const categoryId = matchCategory ? parseInt(params.id) : null;
  
  // Fetch all categories
  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  // Fetch specific category with subjects if categoryId is present
  const { data: categoryWithSubjects, isLoading: categoryLoading } = useQuery<Category>({
    queryKey: [`/api/categories/${categoryId}`],
    enabled: !!categoryId,
  });
  
  // Set title
  useEffect(() => {
    if (categoryWithSubjects) {
      document.title = `${categoryWithSubjects.name} | Aithenode`;
    } else {
      document.title = "Subject Categories | Aithenode";
    }
  }, [categoryWithSubjects]);
  
  if (categoryId && (categoryLoading || !categoryWithSubjects)) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-2/3 mb-8"></div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-40 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {categoryId && categoryWithSubjects ? (
          // Single category view with its subjects
          <>
            <div className="bg-primary text-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-center mb-2">
                  <Link href="/categories">
                    <Button variant="link" className="text-white p-0 mr-2">
                      ← All Categories
                    </Button>
                  </Link>
                </div>
                <h1 className="text-3xl font-bold mb-2">{categoryWithSubjects.name}</h1>
                <p className="text-xl">{categoryWithSubjects.description}</p>
                <div className="mt-4">
                  <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                    {categoryWithSubjects.educatorCount}+ Educators
                  </span>
                </div>
              </div>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <h2 className="text-2xl font-bold mb-6">Subjects in {categoryWithSubjects.name}</h2>
              
              {categoryWithSubjects.subjects && categoryWithSubjects.subjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryWithSubjects.subjects.map((subject: Subject) => (
                    <Card key={subject.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle>{subject.name}</CardTitle>
                        {subject.description && (
                          <CardDescription>{subject.description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <Link href={`/find-educators?subject=${subject.id}`}>
                          <Button>Find Educators</Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No subjects found in this category.</p>
              )}
              
              <div className="mt-12 text-center">
                <h3 className="text-xl font-semibold mb-4">Looking for a different subject?</h3>
                <Link href="/categories">
                  <Button variant="outline">Browse All Categories</Button>
                </Link>
              </div>
            </div>
          </>
        ) : (
          // Categories overview
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold mb-4">Explore Learning Categories</h1>
            <p className="text-xl text-gray-600 mb-8">
              Browse our diverse range of subjects and find the perfect educator for your learning goals.
            </p>
            
            {categoriesLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div key={i} className="h-40 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            ) : categories && categories.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categories.map(category => (
                  <Link key={category.id} href={`/categories/${category.id}`}>
                    <a>
                      <CategoryCard category={category} />
                    </a>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No categories found.</p>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Categories;
