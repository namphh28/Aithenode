import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/lib/types";
import { MenuIcon, CloseIcon } from "@/lib/icons";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiRequest } from "@/lib/queryClient";

const Navbar = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Close mobile menu when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);
  
  const { data: currentUser, isLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/current-user"],
  });
  
  const handleSignOut = async () => {
    try {
      await apiRequest("POST", "/api/auth/signout", {});
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <span className="flex-shrink-0 flex items-center text-primary text-2xl font-bold">
                Aithenode
              </span>
            </Link>
            <nav className="hidden md:ml-8 md:flex md:space-x-8">
              <Link href="/">
                <span className={`inline-flex items-center px-1 pt-1 border-b-2 ${location === "/" ? "border-primary text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} text-sm font-medium`}>
                  Home
                </span>
              </Link>
              <Link href="/find-educators">
                <span className={`inline-flex items-center px-1 pt-1 border-b-2 ${location === "/find-educators" ? "border-primary text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} text-sm font-medium`}>
                  Find Educators
                </span>
              </Link>
              <Link href="/categories">
                <span className={`inline-flex items-center px-1 pt-1 border-b-2 ${location.startsWith("/categories") ? "border-primary text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} text-sm font-medium`}>
                  Subjects
                </span>
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center">
            {!isLoading && (
              <div className="hidden md:flex md:items-center md:space-x-2">
                {currentUser ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          {currentUser.profileImage ? (
                            <AvatarImage src={currentUser.profileImage} alt={currentUser.firstName} />
                          ) : (
                            <AvatarFallback>{currentUser.firstName.charAt(0) + currentUser.lastName.charAt(0)}</AvatarFallback>
                          )}
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Link href="/dashboard">
                          <span>Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleSignOut}>
                        Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex space-x-2">
                    <Link href="/signin">
                      <Button variant="outline">Sign in</Button>
                    </Link>
                    <Link href="/signup">
                      <Button>Sign up</Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex md:hidden ml-4">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <CloseIcon className="h-6 w-6" />
                ) : (
                  <MenuIcon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        <div className={`md:hidden ${mobileMenuOpen ? "block" : "hidden"}`}>
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/">
              <span className={`block pl-3 pr-4 py-2 border-l-4 ${location === "/" ? "border-primary text-primary bg-primary-50" : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"} text-base font-medium`}>
                Home
              </span>
            </Link>
            <Link href="/find-educators">
              <span className={`block pl-3 pr-4 py-2 border-l-4 ${location === "/find-educators" ? "border-primary text-primary bg-primary-50" : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"} text-base font-medium`}>
                Find Educators
              </span>
            </Link>
            <Link href="/categories">
              <span className={`block pl-3 pr-4 py-2 border-l-4 ${location.startsWith("/categories") ? "border-primary text-primary bg-primary-50" : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"} text-base font-medium`}>
                Subjects
              </span>
            </Link>
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-200">
            {!isLoading && (
              <>
                <div className="flex items-center px-4 space-x-2">
                  {currentUser ? (
                    <>
                      <div className="flex-shrink-0">
                        <Avatar className="h-8 w-8">
                          {currentUser.profileImage ? (
                            <AvatarImage src={currentUser.profileImage} alt={currentUser.firstName} />
                          ) : (
                            <AvatarFallback>{currentUser.firstName.charAt(0) + currentUser.lastName.charAt(0)}</AvatarFallback>
                          )}
                        </Avatar>
                      </div>
                      <div className="ml-3 flex flex-col">
                        <div className="text-base font-medium text-gray-800">
                          {currentUser.firstName} {currentUser.lastName}
                        </div>
                        <div className="text-sm font-medium text-gray-500">
                          {currentUser.email}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col space-y-2 w-full">
                      <Link href="/signin">
                        <Button variant="outline" className="w-full">
                          Sign in
                        </Button>
                      </Link>
                      <Link href="/signup">
                        <Button className="w-full">
                          Sign up
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
                
                {currentUser && (
                  <div className="mt-3 space-y-1 px-2">
                    <Link href="/dashboard">
                      <Button variant="ghost" className="w-full justify-start">
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
                      Sign out
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;