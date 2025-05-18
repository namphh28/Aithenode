import { useEffect } from "react";
import { useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Trophy, Users, Clock, Calendar, Target, Award } from "lucide-react";
import { Challenge, UserChallenge, User } from "@/lib/types";
import { getChallenges, getUserChallenges, joinChallenge, completeTask } from "@/lib/challenges";
import { useToast } from "@/components/ui/use-toast";

const ChallengePost = () => {
  const [match, params] = useRoute("/challenges/:id");
  const challengeId = match ? parseInt(params.id) : null;
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get current user
  const { data: currentUser } = useQuery<User | null>({
    queryKey: ["/api/auth/current-user"],
  });

  // Fetch challenge
  const { data: challenges } = useQuery<Challenge[]>({
    queryKey: ["challenges"],
    queryFn: getChallenges,
  });
  const challenge = challenges?.find(c => c.id === challengeId);

  // Fetch user challenge
  const { data: userChallenges } = useQuery<UserChallenge[]>({
    queryKey: ["user-challenges", currentUser?.id],
    queryFn: () => getUserChallenges(currentUser?.id || 0),
    enabled: !!currentUser,
  });
  const userChallenge = userChallenges?.find(uc => uc.challengeId === challengeId);

  // Join challenge mutation
  const joinMutation = useMutation({
    mutationFn: async () => {
      if (!currentUser || !challengeId) return null;
      return joinChallenge(currentUser.id, challengeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-challenges", currentUser?.id] });
      toast({
        title: "Joined challenge!",
        description: "You've successfully joined the challenge.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to join challenge. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Complete task mutation
  const taskMutation = useMutation({
    mutationFn: async (taskId: number) => {
      if (!currentUser || !challengeId) return null;
      return completeTask(currentUser.id, challengeId, taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-challenges", currentUser?.id] });
      toast({
        title: "Task completed!",
        description: "Keep up the good work!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to complete task. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Set page title
  useEffect(() => {
    if (challenge) {
      document.title = `${challenge.title} | Challenge Details`;
    }
  }, [challenge]);

  if (!challenge) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Challenge not found</h1>
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
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Challenge Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold">{challenge.title}</h1>
                  <p className="mt-2 text-gray-600">{challenge.description}</p>
                </div>
                <Badge variant={challenge.status === 'active' ? 'default' : 'secondary'}>
                  {challenge.status}
                </Badge>
              </div>

              {/* Challenge Stats */}
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      <div>
                        <p className="text-sm text-gray-500">Points</p>
                        <p className="font-semibold">{challenge.points}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-500">Participants</p>
                        <p className="font-semibold">{challenge.participants}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Target className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-sm text-gray-500">Difficulty</p>
                        <p className="font-semibold capitalize">{challenge.difficulty}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Challenge Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Challenge Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Start Date</p>
                        <p className="font-semibold">{format(new Date(challenge.startDate), 'PPP')}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">End Date</p>
                        <p className="font-semibold">{format(new Date(challenge.endDate), 'PPP')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{challenge.type}</Badge>
                    <Badge variant="outline">{challenge.category}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Progress Section */}
              {userChallenge && (
                <Card>
                  <CardHeader>
                    <CardTitle>Your Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Overall Progress</span>
                        <span>{userChallenge.progress}%</span>
                      </div>
                      <Progress value={userChallenge.progress} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Points Earned</p>
                      <p className="font-semibold">{userChallenge.pointsEarned} points</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Tasks Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Tasks</CardTitle>
                  <CardDescription>Complete these tasks to earn points</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {challenge.tasks.map((task) => (
                      <div key={task.id} className="flex items-start space-x-4">
                        <Checkbox
                          checked={userChallenge?.completedTasks.includes(task.id)}
                          onCheckedChange={() => taskMutation.mutate(task.id)}
                          disabled={!userChallenge || userChallenge?.completedTasks.includes(task.id)}
                        />
                        <div className="flex-1 space-y-1">
                          <p className="font-medium">{task.title}</p>
                          <p className="text-sm text-gray-600">{task.description}</p>
                          <div className="flex items-center space-x-2">
                            <Award className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm">{task.points} points</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Join Challenge Button */}
              {!userChallenge && challenge.status === 'active' && (
                <div className="flex justify-center">
                  <Button
                    size="lg"
                    onClick={() => joinMutation.mutate()}
                    disabled={!currentUser || joinMutation.isPending}
                  >
                    {joinMutation.isPending ? 'Joining...' : 'Join Challenge'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ChallengePost; 