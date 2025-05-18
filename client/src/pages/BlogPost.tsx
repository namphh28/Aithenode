import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BlogEventNav } from "@/components/BlogEventNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageSquare, Share2, Calendar } from "lucide-react";
import { BlogPost as BlogPostType, User, Comment } from "@/lib/types";
import { getBlogPost, toggleBlogLike, addBlogComment, toggleCommentLike } from "@/lib/blog";
import { formatDistanceToNow } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const BlogPost = () => {
  const [match, params] = useRoute("/blog/:id");
  const postId = match ? parseInt(params.id) : null;
  const [commentContent, setCommentContent] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current user
  const { data: currentUser } = useQuery<User | null>({
    queryKey: ["/api/auth/current-user"],
  });

  // Fetch blog post
  const { data: post, isLoading } = useQuery<BlogPostType | null>({
    queryKey: [`/blog/${postId}`],
    queryFn: () => getBlogPost(postId!),
    enabled: !!postId,
  });

  // Like mutation with optimistic update
  const likeMutation = useMutation({
    mutationFn: async () => {
      if (!currentUser || !post) return null;
      return toggleBlogLike(post.id, currentUser.id);
    },
    onMutate: async () => {
      if (!post) return;
      
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [`/blog/${postId}`] });
      
      // Snapshot the previous value
      const previousPost = queryClient.getQueryData<BlogPostType>([`/blog/${postId}`]);
      
      // Optimistically update to the new value
      queryClient.setQueryData<BlogPostType>([`/blog/${postId}`], old => {
        if (!old) return old;
        return {
          ...old,
          likes: old.isLiked ? old.likes - 1 : old.likes + 1,
          isLiked: !old.isLiked
        };
      });
      
      // Return a context object with the snapshotted value
      return { previousPost };
    },
    onError: (err, newPost, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousPost) {
        queryClient.setQueryData([`/blog/${postId}`], context.previousPost);
      }
      toast({
        title: "Error",
        description: "Failed to update like status. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we're up to date
      queryClient.invalidateQueries({ queryKey: [`/blog/${postId}`] });
    },
  });

  // Comment mutation with optimistic update
  const commentMutation = useMutation({
    mutationFn: async () => {
      if (!currentUser || !commentContent.trim() || !post) return null;
      return addBlogComment(
        post.id,
        currentUser.id,
        `${currentUser.firstName} ${currentUser.lastName}`,
        currentUser.profileImage,
        commentContent
      );
    },
    onSuccess: (newComment) => {
      if (!newComment) return;
      
      // Update the post data with the new comment
      queryClient.setQueryData<BlogPostType>([`/blog/${postId}`], old => {
        if (!old) return old;
        return {
          ...old,
          comments: old.comments + 1,
          commentList: [...(old.commentList || []), newComment]
        };
      });
      
      setCommentContent("");
      toast({
        title: "Success",
        description: "Comment added successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Comment like mutation with optimistic update
  const commentLikeMutation = useMutation({
    mutationFn: async (commentId: number) => {
      if (!currentUser || !post) return null;
      return toggleCommentLike(post.id, commentId, currentUser.id);
    },
    onMutate: async (commentId: number) => {
      if (!post) return;
      
      await queryClient.cancelQueries({ queryKey: [`/blog/${postId}`] });
      
      const previousPost = queryClient.getQueryData<BlogPostType>([`/blog/${postId}`]);
      
      queryClient.setQueryData<BlogPostType>([`/blog/${postId}`], old => {
        if (!old || !old.commentList) return old;
        return {
          ...old,
          commentList: old.commentList.map(comment => 
            comment.id === commentId
              ? {
                  ...comment,
                  likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
                  isLiked: !comment.isLiked
                }
              : comment
          )
        };
      });
      
      return { previousPost };
    },
    onError: (err, commentId, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData([`/blog/${postId}`], context.previousPost);
      }
      toast({
        title: "Error",
        description: "Failed to update comment like status. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [`/blog/${postId}`] });
    },
  });

  // Set page title
  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Aithenode Blog`;
    } else {
      document.title = "Blog Post | Aithenode";
    }
  }, [post]);

  if (isLoading || !post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <BlogEventNav />
        <main className="flex-1 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <BlogEventNav />
      
      <main className="flex-1 py-8">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="space-y-4 mb-8">
            {post.coverImage && (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-[400px] object-cover rounded-lg"
              />
            )}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h1 className="text-4xl font-bold">{post.title}</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Avatar>
                    {post.author.avatar ? (
                      <AvatarImage src={post.author.avatar} alt={post.author.name} />
                    ) : (
                      <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <div className="font-medium">{post.author.name}</div>
                    <div className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>{post.readTime} min read</span>
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-8 flex items-center justify-between border-t pt-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2"
                onClick={() => currentUser && likeMutation.mutate()}
                disabled={likeMutation.isPending}
              >
                <Heart className={`h-5 w-5 ${post?.isLiked ? "fill-current text-red-500" : ""}`} />
                <span>{post?.likes}</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>{post?.comments}</span>
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="flex items-center space-x-2">
              <Share2 className="h-5 w-5" />
              <span>Share</span>
            </Button>
          </div>

          {/* Comments Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Comments ({post?.comments})</h2>
            
            {/* Comment Form */}
            {currentUser ? (
              <div className="mb-8">
                <div className="flex items-start space-x-4">
                  <Avatar>
                    {currentUser.profileImage ? (
                      <AvatarImage src={currentUser.profileImage} alt={`${currentUser.firstName} ${currentUser.lastName}`} />
                    ) : (
                      <AvatarFallback>{currentUser.firstName[0]}</AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Write a comment..."
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      className="mb-2"
                    />
                    <Button 
                      onClick={() => commentMutation.mutate()}
                      disabled={commentMutation.isPending || !commentContent.trim()}
                    >
                      Post Comment
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 mb-8">Please sign in to leave a comment.</p>
            )}

            {/* Comments List */}
            <div className="space-y-6">
              {post?.commentList?.map((comment) => (
                <div key={comment.id} className="flex space-x-4">
                  <Avatar>
                    {comment.author.avatar ? (
                      <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                    ) : (
                      <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-medium">{comment.author.name}</span>
                          <span className="text-gray-500 text-sm ml-2">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => commentLikeMutation.mutate(comment.id)}
                          disabled={commentLikeMutation.isPending}
                        >
                          <Heart className={`h-4 w-4 mr-1 ${comment.isLiked ? "fill-current text-red-500" : ""}`} />
                          <span>{comment.likes}</span>
                        </Button>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost; 