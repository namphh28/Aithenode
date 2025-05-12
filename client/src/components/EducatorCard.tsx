import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EducatorProfile } from "@/lib/types";
import { formatRating } from "@/lib/data";
import { StarIcon } from "@/lib/icons";

interface EducatorCardProps {
  educator: EducatorProfile;
}

const EducatorCard = ({ educator }: EducatorCardProps) => {
  const {
    id,
    user,
    title,
    hourlyRate,
    reviewCount = 0,
    averageRating = 0,
  } = educator;

  // Generate stars based on rating
  const renderStars = () => {
    const stars = [];
    const rating = Math.round(averageRating * 2) / 2; // Round to nearest 0.5
    
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        // Full star
        stars.push(<StarIcon key={i} className="text-yellow-400" filled />);
      } else if (i - 0.5 === rating) {
        // Half star
        stars.push(<i key={i} className="fas fa-star-half-alt text-yellow-400"></i>);
      } else {
        // Empty star
        stars.push(<StarIcon key={i} className="text-yellow-400" />);
      }
    }
    
    return stars;
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="md:flex">
        <div className="md:shrink-0">
          <img 
            className="h-48 w-full object-cover md:h-full md:w-48" 
            src={user.profileImage || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`} 
            alt={`${user.firstName} ${user.lastName}`}
          />
        </div>
        <div className="p-6">
          <div className="flex items-center">
            <h3 className="text-xl font-semibold text-gray-900">{user.firstName} {user.lastName}</h3>
            {user.isVerified && (
              <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-200">
                Verified
              </Badge>
            )}
          </div>
          <p className="text-sm text-primary font-medium mt-1">{title}</p>
          
          <div className="flex items-center mt-2">
            <div className="flex items-center">
              {renderStars()}
            </div>
            <span className="ml-1 text-sm text-gray-500">
              {formatRating(averageRating)} ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
            </span>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="text-lg font-bold text-gray-900">
              ${hourlyRate}
              <span className="text-sm font-normal text-gray-600">/hour</span>
            </div>
            <Link href={`/educators/${id}`}>
              <Button variant="outline" className="text-primary border-primary hover:bg-primary/5">
                View Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducatorCard;
