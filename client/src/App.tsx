import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import GameDetails from "./pages/GameDetails";
import CreateGroup from "./pages/CreateGroup";
import Profile from "./pages/Profile";
import Matchmaking from "./pages/Matchmaking";
import Friends from "./pages/Friends";
import Groups from "./pages/Groups";
import PostGameFeedback from "./pages/PostGameFeedback";
import Notifications from "./pages/Notifications";
import Login from "./pages/Login";
import ProfileEditor from "./pages/ProfileEditor";
import Wallet from "./pages/Wallet";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/game/:id"} component={GameDetails} />
      <Route path={"/create"} component={CreateGroup} />
      <Route path={"/profile"} component={Profile} />
      <Route path={"/matchmaking"} component={Matchmaking} />
      <Route path={"/friends"} component={Friends} />
      <Route path={"/groups"} component={Groups} />
      <Route path={"/feedback/:gameId"} component={PostGameFeedback} />
      <Route path={"/notifications"} component={Notifications} />
      <Route path={"/profile/edit"} component={ProfileEditor} />
      <Route path={"/wallet"} component={Wallet} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [hasEntered, setHasEntered] = useState(false);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          {hasEntered ? <Router /> : <Login onEnter={() => setHasEntered(true)} />}
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
