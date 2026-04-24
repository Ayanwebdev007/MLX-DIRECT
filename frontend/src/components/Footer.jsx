import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#0a0a0a] text-white pt-24 pb-12 overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* Column 1: About Us */}
          <div className="flex flex-col">
            <h3 className="text-lg font-black uppercase tracking-widest mb-6 relative inline-block">
              About Us
              <div className="absolute -bottom-2 left-0 w-12 h-[2px] bg-primary-green"></div>
            </h3>
            <p className="text-gray-400 text-sm font-light leading-relaxed mb-10">
              Since our first day in business, MLX DIRECT has been offering our customers the best safety in the domain of radiology. MLX DIRECT conveys both knowledge and information for understanding technologies, that includes in the house designs for solid waste mangement. MLX DIRECT is just not the name, its a brand in the world of radiation safety services. We are the "one source" global technology enabled service provider in the ground of certification, testing measurements, inspection and verification.
            </p>
            
            {/* Social Suite */}
            <div className="flex gap-3">
              {[
                { icon: <FaFacebookF />, label: "Facebook" },
                { icon: <FaTwitter />, label: "Twitter" },
                { icon: <FaInstagram />, label: "Instagram" },
                { icon: <FaYoutube />, label: "YouTube" }
              ].map((social, idx) => (
                <a 
                  key={idx} 
                  href="#" 
                  aria-label={social.label}
                  className="w-10 h-10 bg-primary-green flex items-center justify-center text-white rounded-sm hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-primary-green/10"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col">
            <h3 className="text-lg font-black uppercase tracking-widest mb-6 relative inline-block">
              Quick Links
              <div className="absolute -bottom-2 left-0 w-12 h-[2px] bg-primary-green"></div>
            </h3>
            <ul className="space-y-4">
              <li><Link to="/" className="text-gray-400 hover:text-primary-green text-sm font-medium transition-colors duration-300 flex items-center gap-2 group"><div className="w-0 h-[1px] bg-primary-green group-hover:w-4 transition-all duration-300"></div>Home</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-primary-green text-sm font-medium transition-colors duration-300 flex items-center gap-2 group"><div className="w-0 h-[1px] bg-primary-green group-hover:w-4 transition-all duration-300"></div>About Us</Link></li>
              <li><Link to="/art-and-craft" className="text-gray-400 hover:text-primary-green text-sm font-medium transition-colors duration-300 flex items-center gap-2 group"><div className="w-0 h-[1px] bg-primary-green group-hover:w-4 transition-all duration-300"></div>Art & Craft</Link></li>
              <li><Link to="/constructions" className="text-gray-400 hover:text-primary-green text-sm font-medium transition-colors duration-300 flex items-center gap-2 group"><div className="w-0 h-[1px] bg-primary-green group-hover:w-4 transition-all duration-300"></div>Constructions</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-primary-green text-sm font-medium transition-colors duration-300 flex items-center gap-2 group"><div className="w-0 h-[1px] bg-primary-green group-hover:w-4 transition-all duration-300"></div>Services</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary-green text-sm font-medium transition-colors duration-300 flex items-center gap-2 group"><div className="w-0 h-[1px] bg-primary-green group-hover:w-4 transition-all duration-300"></div>Consultancy</a></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-primary-green text-sm font-medium transition-colors duration-300 flex items-center gap-2 group"><div className="w-0 h-[1px] bg-primary-green group-hover:w-4 transition-all duration-300"></div>Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="flex flex-col">
            <h3 className="text-lg font-black uppercase tracking-widest mb-6 relative inline-block">
              Services
              <div className="absolute -bottom-2 left-0 w-12 h-[2px] bg-primary-green"></div>
            </h3>
            <ul className="space-y-4">
              {['Trading', 'Industrial Radiography', 'Consulting'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-400 hover:text-primary-green text-sm font-medium transition-colors duration-300 flex items-center gap-2 group">
                    <div className="w-0 h-[1px] bg-primary-green group-hover:w-4 transition-all duration-300"></div>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div className="flex flex-col">
            <h3 className="text-lg font-black uppercase tracking-widest mb-6 relative inline-block">
              Contact Us
              <div className="absolute -bottom-2 left-0 w-12 h-[2px] bg-primary-green"></div>
            </h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <FaPhoneAlt className="text-primary-green mt-1" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white">+1 (806) 429 1952</span>
                </div>
              </li>
              <li className="flex flex-col items-start gap-4">
                <div className="flex items-start gap-4">
                  <FaEnvelope className="text-primary-green mt-1" />
                  <span className="text-sm font-medium text-gray-400 hover:text-primary-green cursor-pointer transition-colors tracking-tight">admin@mlxdirect.com</span>
                </div>
                <div className="flex items-start gap-4">
                  <FaEnvelope className="text-primary-green mt-1" />
                  <span className="text-sm font-medium text-gray-400 hover:text-primary-green cursor-pointer transition-colors tracking-tight">info@mlxdirect.com</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <FaMapMarkerAlt className="text-primary-green mt-1 text-lg" />
                <div>
                   <p className="text-[10px] font-black text-primary-green uppercase tracking-widest mb-1">Corporate HQ (USA)</p>
                   <p className="text-sm font-light text-gray-400 leading-tight">7200 West Commercial Blvd,<br />Suite 206, Ft Lauderdale, FL 33319</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <FaMapMarkerAlt className="text-primary-green mt-1 text-lg" />
                <div>
                   <p className="text-[10px] font-black text-primary-green uppercase tracking-widest mb-1">Indian Branch</p>
                   <p className="text-sm font-light text-gray-400 leading-tight">Dumdum, kolkata,<br />West Bengal-700055</p>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Global Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-medium text-gray-600 uppercase tracking-[0.2em]">
            © 2026 <span className="text-white font-black">MLX DIRECT</span>. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8 text-[10px] font-black text-gray-600 uppercase tracking-widest">
            <a href="#" className="hover:text-primary-green transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-green transition-colors">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
