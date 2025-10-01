// AdminProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

// Ensure axios sends cookies for all calls (one-time setup)
axios.defaults.withCredentials = true;

const AdminProtectedRoute = ({ children }) => {
  const [status, setStatus] = useState("loading"); // loading | auth | unauth

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const res = await axios.get(
          "https://groovy-backend-km9g.onrender.com/api/admin/check-auth"
        );
        if (!mounted) return;
        if (res?.data?.authenticated) {
          setStatus("auth");
        } else {
          setStatus("unauth");
          toast.error("Please login as admin");
        }
      } catch (err) {
        if (!mounted) return;
        setStatus("unauth");
        toast.error("Please login as admin");
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []);

  if (status === "loading") {
    // small spinner / placeholder while verifying
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Checking authentication...</div>
      </div>
    );
  }

  if (status === "unauth") {
    return <Navigate to="/" replace />;
  }

  // authenticated
  return children;
};

export default AdminProtectedRoute;
