import React, {
  useContext,
  createContext,
  useEffect,
  useState,
  useRef,
} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  ChevronLast,
  ChevronFirst,
  MoreVertical,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const SidebarContext = createContext();

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(true);
  const [managerInfo, setManagerInfo] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchManagerProfile = async () => {
      try {
        const res = await axios.get(
          "https://groovy-backend-km9g.onrender.com/api/auth/manager/profile",
          { withCredentials: true }
        );
        setManagerInfo({
          name: res.data.name,
          email: res.data.email,
        });
      } catch (err) {
        console.error("Failed to fetch manager profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchManagerProfile();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    Cookies.remove("manager_token");
    Cookies.remove("storeId");
    Cookies.remove("role");
    navigate("/");
  };

  return (
    <aside className="h-screen flex flex-col">
      <nav
        className={`${
          expanded ? "w-72 p-5" : "w-20 p-4"
        } bg-teal-950 border-r shadow-sm h-full flex flex-col justify-between relative`}
      >
        {/* Header */}
        <div className="pb-2 flex justify-between items-center">
          <span
            className={`overflow-hidden transition-all text-white ${
              expanded ? "w-32" : "w-0"
            }`}
          >
            Manager Panel
          </span>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-teal-900 hover:bg-cyan-100 hover:text-black text-white cursor-pointer"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        {/* Sidebar items */}
        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        {/* Footer login details */}
        <div
          className="border-t flex items-center p-3 text-white relative"
          ref={dropdownRef}
        >
          {expanded ? (
            <>
              <div className="transition-all w-52 ml-3">
                <div className="leading-4">
                  <h4 className="font-semibold">
                    {loading ? "Loading..." : managerInfo.name || "Unknown"}
                  </h4>
                  <span className="text-xs text-gray-300">
                    {loading ? "" : managerInfo.email || "Not available"}
                  </span>
                </div>
              </div>
              <button onClick={() => setShowDropdown((prev) => !prev)}>
                <MoreVertical size={20} className="ml-auto text-white cursor-pointer" />
              </button>

              {showDropdown && (
                <div className="absolute bottom-12 right-4 bg-white rounded shadow-lg z-50 w-32">
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <button 
            onClick={handleLogout}
            className="mx-auto p-2 rounded hover:text-red-600 cursor-pointer">
              <LogOut size={20} />
            </button>
          )}
        </div>
      </nav>
    </aside>
  );
}

export function SidebarItem({ icon, text, active, alert, onClick }) {
  const { expanded } = useContext(SidebarContext);

  return (
    <li
      onClick={onClick}
      className={`relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer transition-colors group
        ${
          active
            ? "bg-gradient-to-tr from-green-200 to-green-100 text-amber-400"
            : "hover:bg-lime-100 hover:text-black text-white"
        }`}
    >
      <span className="w-6 h-6 flex items-center justify-center">{icon}</span>
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-green-100 ${
            expanded ? "" : "top-2"
          }`}
        />
      )}
      {!expanded && (
        <div
          className={`absolute left-full rounded-md px-2 py-1 ml-6
            bg-emerald-900 text-amber-400 text-sm invisible opacity-20
            -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
        >
          {text}
        </div>
      )}
    </li>
  );
}
