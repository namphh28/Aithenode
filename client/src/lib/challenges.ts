import { Challenge, UserChallenge, LeaderboardEntry, Badge, Reward } from './types';

// Local storage keys
const CHALLENGES_KEY = 'learning_challenges';
const USER_CHALLENGES_KEY = 'user_challenges';
const LEADERBOARD_KEY = 'challenge_leaderboard';
const BADGES_KEY = 'user_badges';

// Get challenges from local storage
export const getChallenges = (): Challenge[] => {
  const stored = localStorage.getItem(CHALLENGES_KEY);
  if (!stored) {
    // Initialize with sample data
    const initialChallenges: Challenge[] = [
      {
        id: 1,
        title: "JavaScript Fundamentals Challenge",
        description: "Master the basics of JavaScript with daily coding exercises",
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        type: "weekly",
        difficulty: "beginner",
        category: "Programming",
        points: 1000,
        participants: 156,
        status: "active",
        tasks: [
          {
            id: 1,
            title: "Variables and Data Types",
            description: "Complete exercises on JavaScript variables and data types",
            points: 200,
          },
          {
            id: 2,
            title: "Functions and Scope",
            description: "Practice writing functions and understanding scope",
            points: 300,
          },
          {
            id: 3,
            title: "Arrays and Objects",
            description: "Work with arrays and objects in JavaScript",
            points: 500,
          }
        ]
      },
      // Add more sample challenges
    ];
    localStorage.setItem(CHALLENGES_KEY, JSON.stringify(initialChallenges));
    return initialChallenges;
  }
  return JSON.parse(stored);
};

// Get user challenges
export const getUserChallenges = (userId: number): UserChallenge[] => {
  const stored = localStorage.getItem(USER_CHALLENGES_KEY);
  const userChallenges = stored ? JSON.parse(stored) : {};
  return userChallenges[userId] || [];
};

// Join a challenge
export const joinChallenge = async (userId: number, challengeId: number): Promise<UserChallenge> => {
  const stored = localStorage.getItem(USER_CHALLENGES_KEY);
  const userChallenges = stored ? JSON.parse(stored) : {};
  
  const newUserChallenge: UserChallenge = {
    userId,
    challengeId,
    progress: 0,
    completedTasks: [],
    pointsEarned: 0,
    startedAt: new Date().toISOString(),
  };

  userChallenges[userId] = [...(userChallenges[userId] || []), newUserChallenge];
  localStorage.setItem(USER_CHALLENGES_KEY, JSON.stringify(userChallenges));

  // Update challenge participants count
  const challenges = getChallenges();
  const updatedChallenges = challenges.map(challenge =>
    challenge.id === challengeId
      ? { ...challenge, participants: challenge.participants + 1 }
      : challenge
  );
  localStorage.setItem(CHALLENGES_KEY, JSON.stringify(updatedChallenges));

  return newUserChallenge;
};

// Complete a task
export const completeTask = async (
  userId: number,
  challengeId: number,
  taskId: number
): Promise<UserChallenge> => {
  const stored = localStorage.getItem(USER_CHALLENGES_KEY);
  const userChallenges = stored ? JSON.parse(stored) : {};
  
  const challenges = getChallenges();
  const challenge = challenges.find(c => c.id === challengeId);
  if (!challenge) throw new Error("Challenge not found");
  
  const task = challenge.tasks.find(t => t.id === taskId);
  if (!task) throw new Error("Task not found");

  const userChallenge = userChallenges[userId]?.find((uc: UserChallenge) => uc.challengeId === challengeId);
  if (!userChallenge) throw new Error("User not enrolled in challenge");

  if (userChallenge.completedTasks.includes(taskId)) {
    return userChallenge;
  }

  const updatedUserChallenge = {
    ...userChallenge,
    completedTasks: [...userChallenge.completedTasks, taskId],
    pointsEarned: userChallenge.pointsEarned + task.points,
    progress: ((userChallenge.completedTasks.length + 1) / challenge.tasks.length) * 100
  };

  userChallenges[userId] = userChallenges[userId].map((uc: UserChallenge) =>
    uc.challengeId === challengeId ? updatedUserChallenge : uc
  );

  localStorage.setItem(USER_CHALLENGES_KEY, JSON.stringify(userChallenges));
  updateLeaderboard(userId);

  return updatedUserChallenge;
};

// Get leaderboard
export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  const stored = localStorage.getItem(LEADERBOARD_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Update leaderboard
const updateLeaderboard = (userId: number) => {
  const stored = localStorage.getItem(LEADERBOARD_KEY);
  const leaderboard: LeaderboardEntry[] = stored ? JSON.parse(stored) : [];
  
  // Calculate total points and challenges completed
  const userChallenges = getUserChallenges(userId);
  const totalPoints = userChallenges.reduce((sum, uc) => sum + uc.pointsEarned, 0);
  const completedChallenges = userChallenges.filter(uc => uc.completedAt).length;

  // Update or add user entry
  const updatedLeaderboard = leaderboard
    .filter(entry => entry.user.id !== userId)
    .concat({
      user: {
        id: userId,
        name: "User Name", // This should come from user data
        badges: [],
      },
      points: totalPoints,
      rank: 0,
      challengesCompleted: completedChallenges,
      streak: calculateStreak(userChallenges),
    })
    .sort((a, b) => b.points - a.points)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));

  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updatedLeaderboard));
  checkAndAwardBadges(userId, updatedLeaderboard);
};

// Calculate streak
const calculateStreak = (userChallenges: UserChallenge[]): number => {
  // Implementation of streak calculation
  return 1; // Placeholder
};

// Get user badges
export const getUserBadges = (userId: number): Badge[] => {
  const stored = localStorage.getItem(BADGES_KEY);
  const userBadges = stored ? JSON.parse(stored) : {};
  return userBadges[userId] || [];
};

// Check and award badges
const checkAndAwardBadges = (userId: number, leaderboard: LeaderboardEntry[]) => {
  const userEntry = leaderboard.find(entry => entry.user.id === userId);
  if (!userEntry) return;

  const badges: Badge[] = [];

  // Example badge criteria
  if (userEntry.points >= 1000) {
    badges.push({
      id: 1,
      name: "Point Master",
      description: "Earned 1000 points",
      icon: "🏆",
      rarity: "rare",
      unlockedAt: new Date().toISOString(),
    });
  }

  if (userEntry.challengesCompleted >= 5) {
    badges.push({
      id: 2,
      name: "Challenge Champion",
      description: "Completed 5 challenges",
      icon: "🎯",
      rarity: "epic",
      unlockedAt: new Date().toISOString(),
    });
  }

  // Store badges
  const stored = localStorage.getItem(BADGES_KEY);
  const userBadges = stored ? JSON.parse(stored) : {};
  userBadges[userId] = badges;
  localStorage.setItem(BADGES_KEY, JSON.stringify(userBadges));
};

// Get available rewards
export const getAvailableRewards = (userId: number): Reward[] => {
  const leaderboard = JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || '[]');
  const userEntry = leaderboard.find((entry: LeaderboardEntry) => entry.user.id === userId);
  
  const allRewards: Reward[] = [
    {
      id: 1,
      type: "badge",
      title: "Top 10 Badge",
      description: "Special badge for reaching top 10",
      value: "🏅",
      requirements: { minRank: 10 }
    },
    {
      id: 2,
      type: "discount",
      title: "Course Discount",
      description: "20% off your next course",
      value: 20,
      requirements: { minPoints: 5000 }
    },
    // Add more rewards
  ];

  if (!userEntry) return [];

  return allRewards.filter(reward => {
    const { minRank, minPoints, challengesCompleted } = reward.requirements;
    return (!minRank || userEntry.rank <= minRank) &&
           (!minPoints || userEntry.points >= minPoints) &&
           (!challengesCompleted || userEntry.challengesCompleted >= challengesCompleted);
  });
}; 