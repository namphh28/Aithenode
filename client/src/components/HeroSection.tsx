import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "@/lib/icons";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [, navigate] = useLocation();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/find-educators?q=${encodeURIComponent(searchQuery)}`);
  };
  
  const popularSubjects = [
    { name: "Mathematics", url: "/find-educators?category=1" },
    { name: "Programming", url: "/find-educators?category=2" },
    { name: "Languages", url: "/find-educators?category=3" },
    { name: "Music", url: "/find-educators?category=4" },
  ];
  
  return (
    <section className="hero-gradient text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Connect With Expert Educators</h1>
            <p className="text-lg mb-8 text-blue-50">Find qualified teachers for personalized learning experiences across a wide range of subjects.</p>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="bg-white rounded-lg p-2 shadow-lg">
              <div className="flex flex-col md:flex-row">
                <div className="flex-grow mb-2 md:mb-0 md:mr-2">
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <SearchIcon className="text-gray-400" />
                    </div>
                    <Input
                      type="text"
                      placeholder="What would you like to learn?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 py-3 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-3"
                >
                  Find Educators
                </Button>
              </div>
            </form>
            
            {/* Popular Subjects */}
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="text-sm text-blue-100 mr-2">Popular:</span>
              {popularSubjects.map((subject, index) => (
                <a
                  key={index}
                  href={subject.url}
                  className="text-sm px-3 py-1 bg-white/10 rounded-full text-white hover:bg-white/20"
                >
                  {subject.name}
                </a>
              ))}
            </div>
          </div>
          <div className="hidden md:block">
            <img 
              src="https://pixabay.com/get/g25708ca97f436e631e2515ac56e8f2cec3a6e2d6df59362785ee653a23a9f084800f08941e6cfffd4f762cdccfbfe71766e8934ce2cbb42c3192d49b56929778_1280.jpg" 
              alt="Student learning online with a tutor" 
              className="rounded-xl shadow-lg w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
