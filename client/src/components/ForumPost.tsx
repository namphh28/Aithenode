import { useState, useEffect } from 'react';
import { ForumPost as ForumPostType, ForumReply as ForumReplyType, getPost, getReplies, createReply } from '../lib/forum';
import { User } from '../lib/types';
import { ForumReply } from './ForumReply';
import { format } from 'date-fns';
import { Link } from 'wouter';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { ChatBubbleLeftIcon as MessageSquareIcon, EyeIcon } from '@heroicons/react/24/outline';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

interface ForumPostProps {
  postId: number;
  currentUser: User;
}

export const ForumPost = ({ postId, currentUser }: ForumPostProps) => {
  const [post, setPost] = useState<ForumPostType | null>(null);
  const [replies, setReplies] = useState<ForumReplyType[]>([]);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPost = async () => {
    const postData = await getPost(postId);
    setPost(postData);
  };

  const fetchReplies = async () => {
    const repliesData = await getReplies(postId);
    // Only get top-level replies (no parentId)
    const topLevelReplies = repliesData.filter(reply => !reply.parentId);
    setReplies(topLevelReplies);
  };

  useEffect(() => {
    fetchPost();
    fetchReplies();
  }, [postId]);

  const handleSubmitReply = async () => {
    if (!replyContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createReply(postId, replyContent, currentUser);
      setReplyContent('');
      fetchReplies();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!post) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <div>
        <Link href="/forum">
          <Button variant="ghost" className="pl-0">
            <ChevronLeftIcon className="mr-2 h-4 w-4" />
            Back to Forum
          </Button>
        </Link>
      </div>

      {/* Post Header */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <img
              src={post.author.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
              alt={post.author.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-medium text-gray-900">{post.author.name}</h3>
              <p className="text-sm text-gray-500">{format(new Date(post.createdAt), 'MMM d, yyyy')}</p>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
          
          <div className="prose max-w-none mb-6">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index} className="text-gray-600 mb-4">{paragraph}</p>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <MessageSquareIcon className="w-5 h-5 mr-1.5" />
                <span>{post.replies} replies</span>
              </div>
              <div className="flex items-center">
                <EyeIcon className="w-5 h-5 mr-1.5" />
                <span>{post.views} views</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 ml-auto">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
              <Badge variant="outline">{post.level}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Reply Input */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Leave a Reply</h2>
        <div className="space-y-4">
          <Textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Share your thoughts..."
            className="min-h-[120px] resize-y"
          />
          <div className="flex justify-end">
            <Button
              onClick={handleSubmitReply}
              disabled={isSubmitting || !replyContent.trim()}
            >
              {isSubmitting ? 'Posting...' : 'Post Reply'}
            </Button>
          </div>
        </div>
      </div>

      {/* Replies Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Replies <span className="text-gray-500">({replies.length})</span>
        </h2>
        <div className="space-y-6">
          {replies.map((reply) => (
            <ForumReply
              key={reply.id}
              reply={reply}
              currentUser={currentUser}
              postId={postId}
              onReplyAdded={fetchReplies}
            />
          ))}
        </div>
      </div>
    </div>
  );
}; 