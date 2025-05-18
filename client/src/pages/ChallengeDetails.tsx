import { useEffect } from "react";
import { useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Trophy, Users, Clock } from "lucide-react";
import { Challenge, UserChallenge, User } from "@/lib/types";
import { getChallenges, getUserChallenges, completeTask } from "@/lib/challenges";
import { useToast } from "@/components/ui/use-toast";
import { formatDistanceToNow } from "date-fns";

const ChallengeDetails = () => {
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
      document.title = `${challenge.title} | Learning Challenges`;
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
            {/* Header */}
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

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  <span>{challenge.points} points</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  <span>{challenge.participants} participants</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>
                    Ends {formatDistanceToNow(new Date(challenge.endDate), { addSuffix: true })}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{challenge.difficulty}</Badge>
                <Badge variant="outline">{challenge.category}</Badge>
                <Badge variant="outline">{challenge.type}</Badge>
              </div>

              {userChallenge && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Progress</span>
                    <span>{userChallenge.progress}%</span>
                  </div>
                  <Progress value={userChallenge.progress} />
                </div>
              )}
            </div>

            {/* Tasks */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Tasks</h2>
              <div className="space-y-4">
                {challenge.tasks.map((task) => {
                  const isCompleted = userChallenge?.completedTasks.includes(task.id);
                  
                  return (
                    <Card key={task.id} className={isCompleted ? "bg-gray-50" : ""}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle>{task.title}</CardTitle>
                            <CardDescription>{task.description}</CardDescription>
                          </div>
                          <Badge variant="outline">{task.points} points</Badge>
                        </div>
                      </CardHeader>
                      <CardFooter>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={isCompleted}
                              disabled={isCompleted || taskMutation.isPending}
                              onCheckedChange={() => taskMutation.mutate(task.id)}
                            />
                            <span className={isCompleted ? "text-gray-500" : ""}>
                              {isCompleted ? "Completed" : "Mark as complete"}
                            </span>
                          </div>
                          {isCompleted && (
                            <Badge variant="secondary">+{task.points} points</Badge>
                          )}
                        </div>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ChallengeDetails; 