import { MdAlternateEmail } from "react-icons/md";
import { FaFingerprint, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const StoreManagerModal = ({ isOpen, closeModal }) => {
  const modalRef = useRef(null);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const togglePasswordView = () => setShowPassword(!showPassword);

 const handleLogin = async () => {
  try {
    const { data } = await axios.post("https://groovy-backend-km9g.onrender.com/api/auth/manager/login", {
      email,
      password,
    });

    Cookies.set("manager_token", data.token, { expires: 1 });
    Cookies.set("storeId", data.storeId, { expires: 1 });
    Cookies.set("role", data.role || "manager", { expires: 1 });

    toast.success("Login successful!");

    // Wait for toast to finish (e.g. 3 seconds)
    setTimeout(() => {
      closeModal();
      navigate("/manager");
    }, 1000); // match ToastContainer autoClose
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Login failed");
  }
};


  const handleClose = () => {
    window.location.href = "/";
  };

  if (!isOpen) return null;

  return (
    // ✅ Backdrop with z-index
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div
        ref={modalRef}
        className="w-[90%] max-w-sm md:max-w-md p-5 bg-teal-950 flex-col flex items-center gap-3 rounded-xl shadow-slate-500 shadow-lg justify-center"
      >
        <h1 className="text-lg md:text-xl font-semibold text-white mt-3 text-center">
          Welcome to the
        </h1>
        <span className="text-white text-xl font-bold">Store</span>

        <div className="w-80 flex flex-col gap-3">
          {/* Email Field */}
          <div className="w-full h-10 flex items-center gap-2 bg-teal-800 p-2 rounded-xl">
            <MdAlternateEmail />
            <input
              type="email"
              placeholder="Email address"
              className="bg-transparent text-white border-0 w-full outline-none text-sm md:text-base"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Field */}
          <div className="w-full h-10 flex items-center gap-2 bg-teal-800 p-2 rounded-xl relative">
            <FaFingerprint />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="bg-transparent text-white border-0 w-full outline-none text-sm md:text-base"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

        {/* Error Message */}
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        {/* Action Buttons */}
        <div className="flex justify-between gap-3 w-full text-white mt-3">
          <button
            className="flex-1 p-2 rounded-xl bg-cyan-900 hover:bg-cyan-950 text-sm md:text-base cursor-pointer"
            onClick={handleLogin}
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

export default StoreManagerModal;
