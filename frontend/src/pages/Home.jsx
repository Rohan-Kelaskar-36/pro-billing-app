import React from 'react';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { ShoppingCart, FileText, Users } from 'lucide-react';
import Navbar from '../components/Navbar';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-pink-50 to-orange-50 text-gray-900 font-sans">
         <Navbar/>

      {/* Hero Section */}
      <section className="text-center py-24 bg-gradient-to-r from-pink-100 to-orange-100 shadow-inner">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-wide drop-shadow-md">
            Smarter Billing Starts Here
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-10">
            ProBills empowers fashion retailers to manage POS, billing & customer data effortlessly — all in one elegant dashboard.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-14 text-gray-800">
            Designed for Fashion Retail
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white hover:shadow-xl transition-shadow p-8 rounded-2xl shadow-md text-center border border-gray-100">
              <div className="flex justify-center mb-4 text-orange-500">
                <ShoppingCart size={40} />
              </div>
              <h4 className="text-xl font-semibold mb-3">POS System</h4>
              <p className="text-gray-600 text-sm">Quick & stylish point-of-sale system optimized for boutiques and outlets.</p>
            </div>
            <div className="bg-white hover:shadow-xl transition-shadow p-8 rounded-2xl shadow-md text-center border border-gray-100">
              <div className="flex justify-center mb-4 text-pink-500">
                <FileText size={40} />
              </div>
              <h4 className="text-xl font-semibold mb-3">Billing Reports</h4>
              <p className="text-gray-600 text-sm">Generate elegant invoices, track finances, and view daily to monthly sales reports.</p>
            </div>
            <div className="bg-white hover:shadow-xl transition-shadow p-8 rounded-2xl shadow-md text-center border border-gray-100">
              <div className="flex justify-center mb-4 text-purple-500">
                <Users size={40} />
              </div>
              <h4 className="text-xl font-semibold mb-3">Customer Management</h4>
              <p className="text-gray-600 text-sm">Build loyalty by tracking purchases, preferences, and contact history.</p>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;
