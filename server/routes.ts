import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertEducatorProfileSchema, 
  insertSessionSchema, 
  insertReviewSchema 
} from "@shared/schema";
import session from "express-session";
import MemoryStore from "memorystore";
import { format } from "date-fns";

const MemoryStoreSession = MemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session middleware
  app.use(
    session({
      cookie: { maxAge: 86400000 }, // 24 hours
      store: new MemoryStoreSession({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET || "educonnect-secret",
    })
  );

  // Current user middleware
  app.use((req, res, next) => {
    req.session.user = req.session.user || null;
    next();
  });

  // Auth guard middleware
  const requireAuth = (req: Request, res: Response, next: Function) => {
    if (!req.session.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  };

  // ROUTES
  app.get("/api/health", (req, res) => {
    res.json({ status: "up" });
  });

  // Auth routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUserByEmail = await storage.getUserByEmail(userData.email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }

      const existingUserByUsername = await storage.getUserByUsername(userData.username);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already in use" });
      }

      // In a real app we'd hash the password here
      const user = await storage.createUser(userData);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      req.session.user = userWithoutPassword;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "An error occurred during signup" });
      }
    }
  });

  app.post("/api/auth/signin", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) { // In a real app, use proper password comparison
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Remove password from session
      const { password: _, ...userWithoutPassword } = user;
      
      req.session.user = userWithoutPassword;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "An error occurred during signin" });
    }
  });

  app.post("/api/auth/signout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Signed out successfully" });
    });
  });

  app.get("/api/auth/current-user", (req, res) => {
    res.json(req.session.user || null);
  });

  // Educator profile routes
  app.post("/api/educator-profiles", requireAuth, async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Ensure user is authorized to create an educator profile
      const user = await storage.getUser(req.session.user.id);
      if (!user || user.userType !== "educator") {
        return res.status(403).json({ message: "Only educators can create profiles" });
      }
      
      // Check if user already has a profile
      const existingProfile = await storage.getEducatorProfileByUserId(user.id);
      if (existingProfile) {
        return res.status(400).json({ message: "Educator profile already exists" });
      }
      
      const profileData = insertEducatorProfileSchema.parse({
        ...req.body,
        userId: user.id
      });
      
      const profile = await storage.createEducatorProfile(profileData);
      res.status(201).json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "An error occurred creating the profile" });
      }
    }
  });

  app.get("/api/educator-profiles", async (req, res) => {
    try {
      const { limit, subjectId, categoryId } = req.query;
      
      let educators;
      try {
        if (subjectId) {
          console.log(`Fetching educators by subject ID: ${subjectId}`);
          educators = await storage.getEducatorsBySubject(Number(subjectId));
        } else if (categoryId) {
          console.log(`Fetching educators by category ID: ${categoryId}`);
          educators = await storage.getEducatorsByCategory(Number(categoryId));
        } else {
          console.log('Fetching all educators');
          educators = await storage.getAllEducators(limit ? Number(limit) : undefined);
        }
        console.log(`Found ${educators.length} educators`);
      } catch (fetchError) {
        console.error('Error fetching educators:', fetchError);
        throw fetchError;
      }
      
      // Enhance educators with their subjects and reviews
      try {
        const enhancedEducators = await Promise.all(
          educators.map(async (educator) => {
            console.log(`Enhancing educator ${educator.id}`);
            let subjects, reviews;
            
            try {
              subjects = await storage.getEducatorSubjects(educator.id);
            } catch (subjectsError) {
              console.error(`Error fetching subjects for educator ${educator.id}:`, subjectsError);
              subjects = [];
            }
            
            try {
              reviews = await storage.getReviewsByEducator(educator.id);
            } catch (reviewsError) {
              console.error(`Error fetching reviews for educator ${educator.id}:`, reviewsError);
              reviews = [];
            }
            
            // Calculate average rating
            let averageRating = 0;
            if (reviews.length > 0) {
              averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
            }
            
            return {
              ...educator,
              subjects,
              reviewCount: reviews.length,
              averageRating
            };
          })
        );
        
        res.json(enhancedEducators);
      } catch (enhanceError) {
        console.error('Error enhancing educators:', enhanceError);
        throw enhanceError;
      }
    } catch (error) {
      console.error('Educator profiles API error:', error);
      res.status(500).json({ message: "An error occurred fetching educators" });
    }
  });

  app.get("/api/educator-profiles/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const profile = await storage.getEducatorProfile(id);
      
      if (!profile) {
        return res.status(404).json({ message: "Educator profile not found" });
      }
      
      const user = await storage.getUser(profile.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const subjects = await storage.getEducatorSubjects(profile.id);
      const reviews = await storage.getReviewsByEducator(profile.id);
      
      // Calculate average rating
      let averageRating = 0;
      if (reviews.length > 0) {
        averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      }
      
      // Remove password from user object
      const { password, ...userWithoutPassword } = user;
      
      res.json({
        ...profile,
        user: userWithoutPassword,
        subjects,
        reviews,
        reviewCount: reviews.length,
        averageRating
      });
    } catch (error) {
      res.status(500).json({ message: "An error occurred fetching the educator profile" });
    }
  });

  // Category routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "An error occurred fetching categories" });
    }
  });

  app.get("/api/categories/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const category = await storage.getCategory(id);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      const subjects = await storage.getSubjectsByCategory(id);
      res.json({ ...category, subjects });
    } catch (error) {
      res.status(500).json({ message: "An error occurred fetching the category" });
    }
  });

  // Subject routes
  app.get("/api/subjects", async (req, res) => {
    try {
      const { categoryId } = req.query;
      
      if (categoryId) {
        const subjects = await storage.getSubjectsByCategory(Number(categoryId));
        return res.json(subjects);
      }
      
      const subjects = await storage.getAllSubjects();
      res.json(subjects);
    } catch (error) {
      res.status(500).json({ message: "An error occurred fetching subjects" });
    }
  });

  // Session (booking) routes
  app.post("/api/sessions", requireAuth, async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Validate that the current user is the student making the booking
      if (req.body.studentId !== req.session.user.id) {
        return res.status(403).json({ message: "You can only book sessions for yourself" });
      }
      
      const sessionData = insertSessionSchema.parse(req.body);
      
      // Validate educator exists
      const educator = await storage.getEducatorProfile(sessionData.educatorId);
      if (!educator) {
        return res.status(404).json({ message: "Educator not found" });
      }
      
      // In a real app, we would check educator availability here
      
      const session = await storage.createSession({
        ...sessionData,
        status: "requested", // Initial status is always "requested"
        paymentStatus: "pending" // Initial payment status is always "pending"
      });
      
      res.status(201).json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "An error occurred creating the session" });
      }
    }
  });

  app.get("/api/sessions", requireAuth, async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const { type } = req.query;
      let sessions = [];
      
      if (type === "educator") {
        // Get educator profile for the user
        const profile = await storage.getEducatorProfileByUserId(req.session.user.id);
        if (!profile) {
          return res.status(404).json({ message: "Educator profile not found" });
        }
        
        sessions = await storage.getSessionsByEducator(profile.id);
      } else {
        // Default: get sessions where the user is the student
        sessions = await storage.getSessionsByStudent(req.session.user.id);
      }
      
      // Enhance sessions with educator/student info
      const enhancedSessions = await Promise.all(
        sessions.map(async (session) => {
          const educatorProfile = await storage.getEducatorProfile(session.educatorId);
          if (!educatorProfile) {
            throw new Error(`Educator profile not found: ${session.educatorId}`);
          }
          
          const educatorUser = await storage.getUser(educatorProfile.userId);
          if (!educatorUser) {
            throw new Error(`Educator user not found: ${educatorProfile.userId}`);
          }
          
          const studentUser = await storage.getUser(session.studentId);
          if (!studentUser) {
            throw new Error(`Student user not found: ${session.studentId}`);
          }
          
          // Remove passwords
          const { password: _, ...educatorWithoutPassword } = educatorUser;
          const { password: __, ...studentWithoutPassword } = studentUser;
          
          // Format dates for display
          const formattedStartTime = format(new Date(session.startTime), "PPp");
          const formattedEndTime = format(new Date(session.endTime), "p");
          
          return {
            ...session,
            educator: {
              ...educatorProfile,
              user: educatorWithoutPassword
            },
            student: studentWithoutPassword,
            formattedStartTime,
            formattedEndTime
          };
        })
      );
      
      res.json(enhancedSessions);
    } catch (error) {
      res.status(500).json({ message: "An error occurred fetching sessions" });
    }
  });

  app.patch("/api/sessions/:id/status", requireAuth, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const { status } = req.body;
      
      if (!status || !["confirmed", "completed", "cancelled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const session = await storage.getSession(id);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      // Authorization check: educators can update any status, students can only cancel
      const educatorProfile = await storage.getEducatorProfileByUserId(req.session.user?.id);
      const isEducator = educatorProfile && educatorProfile.id === session.educatorId;
      const isStudent = req.session.user?.id === session.studentId;
      
      if (isEducator || (isStudent && status === "cancelled")) {
        const updatedSession = await storage.updateSessionStatus(id, status);
        res.json(updatedSession);
      } else {
        res.status(403).json({ message: "Not authorized to update this session status" });
      }
    } catch (error) {
      res.status(500).json({ message: "An error occurred updating the session status" });
    }
  });

  app.patch("/api/sessions/:id/payment", requireAuth, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const { status } = req.body;
      
      if (!status || !["paid", "refunded"].includes(status)) {
        return res.status(400).json({ message: "Invalid payment status" });
      }
      
      const session = await storage.getSession(id);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      // In a real app, we would process payment or refund here
      // For this MVP, we'll just update the status
      
      // Authorization check: only the student can pay, only the educator can refund
      const educatorProfile = await storage.getEducatorProfileByUserId(req.session.user?.id);
      const isEducator = educatorProfile && educatorProfile.id === session.educatorId;
      const isStudent = req.session.user?.id === session.studentId;
      
      if ((isStudent && status === "paid") || (isEducator && status === "refunded")) {
        const updatedSession = await storage.updatePaymentStatus(id, status);
        res.json(updatedSession);
      } else {
        res.status(403).json({ message: "Not authorized to update this payment status" });
      }
    } catch (error) {
      res.status(500).json({ message: "An error occurred updating the payment status" });
    }
  });

  // Review routes
  app.post("/api/reviews", requireAuth, async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Validate that the current user is the student leaving the review
      if (req.body.studentId !== req.session.user.id) {
        return res.status(403).json({ message: "You can only leave reviews as yourself" });
      }
      
      const reviewData = insertReviewSchema.parse(req.body);
      
      // Validate educator exists
      const educator = await storage.getEducatorProfile(reviewData.educatorId);
      if (!educator) {
        return res.status(404).json({ message: "Educator not found" });
      }
      
      // If sessionId is provided, validate it belongs to the student and educator
      if (reviewData.sessionId) {
        const session = await storage.getSession(reviewData.sessionId);
        if (!session) {
          return res.status(404).json({ message: "Session not found" });
        }
        
        if (session.studentId !== reviewData.studentId || session.educatorId !== reviewData.educatorId) {
          return res.status(403).json({ message: "Session does not match student and educator" });
        }
        
        // Ensure session is completed
        if (session.status !== "completed") {
          return res.status(400).json({ message: "Can only review completed sessions" });
        }
      }
      
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "An error occurred creating the review" });
      }
    }
  });

  app.get("/api/reviews/educator/:educatorId", async (req, res) => {
    try {
      const educatorId = Number(req.params.educatorId);
      
      // Validate educator exists
      const educator = await storage.getEducatorProfile(educatorId);
      if (!educator) {
        return res.status(404).json({ message: "Educator not found" });
      }
      
      const reviews = await storage.getReviewsByEducator(educatorId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "An error occurred fetching reviews" });
    }
  });

  // Testimonial routes
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getAllTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "An error occurred fetching testimonials" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
