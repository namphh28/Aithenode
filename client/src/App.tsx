import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Home from "./pages/Home";
import FindEducators from "./pages/FindEducators";
import EducatorProfile from "./pages/EducatorProfile";
import Categories from "./pages/Categories";
import BookSession from "./pages/BookSession";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Community from "./pages/Community";
import Resources from "./pages/Resources";
import Forum from "./pages/Forum";
import ForumPost from "./pages/ForumPost";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Events from "./pages/Events";
import EventPost from "./pages/EventPost";
import BlogEvents from "./pages/BlogEvents";
import LearningChallenges from "./pages/LearningChallenges";
import ChallengePost from "./pages/ChallengePost";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/find-educators" component={FindEducators} />
      <Route path="/educators/:id" component={EducatorProfile} />
      <Route path="/categories" component={Categories} />
      <Route path="/categories/:id" component={Categories} />
      <Route path="/book/:educatorId" component={BookSession} />
      <Route path="/signin" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/community" component={Community} />
      <Route path="/resources" component={Resources} />
      <Route path="/forum" component={Forum} />
      <Route path="/forum/:id" component={ForumPost} />
      <Route path="/blog-events" component={BlogEvents} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:id" component={BlogPost} />
      <Route path="/events" component={Events} />
      <Route path="/events/:id" component={EventPost} />
      <Route path="/challenges" component={LearningChallenges} />
      <Route path="/challenges/:id" component={ChallengePost} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
