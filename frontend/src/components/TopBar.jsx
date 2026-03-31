import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaInstagram } from 'react-icons/fa';

const TopBar = () => {
  return (
    <div className="bg-primary-green text-white py-2 text-sm animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0">
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          <span className="flex items-center gap-2"><FaPhoneAlt /> +1 (806) 429 1952</span>
          <span className="flex items-center gap-2"><FaEnvelope /> admin@mlxdirect.com</span>
          <span className="flex items-center gap-2"><FaMapMarkerAlt /> Fort Lauderdale, Florida, United States</span>
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:opacity-80 transition-opacity"><FaFacebookF /></a>
          <a href="#" className="hover:opacity-80 transition-opacity"><FaInstagram /></a>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
