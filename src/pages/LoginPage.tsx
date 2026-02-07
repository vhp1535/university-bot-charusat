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
    <div className="min-h-screen flex items-center justify-center bg-[#0b1020] p-4">
      <div className="w-full max-w-sm" style={{ animation: "fadeInUp 0.5s ease-out" }}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 mb-4 shadow-md shadow-black/40">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">UniBot</h1>
          <p className="text-slate-400 mt-1 text-sm">AI-Powered University Helpdesk</p>
        </div>

        <Card className="shadow-xl border-white/[0.06] bg-[#141828]">
          <CardHeader className="text-center pb-3">
            <CardTitle className="text-lg text-white">{isSignup ? "Create Account" : "Sign In"}</CardTitle>
            <CardDescription className="text-slate-400 text-sm">
              {isSignup ? "Register as a new student" : "Enter your credentials to continue"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              {isSignup && (
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-slate-300 text-sm">Full Name</Label>
                  <div className="relative">
                    <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="pl-10 bg-white/[0.06] border-white/[0.1] text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/30"
                    />
                  </div>
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-slate-300 text-sm">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="pl-10 bg-white/[0.06] border-white/[0.1] text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/30"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-slate-300 text-sm">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isSignup ? "Min 6 characters" : "Enter password"}
                    className="pl-10 bg-white/[0.06] border-white/[0.1] text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/30"
                  />
                </div>
              </div>
              {error && (
                <p className="text-sm text-red-400 bg-red-500/10 p-2.5 rounded-lg border border-red-500/20">{error}</p>
              )}
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold h-10 rounded-xl shadow-md">
                {isSignup ? "Create Account" : "Sign In"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => { setIsSignup(!isSignup); resetForm(); }}
                className="text-sm text-slate-400 hover:text-indigo-400 transition-colors"
              >
                {isSignup ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
