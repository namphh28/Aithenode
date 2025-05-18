import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BlogEventNav } from "@/components/BlogEventNav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Users, PlusCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Event, User } from "@/lib/types";
import { searchEvents, createEvent } from "@/lib/events";

const Events = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Get current user
  const { data: currentUser } = useQuery<User | null>({
    queryKey: ["/api/auth/current-user"],
  });

  // Available event types and levels
  const eventTypes = ["webinar", "workshop"];
  const eventLevels = ["Beginner", "Intermediate", "Advanced"];

  // Fetch events with search and filters
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["events", searchQuery, selectedType, selectedLevel],
    queryFn: () => searchEvents(searchQuery, selectedType, selectedLevel),
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <BlogEventNav />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold">Events</h1>
              <p className="mt-2 text-gray-600">
                Join live webinars and workshops from expert educators
              </p>
            </div>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {eventTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {eventLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Create Event Button */}
            <div className="flex justify-end">
              <Button onClick={() => setIsDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                // Loading skeletons
                Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : events?.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No events found</p>
                </div>
              ) : (
                events?.map((event) => (
                  <Card key={event.id} className="overflow-hidden">
                    <Link href={`/events/${event.id}`}>
                      <a>
                        {event.coverImage && (
                          <img
                            src={event.coverImage}
                            alt={event.title}
                            className="w-full h-48 object-cover"
                          />
                        )}
                        <CardHeader>
                          <Badge className="w-fit mb-2" variant={event.type === 'webinar' ? 'default' : 'secondary'}>
                            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                          </Badge>
                          <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                          <CardDescription className="flex items-center space-x-2">
                            <img
                              src={event.host.avatar}
                              alt={event.host.name}
                              className="w-6 h-6 rounded-full"
                            />
                            <span>{event.host.name}</span>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 line-clamp-3">{event.description}</p>
                        </CardContent>
                        <CardFooter className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(event.startDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {event.registeredCount}/{event.capacity}
                            </div>
                          </div>
                          <Badge variant="outline">{event.level}</Badge>
                        </CardFooter>
                      </a>
                    </Link>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Events; 