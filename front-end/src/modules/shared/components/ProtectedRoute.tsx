import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // If not logged in, redirect to login
  if (!token || !userId) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, show the protected page
  return <>{children}</>;
};

export default ProtectedRoute;