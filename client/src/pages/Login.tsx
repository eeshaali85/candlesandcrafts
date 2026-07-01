import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, EyeOff } from "lucide-react";

type CustomerUser = {
  id: number;
  username: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
};

export default function Login() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);

  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [signupForm, setSignupForm] = useState({ username: "", email: "", firstName: "", lastName: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: user } = useQuery<CustomerUser | null>({
    queryKey: ["/api/auth/customer"],
    retry: false,
  });

  if (user) {
    navigate("/profile");
    return null;
  }

  const loginMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/auth/login", loginForm),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/customer"] });
      navigate("/profile");
    },
    onError: (e: any) => setErrors({ login: e.message || "Invalid username or password" }),
  });

  const signupMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/auth/signup", {
      username: signupForm.username,
      password: signupForm.password,
      email: signupForm.email || undefined,
      firstName: signupForm.firstName || undefined,
      lastName: signupForm.lastName || undefined,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/customer"] });
      toast({ title: "Account created! Welcome 🕯️" });
      navigate("/profile");
    },
    onError: (e: any) => setErrors({ signup: e.message || "Could not create account" }),
  });

  const handleSignup = () => {
    const errs: Record<string, string> = {};
    if (!signupForm.username) errs.username = "Username is required";
    if (signupForm.password.length < 6) errs.password = "Password must be at least 6 characters";
    if (signupForm.password !== signupForm.confirm) errs.confirm = "Passwords do not match";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    signupMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-gray-900 mb-1">My Account</h1>
          <p className="text-gray-400 text-sm">Sign in to save your details and view orders</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => { setTab("login"); setErrors({}); }}
              className={`flex-1 py-4 text-sm font-medium transition-colors ${tab === "login" ? "text-gray-900 border-b-2 border-gray-900" : "text-gray-400 hover:text-gray-600"}`}
              data-testid="tab-login"
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab("signup"); setErrors({}); }}
              className={`flex-1 py-4 text-sm font-medium transition-colors ${tab === "signup" ? "text-gray-900 border-b-2 border-gray-900" : "text-gray-400 hover:text-gray-600"}`}
              data-testid="tab-signup"
            >
              Create Account
            </button>
          </div>

          <div className="p-8">
            {tab === "login" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Username</label>
                  <input
                    type="text"
                    value={loginForm.username}
                    onChange={e => setLoginForm(f => ({ ...f, username: e.target.value }))}
                    onKeyDown={e => e.key === "Enter" && loginMutation.mutate()}
                    placeholder="your_username"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 bg-gray-50"
                    data-testid="input-login-username"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={loginForm.password}
                      onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                      onKeyDown={e => e.key === "Enter" && loginMutation.mutate()}
                      placeholder="••••••••"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 bg-gray-50 pr-10"
                      data-testid="input-login-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {errors.login && <p className="text-red-500 text-xs">{errors.login}</p>}
                <button
                  onClick={() => loginMutation.mutate()}
                  disabled={loginMutation.isPending || !loginForm.username || !loginForm.password}
                  className="w-full py-3 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 mt-2"
                  data-testid="button-login"
                >
                  {loginMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
                </button>
                <p className="text-center text-xs text-gray-400 pt-1">
                  Don't have an account?{" "}
                  <button onClick={() => setTab("signup")} className="text-gray-700 underline">Create one</button>
                </p>
              </div>
            )}

            {tab === "signup" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">First Name</label>
                    <input
                      type="text"
                      value={signupForm.firstName}
                      onChange={e => setSignupForm(f => ({ ...f, firstName: e.target.value }))}
                      placeholder="Aisha"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 bg-gray-50"
                      data-testid="input-firstName"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Last Name</label>
                    <input
                      type="text"
                      value={signupForm.lastName}
                      onChange={e => setSignupForm(f => ({ ...f, lastName: e.target.value }))}
                      placeholder="Khan"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 bg-gray-50"
                      data-testid="input-lastName"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Username <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={signupForm.username}
                    onChange={e => setSignupForm(f => ({ ...f, username: e.target.value }))}
                    placeholder="aisha_khan"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 bg-gray-50"
                    data-testid="input-signup-username"
                  />
                  {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Email <span className="text-gray-400">(optional)</span></label>
                  <input
                    type="email"
                    value={signupForm.email}
                    onChange={e => setSignupForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="aisha@example.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 bg-gray-50"
                    data-testid="input-signup-email"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Password <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={signupForm.password}
                      onChange={e => setSignupForm(f => ({ ...f, password: e.target.value }))}
                      placeholder="At least 6 characters"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 bg-gray-50 pr-10"
                      data-testid="input-signup-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Confirm Password <span className="text-red-400">*</span></label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={signupForm.confirm}
                    onChange={e => setSignupForm(f => ({ ...f, confirm: e.target.value }))}
                    placeholder="••••••••"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 bg-gray-50"
                    data-testid="input-signup-confirm"
                  />
                  {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm}</p>}
                </div>
                {errors.signup && <p className="text-red-500 text-xs">{errors.signup}</p>}
                <button
                  onClick={handleSignup}
                  disabled={signupMutation.isPending}
                  className="w-full py-3 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 mt-2"
                  data-testid="button-signup"
                >
                  {signupMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
                </button>
                <p className="text-center text-xs text-gray-400 pt-1">
                  Already have an account?{" "}
                  <button onClick={() => setTab("login")} className="text-gray-700 underline">Sign in</button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
