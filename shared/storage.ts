import {
  User,
  InsertUser,
  EducatorProfile,
  InsertEducatorProfile,
  Category,
  InsertCategory,
  Subject,
  InsertSubject,
  EducatorSubject,
  InsertEducatorSubject,
  Session,
  InsertSession,
  Review,
  InsertReview,
  Testimonial,
  InsertTestimonial,
  ForumPost,
  InsertForumPost,
  ForumReply,
  InsertForumReply
} from "./schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(userData: InsertUser): Promise<User>;

  // Educator profile operations
  getEducatorProfile(id: number): Promise<EducatorProfile | undefined>;
  getEducatorProfileByUserId(userId: number): Promise<EducatorProfile | undefined>;
  createEducatorProfile(profileData: InsertEducatorProfile): Promise<EducatorProfile>;
  getAllEducators(limit?: number): Promise<(EducatorProfile & { user: User })[]>;
  getEducatorsBySubject(subjectId: number): Promise<(EducatorProfile & { user: User })[]>;
  getEducatorsByCategory(categoryId: number): Promise<(EducatorProfile & { user: User })[]>;

  // Category operations
  getAllCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(categoryData: InsertCategory): Promise<Category>;

  // Subject operations
  getAllSubjects(): Promise<Subject[]>;
  getSubject(id: number): Promise<Subject | undefined>;
  getSubjectsByCategory(categoryId: number): Promise<Subject[]>;
  createSubject(subjectData: InsertSubject): Promise<Subject>;

  // EducatorSubject operations
  assignSubjectToEducator(data: InsertEducatorSubject): Promise<EducatorSubject>;
  getEducatorSubjects(educatorId: number): Promise<(Subject & { category: Category })[]>;

  // Session operations
  getSession(id: number): Promise<Session | undefined>;
  createSession(sessionData: InsertSession): Promise<Session>;
  getSessionsByEducator(educatorId: number): Promise<Session[]>;
  getSessionsByStudent(studentId: number): Promise<Session[]>;
  updateSessionStatus(id: number, status: string): Promise<Session>;
  updatePaymentStatus(id: number, status: string): Promise<Session>;

  // Review operations
  getReview(id: number): Promise<Review | undefined>;
  createReview(reviewData: InsertReview): Promise<Review>;
  getReviewsByEducator(educatorId: number): Promise<(Review & { student: User })[]>;

  // Testimonial operations
  getAllTestimonials(): Promise<(Testimonial & { user: User })[]>;
  createTestimonial(testimonialData: InsertTestimonial): Promise<Testimonial>;

  // Forum operations
  createForumPost(postData: InsertForumPost): Promise<ForumPost>;
  getForumPost(id: number): Promise<ForumPost | undefined>;
  searchForumPosts(query: string, level: string, tag: string): Promise<ForumPost[]>;
  incrementForumPostViews(id: number): Promise<void>;
  createForumReply(replyData: InsertForumReply): Promise<ForumReply>;
  getForumReplies(postId: number): Promise<ForumReply[]>;
  getNestedForumReplies(replyId: number): Promise<ForumReply[]>;
  likeForumReply(replyId: number, userId: number): Promise<ForumReply | undefined>;
  dislikeForumReply(replyId: number, userId: number): Promise<ForumReply | undefined>;
  removeForumReplyReaction(replyId: number, userId: number): Promise<ForumReply | undefined>;

  // Cleanup method for tests and development
  cleanup(): Promise<void>;
} 