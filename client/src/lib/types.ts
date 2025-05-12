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
