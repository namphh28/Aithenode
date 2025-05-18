import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq, and, ilike, desc, sql } from 'drizzle-orm';
import {
  users,
  educatorProfiles,
  categories,
  subjects,
  educatorSubjects,
  sessions,
  reviews,
  testimonials,
  forumPosts,
  forumReplies,
  type User,
  type InsertUser,
  type EducatorProfile,
  type InsertEducatorProfile,
  type Category,
  type InsertCategory,
  type Subject,
  type InsertSubject,
  type EducatorSubject,
  type InsertEducatorSubject,
  type Session,
  type InsertSession,
  type Review,
  type InsertReview,
  type Testimonial,
  type InsertTestimonial,
  type ForumPost,
  type InsertForumPost,
  type ForumReply,
  type InsertForumReply,
  IStorage
} from '@shared/schema';

export class DbStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;
  private pool: Pool;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is required');
    }

    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    this.db = drizzle(this.pool);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(userData: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(userData).returning();
    return result[0];
  }

  // Educator profile operations
  async getEducatorProfile(id: number): Promise<EducatorProfile | undefined> {
    const result = await this.db.select().from(educatorProfiles).where(eq(educatorProfiles.id, id));
    return result[0];
  }

  async getEducatorProfileByUserId(userId: number): Promise<EducatorProfile | undefined> {
    const result = await this.db.select().from(educatorProfiles).where(eq(educatorProfiles.userId, userId));
    return result[0];
  }

  async createEducatorProfile(profileData: InsertEducatorProfile): Promise<EducatorProfile> {
    const result = await this.db.insert(educatorProfiles).values(profileData).returning();
    return result[0];
  }

  async getAllEducators(limit?: number): Promise<(EducatorProfile & { user: User })[]> {
    const query = this.db
      .select({
        ...educatorProfiles,
        user: users
      })
      .from(educatorProfiles)
      .innerJoin(users, eq(users.id, educatorProfiles.userId));

    if (limit) {
      query.limit(limit);
    }

    return await query;
  }

  async getEducatorsBySubject(subjectId: number): Promise<(EducatorProfile & { user: User })[]> {
    return await this.db
      .select({
        ...educatorProfiles,
        user: users
      })
      .from(educatorProfiles)
      .innerJoin(users, eq(users.id, educatorProfiles.userId))
      .innerJoin(educatorSubjects, eq(educatorSubjects.educatorId, educatorProfiles.id))
      .where(eq(educatorSubjects.subjectId, subjectId));
  }

  async getEducatorsByCategory(categoryId: number): Promise<(EducatorProfile & { user: User })[]> {
    return await this.db
      .select({
        ...educatorProfiles,
        user: users
      })
      .from(educatorProfiles)
      .innerJoin(users, eq(users.id, educatorProfiles.userId))
      .innerJoin(educatorSubjects, eq(educatorSubjects.educatorId, educatorProfiles.id))
      .innerJoin(subjects, eq(subjects.id, educatorSubjects.subjectId))
      .where(eq(subjects.categoryId, categoryId));
  }

  // Category operations
  async getAllCategories(): Promise<Category[]> {
    return await this.db.select().from(categories);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const result = await this.db.select().from(categories).where(eq(categories.id, id));
    return result[0];
  }

  async createCategory(categoryData: InsertCategory): Promise<Category> {
    const result = await this.db.insert(categories).values(categoryData).returning();
    return result[0];
  }

  // Subject operations
  async getAllSubjects(): Promise<Subject[]> {
    return await this.db.select().from(subjects);
  }

  async getSubject(id: number): Promise<Subject | undefined> {
    const result = await this.db.select().from(subjects).where(eq(subjects.id, id));
    return result[0];
  }

  async getSubjectsByCategory(categoryId: number): Promise<Subject[]> {
    return await this.db.select().from(subjects).where(eq(subjects.categoryId, categoryId));
  }

  async createSubject(subjectData: InsertSubject): Promise<Subject> {
    const result = await this.db.insert(subjects).values(subjectData).returning();
    return result[0];
  }

  // EducatorSubject operations
  async assignSubjectToEducator(data: InsertEducatorSubject): Promise<EducatorSubject> {
    const result = await this.db.insert(educatorSubjects).values(data).returning();
    return result[0];
  }

  async getEducatorSubjects(educatorId: number): Promise<(Subject & { category: Category })[]> {
    return await this.db
      .select({
        ...subjects,
        category: categories
      })
      .from(subjects)
      .innerJoin(categories, eq(categories.id, subjects.categoryId))
      .innerJoin(educatorSubjects, eq(educatorSubjects.subjectId, subjects.id))
      .where(eq(educatorSubjects.educatorId, educatorId));
  }

  // Session operations
  async getSession(id: number): Promise<Session | undefined> {
    const result = await this.db.select().from(sessions).where(eq(sessions.id, id));
    return result[0];
  }

  async createSession(sessionData: InsertSession): Promise<Session> {
    const result = await this.db.insert(sessions).values(sessionData).returning();
    return result[0];
  }

  async getSessionsByEducator(educatorId: number): Promise<Session[]> {
    return await this.db.select().from(sessions).where(eq(sessions.educatorId, educatorId));
  }

  async getSessionsByStudent(studentId: number): Promise<Session[]> {
    return await this.db.select().from(sessions).where(eq(sessions.studentId, studentId));
  }

  async updateSessionStatus(id: number, status: string): Promise<Session> {
    const result = await this.db
      .update(sessions)
      .set({ status })
      .where(eq(sessions.id, id))
      .returning();
    return result[0];
  }

  async updatePaymentStatus(id: number, status: string): Promise<Session> {
    const result = await this.db
      .update(sessions)
      .set({ paymentStatus: status })
      .where(eq(sessions.id, id))
      .returning();
    return result[0];
  }

  // Review operations
  async getReview(id: number): Promise<Review | undefined> {
    const result = await this.db.select().from(reviews).where(eq(reviews.id, id));
    return result[0];
  }

  async createReview(reviewData: InsertReview): Promise<Review> {
    const result = await this.db.insert(reviews).values(reviewData).returning();
    return result[0];
  }

  async getReviewsByEducator(educatorId: number): Promise<(Review & { student: User })[]> {
    return await this.db
      .select({
        ...reviews,
        student: users
      })
      .from(reviews)
      .innerJoin(users, eq(users.id, reviews.studentId))
      .where(eq(reviews.educatorId, educatorId));
  }

  // Testimonial operations
  async getAllTestimonials(): Promise<(Testimonial & { user: User })[]> {
    return await this.db
      .select({
        ...testimonials,
        user: users
      })
      .from(testimonials)
      .innerJoin(users, eq(users.id, testimonials.userId))
      .where(eq(testimonials.isVisible, true));
  }

  async createTestimonial(testimonialData: InsertTestimonial): Promise<Testimonial> {
    const result = await this.db.insert(testimonials).values(testimonialData).returning();
    return result[0];
  }

  // Forum operations
  async createForumPost(postData: InsertForumPost): Promise<ForumPost> {
    const result = await this.db.insert(forumPosts).values(postData).returning();
    return result[0];
  }

  async getForumPost(id: number): Promise<ForumPost | undefined> {
    const result = await this.db.select().from(forumPosts).where(eq(forumPosts.id, id));
    return result[0];
  }

  async searchForumPosts(query: string, level: string, tag: string): Promise<ForumPost[]> {
    let baseQuery = this.db.select().from(forumPosts);

    if (query) {
      baseQuery = baseQuery.where(
        sql`to_tsvector('english', ${forumPosts.title} || ' ' || ${forumPosts.content}) @@ to_tsquery('english', ${query})`
      );
    }

    if (level) {
      baseQuery = baseQuery.where(eq(forumPosts.level, level));
    }

    if (tag) {
      baseQuery = baseQuery.where(sql`${tag} = ANY(${forumPosts.tags})`);
    }

    return await baseQuery.orderBy(desc(forumPosts.createdAt));
  }

  async incrementForumPostViews(id: number): Promise<void> {
    await this.db
      .update(forumPosts)
      .set({ views: sql`${forumPosts.views} + 1` })
      .where(eq(forumPosts.id, id));
  }

  async createForumReply(replyData: InsertForumReply): Promise<ForumReply> {
    const result = await this.db.insert(forumReplies).values(replyData).returning();

    // Increment replies count
    if (replyData.parentReplyId) {
      await this.db
        .update(forumReplies)
        .set({ nestedReplies: sql`${forumReplies.nestedReplies} + 1` })
        .where(eq(forumReplies.id, replyData.parentReplyId));
    } else {
      await this.db
        .update(forumPosts)
        .set({ replies: sql`${forumPosts.replies} + 1` })
        .where(eq(forumPosts.id, replyData.postId));
    }

    return result[0];
  }

  async getForumReplies(postId: number): Promise<ForumReply[]> {
    return await this.db
      .select()
      .from(forumReplies)
      .where(and(eq(forumReplies.postId, postId), sql`${forumReplies.parentReplyId} IS NULL`))
      .orderBy(desc(forumReplies.createdAt));
  }

  async getNestedForumReplies(replyId: number): Promise<ForumReply[]> {
    return await this.db
      .select()
      .from(forumReplies)
      .where(eq(forumReplies.parentReplyId, replyId))
      .orderBy(desc(forumReplies.createdAt));
  }

  private async getForumReply(id: number): Promise<ForumReply | undefined> {
    const result = await this.db.select().from(forumReplies).where(eq(forumReplies.id, id));
    return result[0];
  }

  async likeForumReply(replyId: number, userId: number): Promise<ForumReply | undefined> {
    const reply = await this.getForumReply(replyId);
    if (!reply) return undefined;

    const likedBy = reply.likedBy || [];
    const dislikedBy = reply.dislikedBy || [];

    if (likedBy.includes(userId)) return reply;

    const newLikedBy = [...likedBy, userId];
    const newDislikedBy = dislikedBy.filter(id => id !== userId);

    const result = await this.db
      .update(forumReplies)
      .set({
        likes: sql`${forumReplies.likes} + 1`,
        dislikes: dislikedBy.includes(userId) ? sql`${forumReplies.dislikes} - 1` : forumReplies.dislikes,
        likedBy: newLikedBy,
        dislikedBy: newDislikedBy
      })
      .where(eq(forumReplies.id, replyId))
      .returning();

    return result[0];
  }

  async dislikeForumReply(replyId: number, userId: number): Promise<ForumReply | undefined> {
    const reply = await this.getForumReply(replyId);
    if (!reply) return undefined;

    const likedBy = reply.likedBy || [];
    const dislikedBy = reply.dislikedBy || [];

    if (dislikedBy.includes(userId)) return reply;

    const newDislikedBy = [...dislikedBy, userId];
    const newLikedBy = likedBy.filter(id => id !== userId);

    const result = await this.db
      .update(forumReplies)
      .set({
        dislikes: sql`${forumReplies.dislikes} + 1`,
        likes: likedBy.includes(userId) ? sql`${forumReplies.likes} - 1` : forumReplies.likes,
        dislikedBy: newDislikedBy,
        likedBy: newLikedBy
      })
      .where(eq(forumReplies.id, replyId))
      .returning();

    return result[0];
  }

  async removeForumReplyReaction(replyId: number, userId: number): Promise<ForumReply | undefined> {
    const reply = await this.getForumReply(replyId);
    if (!reply) return undefined;

    const likedBy = reply.likedBy || [];
    const dislikedBy = reply.dislikedBy || [];

    const result = await this.db
      .update(forumReplies)
      .set({
        likes: likedBy.includes(userId) ? sql`${forumReplies.likes} - 1` : forumReplies.likes,
        dislikes: dislikedBy.includes(userId) ? sql`${forumReplies.dislikes} - 1` : forumReplies.dislikes,
        likedBy: likedBy.filter(id => id !== userId),
        dislikedBy: dislikedBy.filter(id => id !== userId)
      })
      .where(eq(forumReplies.id, replyId))
      .returning();

    return result[0];
  }

  // Cleanup method for tests and development
  async cleanup(): Promise<void> {
    await this.pool.end();
  }
} 