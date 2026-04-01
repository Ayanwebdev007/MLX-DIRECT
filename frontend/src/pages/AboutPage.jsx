import React, { useEffect, useState } from 'react';
import { FaGem, FaGlobe, FaCertificate, FaHistory, FaArrowRight } from 'react-icons/fa';

const AboutPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white font-sans overflow-hidden">
      
      {/* 1. Heritage Hub Hero */}
      <section className="relative h-[80vh] flex items-center justify-center bg-[#050505]">
        <img 
          src="/portfolio/MLX 17.webp" 
          alt="Legacy Collection" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent"></div>
        
        <div className={`relative z-10 max-w-5xl mx-auto px-6 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <div className="inline-flex items-center gap-3 mb-8 px-6 py-2 border border-primary-green/30 rounded-full backdrop-blur-md">
            <div className="w-2 h-2 bg-primary-green rounded-full animate-pulse"></div>
            <span className="text-primary-green text-[10px] font-black uppercase tracking-[0.4em]">Est. 1999 • Integrity First</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-light text-white tracking-tighter uppercase leading-[0.85] italic mb-8">
            WE BUY <span className="text-primary-green not-italic font-normal font-sans">&</span> SELL <br />
            ELITE <span className="text-primary-green not-italic font-normal font-sans">ANTIQUES.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-400 font-light text-lg tracking-wide leading-relaxed">
            Since 1999, MLX DIRECT has been a trusted global name. We spent 25 years in industrial safety and used that experience to build a world-class network for rare antiques and artifacts.
          </p>
        </div>
      </section>

      {/* 2. Acquisition & Trade Narrative */}
      <section className="py-24 lg:py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            
            <div className="space-y-12">
              <div className="space-y-6">
                <h4 className="text-primary-green text-xs font-black uppercase tracking-[0.5em] mb-4">FOR BUYERS</h4>
                <h2 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tighter uppercase leading-[0.9] italic">
                   Get the <span className="text-primary-green not-italic font-normal font-sans">Best</span> <br />
                   Original <span className="text-primary-green not-italic font-normal font-sans whitespace-nowrap">Antiques.</span>
                </h2>
              </div>
              
              <div className="border-l-4 border-gray-100 pl-10 py-6">
                <p className="text-xl text-gray-600 font-light leading-relaxed italic">
                  "Our team finds and checks every item personally. We make sure you get exactly what you're looking for—history in its purest form."
                </p>
              </div>

              <div className="space-y-8 text-gray-500 font-light leading-relaxed">
                <p>
                  If you are looking for rare coins, antique machines, or fine art, we can help. We have a private collection of items that are hard to find anywhere else. Every single piece is verified for 100% authenticity before it reaches you.
                </p>
                <div className="flex gap-12 pt-8">
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-gray-900 mb-1">100%</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary-green">Original Items</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-gray-900 mb-1">750+</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary-green">Happy Collectors</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
               <div className="absolute -inset-4 border border-primary-green/20 scale-95 group-hover:scale-100 transition-all duration-700"></div>
               <img 
                 src="/portfolio/MLX 1.webp" 
                 alt="Heritage Artifact" 
                 className="relative z-10 w-full h-[600px] object-cover shadow-2xl transition-all duration-1000 group-hover:scale-[1.02]"
               />
            </div>

          </div>
        </div>
      </section>

      {/* 3. Global Strategy Section (For Sellers) */}
      <section className="py-24 bg-gray-50/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#0a0a0a] hidden lg:block opacity-100">
           <img 
             src="/hero-premium.png" 
             alt="Global Infrastructure" 
             className="w-full h-full object-cover opacity-40 brightness-50 grayscale hover:grayscale-0 transition-all duration-1000"
           />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="lg:w-1/2 pr-12 lg:pr-24 space-y-16">
            <div className="space-y-6">
               <h4 className="text-primary-green text-xs font-black uppercase tracking-[0.5em] mb-4">FOR SELLERS</h4>
               <h2 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tighter uppercase leading-[0.9] italic">
                  Sell Your <span className="text-primary-green not-italic font-normal font-sans">Assets</span> <br />
                  For a <span className="text-primary-green not-italic font-normal font-sans">Fair Price.</span>
               </h2>
               <p className="text-gray-500 font-light leading-relaxed pt-6">
                 Have a rare collection or a single antique item? We use our global network in 12+ countries to find the right buyer for you. We handle the hard work so you can get a fair price fast and safely.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <div className="p-8 bg-white border border-gray-100 shadow-lg space-y-4">
                  <div className="w-10 h-10 rounded-full bg-primary-green/5 flex items-center justify-center text-primary-green">
                     <FaGlobe />
                  </div>
                  <h5 className="font-bold text-gray-900 uppercase text-xs tracking-widest">Global Network</h5>
                  <p className="text-[11px] text-gray-400 font-light leading-relaxed">We connect you with serious buyers across 12+ different countries.</p>
               </div>
               <div className="p-8 bg-white border border-gray-100 shadow-lg space-y-4">
                  <div className="w-10 h-10 rounded-full bg-primary-green/5 flex items-center justify-center text-primary-green">
                     <FaGem />
                  </div>
                  <h5 className="font-bold text-gray-900 uppercase text-xs tracking-widest">Safe & Easy</h5>
                  <p className="text-[11px] text-gray-400 font-light leading-relaxed">Your privacy is important to us. We make selling your items worry-free.</p>
               </div>
            </div>

            <button className="flex items-center gap-6 group">
               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-900">Get a Valuation</span>
               <div className="h-12 w-12 border border-gray-200 rounded-full flex items-center justify-center group-hover:bg-primary-green group-hover:border-primary-green transition-all">
                  <FaArrowRight className="text-xs group-hover:text-white transition-colors" />
               </div>
            </button>
          </div>
        </div>
      </section>

      {/* 4. Heritage Timeline & Excellence */}
      <section className="py-24 lg:py-40 bg-primary-green text-white relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-24">
            <div className="max-w-xl">
              <h4 className="text-white/60 text-xs font-black uppercase tracking-[0.5em] mb-4">Our History</h4>
              <h2 className="text-4xl md:text-6xl font-light text-white tracking-tighter uppercase leading-[0.85] italic">
                25 Years of <br />
                Trusted <span className="text-white not-italic font-normal font-sans underline decoration-white/20 underline-offset-8">Service.</span>
              </h2>
            </div>
            <div className="flex items-center gap-10">
               <div className="flex flex-col items-end opacity-40">
                  <FaCertificate className="text-4xl text-white mb-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">ISO CERTIFIED</span>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-t border-white/20 pt-20">
             {[
               { year: "1999", title: "Started", desc: "MLX Direct began as an industrial safety company." },
               { year: "2008", title: "Grew Global", desc: "We started working in 5 more countries." },
               { year: "2015", title: "Antique Desk", desc: "We opened our specialized antique trading division." },
               { year: "2024", title: "Today", desc: "We are a top name for buying and selling verified assets." }
             ].map((milestone, i) => (
               <div key={i} className="space-y-4">
                  <div className="text-3xl font-light italic text-white/30">{milestone.year}</div>
                  <h6 className="font-bold text-xs uppercase tracking-widest text-white">{milestone.title}</h6>
                  <p className="text-xs text-white/70 font-light leading-relaxed">{milestone.desc}</p>
               </div>
             ))}
          </div>
          
          {/* Final Integrated Action (Moved into the green block) */}
          <div className="mt-24 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
             <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/50 mb-2">Ready to Trade?</span>
                <p className="text-xs text-white/70">Our experts are standing by to value your assets globally.</p>
             </div>
             <button className="px-12 py-5 bg-white text-primary-green text-[10px] font-black uppercase tracking-[0.5em] hover:bg-gray-100 transition-all shadow-xl">
                Contact Our Desk
             </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
