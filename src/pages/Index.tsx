import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Gamepad2, MessageSquare } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gaming-darker relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-gaming opacity-20 blur-3xl animate-pulse" />
      
      <div className="relative text-center space-y-8 max-w-2xl mx-auto px-4">
        <div className="mx-auto w-24 h-24 bg-gradient-gaming rounded-2xl flex items-center justify-center shadow-glow-cyan">
          <Gamepad2 className="w-12 h-12 text-primary-foreground" />
        </div>

        <div className="space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-gaming bg-clip-text text-transparent">
            Apna Esport
          </h1>
          <p className="text-xl text-muted-foreground">
            Premium Gaming Support & Community Platform
          </p>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg shadow-glow-cyan transition-all"
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            Get Started
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/auth")}
            className="border-2 border-primary/50 hover:bg-primary/10 hover:border-primary font-bold text-lg"
          >
            Sign In
          </Button>
        </div>

        <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-6 bg-card/50 rounded-xl border-2 border-border backdrop-blur">
            <h3 className="text-lg font-semibold text-primary mb-2">Real-time Support</h3>
            <p className="text-sm text-muted-foreground">
              Get instant help from our dedicated team
            </p>
          </div>
          <div className="p-6 bg-card/50 rounded-xl border-2 border-border backdrop-blur">
            <h3 className="text-lg font-semibold text-secondary mb-2">File Sharing</h3>
            <p className="text-sm text-muted-foreground">
              Share images, videos, and documents effortlessly
            </p>
          </div>
          <div className="p-6 bg-card/50 rounded-xl border-2 border-border backdrop-blur">
            <h3 className="text-lg font-semibold text-accent mb-2">Always Online</h3>
            <p className="text-sm text-muted-foreground">
              24/7 platform availability for your convenience
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
