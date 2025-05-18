import { Event, EventRegistration, User } from './types';

// Local storage keys
const EVENTS_KEY = 'events';
const EVENT_REGISTRATIONS_KEY = 'event_registrations';

// Get events from local storage
export const getStoredEvents = (): Event[] => {
  const stored = localStorage.getItem(EVENTS_KEY);
  if (!stored) {
    // Initialize with sample data
    const initialEvents: Event[] = [
      {
        id: 1,
        type: 'webinar',
        title: "Introduction to Deep Learning",
        description: "Join us for a comprehensive introduction to deep learning concepts and practical applications...",
        host: {
          id: 1,
          name: "Dr. Sarah Chen",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
        },
        coverImage: "https://images.unsplash.com/photo-1527474305487-b87b222841cc",
        startDate: "2024-04-15T14:00:00Z",
        endDate: "2024-04-15T16:00:00Z",
        timezone: "UTC",
        capacity: 100,
        registeredCount: 45,
        price: 0,
        tags: ["Deep Learning", "AI", "Neural Networks"],
        level: "Beginner",
        requirements: ["Basic Python knowledge", "Understanding of basic mathematics"],
        learningOutcomes: [
          "Understand basic neural network architectures",
          "Build your first deep learning model",
          "Learn about common use cases and applications"
        ],
        status: "upcoming"
      }
    ];
    localStorage.setItem(EVENTS_KEY, JSON.stringify(initialEvents));
    return initialEvents;
  }
  return JSON.parse(stored);
};

// Get registrations from local storage
export const getStoredRegistrations = (): EventRegistration[] => {
  const stored = localStorage.getItem(EVENT_REGISTRATIONS_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Get a single event
export const getEvent = async (id: number): Promise<Event | null> => {
  const events = getStoredEvents();
  return events.find(e => e.id === id) || null;
};

// Create a new event
export const createEvent = async (
  event: Omit<Event, "id" | "host" | "registeredCount" | "status">,
  currentUser: User
): Promise<Event> => {
  const events = getStoredEvents();
  const newEvent: Event = {
    ...event,
    id: Math.max(0, ...events.map(e => e.id)) + 1,
    host: {
      id: currentUser.id,
      name: `${currentUser.firstName} ${currentUser.lastName}`,
      avatar: currentUser.profileImage,
    },
    registeredCount: 0,
    status: "upcoming"
  };
  
  events.unshift(newEvent);
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  return newEvent;
};

// Update an event
export const updateEvent = async (
  eventId: number,
  updates: Partial<Event>
): Promise<Event | null> => {
  const events = getStoredEvents();
  const event = events.find(e => e.id === eventId);
  
  if (!event) return null;
  
  Object.assign(event, updates);
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  return event;
};

// Register for an event
export const registerForEvent = async (
  eventId: number,
  userId: number
): Promise<EventRegistration | null> => {
  const events = getStoredEvents();
  const event = events.find(e => e.id === eventId);
  
  if (!event) return null;
  
  const registrations = getStoredRegistrations();
  const existingRegistration = registrations.find(
    r => r.eventId === eventId && r.userId === userId
  );
  
  if (existingRegistration) return existingRegistration;
  
  const status = event.registeredCount < event.capacity ? 'confirmed' : 'waitlist';
  
  const newRegistration: EventRegistration = {
    id: Math.max(0, ...registrations.map(r => r.id)) + 1,
    eventId,
    userId,
    registeredAt: new Date().toISOString(),
    status,
    paymentStatus: event.price > 0 ? 'pending' : 'completed'
  };
  
  if (status === 'confirmed') {
    event.registeredCount += 1;
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  }
  
  registrations.push(newRegistration);
  localStorage.setItem(EVENT_REGISTRATIONS_KEY, JSON.stringify(registrations));
  return newRegistration;
};

// Cancel registration
export const cancelRegistration = async (
  eventId: number,
  userId: number
): Promise<boolean> => {
  const registrations = getStoredRegistrations();
  const registration = registrations.find(
    r => r.eventId === eventId && r.userId === userId
  );
  
  if (!registration) return false;
  
  registration.status = 'cancelled';
  
  if (registration.paymentStatus === 'completed') {
    registration.paymentStatus = 'refunded';
  }
  
  const events = getStoredEvents();
  const event = events.find(e => e.id === eventId);
  
  if (event && registration.status === 'confirmed') {
    event.registeredCount = Math.max(0, event.registeredCount - 1);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  }
  
  localStorage.setItem(EVENT_REGISTRATIONS_KEY, JSON.stringify(registrations));
  return true;
};

// Search and filter events
export const searchEvents = async (
  query: string,
  type?: string,
  level?: string,
  tag?: string,
  status?: string
): Promise<Event[]> => {
  let events = getStoredEvents();
  
  if (query) {
    const searchLower = query.toLowerCase();
    events = events.filter(event =>
      event.title.toLowerCase().includes(searchLower) ||
      event.description.toLowerCase().includes(searchLower)
    );
  }
  
  if (type && type !== "all") {
    events = events.filter(event => event.type === type);
  }
  
  if (level && level !== "all") {
    events = events.filter(event => event.level === level);
  }
  
  if (tag && tag !== "all") {
    events = events.filter(event => event.tags.includes(tag));
  }
  
  if (status && status !== "all") {
    events = events.filter(event => event.status === status);
  }
  
  return events;
}; 