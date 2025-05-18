import { BlogPost, User, Comment } from './types';

// Local storage keys
const BLOG_POSTS_KEY = 'blog_posts';
const BLOG_LIKES_KEY = 'blog_likes';
const BLOG_COMMENTS_KEY = 'blog_comments';

// Get posts from local storage
export const getStoredPosts = (): BlogPost[] => {
  const stored = localStorage.getItem(BLOG_POSTS_KEY);
  if (!stored) {
    // Initialize with sample data
    const initialPosts: BlogPost[] = [
      {
        id: 1,
        title: "Getting Started with Machine Learning: A Beginner's Guide",
        content: "Machine learning is a fascinating field that's becoming increasingly accessible...",
        excerpt: "Learn the basics of machine learning and how to get started with your first project.",
        author: {
          id: 1,
          name: "Sarah Chen",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
        },
        coverImage: "https://images.unsplash.com/photo-1527474305487-b87b222841cc",
        tags: ["Machine Learning", "AI", "Programming"],
        category: "Technology",
        createdAt: "2024-03-20T10:00:00Z",
        readTime: 8,
        likes: 45,
        comments: 12,
        isLiked: false,
        commentList: []
      },
      // Add more sample posts here
    ];
    localStorage.setItem(BLOG_POSTS_KEY, JSON.stringify(initialPosts));
    return initialPosts;
  }
  return JSON.parse(stored);
};

// Get likes from local storage
const getStoredLikes = (): Record<string, boolean> => {
  const stored = localStorage.getItem(BLOG_LIKES_KEY);
  return stored ? JSON.parse(stored) : {};
};

// Get comments from local storage
const getStoredComments = (): Record<number, Comment[]> => {
  const stored = localStorage.getItem(BLOG_COMMENTS_KEY);
  return stored ? JSON.parse(stored) : {};
};

// Get a single post with user interaction data
export const getBlogPost = async (id: number): Promise<BlogPost | null> => {
  const posts = getStoredPosts();
  const post = posts.find(p => p.id === id);
  if (!post) return null;

  const comments = getStoredComments();
  return {
    ...post,
    commentList: comments[post.id] || []
  };
};

// Toggle like on a post
export const toggleBlogLike = async (postId: number, userId: number): Promise<BlogPost | null> => {
  const posts = getStoredPosts();
  const post = posts.find(p => p.id === postId);
  if (!post) return null;

  const likes = getStoredLikes();
  const likeKey = `${userId}-${postId}`;
  const isLiked = likes[likeKey];

  if (isLiked) {
    post.likes = Math.max(0, post.likes - 1);
    likes[likeKey] = false;
  } else {
    post.likes += 1;
    likes[likeKey] = true;
  }

  post.isLiked = !isLiked;
  localStorage.setItem(BLOG_POSTS_KEY, JSON.stringify(posts));
  localStorage.setItem(BLOG_LIKES_KEY, JSON.stringify(likes));

  return post;
};

// Add a comment to a post
export const addBlogComment = async (
  postId: number,
  userId: number,
  userName: string,
  userAvatar: string | undefined,
  content: string
): Promise<Comment> => {
  const posts = getStoredPosts();
  const post = posts.find(p => p.id === postId);
  if (!post) throw new Error("Post not found");

  const comments = getStoredComments();
  const postComments = comments[postId] || [];

  const newComment: Comment = {
    id: Math.max(0, ...postComments.map(c => c.id)) + 1,
    content,
    author: {
      id: userId,
      name: userName,
      avatar: userAvatar
    },
    createdAt: new Date().toISOString(),
    likes: 0,
    isLiked: false
  };

  post.comments += 1;
  postComments.push(newComment);
  comments[postId] = postComments;

  localStorage.setItem(BLOG_POSTS_KEY, JSON.stringify(posts));
  localStorage.setItem(BLOG_COMMENTS_KEY, JSON.stringify(comments));

  return newComment;
};

// Toggle like on a comment
export const toggleCommentLike = async (
  postId: number,
  commentId: number,
  userId: number
): Promise<Comment | null> => {
  const comments = getStoredComments();
  const postComments = comments[postId] || [];
  const comment = postComments.find(c => c.id === commentId);
  if (!comment) return null;

  const likes = getStoredLikes();
  const likeKey = `${userId}-${postId}-${commentId}`;
  const isLiked = likes[likeKey];

  if (isLiked) {
    comment.likes = Math.max(0, comment.likes - 1);
    likes[likeKey] = false;
  } else {
    comment.likes += 1;
    likes[likeKey] = true;
  }

  comment.isLiked = !isLiked;
  localStorage.setItem(BLOG_COMMENTS_KEY, JSON.stringify(comments));
  localStorage.setItem(BLOG_LIKES_KEY, JSON.stringify(likes));

  return comment;
};

// Create a new post
export const createBlogPost = async (
  post: Omit<BlogPost, "id" | "author" | "createdAt" | "likes" | "comments">,
  currentUser: User
): Promise<BlogPost> => {
  const posts = getStoredPosts();
  const newPost: BlogPost = {
    ...post,
    id: Math.max(0, ...posts.map(p => p.id)) + 1,
    author: {
      id: currentUser.id,
      name: `${currentUser.firstName} ${currentUser.lastName}`,
      avatar: currentUser.profileImage,
    },
    createdAt: new Date().toISOString(),
    likes: 0,
    comments: 0
  };
  
  posts.unshift(newPost);
  localStorage.setItem(BLOG_POSTS_KEY, JSON.stringify(posts));
  return newPost;
};

// Search and filter posts
export const searchBlogPosts = async (
  query: string,
  category?: string,
  tag?: string
): Promise<BlogPost[]> => {
  let posts = getStoredPosts();
  
  if (query) {
    const searchLower = query.toLowerCase();
    posts = posts.filter(post =>
      post.title.toLowerCase().includes(searchLower) ||
      post.content.toLowerCase().includes(searchLower) ||
      post.excerpt.toLowerCase().includes(searchLower)
    );
  }
  
  if (category && category !== "all") {
    posts = posts.filter(post => post.category === category);
  }
  
  if (tag && tag !== "all") {
    posts = posts.filter(post => post.tags.includes(tag));
  }
  
  return posts;
}; 