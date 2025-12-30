import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "@/config/axios.config";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, CheckCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { useToast, ToastContainer } from "@/modules/shared/components/Toast";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !name) {
      addToast("Please fill all fields", "error");
      return;
    }

    if (password.length < 6) {
      addToast("Password must be at least 6 characters", "error");
      return;
    }

    if (name.trim().length < 3) {
      addToast("Name must be at least 3 characters", "error");
      return;
    }

    setLoading(true);

    try {
      // ✅ FIX: Use apiClient instead of axios
      console.log("🔥 Sending OTP request...");
      
      const otpResponse = await apiClient.post('/api/v1/otp/send', {
        email,
      });

      console.log("✅ OTP response:", otpResponse.data);

      if (otpResponse.data.message) {
        addToast(otpResponse.data.message, "success");
        
        setTimeout(() => {
          navigate("/OTPvalidation", {
            state: { 
              email: email.trim(), 
              password, 
              name: name.trim() 
            },
            replace: true
          });
        }, 1000);
      }
    } catch (error: any) {
      console.error("❌ Registration error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Error code:", error.code);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || "Registration failed. Please try again.";
        
        if (error.response.status === 429) {
          addToast(errorMessage, "warning");
        } else if (error.response.status === 409) {
          addToast("Email already registered. Please login instead.", "error");
          setTimeout(() => navigate("/login"), 2000);
        } else {
          addToast(errorMessage, "error");
        }
      } else if (error.request) {
        // Request made but no response (timeout, network error)
        console.error("No response received. Possible timeout or network issue.");
        addToast("Server timeout. Please try again or check your email for OTP.", "warning");
      } else if (error.code === 'ECONNABORTED') {
        addToast("Request timeout. Please check your email for OTP.", "warning");
      } else {
        addToast("Connection error. Please check your internet and try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
          <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center px-4 py-8">
          <Card className="w-full max-w-md bg-white/80 backdrop-blur-lg shadow-2xl border border-white/20">
            <CardHeader className="text-center pb-4">
              <div className="relative z-10 pt-4 text-center">
                <div 
                  className=" inline-flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => navigate("/")}
                >
                  <img src={logo} alt="MetroMeet Logo" className="h-12 w-auto" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-gray-800">
                Create Account
              </CardTitle>
              <p className="text-gray-600 mt-2">Join the MetroMeet community</p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleRegister} className="space-y-5">
                <div>
                  <label className="flex items-center gap-2 mb-2 font-semibold text-gray-700">
                    <User className="w-4 h-4 text-indigo-600" />
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/50"
                      required
                      minLength={3}
                    />
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

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
                      placeholder="Create a strong password"
                      className="w-full px-4 py-3 pl-11 pr-11 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/50"
                      required
                      minLength={6}
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
                  <p className="text-xs text-gray-500 mt-1">
                    Must be at least 6 characters
                  </p>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 space-y-2">
                  <p className="font-semibold text-gray-700 text-sm">
                    You'll get:
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Instant travel companion matches</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Safe and verified community</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Make your commute social</span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-6 rounded-xl text-lg font-semibold hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span>Creating Account...</span>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>

                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-gray-600">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                    >
                      Login here
                    </button>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="relative z-10 text-center pb-8">
          <p className="text-gray-600 text-sm">
            By registering, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Terms & Conditions
            </a>
            {" "}and{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;