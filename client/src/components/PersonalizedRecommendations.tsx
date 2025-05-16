import React, { useState, useEffect } from 'react';

// Define the structure for a recommended item (course or teacher)
interface RecommendedItem {
  id: string;
  type: 'course' | 'teacher';
  name: string;
  reason: string; // e.g., "Because you completed 'Beginner English'"
  // Add other relevant properties like image, rating, link, etc.
}

// Mock API function to simulate fetching personalized recommendations
// In a real application, this would be an actual API call to your backend
const fetchPersonalizedRecommendations = async (userId: string): Promise<RecommendedItem[]> => {
  console.log(`Fetching recommendations for user ${userId}...`);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock data - replace with actual API call
  // The backend would generate these based on the user's learning history
  const mockRecommendations: RecommendedItem[] = [
    {
      id: 'course1',
      type: 'course',
      name: 'Advanced English Speaking',
      reason: 'Based on your completion of "Intermediate English"',
    },
    {
      id: 'teacher1',
      type: 'teacher',
      name: 'Ms. Lan (IELTS Specialist)',
      reason: 'Matching your interest in IELTS preparation and high ratings for similar teachers.',
    },
    {
      id: 'course2',
      type: 'course',
      name: 'Introduction to Python',
      reason: 'Based on your previous searches for "programming courses"',
    },
    {
      id: 'course3',
      type: 'course',
      name: 'Data Structures in Java',
      reason: 'Students who took "Introduction to Java" also liked this.',
    },
  ];
  return mockRecommendations;
};

interface PersonalizedRecommendationsProps {
  userId: string; // Assuming we have the current user's ID
}

const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({ userId }) => {
  const [recommendations, setRecommendations] = useState<RecommendedItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPersonalizedRecommendations(userId);
        setRecommendations(data);
      } catch (err) {
        setError('Failed to load recommendations.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      getRecommendations();
    }
  }, [userId]);

  if (loading) {
    return <div>Loading recommendations...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (recommendations.length === 0) {
    return <div>No personalized recommendations available at the moment.</div>;
  }

  return (
    <div className="personalized-recommendations">
      <h2>Personalized Recommendations</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {recommendations.map((item) => (
          <li key={item.id} style={{ border: '1px solid #eee', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
            <h3>{item.name} ({item.type})</h3>
            <p><em>{item.reason}</em></p>
            {/* Add more details or a link to the course/teacher profile */}
            <button>View Details</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PersonalizedRecommendations; 