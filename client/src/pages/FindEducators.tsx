import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EducatorCard from "@/components/EducatorCard";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { EducatorProfile, Category } from "@/lib/types";
import { SearchIcon } from "@/lib/icons";

const FindEducators = () => {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [filteredEducators, setFilteredEducators] = useState<EducatorProfile[]>([]);
  
  // Fetch all educators
  const { data: educators, isLoading: educatorsLoading } = useQuery<EducatorProfile[]>({
    queryKey: ["/api/educator-profiles"],
  });
  
  // Fetch all categories for filter
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  // Apply filters when data or filter values change
  useEffect(() => {
    if (!educators) return;
    
    let filtered = [...educators];
    
    // Apply search query filter
    if (searchQuery) {
      filtered = filtered.filter(
        educator => 
          educator.user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          educator.user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          educator.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (educator.subjects && educator.subjects.some(
            subject => subject.name.toLowerCase().includes(searchQuery.toLowerCase())
          ))
      );
    }
    
    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(
        educator => 
          educator.subjects && 
          educator.subjects.some(subject => subject.categoryId === parseInt(selectedCategory))
      );
    }
    
    // Apply price range filter
    filtered = filtered.filter(
      educator => 
        educator.hourlyRate >= priceRange[0] && 
        educator.hourlyRate <= priceRange[1]
    );
    
    setFilteredEducators(filtered);
  }, [educators, searchQuery, selectedCategory, priceRange]);
  
  // Set title
  useEffect(() => {
    document.title = "Find Educators | EduConnect";
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-primary text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-4">Find Your Perfect Educator</h1>
            <p className="text-lg mb-8">Browse our qualified educators and start your learning journey today</p>
            
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search by name, subject, or expertise"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories?.map(category => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar filters */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Filters</h2>
                
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">Price Range</h3>
                  <div className="mb-6">
                    <Slider
                      defaultValue={[0, 100]}
                      max={200}
                      step={5}
                      value={priceRange}
                      onValueChange={setPriceRange}
                    />
                    <div className="flex justify-between mt-2 text-sm text-gray-500">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">Categories</h3>
                  <div className="space-y-2">
                    <Button
                      variant={selectedCategory === "" ? "default" : "outline"}
                      size="sm"
                      className="mr-2 mb-2"
                      onClick={() => setSelectedCategory("")}
                    >
                      All
                    </Button>
                    {categories?.map(category => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id.toString() ? "default" : "outline"}
                        size="sm"
                        className="mr-2 mb-2"
                        onClick={() => setSelectedCategory(category.id.toString())}
                      >
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("");
                    setPriceRange([0, 100]);
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
            
            {/* Educator listing */}
            <div className="lg:col-span-3">
              {educatorsLoading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 h-64 animate-pulse">
                      <div className="flex h-full">
                        <div className="bg-gray-200 md:w-48 w-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredEducators && filteredEducators.length > 0 ? (
                <div className="space-y-6">
                  {filteredEducators.map(educator => (
                    <EducatorCard key={educator.id} educator={educator} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No educators found</h3>
                  <p className="text-gray-500 mb-6">
                    Try adjusting your filters or search criteria to find more results.
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("");
                      setPriceRange([0, 100]);
                    }}
                  >
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FindEducators;
