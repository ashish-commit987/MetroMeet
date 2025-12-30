// AppRoutes.tsx
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "../../user/pages/Login";
import Register from "../../user/pages/Register";
import Home from "../../Data/pages/Home";  // ✅ New Landing Page
import FindRides from "../../Data/pages/FindRides";  // ✅ Old Home.tsx renamed
import NotFound from "../../Data/pages/NotFound";

import OTPvalidation from "@/modules/user/pages/OTPvalidation";
import Matches from "@/modules/Data/pages/Matches";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Landing Page - NEW */}
      <Route path="/" element={<Home />} />
      
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/OTPvalidation" element={<OTPvalidation />} />

      {/* Protected routes */}
      <Route
        path="/find-rides"
        element={
          <ProtectedRoute>
            <FindRides />  {/* ✅ Your old Home.tsx with form */}
          </ProtectedRoute>
        }
      />

      

      <Route
        path="/matches"
        element={
          <ProtectedRoute>
            <Matches />
          </ProtectedRoute>
        }
      />

      {/* 404 - Not Found */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;