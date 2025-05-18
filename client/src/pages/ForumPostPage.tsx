import { useParams } from 'wouter';
import { ForumPost } from '../components/ForumPost';
import { useAuth } from '../hooks/useAuth'; // You'll need to create this hook

export const ForumPostPage = () => {
  const params = useParams();
  const { user } = useAuth();
  const postId = params?.id;

  if (!user || !postId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ForumPost postId={parseInt(postId, 10)} currentUser={user} />
    </div>
  );
}; 