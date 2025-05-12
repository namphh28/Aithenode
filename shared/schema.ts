import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (both students and educators)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  bio: text("bio"),
  profileImage: text("profile_image"),
  userType: text("user_type").notNull(), // "student" or "educator"
  isVerified: boolean("is_verified").default(false),
});

// For educators' additional information
export const educatorProfiles = pgTable("educator_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(), // e.g., "Math Teacher", "Programming Tutor"
  hourlyRate: doublePrecision("hourly_rate").notNull(),
  experience: text("experience"),
  education: text("education"),
  specialties: text("specialties").array(),
  availability: json("availability"), // JSON object with availability slots
});

// Subject categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),
  educatorCount: integer("educator_count").default(0),
});

// Subjects within categories
export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => categories.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
});

// Map educators to subjects they teach
export const educatorSubjects = pgTable("educator_subjects", {
  id: serial("id").primaryKey(),
  educatorId: integer("educator_id").references(() => educatorProfiles.id).notNull(),
  subjectId: integer("subject_id").references(() => subjects.id).notNull(),
});

// Booking sessions
export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  educatorId: integer("educator_id").references(() => educatorProfiles.id).notNull(),
  studentId: integer("student_id").references(() => users.id).notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  status: text("status").notNull(), // "requested", "confirmed", "completed", "cancelled"
  totalPrice: doublePrecision("total_price").notNull(),
  notes: text("notes"),
  paymentStatus: text("payment_status").notNull(), // "pending", "paid", "refunded"
});

// Reviews for educators
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  educatorId: integer("educator_id").references(() => educatorProfiles.id).notNull(),
  studentId: integer("student_id").references(() => users.id).notNull(),
  sessionId: integer("session_id").references(() => sessions.id), // Optional: link to specific session
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Testimonials for the platform (featured on homepage)
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  userRole: text("user_role").notNull(), // e.g., "Computer Science Student", "Parent"
  isVisible: boolean("is_visible").default(true),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users)
  .omit({ id: true })
  .extend({
    confirmPassword: z.string().min(8),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const insertEducatorProfileSchema = createInsertSchema(educatorProfiles).omit({ id: true });
export const insertCategorySchema = createInsertSchema(categories).omit({ id: true });
export const insertSubjectSchema = createInsertSchema(subjects).omit({ id: true });
export const insertEducatorSubjectSchema = createInsertSchema(educatorSubjects).omit({ id: true });
export const insertSessionSchema = createInsertSchema(sessions).omit({ id: true });
export const insertReviewSchema = createInsertSchema(reviews).omit({ id: true, createdAt: true });
export const insertTestimonialSchema = createInsertSchema(testimonials).omit({ id: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type EducatorProfile = typeof educatorProfiles.$inferSelect;
export type InsertEducatorProfile = z.infer<typeof insertEducatorProfileSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Subject = typeof subjects.$inferSelect;
export type InsertSubject = z.infer<typeof insertSubjectSchema>;

export type EducatorSubject = typeof educatorSubjects.$inferSelect;
export type InsertEducatorSubject = z.infer<typeof insertEducatorSubjectSchema>;

export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
