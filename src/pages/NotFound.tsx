import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Hammer, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.log("Page under development: User accessed route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      <main className="flex flex-col items-center justify-center px-4 py-20">
        <div className="text-center space-y-6 animate-fade-in">
          {/* Construction Icon */}
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-yellow-100 flex items-center justify-center animate-bounce">
              <Hammer className="w-12 h-12 text-yellow-600" />
            </div>
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Page Under Development
            </h1>
            <p className="text-lg text-muted-foreground mb-1">
              We're working hard on this page
            </p>
            <p className="text-sm text-muted-foreground">
              It will be available very soon! Please check back later.
            </p>
          </div>

          {/* Details */}
          <div className="bg-card rounded-xl p-4 border border-border max-w-sm mx-auto">
            <p className="text-sm text-muted-foreground">
              Current page: <span className="font-mono text-primary">{location.pathname}</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
            <Button 
              onClick={() => window.history.back()}
              variant="outline"
              className="w-full gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
            <Button 
              onClick={() => window.location.href = '/'}
              className="w-full gradient-primary"
            >
              Return to Home
            </Button>
          </div>

          {/* Fun Message */}
          <p className="text-xs text-muted-foreground mt-8">
            ✨ Something exciting is coming soon! Stay tuned.
          </p>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default NotFound;
