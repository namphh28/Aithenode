import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/lib/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { StarIcon } from "@/lib/icons";

// Define the review form schema
const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  educatorId: number;
}

const ReviewForm = ({ educatorId }: ReviewFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { toast } = useToast();
  
  // Fetch current user
  const { data: currentUser, isLoading: userLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/current-user"],
  });
  
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 5,
      comment: "",
    },
  });
  
  // Watch the rating value to update the stars
  const rating = form.watch("rating");
  
  // Create review mutation
  const createReview = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/reviews", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/educator-profiles/${educatorId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/reviews/educator/${educatorId}`] });
      
      toast({
        title: "Review submitted",
        description: "Your review has been submitted successfully.",
      });
      
      // Close the popover and reset the form
      setIsPopoverOpen(false);
      form.reset({ rating: 5, comment: "" });
    },
    onError: (error) => {
      console.error("Review error:", error);
      toast({
        title: "Review failed",
        description: "Failed to submit your review. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });
  
  const onSubmit = (data: ReviewFormValues) => {
    if (!currentUser) {
      toast({
        title: "Not signed in",
        description: "You need to sign in to leave a review.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    const reviewData = {
      educatorId: educatorId,
      studentId: currentUser.id,
      rating: data.rating,
      comment: data.comment,
    };
    
    createReview.mutate(reviewData);
  };
  
  // If user isn't a student, don't show the review form
  if (!userLoading && currentUser && currentUser.userType !== "student") {
    return null;
  }
  
  // Render star rating component
  const renderStars = () => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="focus:outline-none"
            onClick={() => form.setValue("rating", star)}
          >
            <StarIcon 
              className={`h-6 w-6 ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
              filled={star <= rating}
            />
          </button>
        ))}
      </div>
    );
  };
  
  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full">
          Leave a Review
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h3 className="font-medium text-center">Rate Your Experience</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="rating"
                render={() => (
                  <FormItem className="space-y-1">
                    <FormLabel>Rating</FormLabel>
                    <FormControl>
                      <div className="flex justify-center">
                        {renderStars()}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comment (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share your experience with this educator"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || userLoading || !currentUser}
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          </Form>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ReviewForm;
