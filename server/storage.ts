import {
  users,
  User,
  InsertUser,
  educatorProfiles,
  EducatorProfile,
  InsertEducatorProfile,
  categories,
  Category,
  InsertCategory,
  subjects,
  Subject,
  InsertSubject,
  educatorSubjects,
  EducatorSubject,
  InsertEducatorSubject,
  sessions,
  Session,
  InsertSession,
  reviews,
  Review,
  InsertReview,
  testimonials,
  Testimonial,
  InsertTestimonial,
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Educator profile operations
  getEducatorProfile(id: number): Promise<EducatorProfile | undefined>;
  getEducatorProfileByUserId(userId: number): Promise<EducatorProfile | undefined>;
  createEducatorProfile(profile: InsertEducatorProfile): Promise<EducatorProfile>;
  updateEducatorProfile(id: number, profile: EducatorProfile): Promise<EducatorProfile>;
  getAllEducators(limit?: number): Promise<(EducatorProfile & { user: User })[]>;
  getEducatorsBySubject(subjectId: number): Promise<(EducatorProfile & { user: User })[]>;
  getEducatorsByCategory(categoryId: number): Promise<(EducatorProfile & { user: User })[]>;
  
  // Category operations
  getAllCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Subject operations
  getAllSubjects(): Promise<Subject[]>;
  getSubject(id: number): Promise<Subject | undefined>;
  getSubjectsByCategory(categoryId: number): Promise<Subject[]>;
  createSubject(subject: InsertSubject): Promise<Subject>;
  
  // EducatorSubject operations
  assignSubjectToEducator(educatorSubject: InsertEducatorSubject): Promise<EducatorSubject>;
  removeSubjectFromEducator(educatorId: number, subjectId: number): Promise<boolean>;
  getEducatorSubjects(educatorId: number): Promise<(Subject & { category: Category })[]>;
  
  // Session operations
  getSession(id: number): Promise<Session | undefined>;
  createSession(session: InsertSession): Promise<Session>;
  getSessionsByEducator(educatorId: number): Promise<Session[]>;
  getSessionsByStudent(studentId: number): Promise<Session[]>;
  updateSessionStatus(id: number, status: string): Promise<Session>;
  updatePaymentStatus(id: number, status: string): Promise<Session>;
  
  // Review operations
  getReview(id: number): Promise<Review | undefined>;
  createReview(review: InsertReview): Promise<Review>;
  getReviewsByEducator(educatorId: number): Promise<(Review & { student: User })[]>;
  
  // Testimonial operations
  getAllTestimonials(): Promise<(Testimonial & { user: User })[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private educatorProfiles: Map<number, EducatorProfile>;
  private categories: Map<number, Category>;
  private subjects: Map<number, Subject>;
  private educatorSubjects: Map<number, EducatorSubject>;
  private sessions: Map<number, Session>;
  private reviews: Map<number, Review>;
  private testimonials: Map<number, Testimonial>;
  
  private userId: number;
  private educatorProfileId: number;
  private categoryId: number;
  private subjectId: number;
  private educatorSubjectId: number;
  private sessionId: number;
  private reviewId: number;
  private testimonialId: number;
  
  constructor() {
    this.users = new Map();
    this.educatorProfiles = new Map();
    this.categories = new Map();
    this.subjects = new Map();
    this.educatorSubjects = new Map();
    this.sessions = new Map();
    this.reviews = new Map();
    this.testimonials = new Map();
    
    this.userId = 1;
    this.educatorProfileId = 1;
    this.categoryId = 1;
    this.subjectId = 1;
    this.educatorSubjectId = 1;
    this.sessionId = 1;
    this.reviewId = 1;
    this.testimonialId = 1;
    
    // Initialize with sample data
    this.initializeData().catch(error => {
      console.error("Error initializing data:", error);
    });
  }
  
  private async initializeData(): Promise<void> {
    // Sample categories
    const categories = [
      { name: "Mathematics", description: "Mathematics and Statistics", imageUrl: "https://images.unsplash.com/photo-1535551951406-a19828b0a76b", educatorCount: 120 },
      { name: "Programming", description: "Programming and Web Development", imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97", educatorCount: 85 },
      { name: "Languages", description: "Foreign Languages and Literature", imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f", educatorCount: 150 },
      { name: "Music", description: "Music Theory and Instruments", imageUrl: "https://images.unsplash.com/photo-1514119412350-e174d90d280e", educatorCount: 95 },
      { name: "Science", description: "Physics, Chemistry, and Biology", imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d", educatorCount: 110 },
      { name: "Art & Design", description: "Visual Arts and Design", imageUrl: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b", educatorCount: 75 },
      { name: "Business", description: "Business Studies and Economics", imageUrl: "https://images.unsplash.com/photo-1455849318743-b2233052fcff", educatorCount: 65 }
    ];
    
    for (const category of categories) {
      await this.createCategory(category);
    }
    
    // Sample users
    const users = [
      { username: "sarahjohnson", password: "password123", email: "sarah@example.com", firstName: "Sarah", lastName: "Johnson", bio: "PhD in Mathematics with 10+ years of teaching experience", profileImage: "https://images.unsplash.com/photo-1544717305-2782549b5136", userType: "educator", isVerified: true, confirmPassword: "password123" },
      { username: "jameswilson", password: "password123", email: "james@example.com", firstName: "James", lastName: "Wilson", bio: "Senior software developer with expertise in web technologies", profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d", userType: "educator", isVerified: true, confirmPassword: "password123" },
      { username: "mariagarcia", password: "password123", email: "maria@example.com", firstName: "Maria", lastName: "Garcia", bio: "Multilingual expert with degrees in Literature and Linguistics", profileImage: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd", userType: "educator", isVerified: true, confirmPassword: "password123" },
      { username: "alexthompson", password: "password123", email: "alex@example.com", firstName: "Alex", lastName: "Thompson", bio: "Computer Science student", profileImage: "https://images.unsplash.com/photo-1557862921-37829c790f19", userType: "student", isVerified: true, confirmPassword: "password123" },
      { username: "jenniferdavis", password: "password123", email: "jennifer@example.com", firstName: "Jennifer", lastName: "Davis", bio: "Business professional looking to learn Spanish", profileImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956", userType: "student", isVerified: true, confirmPassword: "password123" },
      { username: "sophiawilliams", password: "password123", email: "sophia@example.com", firstName: "Sophia", lastName: "Williams", bio: "Parent looking for a piano teacher for my daughter", profileImage: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91", userType: "student", isVerified: true, confirmPassword: "password123" }
    ];
    
    for (const user of users) {
      await this.createUser(user);
    }
    
    // Create educator profiles
    const educatorProfiles = [
      { userId: 1, title: "Mathematics & Statistics Professor", hourlyRate: 45, experience: "10+ years teaching at university level", education: "PhD in Applied Mathematics", specialties: ["Calculus", "Statistics", "Algebra"], availability: { monday: ["9:00", "10:00", "11:00"], wednesday: ["13:00", "14:00", "15:00"], friday: ["9:00", "10:00", "11:00"] } },
      { userId: 2, title: "Programming & Web Development Instructor", hourlyRate: 55, experience: "15 years as a software engineer", education: "Master's in Computer Science", specialties: ["JavaScript", "Python", "React"], availability: { tuesday: ["18:00", "19:00", "20:00"], thursday: ["18:00", "19:00", "20:00"], saturday: ["10:00", "11:00", "12:00"] } },
      { userId: 3, title: "Languages & Literature Teacher", hourlyRate: 40, experience: "8 years teaching languages", education: "Master's in Linguistics", specialties: ["Spanish", "French", "English Literature"], availability: { monday: ["16:00", "17:00", "18:00"], wednesday: ["16:00", "17:00", "18:00"], friday: ["16:00", "17:00", "18:00"] } }
    ];
    
    for (const profile of educatorProfiles) {
      await this.createEducatorProfile(profile);
    }
    
    // Create subjects and link to educators
    const mathSubjects = ["Calculus", "Statistics", "Algebra", "Geometry", "Trigonometry"];
    const programmingSubjects = ["JavaScript", "Python", "Web Development", "Algorithms", "Data Structures"];
    const languageSubjects = ["Spanish", "French", "English Literature", "Grammar", "Conversation"];
    
    // Create and assign math subjects
    for (const subjectName of mathSubjects) {
      const subject = await this.createSubject({ categoryId: 1, name: subjectName, description: `Learn ${subjectName} with expert tutors` });
      if (["Calculus", "Statistics", "Algebra"].includes(subjectName)) {
        await this.assignSubjectToEducator({ educatorId: 1, subjectId: subject.id });
      }
    }
    
    // Create and assign programming subjects
    for (const subjectName of programmingSubjects) {
      const subject = await this.createSubject({ categoryId: 2, name: subjectName, description: `Master ${subjectName} with practical projects` });
      if (["JavaScript", "Python", "Web Development"].includes(subjectName)) {
        await this.assignSubjectToEducator({ educatorId: 2, subjectId: subject.id });
      }
    }
    
    // Create and assign language subjects
    for (const subjectName of languageSubjects) {
      const subject = await this.createSubject({ categoryId: 3, name: subjectName, description: `Become fluent in ${subjectName}` });
      if (["Spanish", "French", "English Literature"].includes(subjectName)) {
        await this.assignSubjectToEducator({ educatorId: 3, subjectId: subject.id });
      }
    }
    
    // Create testimonials
    const testimonials = [
      { userId: 4, content: "Aithenode helped me find the perfect math tutor who finally made calculus click for me. I went from struggling to acing my exams in just two months!", userRole: "Computer Science Student", isVisible: true },
      { userId: 5, content: "I wanted to learn Spanish for an upcoming trip to Madrid. My instructor was amazing and tailored lessons to my travel needs. Highly recommend!", userRole: "Business Professional", isVisible: true },
      { userId: 6, content: "As a parent, I was looking for a qualified piano teacher for my daughter. We found an excellent instructor who makes lessons fun and engaging. Her progress has been remarkable!", userRole: "Parent", isVisible: true }
    ];
    
    for (const testimonial of testimonials) {
      await this.createTestimonial(testimonial);
    }
    
    // Create some reviews
    const reviews = [
      { educatorId: 1, studentId: 4, rating: 5, comment: "Dr. Johnson explained complex calculus concepts in a way that finally made sense to me." },
      { educatorId: 2, studentId: 4, rating: 5, comment: "James is an excellent programming tutor. I learned React in just a few weeks!" },
      { educatorId: 3, studentId: 5, rating: 5, comment: "My Spanish improved dramatically after just a month of lessons with Maria." }
    ];
    
    for (const review of reviews) {
      await this.createReview(review);
    }
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }
  
  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...userData, id };
    this.users.set(id, user);
    return user;
  }
  
  // Educator profile operations
  async getEducatorProfile(id: number): Promise<EducatorProfile | undefined> {
    return this.educatorProfiles.get(id);
  }
  
  async getEducatorProfileByUserId(userId: number): Promise<EducatorProfile | undefined> {
    return Array.from(this.educatorProfiles.values()).find(profile => profile.userId === userId);
  }
  
  async createEducatorProfile(profileData: InsertEducatorProfile): Promise<EducatorProfile> {
    const id = this.educatorProfileId++;
    const profile: EducatorProfile = { ...profileData, id };
    this.educatorProfiles.set(id, profile);
    return profile;
  }
  
  async updateEducatorProfile(id: number, profileData: EducatorProfile): Promise<EducatorProfile> {
    if (!this.educatorProfiles.has(id)) {
      throw new Error(`Educator profile not found: ${id}`);
    }
    
    const profile: EducatorProfile = {
      ...profileData,
      id // ensure id is preserved
    };
    
    this.educatorProfiles.set(id, profile);
    return profile;
  }
  
  async getAllEducators(limit?: number): Promise<(EducatorProfile & { user: User })[]> {
    const educators = Array.from(this.educatorProfiles.values()).map(profile => {
      const user = this.users.get(profile.userId);
      if (!user) throw new Error(`User not found for educator profile ${profile.id}`);
      return { ...profile, user };
    });
    
    return limit ? educators.slice(0, limit) : educators;
  }
  
  async getEducatorsBySubject(subjectId: number): Promise<(EducatorProfile & { user: User })[]> {
    const educatorSubjectsWithMatchingSubject = Array.from(this.educatorSubjects.values())
      .filter(es => es.subjectId === subjectId);
    
    return Promise.all(
      educatorSubjectsWithMatchingSubject.map(async es => {
        const profile = await this.getEducatorProfile(es.educatorId);
        if (!profile) throw new Error(`Educator profile not found: ${es.educatorId}`);
        
        const user = await this.getUser(profile.userId);
        if (!user) throw new Error(`User not found: ${profile.userId}`);
        
        return { ...profile, user };
      })
    );
  }
  
  async getEducatorsByCategory(categoryId: number): Promise<(EducatorProfile & { user: User })[]> {
    const subjectsInCategory = Array.from(this.subjects.values())
      .filter(subject => subject.categoryId === categoryId);
    
    const educatorIds = new Set<number>();
    
    for (const subject of subjectsInCategory) {
      const educatorSubjects = Array.from(this.educatorSubjects.values())
        .filter(es => es.subjectId === subject.id);
      
      for (const es of educatorSubjects) {
        educatorIds.add(es.educatorId);
      }
    }
    
    return Promise.all(
      Array.from(educatorIds).map(async educatorId => {
        const profile = await this.getEducatorProfile(educatorId);
        if (!profile) throw new Error(`Educator profile not found: ${educatorId}`);
        
        const user = await this.getUser(profile.userId);
        if (!user) throw new Error(`User not found: ${profile.userId}`);
        
        return { ...profile, user };
      })
    );
  }
  
  // Category operations
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async createCategory(categoryData: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const category: Category = { ...categoryData, id };
    this.categories.set(id, category);
    return category;
  }
  
  // Subject operations
  async getAllSubjects(): Promise<Subject[]> {
    return Array.from(this.subjects.values());
  }
  
  async getSubject(id: number): Promise<Subject | undefined> {
    return this.subjects.get(id);
  }
  
  async getSubjectsByCategory(categoryId: number): Promise<Subject[]> {
    return Array.from(this.subjects.values())
      .filter(subject => subject.categoryId === categoryId);
  }
  
  async createSubject(subjectData: InsertSubject): Promise<Subject> {
    const id = this.subjectId++;
    const subject: Subject = { ...subjectData, id };
    this.subjects.set(id, subject);
    return subject;
  }
  
  // EducatorSubject operations
  async assignSubjectToEducator(data: InsertEducatorSubject): Promise<EducatorSubject> {
    // Check if this educator-subject relationship already exists
    const existingRelationship = Array.from(this.educatorSubjects.values()).find(
      es => es.educatorId === data.educatorId && es.subjectId === data.subjectId
    );
    
    if (existingRelationship) {
      return existingRelationship; // Return existing relationship if it already exists
    }
    
    // If not, create a new one
    const id = this.educatorSubjectId++;
    const educatorSubject: EducatorSubject = { ...data, id };
    this.educatorSubjects.set(id, educatorSubject);
    return educatorSubject;
  }
  
  async removeSubjectFromEducator(educatorId: number, subjectId: number): Promise<boolean> {
    const toRemove = Array.from(this.educatorSubjects.values()).find(
      es => es.educatorId === educatorId && es.subjectId === subjectId
    );
    
    if (toRemove) {
      this.educatorSubjects.delete(toRemove.id);
      return true;
    }
    
    return false; // Nothing to remove
  }
  
  async getEducatorSubjects(educatorId: number): Promise<(Subject & { category: Category })[]> {
    // Find educator-subject relationships for this educator
    const educatorSubjectsWithMatchingEducator = Array.from(this.educatorSubjects.values())
      .filter(es => es.educatorId === educatorId);
    
    // If no subjects assigned to this educator, return empty array
    if (educatorSubjectsWithMatchingEducator.length === 0) {
      return [];
    }
    
    try {
      return Promise.all(
        educatorSubjectsWithMatchingEducator.map(async es => {
          // Skip entries with invalid subjectId
          if (!es.subjectId) {
            console.log(`Skipping invalid subject ID for educator ${educatorId}`);
            return null;
          }
          
          const subject = await this.getSubject(es.subjectId);
          if (!subject) {
            console.log(`Subject not found for ID: ${es.subjectId}, skipping`);
            return null;
          }
          
          const category = await this.getCategory(subject.categoryId);
          if (!category) {
            console.log(`Category not found for ID: ${subject.categoryId}, using default category`);
            // Create a minimal default category to avoid errors
            const defaultCategory: Category = {
              id: 0,
              name: "Uncategorized",
              educatorCount: 0
            };
            return { ...subject, category: defaultCategory };
          }
          
          return { ...subject, category };
        })
      ).then(results => results.filter(Boolean) as (Subject & { category: Category })[]);
    } catch (error) {
      console.error(`Error in getEducatorSubjects for educator ${educatorId}:`, error);
      return []; // Return empty array on error to avoid breaking the app
    }
  }
  
  // Session operations
  async getSession(id: number): Promise<Session | undefined> {
    return this.sessions.get(id);
  }
  
  async createSession(sessionData: InsertSession): Promise<Session> {
    const id = this.sessionId++;
    const session: Session = { ...sessionData, id };
    this.sessions.set(id, session);
    return session;
  }
  
  async getSessionsByEducator(educatorId: number): Promise<Session[]> {
    return Array.from(this.sessions.values())
      .filter(session => session.educatorId === educatorId);
  }
  
  async getSessionsByStudent(studentId: number): Promise<Session[]> {
    return Array.from(this.sessions.values())
      .filter(session => session.studentId === studentId);
  }
  
  async updateSessionStatus(id: number, status: string): Promise<Session> {
    const session = this.sessions.get(id);
    if (!session) throw new Error(`Session not found: ${id}`);
    
    const updatedSession = { ...session, status };
    this.sessions.set(id, updatedSession);
    return updatedSession;
  }
  
  async updatePaymentStatus(id: number, status: string): Promise<Session> {
    const session = this.sessions.get(id);
    if (!session) throw new Error(`Session not found: ${id}`);
    
    const updatedSession = { ...session, paymentStatus: status };
    this.sessions.set(id, updatedSession);
    return updatedSession;
  }
  
  // Review operations
  async getReview(id: number): Promise<Review | undefined> {
    return this.reviews.get(id);
  }
  
  async createReview(reviewData: InsertReview): Promise<Review> {
    const id = this.reviewId++;
    const review: Review = { ...reviewData, id, createdAt: new Date() };
    this.reviews.set(id, review);
    return review;
  }
  
  async getReviewsByEducator(educatorId: number): Promise<(Review & { student: User })[]> {
    const reviews = Array.from(this.reviews.values())
      .filter(review => review.educatorId === educatorId);
    
    // If no reviews for this educator, return empty array
    if (reviews.length === 0) {
      return [];
    }
    
    try {
      return Promise.all(
        reviews.map(async review => {
          try {
            const student = await this.getUser(review.studentId);
            if (!student) {
              console.log(`Student not found for ID: ${review.studentId}, using placeholder`);
              // Create a minimal student object to avoid errors
              const placeholderStudent: User = {
                id: 0,
                username: "former_student",
                firstName: "Former",
                lastName: "Student",
                email: "student@example.com",
                password: "",
                userType: "student",
                isVerified: false
              };
              return { ...review, student: placeholderStudent };
            }
            
            return { ...review, student };
          } catch (error) {
            console.error(`Error processing review ${review.id}:`, error);
            return null;
          }
        })
      ).then(results => results.filter(Boolean) as (Review & { student: User })[]);
    } catch (error) {
      console.error(`Error in getReviewsByEducator for educator ${educatorId}:`, error);
      return []; // Return empty array on error to avoid breaking the app
    }
  }
  
  // Testimonial operations
  async getAllTestimonials(): Promise<(Testimonial & { user: User })[]> {
    const testimonials = Array.from(this.testimonials.values())
      .filter(testimonial => testimonial.isVisible);
    
    return Promise.all(
      testimonials.map(async testimonial => {
        const user = await this.getUser(testimonial.userId);
        if (!user) throw new Error(`User not found: ${testimonial.userId}`);
        
        return { ...testimonial, user };
      })
    );
  }
  
  async createTestimonial(testimonialData: InsertTestimonial): Promise<Testimonial> {
    const id = this.testimonialId++;
    const testimonial: Testimonial = { ...testimonialData, id };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }
}

export const storage = new MemStorage();
