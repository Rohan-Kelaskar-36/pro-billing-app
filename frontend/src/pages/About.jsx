import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

function About() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
         <Navbar/>

      {/* Header */}
      <section className="bg-orange-100 py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-orange-600 mb-4">About ProBills</h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Empowering small businesses with smart, simple, and seamless billing solutions.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-6 md:flex items-center gap-10">
          <div className="md:w-1/3 mb-10 md:mb-0">
            <img
              src="/images/about.svg"
              alt="Our Story"
              className="w-full rounded-lg shadow-md"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-5xl font-semibold mb-4">Our Story</h2>
            <p className="text-gray-700  mb-4">
              ProBills was founded with a mission to bring modern billing, POS, and customer
              management tools to small businesses and growing shops. We noticed how many businesses
              struggled with outdated systems, and we built ProBills to be the intuitive, fast,
              and affordable alternative.
            </p>
            <p className="text-gray-700">
              Today, we're proud to help hundreds of businesses streamline their operations and grow
              confidently with powerful, user-friendly software.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
              <h4 className="text-xl font-bold text-orange-500 mb-2">Simplicity</h4>
              <p className="text-gray-600">We believe software should be easy to use, even for non-tech users.</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
              <h4 className="text-xl font-bold text-orange-500 mb-2">Reliability</h4>
              <p className="text-gray-600">Our platform is built to handle your business with speed and stability.</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
              <h4 className="text-xl font-bold text-orange-500 mb-2">Support</h4>
              <p className="text-gray-600">We’re here when you need us – real humans, ready to help.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-orange-500 text-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">Want to join our journey?</h2>
          <p className="mb-6">Start managing your business better with ProBills today.</p>
          <Link to="/">
          <button className="bg-white text-orange-500 px-6 py-3 rounded-full font-semibold hover:bg-gray-100">
            Get Started
          </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
     <Footer/>
    </div>
  );
}

export default About;
