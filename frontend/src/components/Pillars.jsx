import React, { useEffect, useRef, useState } from 'react';
import { FaRocket, FaEye, FaBolt, FaGem, FaTachometerAlt } from 'react-icons/fa';

const Pillars = () => {
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

  return (
    <section ref={sectionRef} className="pt-12 pb-24 lg:pt-16 lg:pb-32 bg-[#050505] relative overflow-hidden">
      
      {/* Background Micro-Engineering Grid */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#16a34a 0.5px, transparent 0.5px), linear-gradient(90deg, #16a34a 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }}></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Elite Section Header */}
        <div className={`mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-primary-green px-4 py-1 rounded-full">
              <span className="text-white font-black text-xs uppercase tracking-[0.2em]">Core Ideology</span>
            </div>
            <div className="h-[1px] w-24 bg-primary-green/20"></div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-[0.9]">
            The <span className="text-primary-green italic font-light">Foundation</span> of <br />
            Industrial <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-green to-white">Mastery.</span>
          </h1>
        </div>

        {/* Global Industrial Excellence: Bento Grid System */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-[320px]">
          
          {/* Cell 1: Strategic Mission (2/3 Width - Primary Hub) */}
          <div className={`lg:col-span-2 row-span-1 relative rounded-sm overflow-hidden group shadow-2xl transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
             <img src="/hero-premium.png" alt="Strategic Mission" className="w-full h-full object-cover transition-all duration-1000 scale-110 group-hover:scale-100 brightness-[0.4]" />
             <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
             <div className="absolute bottom-10 left-10 right-10">
                <div className="flex items-center gap-3 mb-4">
                   <FaRocket className="text-primary-green" />
                   <span className="text-white text-xs font-black tracking-[0.4em] uppercase">01 / Our Mission</span>
                </div>
                <h4 className="text-2xl font-bold text-white mb-4 uppercase">Eliminating Risk. <span className="text-primary-green">Empowering Safety.</span></h4>
                <p className="text-gray-400 font-light text-sm max-w-xl leading-relaxed">
                   Assisting businesses in making wiser decisions to lower radiation exposure risks through technical radiography and advanced data analytics.
                </p>
             </div>
             {/* Tech Identifier */}
             <div className="absolute top-6 right-6 text-[8px] font-mono text-white/30 tracking-[0.3em] uppercase rotate-90 origin-right">
                MLX CORE / ST-01
             </div>
          </div>

          {/* Cell 2: Progressive Vision (1/3 Width) */}
          <div className={`lg:col-span-1 row-span-1 bg-[#0a0a0a] border border-white/5 p-10 flex flex-col justify-end relative group overflow-hidden transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
             <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
                <FaEye className="text-8xl text-primary-green" />
             </div>
             <div className="relative z-10">
                <div className="w-12 h-1 bg-primary-green mb-8"></div>
                <h4 className="text-white text-xs font-black tracking-[0.4em] uppercase mb-4">02 / Vision</h4>
                <p className="text-gray-500 font-light text-sm leading-relaxed">
                   Pioneering industrial insight and discovery through deep nuclear knowledge and global infrastructure mastery.
                </p>
             </div>
             {/* Scanning Line Animation */}
             <div className="absolute top-0 left-0 w-full h-[1px] bg-primary-green/30 animate-scan pointer-events-none"></div>
          </div>

          {/* Cell 3: Operational Efficiency (1/3 Width) */}
          <div className={`lg:col-span-1 row-span-1 bg-[#101010] p-10 flex flex-col justify-between border border-white/5 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
             <div className="flex justify-between items-start">
                <FaBolt className="text-primary-green text-3xl" />
                <span className="text-[10px] text-white/20 font-black tracking-widest uppercase">Efficiency</span>
             </div>
             <div>
                <h4 className="text-white text-sm font-black tracking-widest uppercase mb-3">Accelerated Solutions</h4>
                <p className="text-gray-500 text-xs font-light leading-relaxed">
                   Flexible business solutions that streamline, accelerate, and enhance complex global industrial workflows.
                </p>
             </div>
          </div>

          {/* Cell 4: Strategic Value (1/3 Width) */}
          <div className={`lg:col-span-1 row-span-1 relative group overflow-hidden transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
             <img src="/construction-2.png" alt="Strategic Industrial Value" className="w-full h-full object-cover transition-all duration-1000 grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100" />
             <div className="absolute inset-0 bg-primary-green/10 group-hover:bg-transparent transition-all duration-700"></div>
             <div className="absolute inset-0 p-10 flex flex-col justify-end">
                <div className="flex items-center gap-3 mb-3">
                   <FaGem className="text-primary-green" />
                   <span className="text-white text-[10px] font-black tracking-widest uppercase">04 / Precision Value</span>
                </div>
                <p className="text-white/80 text-xs font-bold leading-snug">Upholding the highest standards of integrity across all global industrial touchpoints.</p>
             </div>
          </div>

          {/* Cell 5: Rapid Agility (1/3 Width) */}
          <div className={`lg:col-span-1 row-span-1 bg-[#0a0a0a] p-10 flex flex-col justify-between border-l-4 border-primary-green transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
             <div className="text-[10px] font-black tracking-[0.5em] text-white/30 uppercase">Agility Metrics</div>
             <div className="space-y-4">
                <FaTachometerAlt className="text-primary-green text-4xl mb-4" />
                <h4 className="text-white text-xs font-black tracking-[0.3em] uppercase">Speed to Market</h4>
                <p className="text-gray-500 text-xs font-light leading-relaxed">
                   Strategic consultation that empowers businesses to comprehend and penetrate primary target markets with absolute speed.
                </p>
             </div>
          </div>

        </div>

        {/* Global Performance Signature */}
        <div className={`mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
           <div className="flex items-center gap-10 mb-8 md:mb-0">
              <div className="flex flex-col">
                 <span className="text-white text-xs font-black tracking-widest uppercase">Verified Standard</span>
                 <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">ISO / MLX CORE 9100</span>
              </div>
              <div className="flex flex-col">
                 <span className="text-white text-xs font-black tracking-widest uppercase">Global Operations</span>
                 <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">12+ Functional Territories</span>
              </div>
           </div>
           <button className="group relative px-10 py-4 bg-primary-green overflow-hidden">
              <span className="relative z-10 text-white text-[10px] font-black uppercase tracking-[0.4em] group-hover:text-gray-900 transition-colors">Partner With Excellence</span>
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
           </button>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
      `}} />
    </section>
  );
};

export default Pillars;
