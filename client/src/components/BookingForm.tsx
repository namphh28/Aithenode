import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { format, addHours, parse } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { EducatorProfile, User } from "@/lib/types";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "@/lib/icons";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";

// Define the booking form schema
const bookingSchema = z.object({
  date: z.date({
    required_error: "Please select a date",
  }),
  startTime: z.string({
    required_error: "Please select a start time",
  }),
  duration: z.coerce.number().min(1).max(4),
  notes: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  educator: EducatorProfile;
  currentUser: User;
}

const BookingForm = ({ educator, currentUser }: BookingFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Convert availability object to array of days with available time slots
  const availableDays = educator.availability ? Object.keys(educator.availability) : [];
  
  // Get available time slots for a specific day
  const getAvailableTimesForDay = (day: string): string[] => {
    if (!educator.availability || !educator.availability[day]) {
      return [];
    }
    return educator.availability[day] as string[];
  };
  
  // Initialize the form
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      date: undefined,
      startTime: "",
      duration: 1,
      notes: "",
    },
  });
  
  // Watch the date value to show only available times for that day
  const selectedDate = form.watch("date");
  const selectedDay = selectedDate 
    ? format(selectedDate, "EEEE").toLowerCase() 
    : null;
  
  // Get available times for the selected day
  const availableTimes = selectedDay 
    ? getAvailableTimesForDay(selectedDay) 
    : [];
  
  // Watch the start time and duration to calculate end time and total price
  const startTime = form.watch("startTime");
  const duration = form.watch("duration") || 1;
  
  // Calculate end time
  const getEndTime = (): string => {
    if (!startTime) return "";
    
    try {
      const timeFormat = "HH:mm";
      const parsedTime = parse(startTime, timeFormat, new Date());
      const endTime = addHours(parsedTime, duration);
      return format(endTime, timeFormat);
    } catch (error) {
      return "";
    }
  };
  
  // Calculate total price
  const totalPrice = educator.hourlyRate * duration;
  
  // Create session mutation
  const createSession = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/sessions", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
      
      toast({
        title: "Session requested",
        description: `Your session with ${educator.user.firstName} has been requested.`,
      });
      
      // Redirect to dashboard
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Booking error:", error);
      toast({
        title: "Booking failed",
        description: "Failed to book the session. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });
  
  const onSubmit = (data: BookingFormValues) => {
    setIsSubmitting(true);
    
    const endTime = getEndTime();
    if (!endTime) {
      toast({
        title: "Invalid time",
        description: "There was an error calculating the end time. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
    // Format dates for backend
    const startDateTime = new Date(format(data.date, "yyyy-MM-dd") + "T" + data.startTime);
    const endDateTime = new Date(format(data.date, "yyyy-MM-dd") + "T" + endTime);
    
    const sessionData = {
      educatorId: educator.id,
      studentId: currentUser.id,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      totalPrice: totalPrice,
      notes: data.notes || "",
    };
    
    createSession.mutate(sessionData);
  };
  
  // Filter out days that are not available
  const disabledDays = (date: Date) => {
    const day = format(date, "EEEE").toLowerCase();
    const isDisabled = !availableDays.includes(day);
    const isPast = date < new Date();
    return isDisabled || isPast;
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={disabledDays}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Only days when the educator is available are selectable.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <Select
                  disabled={!selectedDate}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a time" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableTimes.length > 0 ? (
                      availableTimes.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-times" disabled>
                        No available times
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select from available time slots.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (hours)</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">1 hour</SelectItem>
                    <SelectItem value="2">2 hours</SelectItem>
                    <SelectItem value="3">3 hours</SelectItem>
                    <SelectItem value="4">4 hours</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Session Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any specific topics or questions you'd like to cover in this session"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Session Summary</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p>{selectedDate ? format(selectedDate, "PPP") : "-"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Time</p>
              <p>{startTime ? `${startTime} - ${getEndTime()}` : "-"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Duration</p>
              <p>{duration} {duration === 1 ? "hour" : "hours"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Hourly Rate</p>
              <p>${educator.hourlyRate}/hour</p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <p className="font-semibold">Total Price</p>
              <p className="text-xl font-bold">${totalPrice}</p>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Payment will be processed after the session is confirmed.
            </p>
          </div>
        </div>
        
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Requesting Session..." : "Request Session"}
        </Button>
      </form>
    </Form>
  );
};

export default BookingForm;
