/*
 * Create Game Page - Cyberpunk Athleticism
 * Form for creating new futsal games with venue, skill level, and settings
 */

import { useState } from "react";
import { Link, useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, MapPin, Users, DollarSign, Lock, Zap } from "lucide-react";
import { toast } from "sonner";

export default function CreateGame() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    venue: "",
    skillLevel: "",
    maxPlayers: "10",
    price: "",
    privacy: "public",
    teamBalancing: true,
    date: "",
    time: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.venue || !formData.skillLevel || !formData.date || !formData.time) {
      toast.error("Please fill in all required fields");
      return;
    }

    toast.success("Game created successfully!");
    setTimeout(() => {
      setLocation("/");
    }, 1000);
  };

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border">
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-display font-bold text-foreground">
              Create New Game
            </h1>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div
        className="relative h-40 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://private-us-east-1.manuscdn.com/sessionFile/rMco6RyN77L0Rvf8s3BShq/sandbox/j2B2drvtzojpOCqpr8e6B6-img-4_1770793033000_na1fn_YWJzdHJhY3QtZnV0c2FsLXBhdHRlcm4.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvck1jbzZSeU43N0wwUnZmOHMzQlNocS9zYW5kYm94L2oyQjJkcnZ0em9qcE9DcXByOGU2QjYtaW1nLTRfMTc3MDc5MzAzMzAwMF9uYTFmbl9ZV0p6ZEhKaFkzUXRablYwYzJGc0xYQmhkSFJsY200LnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=XOliaOge9fDWATWaUTmsWTSFjRo1qoDWKJwOfRS69iEkLMQMZZtp3yxZYs0XCPonV-6Vczyx0I26~f7lxz1~rOOMuExFgcT6dEVUuzKm-fM8ygFXMrygmFIyVWULZ352L7ygq1htnL6YG5uCf3J1CPf4E-oWBCdjEk91HmjO7KW97KuzVF80DRIHxoG5-H9wlYvo~LRyiuXZblW~e3KssHPQD~nSVDWC1HBcRZrpo67f4fdEaATzXZkn47y9XVSmme5Ljh-iA950IZPxw7uXCb9nsSrqTyLs2YCUZCOFheorQvtCUff3k-Je3Xu5MGakm8PD-ToHwE1X1yh5WUUTSg__')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 to-background" />
      </div>

      <div className="container py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Venue Selection */}
          <div className="bg-card border-2 border-border rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-neon-green/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-neon-green" />
              </div>
              <div>
                <h2 className="text-lg font-display font-bold text-foreground">Venue</h2>
                <p className="text-sm text-muted-foreground">Select game location</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="venue">Venue Name</Label>
              <Input
                id="venue"
                placeholder="e.g., Downtown Sports Arena"
                value={formData.venue}
                onChange={(e) => updateField("venue", e.target.value)}
                className="bg-background border-border"
              />
            </div>
          </div>

          {/* Game Settings */}
          <div className="bg-card border-2 border-border rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-neon-cyan/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-neon-cyan" />
              </div>
              <div>
                <h2 className="text-lg font-display font-bold text-foreground">Game Settings</h2>
                <p className="text-sm text-muted-foreground">Configure game details</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => updateField("date", e.target.value)}
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => updateField("time", e.target.value)}
                  className="bg-background border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skillLevel">Skill Level</Label>
              <Select value={formData.skillLevel} onValueChange={(val) => updateField("skillLevel", val)}>
                <SelectTrigger id="skillLevel" className="bg-background border-border">
                  <SelectValue placeholder="Select skill level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxPlayers">Max Players</Label>
                <Select value={formData.maxPlayers} onValueChange={(val) => updateField("maxPlayers", val)}>
                  <SelectTrigger id="maxPlayers" className="bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 Players</SelectItem>
                    <SelectItem value="8">8 Players</SelectItem>
                    <SelectItem value="10">10 Players</SelectItem>
                    <SelectItem value="12">12 Players</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price per Player</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="price"
                    type="number"
                    placeholder="15"
                    value={formData.price}
                    onChange={(e) => updateField("price", e.target.value)}
                    className="bg-background border-border pl-9"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="bg-card border-2 border-border rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-neon-green" />
              </div>
              <div>
                <h2 className="text-lg font-display font-bold text-foreground">Advanced</h2>
                <p className="text-sm text-muted-foreground">Additional options</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Team Balancing */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-neon-green" />
                  <div>
                    <div className="text-sm font-semibold text-foreground">Smart Team Balancing</div>
                    <div className="text-xs text-muted-foreground">Auto-balance teams by skill</div>
                  </div>
                </div>
                <Switch
                  checked={formData.teamBalancing}
                  onCheckedChange={(checked) => updateField("teamBalancing", checked)}
                />
              </div>

              {/* Privacy */}
              <div className="space-y-2">
                <Label htmlFor="privacy">Privacy</Label>
                <Select value={formData.privacy} onValueChange={(val) => updateField("privacy", val)}>
                  <SelectTrigger id="privacy" className="bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Public - Anyone can join
                      </div>
                    </SelectItem>
                    <SelectItem value="friends">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Friends Only
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-display font-bold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-neon-green/30"
          >
            Create Game
          </Button>
        </form>
      </div>

      <Navigation />
    </div>
  );
}
