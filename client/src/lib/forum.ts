import { User } from "./types";

export interface ForumPost {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    name: string;
    avatar?: string;
  };
  tags: string[];
  level: "Beginner" | "Intermediate" | "Advanced";
  createdAt: string;
  replies: number;
  views: number;
}

export interface ForumReply {
  id: number;
  postId: number;
  parentId?: number; // ID of the parent reply (if this is a nested reply)
  content: string;
  author: {
    id: number;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  likes: number;
  dislikes: number;
  likedBy: number[]; // Array of user IDs who liked
  dislikedBy: number[]; // Array of user IDs who disliked
}

// Local storage keys
const FORUM_POSTS_KEY = "forum_posts";
const FORUM_REPLIES_KEY = "forum_replies";

// Get posts from local storage
export const getStoredPosts = (): ForumPost[] => {
  const stored = localStorage.getItem(FORUM_POSTS_KEY);
  if (!stored) {
    // Initialize with sample data
    const initialPosts: ForumPost[] = [
      {
        id: 1,
        title: "Getting started with React Hooks",
        content: "I'm new to React and trying to understand hooks. Can someone explain useState and useEffect in simple terms? I've been following the documentation but still finding it a bit confusing, especially with dependency arrays in useEffect.\n\nSpecifically, I'm trying to understand:\n1. When to use useState vs useRef\n2. How to properly handle side effects with useEffect\n3. Best practices for custom hooks\n\nAny help or resources would be greatly appreciated!",
        author: {
          id: 1,
          name: "John Doe",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
        },
        tags: ["React", "JavaScript", "Web Development"],
        level: "Beginner",
        createdAt: "2024-03-20T10:00:00Z",
        replies: 2,
        views: 120,
      },
      {
        id: 2,
        title: "Machine Learning Project Ideas for Beginners",
        content: "I'm looking to start my first machine learning project but not sure where to begin. What are some good beginner-friendly project ideas that would help me learn the fundamentals? I have basic Python knowledge and have completed some online ML courses.",
        author: {
          id: 2,
          name: "Emily Chen",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily"
        },
        tags: ["Python", "Machine Learning", "Data Science"],
        level: "Beginner",
        createdAt: "2024-03-21T09:15:00Z",
        replies: 0,
        views: 85,
      },
      {
        id: 3,
        title: "Advanced TypeScript Type Manipulation",
        content: "Looking to discuss advanced TypeScript type manipulation techniques. Specifically interested in:\n\n1. Conditional types with infer\n2. Mapped types with template literals\n3. Recursive type definitions\n\nShare your experiences and best practices!",
        author: {
          id: 3,
          name: "Alex Thompson",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
        },
        tags: ["TypeScript", "JavaScript", "Web Development"],
        level: "Advanced",
        createdAt: "2024-03-21T14:30:00Z",
        replies: 0,
        views: 45,
      },
      {
        id: 4,
        title: "Building Scalable Web Applications",
        content: "What are the key considerations when building a web application that needs to scale? Looking for insights on:\n\n- Architecture patterns\n- Database optimization\n- Caching strategies\n- Load balancing\n\nCurrently working on a project that's growing rapidly and want to ensure we're following best practices.",
        author: {
          id: 4,
          name: "Sarah Wilson",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
        },
        tags: ["Web Development", "Architecture", "DevOps"],
        level: "Intermediate",
        createdAt: "2024-03-22T11:20:00Z",
        replies: 0,
        views: 98,
      },
      {
        id: 5,
        title: "Python Data Analysis Workflow",
        content: "I'd love to hear about your Python data analysis workflow. What libraries and tools do you use? How do you structure your projects? Looking to improve my current process which involves Jupyter notebooks and pandas.",
        author: {
          id: 5,
          name: "Michael Brown",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael"
        },
        tags: ["Python", "Data Science", "Data Analysis"],
        level: "Intermediate",
        createdAt: "2024-03-22T16:45:00Z",
        replies: 0,
        views: 62,
      }
    ];
    localStorage.setItem(FORUM_POSTS_KEY, JSON.stringify(initialPosts));
    return initialPosts;
  }
  return JSON.parse(stored);
};

// Get stored replies
export const getStoredReplies = (): ForumReply[] => {
  const stored = localStorage.getItem(FORUM_REPLIES_KEY);
  if (!stored) {
    // Initialize with sample replies
    const initialReplies: ForumReply[] = [
      // React Hooks post replies
      {
        id: 1,
        postId: 1,
        content: "useState is for managing state that triggers re-renders when changed, while useRef is for values that persist between renders but don't trigger re-renders. As for useEffect, think of it as a way to synchronize your component with external systems or side effects.",
        author: {
          id: 6,
          name: "Sarah Chen",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
        },
        createdAt: "2024-03-20T11:30:00Z",
        likes: 5,
        dislikes: 0,
        likedBy: [],
        dislikedBy: []
      },
      {
        id: 2,
        postId: 1,
        content: "Here's a simple example of useState and useEffect:\n\n```jsx\nconst [count, setCount] = useState(0);\n\nuseEffect(() => {\n  document.title = `Count: ${count}`;\n}, [count]);\n```\n\nThe dependency array [count] means the effect runs whenever count changes.",
        author: {
          id: 7,
          name: "Mike Johnson",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike"
        },
        createdAt: "2024-03-20T12:15:00Z",
        likes: 3,
        dislikes: 1,
        likedBy: [],
        dislikedBy: []
      }
    ];
    localStorage.setItem(FORUM_REPLIES_KEY, JSON.stringify(initialReplies));
    return initialReplies;
  }
  return JSON.parse(stored);
};

// Get replies for a specific post
export const getReplies = async (postId: number): Promise<ForumReply[]> => {
  const replies = getStoredReplies();
  const posts = getStoredPosts();
  
  // Find the post
  const post = posts.find(p => p.id === postId);
  if (!post) return [];
  
  // Only return replies for original example posts (created before March 23, 2024)
  const isExamplePost = new Date(post.createdAt) < new Date('2024-03-23');
  if (!isExamplePost) return [];
  
  return replies.filter(reply => reply.postId === postId);
};

// Add a new reply
export const createReply = async (
  postId: number,
  content: string,
  currentUser: User,
  parentId?: number // Optional parent reply ID
): Promise<ForumReply> => {
  const replies = getStoredReplies();
  const posts = getStoredPosts();
  
  // Create new reply
  const newReply: ForumReply = {
    id: Math.max(0, ...replies.map(r => r.id)) + 1,
    postId,
    parentId,
    content,
    author: {
      id: currentUser.id,
      name: `${currentUser.firstName} ${currentUser.lastName}`,
      avatar: currentUser.profileImage,
    },
    createdAt: new Date().toISOString(),
    likes: 0,
    dislikes: 0,
    likedBy: [],
    dislikedBy: []
  };
  
  // Add reply to storage
  replies.push(newReply);
  localStorage.setItem(FORUM_REPLIES_KEY, JSON.stringify(replies));
  
  // Update post reply count
  const post = posts.find(p => p.id === postId);
  if (post) {
    post.replies += 1;
    localStorage.setItem(FORUM_POSTS_KEY, JSON.stringify(posts));
  }
  
  return newReply;
};

// Add a new post
export const createPost = async (
  post: Omit<ForumPost, "id" | "author" | "createdAt" | "replies" | "views">,
  currentUser: User
): Promise<ForumPost> => {
  const posts = getStoredPosts();
  const newPost: ForumPost = {
    ...post,
    id: Math.max(0, ...posts.map(p => p.id)) + 1,
    author: {
      id: currentUser.id,
      name: `${currentUser.firstName} ${currentUser.lastName}`,
      avatar: currentUser.profileImage,
    },
    createdAt: new Date().toISOString(),
    replies: 0,
    views: 0,
  };
  
  posts.unshift(newPost);
  localStorage.setItem(FORUM_POSTS_KEY, JSON.stringify(posts));
  return newPost;
};

// Get a single post by ID
export const getPost = async (id: number): Promise<ForumPost | null> => {
  const posts = getStoredPosts();
  const post = posts.find(p => p.id === id);
  if (post) {
    // Increment views
    post.views += 1;
    localStorage.setItem(FORUM_POSTS_KEY, JSON.stringify(posts));
  }
  return post || null;
};

// Search and filter posts
export const searchPosts = async (
  query: string,
  level: string,
  tag: string
): Promise<ForumPost[]> => {
  let posts = getStoredPosts();
  
  // Apply filters
  if (query) {
    const searchLower = query.toLowerCase();
    posts = posts.filter(post =>
      post.title.toLowerCase().includes(searchLower) ||
      post.content.toLowerCase().includes(searchLower)
    );
  }
  
  if (level && level !== "all") {
    posts = posts.filter(post => post.level === level);
  }
  
  if (tag && tag !== "all") {
    posts = posts.filter(post => post.tags.includes(tag));
  }
  
  return posts;
};

// Add functions to handle likes and dislikes
export const likeReply = async (replyId: number, userId: number): Promise<ForumReply | null> => {
  const replies = getStoredReplies();
  const reply = replies.find(r => r.id === replyId);
  
  if (!reply) return null;
  
  // Remove from dislikedBy if present
  if (reply.dislikedBy.includes(userId)) {
    reply.dislikedBy = reply.dislikedBy.filter(id => id !== userId);
    reply.dislikes = Math.max(0, reply.dislikes - 1);
  }
  
  // Toggle like
  if (reply.likedBy.includes(userId)) {
    reply.likedBy = reply.likedBy.filter(id => id !== userId);
    reply.likes = Math.max(0, reply.likes - 1);
  } else {
    reply.likedBy.push(userId);
    reply.likes += 1;
  }
  
  localStorage.setItem(FORUM_REPLIES_KEY, JSON.stringify(replies));
  return reply;
};

export const dislikeReply = async (replyId: number, userId: number): Promise<ForumReply | null> => {
  const replies = getStoredReplies();
  const reply = replies.find(r => r.id === replyId);
  
  if (!reply) return null;
  
  // Remove from likedBy if present
  if (reply.likedBy.includes(userId)) {
    reply.likedBy = reply.likedBy.filter(id => id !== userId);
    reply.likes = Math.max(0, reply.likes - 1);
  }
  
  // Toggle dislike
  if (reply.dislikedBy.includes(userId)) {
    reply.dislikedBy = reply.dislikedBy.filter(id => id !== userId);
    reply.dislikes = Math.max(0, reply.dislikes - 1);
  } else {
    reply.dislikedBy.push(userId);
    reply.dislikes += 1;
  }
  
  localStorage.setItem(FORUM_REPLIES_KEY, JSON.stringify(replies));
  return reply;
}; 