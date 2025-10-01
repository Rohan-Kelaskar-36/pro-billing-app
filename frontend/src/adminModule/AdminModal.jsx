import { MdAlternateEmail } from "react-icons/md";
import { FaFingerprint, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import React, { useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminModal = ({ isOpen }) => {
  const modalRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const togglePasswordView = () => setShowPassword(!showPassword);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "https://groovy-backend-km9g.onrender.com/api/admin/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("Login successful! Redirecting...", {
          onClose: () => {
            window.location.href = "/admin";
          },
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    window.location.href = "/";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div
        ref={modalRef}
        className="w-[90%] max-w-sm md:max-w-md lg:max-w-md h-auto p-5 bg-teal-950 flex flex-col items-center gap-3 rounded-xl shadow-slate-500 shadow-lg justify-center"
      >
        <h1 className="text-lg md:text-xl font-semibold text-white">Welcome Back</h1>
        <h1 className="text-lg md:text-xl font-semibold text-white">Admin</h1>

        <div className="w-80 flex flex-col gap-3">
          <div className="w-full h-10 flex items-center gap-2 bg-teal-800 p-2 rounded-xl">
            <MdAlternateEmail />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent text-white border-0 w-full outline-none text-sm md:text-base"
            />
          </div>

          <div className="w-full h-10 flex items-center gap-2 bg-teal-800 p-2 rounded-xl relative">
            <FaFingerprint />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent text-white border-0 w-full outline-none text-sm md:text-base"
            />
            {showPassword ? (
              <FaRegEyeSlash
                className="absolute right-5 cursor-pointer"
                onClick={togglePasswordView}
              />
            ) : (
              <FaRegEye
                className="absolute right-5 cursor-pointer"
                onClick={togglePasswordView}
              />
            )}
          </div>

          
        </div>

        <div className="flex justify-between gap-3 mt-4 w-full text-white h-12">
          <button
            className="flex-1 p-2 bg-cyan-900 rounded-xl hover:bg-cyan-950 text-sm md:text-base cursor-pointer"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <button
            className="flex-1 p-2 bg-cyan-900 rounded-xl hover:bg-cyan-950 text-sm md:text-base cursor-pointer"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminModal;
