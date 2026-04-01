import React, { useEffect, useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaPlus, FaArrowRight } from 'react-icons/fa';

const Antiques = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const scrollRef = useRef(null);

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

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const artifacts = [
    { src: "/portfolio/MLX 17.webp", label: "National Registry / We Buy" },
    { src: "/portfolio/MLX 13.webp", label: "Heritage Porcelain / We Sell" },
    { src: "/portfolio/MLX 7.webp", label: "Numismatic Collection / We Buy" },
    { src: "/portfolio/MLX 6.webp", label: "Bronze Antiquity / We Sell" },
    { src: "/portfolio/MLX 16.webp", label: "Carved Wood Figurine / We Buy" },
    { src: "/portfolio/MLX 10.webp", label: "Fine Silverwork / We Sell" },
    { src: "/portfolio/MLX 3.webp", label: "Authenticated Detail" }
  ];

  return (
    <section ref={sectionRef} className="pt-20 lg:pt-28 pb-0 bg-white border-t border-gray-100 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        
        {/* Optimized Compact Header */}
        <div className={`flex flex-col lg:flex-row justify-between items-end gap-8 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-4">
               <div className="bg-primary-green w-2 h-2 rounded-full animate-pulse"></div>
               <span className="text-gray-400 font-bold text-[9px] uppercase tracking-[0.4em]">Elite Trade Desk</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-light text-gray-900 tracking-tighter uppercase leading-[0.85] italic">
               WE <span className="text-primary-green not-italic italic font-normal tracking-[-0.02em] font-sans">BUY.</span> <br />
               WE <span className="text-primary-green not-italic italic font-normal tracking-[-0.02em] font-sans">SELL.</span>
            </h2>
          </div>

          <div className="flex flex-col items-end gap-6">
             <div className="flex gap-4">
                <button className="px-8 py-3 border border-gray-900 text-[9px] font-bold uppercase tracking-[0.3em] hover:bg-gray-900 hover:text-white transition-all duration-300">
                   Buy An Asset
                </button>
                <button className="px-8 py-3 bg-primary-green text-white text-[9px] font-bold uppercase tracking-[0.3em] hover:bg-gray-900 transition-all duration-300">
                   Sell An Asset
                </button>
             </div>
             
             {/* Gallery Navigation Controls */}
             <div className="flex gap-4">
                <button 
                  onClick={() => scroll('left')}
                  className="w-10 h-10 border border-gray-100 flex items-center justify-center text-gray-400 hover:border-primary-green hover:text-primary-green transition-all"
                >
                  <FaChevronLeft className="text-xs" />
                </button>
                <button 
                  onClick={() => scroll('right')}
                  className="w-10 h-10 border border-gray-100 flex items-center justify-center text-gray-400 hover:border-primary-green hover:text-primary-green transition-all"
                >
                  <FaChevronRight className="text-xs" />
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* Tighter Vault Scroller (Horizontal Full-Height Gallery) */}
      <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
         <div 
           ref={scrollRef}
           className="flex overflow-x-auto pb-8 px-6 lg:px-[calc((100vw-1280px)/2+24px)] gap-6 no-scrollbar flex-nowrap"
         >
            {artifacts.map((artifact, i) => (
               <div 
                  key={i} 
                  className="flex-shrink-0 group relative cursor-pointer"
               >
                  <div className="h-[300px] md:h-[420px] w-auto overflow-hidden bg-gray-50 border border-gray-100 shadow-sm group-hover:shadow-xl transition-all duration-700">
                     <img 
                        src={artifact.src} 
                        alt={artifact.label} 
                        className="h-full w-auto object-contain transition-all duration-1000 group-hover:scale-105" 
                     />
                     <div className="absolute inset-0 bg-primary-green/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  
                  {/* Luxury Contextual Label */}
                  <div className="absolute bottom-6 left-6 transition-all duration-700">
                     <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 group-hover:text-primary-green transition-colors">{artifact.label}</span>
                     <div className="h-[1px] w-0 group-hover:w-full bg-primary-green transition-all mt-1"></div>
                  </div>
               </div>
            ))}
            
            {/* Gallery Terminal */}
            <div className="flex-shrink-0 w-64 h-[300px] md:h-[420px] flex items-center justify-center bg-gray-50 border border-dashed border-gray-200 group hover:border-primary-green/30 transition-all">
               <div className="text-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 group-hover:text-primary-green transition-colors">Private Access</span>
                  <div className="mt-6 mx-auto w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-primary-green group-hover:bg-primary-green transition-all">
                     <FaPlus className="text-[10px] text-gray-300 group-hover:text-white" />
                  </div>
               </div>
            </div>
         </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </section>
  );
};

export default Antiques;
