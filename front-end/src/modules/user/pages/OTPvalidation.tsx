import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ArrowRight, RotateCw, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast, ToastContainer } from "@/modules/shared/components/Toast";
import logo from "@/assets/logo.png";
const OTPValidation = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(60);
  const [resendCount, setResendCount] = useState(0);
  const [hourlyLockout, setHourlyLockout] = useState(false);
  const [lockoutEndTime, setLockoutEndTime] = useState<number | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { toasts, addToast, removeToast } = useToast();

  const { email, password, name } = location.state || {};

  // ✅ PROTECTION: Redirect if no registration data
  useEffect(() => {
    if (!email || !password || !name) {
      addToast("Invalid access. Please register first.", "error");
      navigate("/register", { replace: true });
    }
  }, [email, password, name, navigate, addToast]);

  // ✅ Load rate limit data from localStorage on mount
  useEffect(() => {
    const storedData = localStorage.getItem(`otp_limit_${email}`);
    if (storedData) {
      const { count, lockoutEnd } = JSON.parse(storedData);
      const now = Date.now();
      
      if (lockoutEnd && now < lockoutEnd) {
        // Still in 1-hour lockout
        setHourlyLockout(true);
        setLockoutEndTime(lockoutEnd);
        setResendCount(count);
      } else if (lockoutEnd && now >= lockoutEnd) {
        // Lockout expired, reset
        localStorage.removeItem(`otp_limit_${email}`);
        setResendCount(0);
        setHourlyLockout(false);
      } else {
        // No lockout, just restore count
        setResendCount(count);
      }
    }
  }, [email]);

  // ✅ Initial 60-second cooldown when page loads
  useEffect(() => {
    let timer: number;
    
    if (cooldownSeconds > 0) {
      timer = setInterval(() => {
        setCooldownSeconds(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, []);

  // ✅ Countdown for 1-hour lockout
  useEffect(() => {
    if (hourlyLockout && lockoutEndTime) {
      const timer = setInterval(() => {
        const now = Date.now();
        if (now >= lockoutEndTime) {
          // Lockout ended
          setHourlyLockout(false);
          setLockoutEndTime(null);
          setResendCount(0);
          localStorage.removeItem(`otp_limit_${email}`);
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [hourlyLockout, lockoutEndTime, email]);

  // Handle OTP input
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length; i++) {
      if (i < 6) {
        newOtp[i] = pastedData[i];
      }
    }
    setOtp(newOtp);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      addToast("Please enter complete OTP", "error");
      return;
    }

    if (!email || !password || !name) {
      addToast("Registration data missing. Please start again.", "error");
      navigate("/register");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/otp/verify`, {
        email,
        otp: otpCode,
        password,
        name,
      });

      if (response.data.success) {
        // ✅ Clear rate limit data on successful verification
        localStorage.removeItem(`otp_limit_${email}`);
        
        addToast(response.data.message, "success");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        addToast(response.data.message || "OTP verification failed", "error");
      }
    } catch (error: any) {
      console.error("OTP verification error:", error);
      addToast(error.response?.data?.message || "Invalid OTP. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      addToast("Email not found. Please register again.", "error");
      navigate("/register");
      return;
    }

    // ✅ Check if in hourly lockout
    if (hourlyLockout) {
      const remainingTime = lockoutEndTime ? Math.ceil((lockoutEndTime - Date.now()) / 60000) : 0;
      addToast(`Too many attempts. Try again in ${remainingTime} minutes.`, "error");
      return;
    }

    // ✅ Check 60-second cooldown
    if (!canResend) {
      addToast(`Please wait ${cooldownSeconds} seconds before resending.`, "warning");
      return;
    }

    setResending(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/otp/send`, {
        email,
      });

      addToast(response.data.message || "OTP resent successfully", "success");
      setOtp(["", "", "", "", "", ""]);
      document.getElementById("otp-0")?.focus();

      // ✅ Update resend count
      const newCount = resendCount + 1;
      setResendCount(newCount);

      // ✅ Check if reached 5 attempts
      if (newCount >= 5) {
        const lockoutEnd = Date.now() + 60 * 60 * 1000; // 1 hour from now
        setHourlyLockout(true);
        setLockoutEndTime(lockoutEnd);
        
        // Store in localStorage
        localStorage.setItem(`otp_limit_${email}`, JSON.stringify({
          count: newCount,
          lockoutEnd
        }));

        addToast("Maximum attempts reached. Try again in 1 hour.", "error");
      } else {
        // Store current count
        localStorage.setItem(`otp_limit_${email}`, JSON.stringify({
          count: newCount,
          lockoutEnd: null
        }));
      }

      // ✅ Reset 60-second cooldown
      setCanResend(false);
      setCooldownSeconds(60);

    } catch (error: any) {
      console.error("Resend OTP error:", error);
      addToast(error.response?.data?.message || "Failed to resend OTP", "error");
    } finally {
      setResending(false);
    }
  };

  // ✅ Format remaining lockout time
  const getRemainingLockoutTime = () => {
    if (!lockoutEndTime) return "";
    const remaining = Math.ceil((lockoutEndTime - Date.now()) / 60000);
    return `${remaining} minute${remaining !== 1 ? 's' : ''}`;
  };

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
          <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>
        </div>

        {/* Logo/Header */}
        {/* <div className="relative z-10 pt-8 text-center">
        <div 
          className="inline-flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="MetroMeet Logo" className="h-12 w-auto" />
        </div>
      </div> */}

        {/* OTP Card */}
        <div className="relative z-10 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md bg-white/80 backdrop-blur-lg shadow-2xl border border-white/20">
            <CardHeader className="text-center pb-4">
              {/* <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <Shield className="w-8 h-8 text-white" />
              </div> */}
              <div className="relative z-10 pt-4 text-center">
        <div 
          className="inline-flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="MetroMeet Logo" className="h-12 w-auto" />
        </div>
      </div>

              <CardTitle className="text-3xl font-bold text-gray-800">
                Verify Your Email
              </CardTitle>
              <p className="text-gray-600 mt-2">
                We've sent a 6-digit code to
              </p>
              <p className="text-blue-600 font-semibold">{email}</p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                {/* OTP Input */}
                <div>
                  <label className="block text-center mb-4 font-semibold text-gray-700">
                    Enter OTP
                  </label>
                  <div className="flex gap-2 justify-center">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={index === 0 ? handlePaste : undefined}
                        className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                        required
                      />
                    ))}
                  </div>
                </div>

                {/* Info Text */}
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-600">
                    📧 Check your email inbox (and spam folder)
                  </p>
                </div>

                {/* Verify Button */}
                <Button
                  type="submit"
                  disabled={loading || otp.join("").length !== 6}
                  className="w-full bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white py-6 rounded-xl text-lg font-semibold hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span>Verifying...</span>
                  ) : (
                    <>
                      <span>Verify & Continue</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>

                {/* ✅ Rate Limit Status */}
                <div className="text-center pt-2">
                  {resendCount > 0 && !hourlyLockout && (
                    <p className="text-sm text-gray-500">
                      Attempts: {resendCount}/5
                    </p>
                  )}
                  {hourlyLockout && (
                    <div className="bg-red-50 rounded-lg p-3">
                      <p className="text-sm text-red-600 font-semibold">
                        ⏰ Too many attempts. Try again in {getRemainingLockoutTime()}
                      </p>
                    </div>
                  )}
                </div>

                {/* Resend OTP */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-gray-600 mb-2">Didn't receive the code?</p>
                  
                  {hourlyLockout ? (
                    <div className="flex items-center justify-center gap-2 text-red-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Wait {getRemainingLockoutTime()}
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resending || !canResend}
                      className="text-blue-600 hover:text-blue-700 font-semibold transition-colors inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <RotateCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
                      {resending ? "Resending..." : canResend ? "Resend OTP" : `Wait ${cooldownSeconds}s`}
                    </button>
                  )}
                </div>

                {/* Back to Register */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="text-gray-600 hover:text-gray-800 text-sm transition-colors"
                  >
                    ← Back to Registration
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Security Note */}
        <div className="relative z-10 text-center pb-8">
          <p className="text-gray-600 text-sm max-w-md mx-auto px-4">
            🔒 Your data is secure. We'll never share your information with third parties.
          </p>
        </div>
      </div>
    </>
  );
};

export default OTPValidation;