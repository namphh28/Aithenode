import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge as BadgeUI } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Star, Users, Clock, ChevronRight } from "lucide-react";
import { Challenge, UserChallenge, LeaderboardEntry, Badge, User } from "@/lib/types";
import {
  getChallenges,
  getUserChallenges,
  joinChallenge,
  getLeaderboard,
  getUserBadges,
  getAvailableRewards,
} from "@/lib/challenges";
import { useToast } from "@/components/ui/use-toast";

const LearningChallenges = () => {
  const [activeTab, setActiveTab] = useState("challenges");
  const { toast } = useToast();

  // Get current user
  const { data: currentUser } = useQuery<User | null>({
    queryKey: ["/api/auth/current-user"],
  });

  // Fetch challenges
  const { data: challenges } = useQuery<Challenge[]>({
    queryKey: ["challenges"],
    queryFn: getChallenges,
  });

  // Fetch user challenges
  const { data: userChallenges } = useQuery<UserChallenge[]>({
    queryKey: ["user-challenges", currentUser?.id],
    queryFn: () => getUserChallenges(currentUser?.id || 0),
    enabled: !!currentUser,
  });

  // Fetch leaderboard
  const { data: leaderboard } = useQuery<LeaderboardEntry[]>({
    queryKey: ["leaderboard"],
    queryFn: getLeaderboard,
  });

  // Fetch user badges
  const { data: badges } = useQuery<Badge[]>({
    queryKey: ["badges", currentUser?.id],
    queryFn: () => getUserBadges(currentUser?.id || 0),
    enabled: !!currentUser,
  });

  // Fetch available rewards
  const { data: rewards } = useQuery({
    queryKey: ["rewards", currentUser?.id],
    queryFn: () => getAvailableRewards(currentUser?.id || 0),
    enabled: !!currentUser,
  });

  // Handle joining a challenge
  const handleJoinChallenge = async (challengeId: number) => {
    if (!currentUser) {
      toast({
        title: "Sign in required",
        description: "Please sign in to join challenges",
        variant: "destructive",
      });
      return;
    }

    try {
      await joinChallenge(currentUser.id, challengeId);
      toast({
        title: "Success",
        description: "You've joined the challenge!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join challenge. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold">Learning Challenges</h1>
              <p className="mt-2 text-gray-600">
                Complete challenges, earn points, and unlock rewards
              </p>
            </div>

            {/* Main Content */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="challenges">Challenges</TabsTrigger>
                <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                <TabsTrigger value="rewards">Rewards</TabsTrigger>
              </TabsList>

              {/* Challenges Tab */}
              <TabsContent value="challenges" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {challenges?.map((challenge) => {
                    const userChallenge = userChallenges?.find(
                      (uc) => uc.challengeId === challenge.id
                    );
                    
                    return (
                      <Card key={challenge.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{challenge.title}</CardTitle>
                              <CardDescription>{challenge.description}</CardDescription>
                            </div>
                            <BadgeUI variant={challenge.status === 'active' ? 'default' : 'secondary'}>
                              {challenge.status}
                            </BadgeUI>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center">
                                <Trophy className="w-4 h-4 mr-1" />
                                <span>{challenge.points} points</span>
                              </div>
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                <span>{challenge.participants} participants</span>
                              </div>
                            </div>
                            {userChallenge && (
                              <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span>Progress</span>
                                  <span>{userChallenge.progress}%</span>
                                </div>
                                <Progress value={userChallenge.progress} />
                              </div>
                            )}
                            <div className="flex flex-wrap gap-2">
                              <BadgeUI variant="outline">{challenge.difficulty}</BadgeUI>
                              <BadgeUI variant="outline">{challenge.category}</BadgeUI>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          {userChallenge ? (
                            <Button className="w-full" asChild>
                              <Link href={`/challenges/${challenge.id}`}>
                                Continue Challenge
                                <ChevronRight className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                          ) : (
                            <Button
                              className="w-full"
                              onClick={() => handleJoinChallenge(challenge.id)}
                              disabled={challenge.status !== 'active'}
                            >
                              Join Challenge
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              {/* Leaderboard Tab */}
              <TabsContent value="leaderboard">
                <Card>
                  <CardHeader>
                    <CardTitle>Global Leaderboard</CardTitle>
                    <CardDescription>Top performers this week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">Rank</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Points</TableHead>
                          <TableHead>Challenges</TableHead>
                          <TableHead>Streak</TableHead>
                          <TableHead>Badges</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {leaderboard?.map((entry) => (
                          <TableRow key={entry.user.id}>
                            <TableCell className="font-medium">
                              {entry.rank <= 3 ? (
                                <div className="flex items-center">
                                  {entry.rank === 1 && <Trophy className="w-5 h-5 text-yellow-500" />}
                                  {entry.rank === 2 && <Medal className="w-5 h-5 text-gray-400" />}
                                  {entry.rank === 3 && <Medal className="w-5 h-5 text-amber-600" />}
                                </div>
                              ) : (
                                entry.rank
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Avatar>
                                  {entry.user.avatar ? (
                                    <AvatarImage src={entry.user.avatar} />
                                  ) : (
                                    <AvatarFallback>{entry.user.name[0]}</AvatarFallback>
                                  )}
                                </Avatar>
                                <span>{entry.user.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>{entry.points}</TableCell>
                            <TableCell>{entry.challengesCompleted}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                                {entry.streak}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-1">
                                {entry.user.badges.map((badge) => (
                                  <span key={badge.id} title={badge.name}>
                                    {badge.icon}
                                  </span>
                                ))}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Rewards Tab */}
              <TabsContent value="rewards">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* User Badges Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Badges</CardTitle>
                      <CardDescription>Badges you've earned</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        {badges?.map((badge) => (
                          <div
                            key={badge.id}
                            className="flex flex-col items-center text-center p-2 rounded-lg bg-gray-50"
                          >
                            <span className="text-3xl mb-2">{badge.icon}</span>
                            <span className="text-sm font-medium">{badge.name}</span>
                            <span className="text-xs text-gray-500">{badge.rarity}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Available Rewards */}
                  {rewards?.map((reward) => (
                    <Card key={reward.id}>
                      <CardHeader>
                        <CardTitle>{reward.title}</CardTitle>
                        <CardDescription>{reward.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {reward.type === 'discount' && (
                            <div className="text-2xl font-bold text-center">
                              {reward.value}% OFF
                            </div>
                          )}
                          {(reward.type === 'badge' || reward.type === 'souvenir') && (
                            <div className="text-4xl text-center">
                              {reward.value}
                            </div>
                          )}
                          <div className="text-sm text-gray-500">
                            Requirements:
                            <ul className="list-disc list-inside mt-1">
                              {reward.requirements.minRank && (
                                <li>Reach rank {reward.requirements.minRank} or higher</li>
                              )}
                              {reward.requirements.minPoints && (
                                <li>Earn {reward.requirements.minPoints} points</li>
                              )}
                              {reward.requirements.challengesCompleted && (
                                <li>Complete {reward.requirements.challengesCompleted} challenges</li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" variant="outline">
                          Claim Reward
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LearningChallenges; 