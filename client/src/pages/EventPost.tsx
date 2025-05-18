import { useEffect } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BlogEventNav } from "@/components/BlogEventNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Users, Clock, Share2, MapPin } from "lucide-react";
import { Event as EventType, User, EventRegistration } from "@/lib/types";
import { getEvent, registerForEvent } from "@/lib/events";
import { format, formatDistanceToNow } from "date-fns";

const EventPost = () => {
  const [match, params] = useRoute("/events/:id");
  const eventId = match ? parseInt(params.id) : null;

  // Get current user
  const { data: currentUser } = useQuery<User | null>({
    queryKey: ["/api/auth/current-user"],
  });

  // Fetch event
  const { data: event, isLoading } = useQuery<EventType | null>({
    queryKey: [`/events/${eventId}`],
    queryFn: () => getEvent(eventId!),
    enabled: !!eventId,
  });

  // Set page title
  useEffect(() => {
    if (event) {
      document.title = `${event.title} | Aithenode Events`;
    } else {
      document.title = "Event Details | Aithenode";
    }
  }, [event]);

  if (isLoading || !event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <BlogEventNav />
        <main className="flex-1 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isFullyBooked = event.registeredCount >= event.capacity;
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <BlogEventNav />
      
      <main className="flex-1 py-8">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="space-y-4 mb-8">
            {event.coverImage && (
              <img
                src={event.coverImage}
                alt={event.title}
                className="w-full h-[400px] object-cover rounded-lg"
              />
            )}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant={event.type === 'webinar' ? 'default' : 'secondary'}>
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </Badge>
                <Badge variant="outline">{event.level}</Badge>
                {event.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h1 className="text-4xl font-bold">{event.title}</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Avatar>
                    {event.host.avatar ? (
                      <AvatarImage src={event.host.avatar} alt={event.host.name} />
                    ) : (
                      <AvatarFallback>{event.host.name.charAt(0)}</AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <div className="font-medium">{event.host.name}</div>
                    <div className="text-sm text-gray-500">Host</div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Event Details */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              {/* Description */}
              <div className="prose prose-lg max-w-none">
                <h2>About this event</h2>
                <p>{event.description}</p>
              </div>

              {/* Requirements */}
              {event.requirements && event.requirements.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Requirements</h2>
                  <ul className="list-disc list-inside space-y-2">
                    {event.requirements.map((req, index) => (
                      <li key={index} className="text-gray-600">{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Learning Outcomes */}
              {event.learningOutcomes && event.learningOutcomes.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">What you'll learn</h2>
                  <ul className="list-disc list-inside space-y-2">
                    {event.learningOutcomes.map((outcome, index) => (
                      <li key={index} className="text-gray-600">{outcome}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Registration Card */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                {/* Date & Time */}
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Date and time</div>
                    <div className="text-gray-600">
                      {format(startDate, "EEEE, MMMM d, yyyy")}
                    </div>
                    <div className="text-gray-600">
                      {format(startDate, "h:mm a")} - {format(endDate, "h:mm a")} {event.timezone}
                    </div>
                  </div>
                </div>

                {/* Capacity */}
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Capacity</div>
                    <div className="text-gray-600">
                      {event.registeredCount} registered of {event.capacity} spots
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="text-2xl font-bold">
                  {event.price === 0 ? "Free" : `$${event.price}`}
                </div>

                {/* Register Button */}
                <Button
                  className="w-full"
                  size="lg"
                  disabled={isFullyBooked || !currentUser}
                  onClick={() => currentUser && registerForEvent(event.id, currentUser.id)}
                >
                  {isFullyBooked ? "Join Waitlist" : "Register Now"}
                </Button>

                {!currentUser && (
                  <p className="text-sm text-gray-500 text-center">
                    Please sign in to register for this event
                  </p>
                )}
              </div>

              {/* Share Button */}
              <Button variant="outline" className="w-full" size="lg">
                <Share2 className="h-5 w-5 mr-2" />
                Share Event
              </Button>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default EventPost; 