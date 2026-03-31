import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 py-0 animate-fade-in-down">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-24">
        <div className="logo flex-shrink-0 h-24 flex items-center pr-10">
          <img src="/logo.png" alt="MLX DIRECT Logo" className="h-16 w-auto object-contain max-w-[220px] transition-all duration-500 hover:scale-105" />
        </div>
        <ul className="hidden lg:flex gap-8 font-semibold text-gray-700">
          <li><a href="#" className="text-primary-green">Home</a></li>
          <li><a href="#" className="hover:text-primary-green transition-colors">About Us</a></li>
          <li><a href="#" className="hover:text-primary-green transition-colors">Art & Craft</a></li>
          <li><a href="#" className="hover:text-primary-green transition-colors">Constructions</a></li>
          <li><a href="#" className="hover:text-primary-green transition-colors">Land Development</a></li>
          <li><a href="#" className="hover:text-primary-green transition-colors">Contact Us</a></li>
        </ul>
        <div className="flex-shrink-0">
          <button className="bg-primary-green text-white px-6 py-3 rounded-full font-bold hover:bg-green-700 transition-all transform hover:-translate-y-0.5">
            Get A Quote
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
