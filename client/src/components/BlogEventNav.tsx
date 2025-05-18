import { Link, useLocation } from 'wouter';
import { cn } from "@/lib/utils";

export const BlogEventNav = () => {
  const [location] = useLocation();
  const currentPath = location.split('/')[1]; // Get 'blog' or 'events' from the path

  return (
    <div className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-center items-center space-x-8">
          <Link href="/blog">
            <a className={cn(
              "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
              currentPath === "blog"
                ? "border-primary text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}>
              Blog
            </a>
          </Link>
          <Link href="/events">
            <a className={cn(
              "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
              currentPath === "events"
                ? "border-primary text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}>
              Events
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}; 