/*
 * 404 Not Found Page - Cyberpunk Athleticism
 */

import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center space-y-6 max-w-md">
        <div
          className="w-64 h-64 mx-auto bg-cover bg-center opacity-60"
          style={{
            backgroundImage: `url('https://private-us-east-1.manuscdn.com/sessionFile/rMco6RyN77L0Rvf8s3BShq/sandbox/j2B2drvtzojpOCqpr8e6B6-img-5_1770793025000_na1fn_ZW1wdHktc3RhdGUtaWxsdXN0cmF0aW9u.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvck1jbzZSeU43N0wwUnZmOHMzQlNocS9zYW5kYm94L2oyQjJkcnZ0em9qcE9DcXByOGU2QjYtaW1nLTVfMTc3MDc5MzAyNTAwMF9uYTFmbl9aVzF3ZEhrdGMzUmhkR1V0YVd4c2RYTjBjbUYwYVc5dS5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=PKwk0cpe1R7hBodrpWgIWQufe~7gjFBvL1yQVj41tdbL1htBvz0ol7iM0mfLYHo37H4zpesQWwMHZ-q0AFh6kbbEurB6DcURwX241YsJkNIVLWENovPPkECL7rHxsULX3ZPkEN3l6rL2zcnPevueFxK7ItLyJ2B9Mji3cIpi1Ruy02U2Li1LLfmL5nSo-scGlq-fhiswYY~rMu3oD3ra0PsLxiypuaKv8rTkm-OdPsT0pgAN6JSpArc1a9V5dQiLAf4Avj6PPT9pzUO0Uj5Bh~Gw2fxC2fJ6RHm4y19YbgLy8kxg7KzXzB5MLlNVvZ9e3su5hiRhPz20u6EAPVQueA__')`,
          }}
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
