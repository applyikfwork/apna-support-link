import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Gamepad2, MessageSquare } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gaming-darker relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-500" />
      
      <div className="relative text-center space-y-8 max-w-4xl mx-auto px-4 animate-fade-in">
        <div className="mx-auto w-28 h-28 bg-gradient-gaming rounded-3xl flex items-center justify-center shadow-glow-cyan animate-scale-in hover-scale">
          <Gamepad2 className="w-14 h-14 text-primary-foreground" />
        </div>

        <div className="space-y-4">
          <h1 className="text-7xl md:text-8xl font-bold bg-gradient-gaming bg-clip-text text-transparent animate-fade-in">
            Apna Esport
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground animate-fade-in">
            Premium Gaming Support & Community Platform
          </p>
        </div>

        <div className="flex gap-4 justify-center flex-wrap animate-fade-in">
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-8 py-6 shadow-glow-cyan hover-scale transition-all"
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            Get Started
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/auth")}
            className="border-2 border-primary/50 hover:bg-primary/10 hover:border-primary font-bold text-lg px-8 py-6 hover-scale transition-all"
          >
            Sign In
          </Button>
        </div>

        <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-8 bg-card/60 rounded-2xl border-2 border-primary/30 backdrop-blur-lg hover:border-primary/60 hover:shadow-glow-cyan transition-all hover-scale">
            <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-3">Real-time Support</h3>
            <p className="text-sm text-muted-foreground">
              Get instant help from our dedicated team 24/7
            </p>
          </div>
          <div className="p-8 bg-card/60 rounded-2xl border-2 border-secondary/30 backdrop-blur-lg hover:border-secondary/60 hover:shadow-glow-purple transition-all hover-scale">
            <div className="w-14 h-14 bg-secondary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Gamepad2 className="w-7 h-7 text-secondary" />
            </div>
            <h3 className="text-xl font-bold text-secondary mb-3">File Sharing</h3>
            <p className="text-sm text-muted-foreground">
              Share images, videos, and documents effortlessly
            </p>
          </div>
          <div className="p-8 bg-card/60 rounded-2xl border-2 border-accent/30 backdrop-blur-lg hover:border-accent/60 hover:shadow-glow-pink transition-all hover-scale">
            <div className="w-14 h-14 bg-accent/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Gamepad2 className="w-7 h-7 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-accent mb-3">Always Online</h3>
            <p className="text-sm text-muted-foreground">
              Reliable platform with 99.9% uptime guarantee
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
