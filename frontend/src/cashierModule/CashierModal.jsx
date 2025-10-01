import { MdAlternateEmail } from "react-icons/md";
import { FaFingerprint, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import React, { useState, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CashierModal = ({ isOpen }) => {
  const modalRef = useRef(null);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const togglePasswordView = () => setShowPassword(!showPassword);

  const handleLogin = async () => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/cashier/login`,
        { email, password },
        { withCredentials: true }
      );

      Cookies.set("cashier_storeId", data.cashier_storeId, { expires: 1 });
      Cookies.set("role", data.role || "cashier", { expires: 1 });

    toast.success("Login successful");

setTimeout(() => {
  navigate("/cashier");
}, 1000); // Wait for toast to complete (matches autoClose)

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const handleClose = () => {
    window.location.href = "/";
  };

  if (!isOpen) return null;

  return (
    // Backdrop overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div
        ref={modalRef}
        className="w-[90%] max-w-sm md:max-w-md lg:max-w-md p-5 bg-teal-950 flex flex-col items-center gap-3 rounded-xl shadow-slate-500 shadow-lg justify-center"
      >
        <h1 className="mt-2 text-lg md:text-xl font-semibold text-white text-center">
          Welcome Back to the Cash Counter!
        </h1>

        <div className="w-80 flex flex-col gap-3">
          {/* Email input */}
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

          {/* Password input */}
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

        {/* Error message */}
        {error && (
          <p className="text-red-400 text-sm mt-2 text-center">{error}</p>
        )}

        {/* Buttons */}
        <div className="flex justify-between gap-5 mt-3 w-full text-white">
          <button
            onClick={handleLogin}
            className="flex-1 p-2 bg-cyan-900 rounded-xl hover:bg-cyan-950 text-sm md:text-base cursor-pointer"
          >
            Login
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

export default CashierModal;
