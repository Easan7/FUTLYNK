import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import OnboardingFlow from "./components/OnboardingFlow";
import SkillBandIntro from "./components/SkillBandIntro";
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
import Signup from "./pages/Signup";
import ProfileEditor from "./pages/ProfileEditor";
import Wallet from "./pages/Wallet";
import Availability from "./pages/Availability";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/game/:id"} component={GameDetails} />
      <Route path={"/create"} component={CreateGroup} />
      <Route path={"/profile/edit"} component={ProfileEditor} />
      <Route path={"/profile/:id"} component={Profile} />
      <Route path={"/profile"} component={Profile} />
      <Route path={"/matchmaking"} component={Matchmaking} />
      <Route path={"/friends"} component={Friends} />
      <Route path={"/groups"} component={Groups} />
      <Route path={"/feedback/:gameId"} component={PostGameFeedback} />
      <Route path={"/notifications"} component={Notifications} />
      <Route path={"/wallet"} component={Wallet} />
      <Route path={"/availability"} component={Availability} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSkillBandStep, setShowSkillBandStep] = useState(false);
  const [authScreen, setAuthScreen] = useState<"signup" | "login">("signup");

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          {hasEntered ? (
            <Router />
          ) : authScreen === "signup" ? (
            <Signup
              onEnter={() => {
                setHasEntered(true);
                setShowOnboarding(true);
                setShowSkillBandStep(false);
              }}
              onGoLogin={() => setAuthScreen("login")}
            />
          ) : (
            <Login
              onEnter={() => {
                setHasEntered(true);
                setShowOnboarding(false);
                setShowSkillBandStep(false);
              }}
              onGoSignup={() => setAuthScreen("signup")}
            />
          )}
          {hasEntered && showOnboarding ? <OnboardingFlow onFinish={() => {
            setShowOnboarding(false);
            setShowSkillBandStep(true);
          }} /> : null}
          {hasEntered && showSkillBandStep ? <SkillBandIntro onFinish={() => setShowSkillBandStep(false)} /> : null}
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
