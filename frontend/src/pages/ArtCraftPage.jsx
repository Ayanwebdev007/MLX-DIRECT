import React, { useEffect, useState } from 'react';
import { FaPaintBrush, FaHammer, FaDraftingCompass, FaChessQueen, FaArrowRight } from 'react-icons/fa';

const ArtCraftPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white font-sans overflow-hidden">
      
      {/* 1. Artist's Hero - The Studio Feel */}
      <section className="relative h-[70vh] flex items-center bg-[#f8f9fa] overflow-hidden">
        <div className="absolute top-0 right-0 w-full lg:w-3/5 h-full">
           <img 
             src="/portfolio/MLX 13.webp" 
             alt="Masterpiece Collection" 
             className="w-full h-full object-cover grayscale-[0.2] brightness-90 transition-all duration-[2000ms] hover:scale-105"
           />
           <div className="absolute inset-0 bg-gradient-to-r from-[#f8f9fa] via-[#f8f9fa]/20 to-transparent"></div>
        </div>
        
        <div className={`relative z-10 w-full px-12 lg:px-32 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[2px] bg-primary-green"></div>
              <span className="text-primary-green text-[10px] font-black uppercase tracking-[0.4em]">The Artisan's Portfolio</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter uppercase leading-[0.85] mb-8">
              Art <span className="text-primary-green">&</span> <br />
              Craft <span className="text-primary-green">.</span>
            </h1>
            <p className="text-lg text-gray-500 font-medium leading-relaxed tracking-tight max-w-md">
              Discover a curated world where human skill meets timeless beauty. From intricate carvings to hand-painted masterpieces.
            </p>
          </div>
        </div>
      </section>

      {/* 2. The Human Touch - Skill Showcase */}
      <section className="py-24 lg:py-40 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            
            <div className={`space-y-12 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
              <div className="space-y-6">
                 <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-[0.9]">
                    Small <span className="text-primary-green">Details.</span> <br />
                    Big <span className="text-primary-green">History.</span>
                 </h2>
                 <p className="text-gray-500 text-lg leading-relaxed pt-4">
                   Every piece in our Art & Craft collection was made by hand. Whether it's a centuries-old wood carving or a delicately painted vase, we value the patience and talent of the original creators.
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {[
                   { icon: <FaPaintBrush />, title: "Hand-Painted", desc: "Traditional techniques used in every brushstroke." },
                   { icon: <FaHammer />, title: "Forged Metal", desc: "Rare bronze and iron work found globally." },
                   { icon: <FaDraftingCompass />, title: "Precision Design", desc: "Mathematical beauty in early architecture." },
                   { icon: <FaChessQueen />, title: "Elite Carvings", desc: "Detailed ivory, wood, and stone figures." }
                 ].map((item, i) => (
                   <div key={i} className="group space-y-3">
                      <div className="text-primary-green text-2xl group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                      <h6 className="font-bold text-xs uppercase tracking-widest text-gray-900">{item.title}</h6>
                      <p className="text-[11px] text-gray-400 font-medium leading-relaxed">{item.desc}</p>
                   </div>
                 ))}
              </div>
            </div>

            <div className="relative h-[600px] overflow-hidden group">
               <img 
                 src="/portfolio/MLX 3.webp" 
                 alt="Detailed Craftsmanship" 
                 className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
               />
               <div className="absolute inset-0 bg-primary-green/5 mix-blend-multiply"></div>
               <div className="absolute bottom-10 left-10 text-white z-10">
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-60">Artifact Reference</span>
                  <p className="text-xl font-bold tracking-tight mt-1 underline decoration-primary-green underline-offset-8">MLX-STUDIO-V03</p>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. The Masterpiece Gallery */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
             <h4 className="text-primary-green text-[10px] font-black uppercase tracking-[0.5em] mb-4">Curated Showcase</h4>
             <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase leading-[0.9]">
                Hand-Crafted <br />
                <span className="text-primary-green italic font-light">Excellence.</span>
             </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="md:col-span-2 relative h-[400px] group overflow-hidden shadow-xl">
                <img src="/portfolio/MLX 15.webp" alt="Gallery 1" className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent flex flex-col justify-end p-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                   <span className="text-primary-green text-xs font-black uppercase tracking-widest mb-2">Masterpiece</span>
                   <h5 className="text-white text-2xl font-bold">The Canvas of Time</h5>
                </div>
             </div>
             <div className="relative h-[400px] group overflow-hidden shadow-xl">
                <img src="/portfolio/MLX 7.webp" alt="Gallery 2" className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent flex flex-col justify-end p-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                   <span className="text-primary-green text-xs font-black uppercase tracking-widest mb-2">Mechanical</span>
                   <h5 className="text-white text-2xl font-bold">Engineered Beauty</h5>
                </div>
             </div>
             <div className="relative h-[400px] group overflow-hidden shadow-xl">
                <img src="/portfolio/MLX 16.webp" alt="Gallery 3" className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent flex flex-col justify-end p-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                   <span className="text-primary-green text-xs font-black uppercase tracking-widest mb-2">Vessels</span>
                   <h5 className="text-white text-2xl font-bold">The Golden Era</h5>
                </div>
             </div>
             <div className="md:col-span-2 relative h-[400px] group overflow-hidden shadow-xl">
                <img src="/portfolio/MLX 17.webp" alt="Gallery 4" className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent flex flex-col justify-end p-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                   <span className="text-primary-green text-xs font-black uppercase tracking-widest mb-2">Equipment</span>
                   <h5 className="text-white text-2xl font-bold">Crafted Utility</h5>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 4. Final Craft Action */}
      <section className="py-24 lg:py-40 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-12">
           <h2 className="text-4xl md:text-7xl font-black text-gray-900 tracking-tighter uppercase leading-[0.85]">
              Own a Piece of <br />
              <span className="text-primary-green">The Master's Touch.</span>
           </h2>
           <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto">
             Are you looking for a specific type of craft or a certain artistic era? Our private global network can source the exact piece for your collection.
           </p>
           <div className="flex flex-col md:flex-row justify-center items-center gap-6">
              <button className="px-12 py-5 bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.5em] hover:bg-primary-green transition-all shadow-2xl">
                 Inquire About Pieces
              </button>
              <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 hover:text-primary-green transition-colors">
                 Download Catalog <FaArrowRight />
              </button>
           </div>
        </div>
      </section>

    </div>
  );
};

export default ArtCraftPage;
