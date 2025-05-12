import { Category, Testimonial } from "./types";

// Utility function to format ratings
export const formatRating = (rating: number | undefined): string => {
  if (rating === undefined) return "0.0";
  return rating.toFixed(1);
};

// Days of the week for scheduling
export const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Time slots for booking
export const timeSlots = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];

// Sample categories data (used for fallback if API fails)
export const fallbackCategories: Category[] = [
  { id: 1, name: "Mathematics", description: "Mathematics and Statistics", imageUrl: "https://images.unsplash.com/photo-1535551951406-a19828b0a76b", educatorCount: 120 },
  { id: 2, name: "Programming", description: "Programming and Web Development", imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97", educatorCount: 85 },
  { id: 3, name: "Languages", description: "Foreign Languages and Literature", imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f", educatorCount: 150 },
  { id: 4, name: "Music", description: "Music Theory and Instruments", imageUrl: "https://images.unsplash.com/photo-1514119412350-e174d90d280e", educatorCount: 95 },
  { id: 5, name: "Science", description: "Physics, Chemistry, and Biology", imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d", educatorCount: 110 },
  { id: 6, name: "Art & Design", description: "Visual Arts and Design", imageUrl: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b", educatorCount: 75 },
  { id: 7, name: "Business", description: "Business Studies and Economics", imageUrl: "https://images.unsplash.com/photo-1455849318743-b2233052fcff", educatorCount: 65 },
];

// Sample testimonials data (used for fallback if API fails)
export const fallbackTestimonials: Partial<Testimonial>[] = [
  {
    id: 1,
    content: "EduConnect helped me find the perfect math tutor who finally made calculus click for me. I went from struggling to acing my exams in just two months!",
    userRole: "Computer Science Student",
    user: {
      id: 4,
      firstName: "Alex",
      lastName: "Thompson",
      profileImage: "https://images.unsplash.com/photo-1557862921-37829c790f19",
      username: "alexthompson",
      email: "alex@example.com",
      userType: "student",
      isVerified: true,
    },
  },
  {
    id: 2,
    content: "I wanted to learn Spanish for an upcoming trip to Madrid. My instructor was amazing and tailored lessons to my travel needs. Highly recommend!",
    userRole: "Business Professional",
    user: {
      id: 5,
      firstName: "Jennifer",
      lastName: "Davis",
      profileImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
      username: "jenniferdavis",
      email: "jennifer@example.com",
      userType: "student",
      isVerified: true,
    },
  },
  {
    id: 3,
    content: "As a parent, I was looking for a qualified piano teacher for my daughter. We found an excellent instructor who makes lessons fun and engaging. Her progress has been remarkable!",
    userRole: "Parent",
    user: {
      id: 6,
      firstName: "Sophia",
      lastName: "Williams",
      profileImage: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91",
      username: "sophiawilliams",
      email: "sophia@example.com",
      userType: "student",
      isVerified: true,
    },
  },
];
