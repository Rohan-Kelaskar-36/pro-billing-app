import { ChevronLast, ChevronFirst, LogOut } from "lucide-react";
import React, { useContext, createContext, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const SidebarContext = createContext();

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("admin_token");
    navigate("/"); 
  };

  return (
    <aside className="h-screen">
      <nav
        className={`${
          expanded ? "w-72 p-5" : "w-20 p-4"
        } bg-teal-950 border-r shadow-sm h-full flex flex-col justify-between`}
      >
        <div>
          {/* Top Section */}
          <div className="p-4 pb-2 flex justify-between items-center">
            <span
              className={`overflow-hidden transition-all text-white ${
                expanded ? "w-32" : "w-0"
              }`}
            >
              Admin Panel
            </span>
            <button
              onClick={() => setExpanded((curr) => !curr)}
              className="p-1.5 rounded-lg bg-teal-900 hover:bg-cyan-100 hover:text-black text-white cursor-pointer"
            >
              {expanded ? <ChevronFirst /> : <ChevronLast />}
            </button>
          </div>

          <SidebarContext.Provider value={{ expanded }}>
            <ul className="flex-1 px-3">{children}</ul>
          </SidebarContext.Provider>
        </div>

        {/* Logout Section */}
        <div className="border-t mt-4 pt-4 px-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-white hover:text-red-500 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            {expanded && (
              <div className="text-left leading-tight">
                <div className="text-sm font-medium">Logout</div>
                <div className="text-xs text-gray-400">Admin</div>
              </div>
            )}
          </button>
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
      className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${active
          ? "bg-gradient-to-tr from-green-200 to-green-100 text-amber-400"
          : "hover:bg-lime-100 hover:text-black text-white"}
      `}
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
          className={`
            absolute left-full rounded-md px-2 py-1 ml-6
            bg-emerald-900 text-amber-400 text-sm
            invisible opacity-20 -translate-x-3 transition-all
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
        `}
        >
          {text}
        </div>
      )}
    </li>
  );
}
