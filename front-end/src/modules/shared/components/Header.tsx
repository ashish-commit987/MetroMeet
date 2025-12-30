import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    
    setIsLoggedIn(!!(token && userId));
  }, [location.pathname]); // Re-check on route change

  const handleLogout = () => {
    // Clear all localStorage
    localStorage.clear();
    
    console.log("✅ User logged out");
    
    // Update state
    setIsLoggedIn(false);
    
    // Redirect to login
    navigate("/login", { replace: true });
  };

  return (
    <div style={{ padding: "10px", background: "#f0f0f0", marginBottom: "20px" }}>
      <Link to="/">Home</Link>
      &nbsp;
      
      {!isLoggedIn ? (
        <>
          <Link to="/login">Login</Link>
          &nbsp;
          <Link to="/register">Register</Link>
          &nbsp;
        </>
      ) : (
        <>
          <button 
            onClick={handleLogout}
            style={{
              background: "#dc2626",
              color: "white",
              border: "none",
              padding: "5px 15px",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
          &nbsp;
        </>
      )}
      
      {localStorage.token && localStorage.role === 'admin' && (
        <Link to="/search-paths">Search Path</Link>
      )}
    </div>
  );
};

export default Header;