import React, { useEffect, useRef, useState } from 'react';

const MapSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  // Coordinates for Fort Lauderdale, Florida with red pin
  const mapSrc = "https://maps.google.com/maps?q=26.1420358,-80.1373&hl=en&z=15&output=embed";

  return (
    <section ref={sectionRef} className="relative w-full min-h-[650px] bg-gray-50 overflow-hidden group">
      
      {/* Cinematic Full-Width Map Foundation */}
      <div className={`w-full h-[650px] transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}>
        <iframe 
          src={mapSrc}
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full brightness-[0.95] hover:brightness-100 transition-all duration-1000"
        ></iframe>
      </div>

      {/* Floating Glassmorphic Command Card */}
      <div className={`absolute left-6 lg:left-24 top-1/2 -translate-y-1/2 z-20 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
        <div className="bg-white/90 backdrop-blur-xl border border-white/50 p-10 lg:p-14 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] max-w-md rounded-sm relative overflow-hidden group/card">
          
          {/* Subtle Industrial Accent Lines */}
          <div className="absolute top-0 left-0 w-2 h-full bg-primary-green translate-x-[-100%] group-hover/card:translate-x-0 transition-transform duration-700 ease-out"></div>
          
          <h2 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none mb-10">
            Corporate <br />
            <span className="text-primary-green italic font-light tracking-wide">Headquarters.</span>
          </h2>
          
          <div className="space-y-10">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-4 h-[1px] bg-primary-green"></span> Physical Office
              </p>
              <p className="text-lg font-bold text-gray-800 leading-tight">
                Fort Lauderdale,<br />
                Florida, United States
              </p>
            </div>
            
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-4 h-[1px] bg-primary-green"></span> Contact Suite
              </p>
              <p className="text-lg font-bold text-gray-800 tracking-tight mb-1">+1 (806) 429 1952</p>
              <p className="text-sm font-medium text-primary-green lowercase">admin@mlxdirect.com</p>
              <p className="text-sm font-medium text-primary-green lowercase">info@mlxdirect.com</p>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <a 
                href="https://maps.google.com/?q=26.1420358,-80.1373" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group/btn relative inline-flex items-center gap-6 text-[10px] font-black text-gray-900 uppercase tracking-[0.4em] hover:text-primary-green transition-colors duration-500"
              >
                Get Directions
                <div className="relative w-16 h-[2px] bg-gray-200 overflow-hidden">
                   <div className="absolute inset-0 bg-primary-green translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-500 ease-out"></div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Map Interaction Guard Overlay (Hidden by default, can be used to prevent scroll zoom) */}
      <div className="absolute inset-0 pointer-events-none border-[24px] border-white/5 z-10"></div>

    </section>
  );
};

export default MapSection;
