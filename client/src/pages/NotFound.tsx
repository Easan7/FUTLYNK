/*
 * 404 Not Found Page - Cyberpunk Athleticism
 */

import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import wallpaperImage from "@/assets/images/wallpaper.jpg";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center space-y-6 max-w-md">
        <div
          className="w-64 h-64 mx-auto bg-cover bg-center opacity-60"
          style={{ backgroundImage: `url(${wallpaperImage})` }}
        />
        
        <div className="space-y-3">
          <h1 className="text-6xl font-display font-bold text-neon-green font-accent">404</h1>
          <h2 className="text-2xl font-display font-bold text-foreground">Page Not Found</h2>
          <p className="text-muted-foreground">
            Looks like this game doesn't exist. Let's get you back on the pitch!
          </p>
        </div>

        <Link href="/">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-display font-bold">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
