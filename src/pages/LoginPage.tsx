import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GraduationCap, Lock, User, UserPlus } from "lucide-react";

const LoginPage = () => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    let err: string | null;
    if (isSignup) {
      err = signup(username, password, name);
    } else {
      err = login(username, password);
    }
    if (err) {
      setError(err);
    } else {
      const stored = JSON.parse(localStorage.getItem("helpdesk_user")!);
      navigate(stored.role === "admin" ? "/admin" : "/chat");
    }
  };

  const resetForm = () => {
    setError("");
    setUsername("");
    setPassword("");
    setName("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary p-4">
      <div className="w-full max-w-md" style={{ animation: "fadeInUp 0.6s ease-out" }}>
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-accent mb-3 sm:mb-4">
            <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8 text-accent-foreground" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-foreground">UniBot</h1>
          <p className="text-primary-foreground/70 mt-1 text-sm sm:text-base">AI-Powered University Helpdesk</p>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-3 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl">{isSignup ? "Create Account" : "Sign In"}</CardTitle>
            <CardDescription>
              {isSignup ? "Register as a new student" : "Use demo credentials to explore"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {isSignup && (
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="pl-10"
                    />
                  </div>
                </div>
              )}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isSignup ? "Min 6 characters" : "Enter password"}
                    className="pl-10"
                  />
                </div>
              </div>
              {error && (
                <p className="text-sm text-destructive bg-destructive/10 p-2 rounded-md">{error}</p>
              )}
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                {isSignup ? "Create Account" : "Sign In"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => { setIsSignup(!isSignup); resetForm(); }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
              >
                {isSignup ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
              </button>
            </div>

            {!isSignup && (
              <div className="mt-5 sm:mt-6 p-3 sm:p-4 rounded-lg bg-muted">
                <p className="text-xs font-semibold text-muted-foreground mb-2">Demo Credentials</p>
                <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => { setUsername("student"); setPassword("student123"); }}
                    className="p-2 rounded-md bg-card border text-left hover:border-accent transition-colors cursor-pointer"
                  >
                    <span className="font-semibold text-foreground">Student</span>
                    <br />
                    <span className="text-muted-foreground">student / student123</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setUsername("admin"); setPassword("admin123"); }}
                    className="p-2 rounded-md bg-card border text-left hover:border-accent transition-colors cursor-pointer"
                  >
                    <span className="font-semibold text-foreground">Admin</span>
                    <br />
                    <span className="text-muted-foreground">admin / admin123</span>
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
