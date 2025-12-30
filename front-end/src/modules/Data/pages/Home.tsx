import { useState, useEffect } from "react";
import { Users, Shield, Zap, ArrowRight, Menu, X, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";

const Home = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!(token && userId));
  }, []);

  const handleGetStarted = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/find-rides");
    } else {
      navigate("/register");
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/");
    // Optionally reload to reset state
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <div
              className="flex items-center cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img src={logo} alt="MetroMeet Logo" className="h-12 w-auto" />
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#how-it-works"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                How it works
              </a>

              <a
                href="#features"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Features
              </a>

              <a
                href="#about"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                About
              </a>

              {/* Conditional Login/Logout Button */}
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-700 hover:text-red-600 font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              ) : (
                <button
                  onClick={handleLogin}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Login
                </button>
              )}

              <button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all transform hover:scale-105"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-4">
              <a
                href="#how-it-works"
                className="block text-gray-700 hover:text-blue-600 font-medium"
              >
                How it works
              </a>

              <a
                href="#features"
                className="block text-gray-700 hover:text-blue-600 font-medium"
              >
                Features
              </a>

              <a
                href="#about"
                className="block text-gray-700 hover:text-blue-600 font-medium"
              >
                About
              </a>

              {/* Conditional Login/Logout Button for Mobile */}
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-left text-gray-700 hover:text-red-600 font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              ) : (
                <button
                  onClick={handleLogin}
                  className="block w-full text-left text-gray-700 hover:text-blue-600 font-medium"
                >
                  Login
                </button>
              )}

              <button
                onClick={handleGetStarted}
                className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-semibold"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Your Pick of Travel Companions
              </span>
              <br />
              <span className="text-gray-800">At Every Station</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Connect with fellow metro travelers. Make your daily commute cheaper, and social!
            </p>

            <button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all transform hover:scale-105 inline-flex items-center gap-2"
            >
              Start Finding Travel Mates
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Why choose MetroMeet?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Safe, convenient, and social travel experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Find Travel Companions</h3>
              <p className="text-gray-600">
                Connect with verified travelers going your way. Never travel alone again.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Safe & Verified</h3>
              <p className="text-gray-600">
                All users are verified. Travel with peace of mind.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Instant Matching</h3>
              <p className="text-gray-600">
                Smart algorithm finds the best travel matches instantly.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-4">

          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              How it works
            </h2>
            <p className="text-xl text-gray-600">Get started in 3 simple steps</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Step 1 */}
              <div className="text-center">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Enter Your Journey</h3>
                <p className="text-gray-600">Select your source, destination, date and time</p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Find Matches</h3>
                <p className="text-gray-600">Get instant matches with travelers</p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Travel Cheaply</h3>
                <p className="text-gray-600">Connect and swap tickets and enjoy a cheaper commute</p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        <div className="container mx-auto px-4 text-center">

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to start your journey?
          </h2>

          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of metro travelers improving their commute
          </p>

          <button
            onClick={handleGetStarted}
            className="bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all transform hover:scale-105 inline-flex items-center gap-2"
          >
            Find Your Metro Mate
            <ArrowRight className="w-5 h-5" />
          </button>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

            <div>
              <img src={logo} alt="MetroMeet" className="h-10 w-auto mb-4" />
              <p className="text-gray-400">
                Making metro travel safer and more social
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How it works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="https://github.com/ash172839" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="https://github.com/ash172839" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>

          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 MetroMeet. All rights reserved.</p>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default Home;
