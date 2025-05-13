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
import { Checkbox } from "@/components/ui/checkbox";
import { EducatorProfile, Category } from "@/lib/types";
import { SearchIcon, StarIcon } from "@/lib/icons";
import { sampleEducators, sampleCategories } from "@/lib/sampleData";

// Available languages
const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
  "Korean",
  "Arabic",
  "Russian",
  "Portuguese"
];

// Available time slots
const TIME_SLOTS = [
  "Morning (6AM-12PM)",
  "Afternoon (12PM-5PM)",
  "Evening (5PM-10PM)",
  "Night (10PM-6AM)"
];

const FindEducators = () => {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  
  // Search and basic filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [priceRange, setPriceRange] = useState([0, 200]);
  
  // New filters
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [minimumRating, setMinimumRating] = useState<number>(0);
  
  const [filteredEducators, setFilteredEducators] = useState<EducatorProfile[]>([]);
  
  // Fetch all educators (with fallback to sample data)
  const { data: educators, isLoading: educatorsLoading } = useQuery<EducatorProfile[]>({
    queryKey: ["/api/educator-profiles"],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return sampleEducators;
    }
  });
  
  // Fetch all categories (with fallback to sample data)
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return sampleCategories;
    }
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
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter(
        educator => 
          educator.subjects && 
          educator.subjects.some(subject => subject.categoryId === parseInt(selectedCategory))
      );
    }
    
    // Apply subject filters
    if (selectedSubjects.length > 0) {
      filtered = filtered.filter(educator =>
        educator.subjects?.some(subject =>
          selectedSubjects.includes(subject.name)
        )
      );
    }
    
    // Apply language filters
    if (selectedLanguages.length > 0) {
      filtered = filtered.filter(educator =>
        educator.specialties?.some(specialty =>
          selectedLanguages.some(lang => 
            specialty.toLowerCase().includes(lang.toLowerCase())
          )
        )
      );
    }
    
    // Apply time slot filters
    if (selectedTimeSlots.length > 0) {
      filtered = filtered.filter(educator => {
        if (!educator.availability) return false;
        
        return selectedTimeSlots.some(slot => {
          const [period] = slot.split(" ");
          return Object.values(educator.availability).some(times => 
            times.some(time => {
              const hour = parseInt(time.split(":")[0]);
              switch(period) {
                case "Morning": return hour >= 6 && hour < 12;
                case "Afternoon": return hour >= 12 && hour < 17;
                case "Evening": return hour >= 17 && hour < 22;
                case "Night": return hour >= 22 || hour < 6;
                default: return false;
              }
            })
          );
        });
      });
    }
    
    // Apply rating filter
    if (minimumRating > 0) {
      filtered = filtered.filter(
        educator => (educator.averageRating || 0) >= minimumRating
      );
    }
    
    // Apply price range filter
    filtered = filtered.filter(
      educator => 
        educator.hourlyRate >= priceRange[0] && 
        educator.hourlyRate <= priceRange[1]
    );
    
    setFilteredEducators(filtered);
  }, [educators, searchQuery, selectedCategory, priceRange, selectedSubjects, selectedLanguages, selectedTimeSlots, minimumRating]);
  
  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setPriceRange([0, 200]);
    setSelectedSubjects([]);
    setSelectedLanguages([]);
    setSelectedTimeSlots([]);
    setMinimumRating(0);
  };
  
  // Set title
  useEffect(() => {
    document.title = "Find Educators | Aithenode";
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
                
                {/* Price Range Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">Price Range ($/hour)</h3>
                  <div className="mb-6">
                    <Slider
                      defaultValue={[0, 200]}
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
                
                {/* Rating Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">Minimum Rating</h3>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <Button
                        key={rating}
                        variant={minimumRating === rating ? "default" : "outline"}
                        size="sm"
                        onClick={() => setMinimumRating(rating === minimumRating ? 0 : rating)}
                        className="p-2"
                      >
                        <StarIcon className="h-4 w-4" filled={rating <= minimumRating} />
                      </Button>
                    ))}
                  </div>
                </div>
                
                {/* Language Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">Languages</h3>
                  <div className="space-y-2">
                    {LANGUAGES.map(language => (
                      <div key={language} className="flex items-center">
                        <Checkbox
                          id={`lang-${language}`}
                          checked={selectedLanguages.includes(language)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedLanguages([...selectedLanguages, language]);
                            } else {
                              setSelectedLanguages(selectedLanguages.filter(l => l !== language));
                            }
                          }}
                        />
                        <label htmlFor={`lang-${language}`} className="ml-2 text-sm">
                          {language}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Time Availability Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">Availability</h3>
                  <div className="space-y-2">
                    {TIME_SLOTS.map(slot => (
                      <div key={slot} className="flex items-center">
                        <Checkbox
                          id={`time-${slot}`}
                          checked={selectedTimeSlots.includes(slot)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedTimeSlots([...selectedTimeSlots, slot]);
                            } else {
                              setSelectedTimeSlots(selectedTimeSlots.filter(s => s !== slot));
                            }
                          }}
                        />
                        <label htmlFor={`time-${slot}`} className="ml-2 text-sm">
                          {slot}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Subject Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">Subjects</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {categories?.map(category => 
                      category.subjects?.map(subject => (
                        <div key={subject.id} className="flex items-center">
                          <Checkbox
                            id={`subject-${subject.id}`}
                            checked={selectedSubjects.includes(subject.name)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedSubjects([...selectedSubjects, subject.name]);
                              } else {
                                setSelectedSubjects(selectedSubjects.filter(s => s !== subject.name));
                              }
                            }}
                          />
                          <label htmlFor={`subject-${subject.id}`} className="ml-2 text-sm">
                            {subject.name}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={resetFilters}
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
                  <Button onClick={resetFilters}>
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
