import { useState, useEffect } from 'react';
import { User } from '../lib/types';

// This is a temporary mock user for development
const MOCK_USER: User = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  username: 'johndoe',
  profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  userType: 'student',
  isVerified: true
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would check for an auth token and fetch the user data
    // For now, we'll just return the mock user
    setUser(MOCK_USER);
    setLoading(false);
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
  };
}; 