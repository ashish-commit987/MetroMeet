import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
// ✅ STEP 1: Import the toast hook and container
import { useToast, ToastContainer } from "@/modules/shared/components/Toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // ✅ STEP 2: Initialize the toast hook
  const { toasts, addToast, removeToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ STEP 3: Replace alert() with addToast()
    if (!email || !password) {
      addToast("Please fill all fields", "error"); // ← Instead of alert()
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/user/login`, {
        email,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("userName", response.data.name);
        
        // ✅ Show success toast
        addToast(response.data.message, "success");
        
        // Navigate after showing success message
        setTimeout(() => {
          navigate("/find-rides");
        }, 1000);
      } else {
        // ✅ Show error toast
        addToast(response.data.message || "Login failed", "error");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      // ✅ Show error toast
      addToast(error.response?.data?.message || "Login failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ✅ STEP 4: Add ToastContainer at the top of your JSX */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
          <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>
        </div>

        {/* Login Card */}
        <div className="relative z-10 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md bg-white/80 backdrop-blur-lg shadow-2xl border border-white/20">
            <CardHeader className="text-center pb-4">
              <div className="relative z-10 pt-4 text-center">
                <div 
                  className="inline-flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => navigate("/")}
                >
                  <img src={logo} alt="MetroMeet Logo" className="h-12 w-auto" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-gray-800">
                Welcome Back!
              </CardTitle>
              <p className="text-gray-600 mt-2">Login to find your metro mates</p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleLogin} className="space-y-5">
                {/* Email Field */}
                <div>
                  <label className="flex items-center gap-2 mb-2 font-semibold text-gray-700">
                    <Mail className="w-4 h-4 text-blue-600" />
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50"
                      required
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="flex items-center gap-2 mb-2 font-semibold text-gray-700">
                    <Lock className="w-4 h-4 text-purple-600" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 pl-11 pr-11 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/50"
                      required
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Forgot Password */}
                <div className="text-right">
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-6 rounded-xl text-lg font-semibold hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span>Logging in...</span>
                  ) : (
                    <>
                      <span>Login</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>

                {/* Register Link */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-gray-600">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/register")}
                      className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                    >
                      Register here
                    </button>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Text */}
        <div className="relative z-10 text-center pb-8">
          <p className="text-gray-600 text-sm">
            By logging in, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Terms & Conditions
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;