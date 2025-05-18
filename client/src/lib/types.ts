export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  bio?: string;
  profileImage?: string;
  userType: "student" | "educator";
  isVerified: boolean;
}

export interface EducatorProfile {
  id: number;
  userId: number;
  title: string;
  hourlyRate: number;
  experience?: string;
  education?: string;
  specialties: string[];
  availability: Record<string, string[]>;
  user: User;
  subjects?: (Subject & { category: Category })[];
  reviewCount?: number;
  averageRating?: number;
  reviews?: (Review & { student: User })[];
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  educatorCount: number;
  subjects?: Subject[];
}

export interface Subject {
  id: number;
  categoryId: number;
  name: string;
  description?: string;
  category?: Category;
}

export interface Session {
  id: number;
  educatorId: number;
  studentId: number;
  startTime: string;
  endTime: string;
  status: "requested" | "confirmed" | "completed" | "cancelled";
  totalPrice: number;
  notes?: string;
  paymentStatus: "pending" | "paid" | "refunded";
  educator?: {
    id: number;
    title: string;
    hourlyRate: number;
    user: User;
  };
  student?: User;
  formattedStartTime?: string;
  formattedEndTime?: string;
}

export interface Review {
  id: number;
  educatorId: number;
  studentId: number;
  sessionId?: number;
  rating: number;
  comment?: string;
  createdAt: string;
  student?: User;
}

export interface Testimonial {
  id: number;
  userId: number;
  content: string;
  userRole: string;
  isVisible: boolean;
  user: User;
}

export interface SignUpFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  userType: "student" | "educator";
}

export interface SignInFormData {
  email: string;
  password: string;
}

export interface BookingFormData {
  date: Date;
  startTime: string;
  endTime: string;
  notes?: string;
}

export interface ReviewFormData {
  rating: number;
  comment?: string;
}

export interface Comment {
  id: number;
  content: string;
  author: {
    id: number;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  likes: number;
  isLiked?: boolean;
}

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  author: {
    id: number;
    name: string;
    avatar?: string;
  };
  coverImage?: string;
  tags: string[];
  category: string;
  createdAt: string;
  readTime: number;
  likes: number;
  comments: number;
  isLiked?: boolean;
  commentList?: Comment[];
}

export type EventType = 'webinar' | 'workshop';

export interface Event {
  id: number;
  type: EventType;
  title: string;
  description: string;
  host: {
    id: number;
    name: string;
    avatar?: string;
  };
  coverImage?: string;
  startDate: string;
  endDate: string;
  timezone: string;
  capacity: number;
  registeredCount: number;
  price: number;
  tags: string[];
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  requirements?: string[];
  learningOutcomes?: string[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  likes: number;
  comments: number;
  isLiked?: boolean;
  commentList?: Comment[];
}

export interface EventRegistration {
  id: number;
  eventId: number;
  userId: number;
  registeredAt: string;
  status: 'confirmed' | 'waitlist' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'refunded';
}

export interface Challenge {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  type: 'weekly' | 'monthly' | 'special';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  points: number;
  tasks: ChallengeTask[];
  participants: number;
  status: 'upcoming' | 'active' | 'completed';
}

export interface ChallengeTask {
  id: number;
  title: string;
  description: string;
  points: number;
  completed?: boolean;
}

export interface UserChallenge {
  userId: number;
  challengeId: number;
  progress: number;
  completedTasks: number[];
  pointsEarned: number;
  startedAt: string;
  completedAt?: string;
  rank?: number;
}

export interface LeaderboardEntry {
  user: {
    id: number;
    name: string;
    avatar?: string;
    badges: Badge[];
  };
  points: number;
  rank: number;
  challengesCompleted: number;
  streak: number;
}

export interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: string;
}

export interface Reward {
  id: number;
  type: 'badge' | 'discount' | 'souvenir';
  title: string;
  description: string;
  value: string | number; // percentage for discount, image URL for badge/souvenir
  requirements: {
    minRank?: number;
    minPoints?: number;
    challengesCompleted?: number;
  };
}
