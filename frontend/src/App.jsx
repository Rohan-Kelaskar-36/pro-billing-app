import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Header from "./components/Header"
import About from './pages/About'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import axios from "axios";
import AdminHome from './adminModule/AdminHome'
import StoreManagerHome from './storeManagerModule/StoreManagerHome'
import CashierHome from './cashierModule/CashierHome'
import ProtectedRoute from './pages/ProtectedRoute'
import AdminProtectedRoute from './pages/AdminProtectedRoute'
import AdminModal from './adminModule/AdminModal'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';






function App() {
  return (
  
      <div>
      {/* ✅ Global Toast container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
      <Routes>
      <Route path="/" element={<Home/>}/>
            <Route path="/about" element={<About/>}/>
            <Route path='/admin-login' element={<AdminModal/>}/>
            <Route path="/admin" element={<AdminProtectedRoute><AdminHome/> </AdminProtectedRoute> }/>
                        <Route path="/manager" element={<ProtectedRoute allowedRoles={["Manager"]}><StoreManagerHome/></ProtectedRoute>}/>
                        <Route path="/cashier" element={<ProtectedRoute allowedRoles={["Cashier"]}><CashierHome/></ProtectedRoute>}/>


      </Routes>
    </div>
  )
}

export default App
