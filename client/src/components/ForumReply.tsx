import { useState, useEffect } from 'react';
import { ForumReply as ForumReplyType } from '../lib/forum';
import { User } from '../lib/types';
import { likeReply, dislikeReply, createReply, getReplies } from '../lib/forum';
import { 
  HandThumbUpIcon, 
  HandThumbDownIcon,
  ArrowUturnLeftIcon as ReplyIcon 
} from '@heroicons/react/24/solid';
import { format } from 'date-fns';

interface ForumReplyProps {
  reply: ForumReplyType;
  currentUser: User;
  postId: number;
  onReplyAdded: () => void;
  level?: number;
}

export const ForumReply = ({ reply, currentUser, postId, onReplyAdded, level = 0 }: ForumReplyProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [localLikes, setLocalLikes] = useState(reply.likes);
  const [localDislikes, setLocalDislikes] = useState(reply.dislikes);
  const [hasLiked, setHasLiked] = useState(reply.likedBy.includes(currentUser.id));
  const [hasDisliked, setHasDisliked] = useState(reply.dislikedBy.includes(currentUser.id));
  const [nestedReplies, setNestedReplies] = useState<ForumReplyType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchNestedReplies = async () => {
    const allReplies = await getReplies(postId);
    const nested = allReplies.filter(r => r.parentId === reply.id);
    setNestedReplies(nested);
  };

  useEffect(() => {
    fetchNestedReplies();
  }, [reply.id]);

  const handleLike = async () => {
    const updatedReply = await likeReply(reply.id, currentUser.id);
    if (updatedReply) {
      setLocalLikes(updatedReply.likes);
      setLocalDislikes(updatedReply.dislikes);
      setHasLiked(updatedReply.likedBy.includes(currentUser.id));
      setHasDisliked(updatedReply.dislikedBy.includes(currentUser.id));
    }
  };

  const handleDislike = async () => {
    const updatedReply = await dislikeReply(reply.id, currentUser.id);
    if (updatedReply) {
      setLocalLikes(updatedReply.likes);
      setLocalDislikes(updatedReply.dislikes);
      setHasLiked(updatedReply.likedBy.includes(currentUser.id));
      setHasDisliked(updatedReply.dislikedBy.includes(currentUser.id));
    }
  };

  const handleSubmitReply = async () => {
    if (!replyContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createReply(postId, replyContent, currentUser, reply.id);
      setReplyContent('');
      setIsReplying(false);
      fetchNestedReplies();
      onReplyAdded();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Limit nesting level to prevent deep threads
  const canReply = level < 3;

  return (
    <div className={`${level > 0 ? 'ml-8 border-l-2 border-gray-100 pl-6' : ''}`}>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <img
              src={reply.author.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
              alt={reply.author.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-medium text-gray-900">{reply.author.name}</h3>
              <p className="text-sm text-gray-500">{format(new Date(reply.createdAt), 'MMM d, yyyy')}</p>
            </div>
          </div>

          <div className="prose max-w-none mb-4">
            <p className="text-gray-700">{reply.content}</p>
          </div>
          
          <div className="flex items-center space-x-6">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 ${
                hasLiked ? 'text-blue-600' : 'text-gray-500'
              } hover:text-blue-600 transition-colors`}
            >
              <HandThumbUpIcon className="w-5 h-5" />
              <span className="text-sm font-medium">{localLikes}</span>
            </button>
            
            <button
              onClick={handleDislike}
              className={`flex items-center space-x-2 ${
                hasDisliked ? 'text-red-600' : 'text-gray-500'
              } hover:text-red-600 transition-colors`}
            >
              <HandThumbDownIcon className="w-5 h-5" />
              <span className="text-sm font-medium">{localDislikes}</span>
            </button>
            
            {canReply && (
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors"
              >
                <ReplyIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Reply</span>
              </button>
            )}
          </div>

          {isReplying && (
            <div className="mt-6 space-y-4">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write your reply..."
                className="w-full min-h-[100px] p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                rows={3}
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsReplying(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReply}
                  disabled={isSubmitting || !replyContent.trim()}
                  className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    (isSubmitting || !replyContent.trim()) && 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? 'Posting...' : 'Submit'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {nestedReplies.length > 0 && (
        <div className="mt-4 space-y-4">
          {nestedReplies.map((nestedReply) => (
            <ForumReply
              key={nestedReply.id}
              reply={nestedReply}
              currentUser={currentUser}
              postId={postId}
              onReplyAdded={onReplyAdded}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}; 