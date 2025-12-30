import { useNavigate, useLocation } from "react-router-dom";
import { Train, Home, LogIn, UserPlus, LogOut } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Don't show navbar on certain pages (they have their own headers)
  const hideNavbar = ["/login", "/register", "/OTPvalidation"].includes(location.pathname);
  
  if (hideNavbar) return null;

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-md z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate("/")}
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Train className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MetroMeet
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-3">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => navigate("/")}
                  className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 transition-all"
                >
                  <Home className="w-4 h-4" />
                  <span className="font-medium">Home</span>
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="font-medium">Login</span>
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-lg transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="font-medium">Register</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/")}
                  className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 transition-all"
                >
                  <Home className="w-4 h-4" />
                  <span className="font-medium">Home</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;