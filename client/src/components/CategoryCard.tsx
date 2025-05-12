import { Link } from "wouter";
import { Category } from "@/lib/types";

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  const { id, name, educatorCount, imageUrl } = category;

  return (
    <Link href={`/find-educators?category=${id}`}>
      <a className="group relative block h-40 rounded-lg overflow-hidden shadow-md">
        <div className="absolute inset-0 bg-gray-900 bg-opacity-40 group-hover:bg-opacity-50 transition-all"></div>
        <img 
          src={imageUrl || `https://ui-avatars.com/api/?name=${name}&size=400&background=random`} 
          alt={name} 
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className="text-white text-lg font-semibold">{name}</span>
            <p className="text-white text-sm">{educatorCount}+ Educators</p>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default CategoryCard;
