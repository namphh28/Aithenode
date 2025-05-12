import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { EducatorProfile, User } from "@/lib/types";
import BookingForm from "@/components/BookingForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarIcon } from "@/lib/icons";
import { formatRating } from "@/lib/data";

const BookSession = () => {
  const [match, params] = useRoute("/book/:educatorId");
  const [, navigate] = useLocation();
  const educatorId = match ? parseInt(params.educatorId) : null;
  
  // Get current user
  const { data: currentUser, isLoading: userLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/current-user"],
  });
  
  // Fetch educator data
  const { data: educator, isLoading: educatorLoading } = useQuery<EducatorProfile>({
    queryKey: [`/api/educator-profiles/${educatorId}`],
    enabled: !!educatorId,
  });
  
  // Set title
  useEffect(() => {
    if (educator) {
      document.title = `Book a Session with ${educator.user.firstName} ${educator.user.lastName} | Aithenode`;
    } else {
      document.title = "Book a Session | Aithenode";
    }
  }, [educator]);
  
  // Redirect to sign in if not logged in
  useEffect(() => {
    if (!userLoading && !currentUser) {
      navigate(`/signin?redirect=/book/${educatorId}`);
    }
  }, [currentUser, userLoading, educatorId, navigate]);
  
  // Generate stars based on rating
  const renderStars = (rating: number = 0) => {
    const stars = [];
    const roundedRating = Math.round(rating * 2) / 2; // Round to nearest 0.5
    
    for (let i = 1; i <= 5; i++) {
      if (i <= roundedRating) {
        // Full star
        stars.push(<StarIcon key={i} className="text-yellow-400" filled />);
      } else if (i - 0.5 === roundedRating) {
        // Half star
        stars.push(<i key={i} className="fas fa-star-half-alt text-yellow-400"></i>);
      } else {
        // Empty star
        stars.push(<StarIcon key={i} className="text-yellow-400" />);
      }
    }
    
    return stars;
  };
  
  if (educatorLoading || userLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="bg-white rounded-lg p-6 shadow-md mb-6">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-6"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!educator) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Educator Not Found</h1>
            <p className="text-lg text-gray-600 mb-8">
              We couldn't find the educator you're looking to book a session with.
            </p>
            <Button onClick={() => navigate("/find-educators")}>
              Browse Educators
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow py-12 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book a Session</h1>
          <p className="text-lg text-gray-600 mb-8">
            Schedule a personalized learning session with your selected educator.
          </p>
          
          <div className="bg-white rounded-lg p-6 shadow-md mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <img 
                  src={educator.user.profileImage || `https://ui-avatars.com/api/?name=${educator.user.firstName}+${educator.user.lastName}&background=random`} 
                  alt={`${educator.user.firstName} ${educator.user.lastName}`} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold flex items-center">
                  {educator.user.firstName} {educator.user.lastName}
                  {educator.user.isVerified && (
                    <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-200">
                      Verified
                    </Badge>
                  )}
                </h2>
                <p className="text-gray-600">{educator.title}</p>
                <div className="flex items-center mt-1">
                  <div className="flex items-center">
                    {renderStars(educator.averageRating)}
                  </div>
                  <span className="ml-1 text-sm text-gray-500">
                    {formatRating(educator.averageRating)} ({educator.reviewCount} {educator.reviewCount === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              </div>
              <div className="ml-auto">
                <p className="text-lg font-bold text-gray-900">
                  ${educator.hourlyRate}
                  <span className="text-sm font-normal text-gray-600">/hour</span>
                </p>
              </div>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Session Details</CardTitle>
              <CardDescription>
                Choose your preferred date and time for your session with {educator.user.firstName}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BookingForm educator={educator} currentUser={currentUser!} />
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookSession;
