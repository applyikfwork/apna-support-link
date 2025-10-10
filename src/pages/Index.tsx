import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Gamepad2, MessageSquare, Zap, Shield, Users } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gaming-darker relative overflow-hidden">
      {/* Enhanced animated background gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-secondary/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-accent/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Grid overlay for depth */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      
      {/* Hero Section */}
      <div className="relative pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-8 animate-fade-in">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-gaming rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-32 h-32 bg-gradient-gaming rounded-3xl flex items-center justify-center shadow-glow-cyan animate-scale-in hover-scale cursor-pointer">
                <Gamepad2 className="w-16 h-16 text-gaming-darker" />
              </div>
            </div>
          </div>

          {/* Main Heading */}
          <div className="space-y-6">
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight">
              <span className="bg-gradient-gaming bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,255,255,0.3)]">
                Apna Esport
              </span>
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
              Premium Gaming Support & Community Platform
            </p>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with our elite support team and join a thriving gaming community. Your success is our mission.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center flex-wrap pt-4">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="group relative bg-primary hover:bg-primary/90 text-gaming-darker font-bold text-lg px-10 py-7 shadow-glow-cyan hover-scale transition-all overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Get Started
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/auth")}
              className="border-2 border-primary/50 hover:bg-primary/10 hover:border-primary text-foreground font-bold text-lg px-10 py-7 hover-scale transition-all backdrop-blur-sm"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose <span className="bg-gradient-gaming bg-clip-text text-transparent">Apna Esport</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Experience the ultimate gaming support platform with cutting-edge features designed for champions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-8 bg-card/40 rounded-2xl border-2 border-primary/30 backdrop-blur-lg hover:border-primary/60 hover:shadow-glow-cyan transition-all hover-scale h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/30 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">Lightning Fast Support</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get instant responses from our dedicated team available 24/7. No more waiting, just solutions.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-8 bg-card/40 rounded-2xl border-2 border-secondary/30 backdrop-blur-lg hover:border-secondary/60 hover:shadow-glow-purple transition-all hover-scale h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold text-secondary mb-4">Secure File Sharing</h3>
              <p className="text-muted-foreground leading-relaxed">
                Share images, videos, and documents with enterprise-grade security. Your data stays protected.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-8 bg-card/40 rounded-2xl border-2 border-accent/30 backdrop-blur-lg hover:border-accent/60 hover:shadow-glow-pink transition-all hover-scale h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-accent/30 to-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-accent mb-4">Thriving Community</h3>
              <p className="text-muted-foreground leading-relaxed">
                Join thousands of gamers with 99.9% uptime. Always online, always ready to help you win.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: "10K+", label: "Active Users" },
            { number: "24/7", label: "Support" },
            { number: "99.9%", label: "Uptime" },
            { number: "50K+", label: "Messages" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-black bg-gradient-gaming bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-muted-foreground text-sm md:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="relative max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="p-12 bg-gradient-to-br from-card/60 to-card/30 rounded-3xl border-2 border-primary/20 backdrop-blur-lg">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Level Up?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join our community today and experience the future of gaming support
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="bg-primary hover:bg-primary/90 text-gaming-darker font-bold text-lg px-12 py-7 shadow-glow-cyan hover-scale transition-all"
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            Start Your Journey
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
