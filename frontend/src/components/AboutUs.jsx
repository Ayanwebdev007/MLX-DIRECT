import React, { useEffect, useRef, useState } from 'react';
import { FaShieldAlt, FaGlobe, FaCogs, FaProjectDiagram } from 'react-icons/fa';

const AboutUs = () => {
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
    <section ref={sectionRef} className="pt-12 pb-12 lg:pt-16 lg:pb-16 bg-gray-50/30 relative overflow-hidden">
      
      {/* Background Micro-Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#16a34a 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Supreme Header */}
        <div className={`mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-primary-green px-4 py-1 rounded-full">
              <span className="text-white font-black text-xs uppercase tracking-[0.2em]">About MLX Direct</span>
            </div>
            <div className="h-[1px] w-24 bg-primary-green/20"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-[0.9]">
            Engineering the Future <br />
            <span className="text-primary-green italic font-light">of Industrial Operations.</span>
          </h2>

          {/* Executive Narrative (New Statement Block) */}
          <div className="mt-12 max-w-4xl space-y-8">
             <div className="border-l-4 border-primary-green pl-10 py-4">
                <p className="text-xl md:text-2xl font-light text-gray-700 leading-snug tracking-tight">
                  Since our first day in business, <span className="text-gray-900 font-bold">MLX DIRECT</span> has been offering our customers the best safety in the domain of radiology.
                </p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pl-10 pr-6">
                <p className="text-sm font-medium text-gray-500 leading-relaxed uppercase tracking-widest">
                  Mlx Direct conveys both knowledge and information for understanding technologies—from radiography safety to <span className="text-primary-green">solid waste management</span> engineering.
                </p>
                <div className="space-y-4">
                   <p className="text-sm font-bold text-gray-900 leading-relaxed uppercase tracking-[0.2em] underline decoration-primary-green underline-offset-8">
                     More Than Just a Name.
                   </p>
                   <p className="text-xs font-medium text-gray-500 leading-relaxed">
                     MLX DIRECT is a premier brand in radiation safety. We are the "one source" global technology provider for certification, testing, and inspection.
                   </p>
                </div>
             </div>
          </div>
        </div>

        {/* Global Industrial Core: Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-[300px]">
          
          {/* Cell 1: Strategic Vision (2/3 Width) */}
          <div className={`lg:col-span-2 row-span-1 relative rounded-sm overflow-hidden group shadow-xl transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
            <img src="/about-team.png" alt="Strategic Vision" className="w-full h-full object-cover brightness-75 group-hover:brightness-100 transition-all duration-1000 rotate-0 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent p-10 flex flex-col justify-end">
              <h4 className="text-xl font-bold text-white mb-3">Strategic Technical Synergy</h4>
              <p className="text-gray-300 font-light text-sm max-w-lg">
                MLX DIRECT bridges technical excellence with global operational intelligence, turn technical challenges into elite-scale competitive advantages.
              </p>
            </div>
            {/* Coordinate Label */}
            <div className="absolute top-6 right-6 text-[8px] font-mono text-white/40 tracking-[0.4em] pointer-events-none">
              [ 43.12N / 79.38W ]
            </div>
          </div>

          {/* Cell 2: Numerical Authority (1/3 Width) */}
          <div className={`lg:col-span-1 row-span-2 bg-gray-900 p-12 flex flex-col justify-between shadow-2xl transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
             <div className="space-y-12">
                <div className="group cursor-default">
                  <div className="text-primary-green text-xs font-black tracking-widest uppercase mb-2">History</div>
                  <div className="text-5xl font-black text-white">25<span className="text-primary-green">+</span></div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Established Years</div>
                </div>
                <div className="group cursor-default">
                   <div className="text-primary-green text-xs font-black tracking-widest uppercase mb-2">Network</div>
                   <div className="text-5xl font-black text-white">12<span className="text-primary-green">+</span></div>
                   <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Global Territories</div>
                </div>
                <div className="group cursor-default">
                   <div className="text-primary-green text-xs font-black tracking-widest uppercase mb-2">Execution</div>
                   <div className="text-5xl font-black text-white">100<span className="text-primary-green">%</span></div>
                   <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Compliance Rating</div>
                </div>
             </div>
             <div className="pt-8 border-t border-white/10 group">
                <div className="text-[9px] font-bold text-gray-600 group-hover:text-primary-green transition-colors uppercase tracking-[0.5em]">ISO CERTIFIED STANDARDS</div>
             </div>
          </div>

          {/* Cell 3: Capabilities Cloud (1/3 Width) */}
          <div className={`lg:col-span-1 row-span-1 bg-white border border-gray-100 p-10 flex flex-col justify-center shadow-xl transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
             <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-green mb-8">Pillars of Excellence</h4>
             <div className="space-y-6">
                {[
                  { icon: <FaShieldAlt />, label: "Radiography Auditing" },
                  { icon: <FaGlobe />, label: "Strategic Sourcing" },
                  { icon: <FaCogs />, label: "Industrial Consulting" },
                  { icon: <FaProjectDiagram />, label: "Logistics Excellence" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group cursor-default">
                    <div className="text-gray-900 group-hover:text-primary-green transition-colors">{item.icon}</div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-gray-900 transition-colors">{item.label}</span>
                  </div>
                ))}
             </div>
          </div>

          {/* Cell 4: Engineering Precision (1/3 Width - but made 2/3 below mobile) */}
          <div className={`lg:col-span-1 row-span-1 relative rounded-sm overflow-hidden shadow-xl transition-all duration-1000 delay-700 group ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
             <img src="/about-precision.png" alt="Precision Detail" className="w-full h-full object-cover brightness-75 group-hover:brightness-100 group-hover:scale-110 transition-all duration-1000" />
             <div className="absolute inset-0 bg-primary-green/10 mix-blend-overlay"></div>
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-md p-6 border border-white/50 shadow-2xl">
                   <div className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400 mb-1">Precision Seal</div>
                   <div className="text-xs font-black uppercase tracking-widest text-primary-green">MLX Direct Auth.</div>
                </div>
             </div>
          </div>

        </div>

        {/* Final Integrated Action */}
        <div className={`mt-12 flex flex-col items-center justify-center transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
           <button className="relative px-12 py-5 bg-gray-900 overflow-hidden group">
              <span className="relative z-10 text-white text-xs font-black uppercase tracking-[0.5em] group-hover:text-white transition-colors duration-500">Discover Our Process</span>
              <div className="absolute inset-0 bg-primary-green scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ease-out"></div>
           </button>
           <p className="mt-6 text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">Operational Since 1999 • All Rights Reserved</p>
        </div>

      </div>
    </section>
  );
};

export default AboutUs;
