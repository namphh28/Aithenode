import { Testimonial } from "@/lib/types";
import { StarIcon } from "@/lib/icons";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  const { content, userRole, user } = testimonial;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <div className="flex text-yellow-400">
          <StarIcon filled className="h-5 w-5" />
          <StarIcon filled className="h-5 w-5" />
          <StarIcon filled className="h-5 w-5" />
          <StarIcon filled className="h-5 w-5" />
          <StarIcon filled className="h-5 w-5" />
        </div>
      </div>
      <p className="text-gray-700 mb-6">"{content}"</p>
      <div className="flex items-center">
        <img 
          className="h-10 w-10 rounded-full" 
          src={user.profileImage || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`}
          alt={`${user.firstName} ${user.lastName}`}
        />
        <div className="ml-3">
          <h4 className="text-sm font-semibold text-gray-900">{user.firstName} {user.lastName}</h4>
          <p className="text-sm text-gray-500">{userRole}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
