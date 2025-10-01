import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import AdminModal from "../adminModule/AdminModal";
import CashierModal from "../cashierModule/CashierModal";
import StoreManagerModal from "../storeManagerModule/StoreManagerModal";
import './Navbar.css';

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Modal control states
  const [showAdmin, setShowAdmin] = useState(false);
  const [showStoreManager, setShowStoreManager] = useState(false);
  const [showCashier, setShowCashier] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="flex justify-between items-center px-6 py-3 bg-teal-950 sticky top-0 z-50 w-full">
        <Link to="/" className="text-2xl font-bold">
          <span className="text-orange-300">Pro</span>
          <span className="text-white">Bills</span>
        </Link>

        <ul className="flex gap-6 items-center text-white">
          <li>
            <NavLink to="/" className="hover:text-orange-300 transition">Home</NavLink>
          </li>
          <li>
            <NavLink to="/about" className="hover:text-orange-300 transition">About Us</NavLink>
          </li>
          <li className="relative" ref={dropdownRef}>
            <button 
              onClick={toggleDropdown} 
              className="py-2 px-4 bg-orange-500 rounded hover:bg-orange-600 transition cursor-pointer"
            >
              Login
            </button>

            {dropdownOpen && (
              <div className="dropDown absolute right-0 top-full mt-2 bg-white text-gray-800 w-48 shadow-lg rounded-md z-10">
                <ul>
                  <li>
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setShowAdmin(true);
                        setDropdownOpen(false);
                      }}
                    >
                      Admin Login
                    </button>
                  </li>
                  <li>
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setShowStoreManager(true);
                        setDropdownOpen(false);
                      }}
                    >
                      Manager Login
                    </button>
                  </li>
                  <li>
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setShowCashier(true);
                        setDropdownOpen(false);
                      }}
                    >
                      Cashier Login
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </li>
        </ul>
      </nav>
{/* Modals */}
      <AdminModal isOpen={showAdmin}/>
      <StoreManagerModal isOpen={showStoreManager} />

      {/* Modals */}
      <AdminModal isOpen={showAdmin} closeModal={() => setShowAdmin(false)} />
      <StoreManagerModal isOpen={showStoreManager} closeModal={() => setShowStoreManager(false)} />
      <CashierModal isOpen={showCashier} closeModal={() => setShowCashier(false)} />
    </>
  );
}

export default Navbar;
