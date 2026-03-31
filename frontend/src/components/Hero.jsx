import React, { useEffect, useRef, useState } from 'react';

const Hero = () => {
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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative h-[90vh] flex flex-col lg:flex-row bg-[#0a0a0a] text-white overflow-hidden"
    >
      
      {/* Left Content Column */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-20 z-20 bg-[#0a0a0a]">
        <div className={`max-w-xl flex flex-col gap-10 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Subtle Brand Identifier */}
          <div className="flex items-center gap-3">
            <span className={`h-[2px] bg-primary-green transition-all duration-1000 delay-300 ${isVisible ? 'w-12' : 'w-0'}`}></span>
            <span className="text-primary-green text-xs font-bold tracking-[0.4rem] uppercase">
              Elite Industrial Solutions
            </span>
          </div>

          {/* Massive, Clean Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-black leading-[1.1] tracking-tight max-w-lg uppercase">
              Empowering <br />
              <span className="text-primary-green">Industries</span> <br />
              with Precision & Trust
            </h1>
          </div>

          {/* Refined Description */}
          <p className="text-base md:text-lg text-gray-400 leading-relaxed max-w-sm font-light">
            Trading, Industrial Radiography & Consulting across Canada.
          </p>

          {/* Premium Interaction Point */}
          <div className="flex items-center gap-8 group cursor-pointer w-fit">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border border-primary-green flex items-center justify-center group-hover:bg-primary-green transition-all duration-500">
                <svg className="w-6 h-6 text-primary-green group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </div>
              <div className="absolute inset-0 w-16 h-16 rounded-full border border-primary-green animate-ping opacity-20 group-hover:opacity-0"></div>
            </div>
            <span className="text-sm font-black tracking-widest uppercase group-hover:text-primary-green transition-colors">
              Explore MLX Direct
            </span>
          </div>

        </div>
      </div>

      {/* Right Visual Column */}
      <div className="w-full lg:w-1/2 relative min-h-[400px] lg:min-h-full overflow-hidden group">
        <div 
          className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out transform scale-110 group-hover:scale-100 grayscale group-hover:grayscale-0 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{ backgroundImage: "url('/hero-premium.png')" }}
        >
          {/* Hover Overlay Effect */}
          <div className="absolute inset-0 bg-primary-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        </div>
        
        {/* Subtle Black Overlay for Contrast */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-700"></div>

        {/* Subtle Fade to bridge columns */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-transparent hidden lg:block"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent lg:hidden"></div>

        {/* Floating Accent Text */}
        <div className="absolute bottom-10 right-10 flex items-center gap-4">
          <p className="text-white/20 text-[10px] font-black tracking-[1em] uppercase -rotate-90 origin-right whitespace-nowrap">
            EST. MMXXIV
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
