import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "@/components/auth/AuthForm";
import { CheckCircle2 } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8 items-center justify-center">
        <div className="flex-1 space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent animate-glitch" data-text="Welcome to TaskFlow">
            Welcome to TaskFlow
          </h1>
          <p className="text-xl text-muted-foreground max-w-md">
            Stay organized, boost productivity, and achieve your goals with our intuitive task management platform.
          </p>
          <div className="space-y-3 pt-4">
            {["Create and manage tasks effortlessly", "Set priorities and due dates", "Track your progress"].map((feature, index) => (
              <div key={feature} className="flex items-center gap-3 text-foreground/90 hover-lift">
                <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <AuthForm />
        </div>
      </div>
    </div>
  );
};

export default Auth;
