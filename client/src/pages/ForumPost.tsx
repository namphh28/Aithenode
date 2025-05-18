import { useParams } from 'wouter';
import { ForumPost as ForumPostComponent } from '../components/ForumPost';
import { useAuth } from '../hooks/useAuth';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ForumPost = () => {
  const params = useParams();
  const { user } = useAuth();
  const postId = params?.id;

  if (!user || !postId) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div>Loading...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ForumPostComponent postId={parseInt(postId, 10)} currentUser={user} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForumPost; 