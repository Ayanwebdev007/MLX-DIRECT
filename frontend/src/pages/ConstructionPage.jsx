import React, { useEffect, useState } from 'react';
import { FaHardHat, FaBuilding, FaDraftingCompass, FaTools, FaShieldAlt, FaClock, FaCheckCircle, FaHeadset, FaArrowRight } from 'react-icons/fa';

const ConstructionPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
  }, []);

  const developments = [
    { title: "Family House Developments", img: "/constructions/dev-family.png" },
    { title: "Commercial Building Developments", img: "/constructions/dev-commercial.png" },
    { title: "Sports Center Developments", img: "/constructions/dev-sports.png" },
    { title: "Office & Tower Developments", img: "/constructions/dev-office.png" },
    { title: "Public Facility Developments", img: "/constructions/dev-public.png" },
    { title: "Art Center Developments", img: "/constructions/dev-art.png" }
  ];

  return (
    <div className="bg-white font-sans overflow-hidden">
      
      {/* 1. Industrial Hero */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
           <img 
             src="/constructions/hero.png" 
             alt="Construction Excellence" 
             className="w-full h-full object-cover brightness-50"
           />
           <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-transparent to-gray-900/80"></div>
        </div>
        
        <div className={`relative z-10 max-w-7xl mx-auto px-6 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <h4 className="text-primary-green text-xs font-black uppercase tracking-[0.5em] mb-6">Execution & Quality</h4>
          <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter uppercase leading-[0.8] mb-8">
            Constructions <span className="text-primary-green">.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-200 font-light tracking-wide leading-relaxed">
            Quality work from dedicated professionals. We build the foundations of the future.
          </p>
        </div>
      </section>

      {/* 2. Our Service & The Three Pillars */}
      <section className="py-24 lg:py-40 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-end mb-24">
            <div>
               <h4 className="text-primary-green text-[10px] font-black uppercase tracking-[0.5em] mb-4">Our Service</h4>
               <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase leading-[0.9]">
                  Leading the industry in <br />
                  <span className="text-primary-green italic font-light">quality & efficiency.</span>
               </h2>
            </div>
            <p className="text-gray-500 text-lg leading-relaxed max-w-lg pb-2">
              Our commitment to excellence ensures that every project, from minor renovations to massive urban developments, meets the highest standards of safety and craftsmanship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
               { icon: <FaDraftingCompass />, title: "Consultations", desc: "Convallis iaculis pellentesque sagittis vestibulum non aliquam gravida pede maecenas" },
               { icon: <FaTools />, label: "Renovations", desc: "Convallis iaculis pellentesque sagittis vestibulum non aliquam gravida pede maecenas" },
               { icon: <FaBuilding />, title: "Developments", desc: "Convallis iaculis pellentesque sagittis vestibulum non aliquam gravida pede maecenas" }
             ].map((pillar, i) => (
               <div key={i} className="bg-white p-12 shadow-xl hover:-translate-y-2 transition-all duration-500 group border-b-4 border-transparent hover:border-primary-green">
                  <div className="text-4xl text-gray-300 group-hover:text-primary-green transition-colors mb-8">{pillar.icon}</div>
                  <h5 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-4">{pillar.title || pillar.label}</h5>
                  <p className="text-gray-400 text-sm leading-relaxed">{pillar.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 3. The Development Experience */}
      <section className="py-24 lg:py-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-24 gap-12 text-center md:text-left">
             <div className="max-w-xl">
               <h4 className="text-primary-green text-[10px] font-black uppercase tracking-[0.5em] mb-4 font-sans">What we offer</h4>
               <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase leading-[0.9]">
                  Safe, Fast <span className="text-primary-green">&</span> <br />
                  Affordable <span className="text-primary-green">Solutions.</span>
               </h2>
             </div>
             <div className="bg-gray-900 px-12 py-10 text-white rounded-sm shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-green/20 -translate-y-12 translate-x-12 rounded-full"></div>
                <div className="text-5xl font-black text-primary-green mb-1 italic">25<span className="text-white">+</span></div>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Years of Experience</div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {developments.map((dev, i) => (
                <div key={i} className="group relative h-[500px] overflow-hidden shadow-2xl">
                   <img src={dev.img} alt={dev.title} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 brightness-75 group-hover:brightness-90" />
                   <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent p-10 flex flex-col justify-end">
                      <h5 className="text-white text-2xl font-black uppercase tracking-tighter max-w-[80%] leading-tight mb-6">
                         {dev.title}
                      </h5>
                      <p className="text-gray-300 text-[11px] font-medium leading-relaxed mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                         Class nostra vehicula tortor parturient ante habitasse mollis quis urna mauris duis.
                      </p>
                      <button className="flex items-center gap-3 text-primary-green text-[10px] font-black uppercase tracking-[0.4em] hover:text-white transition-colors">
                         Learn more <FaArrowRight />
                      </button>
                   </div>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* 4. Vision Section */}
      <section className="py-24 lg:py-40 relative bg-primary-green text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10 space-y-12">
           <h4 className="text-white/60 text-[10px] font-black uppercase tracking-[0.5em]">Future Ready</h4>
           <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-[0.85]">
              Fast forward to tomorrow: <br />
              <span className="italic font-light">our vision is your reality.</span>
           </h2>
           <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
             Commodo elementum parturient mauris montes dignissim leo orci efficitur. Sodales erat nisl sed augue vel consectetur nulla adipiscing ex.
           </p>
           <button className="px-12 py-5 bg-white text-primary-green text-[10px] font-black uppercase tracking-[0.5em] hover:bg-gray-100 transition-all shadow-2xl">
              Discover more
           </button>
        </div>
      </section>

      {/* 5. Why Choose Us */}
      <section className="py-24 lg:py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
             <div className="relative h-[700px] overflow-hidden shadow-2xl">
                <img src="/constructions/dev-office.png" alt="Expertise" className="w-full h-full object-cover" />
                <div className="absolute top-10 left-10 bg-primary-green p-10 shadow-2xl">
                   <div className="text-white text-5xl font-black italic">32<span className="text-sm font-normal not-italic ml-2">YRS</span></div>
                   <div className="text-[10px] text-white/70 font-black uppercase tracking-widest mt-2">Expert Experience</div>
                </div>
             </div>

             <div className="space-y-12">
                <div>
                   <h4 className="text-primary-green text-[10px] font-black uppercase tracking-[0.5em] mb-4">Why Choose Us</h4>
                   <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase leading-[0.9]">
                      The earth is <br />
                      <span className="text-primary-green italic font-light font-sans tracking-tight">our foundation.</span>
                   </h2>
                </div>

                <div className="space-y-10">
                   {[
                     { icon: <FaShieldAlt />, title: "Certified Professional & Expert", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus." },
                     { icon: <FaClock />, title: "We're Fast, Accurate & Reliable", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus." },
                     { icon: <FaHeadset />, title: "24/7 Premium Support", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus." },
                     { icon: <FaCheckCircle />, title: "Quality Guaranteed", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus." }
                   ].map((item, i) => (
                     <div key={i} className="flex gap-6 group">
                        <div className="text-3xl text-primary-green group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                        <div className="space-y-2">
                           <h6 className="font-black text-sm uppercase tracking-widest text-gray-900 underline decoration-primary-green/0 group-hover:decoration-primary-green underline-offset-4 transition-all">{item.title}</h6>
                           <p className="text-xs text-gray-400 font-medium leading-relaxed max-w-sm">{item.desc}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 6. Final CTA */}
      <section className="py-24 lg:py-40 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-12">
           <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-[0.85]">
              Building your visions. <br />
              <span className="text-primary-green">Creating reality.</span>
           </h2>
           <p className="text-lg text-gray-400 font-medium leading-relaxed max-w-2xl mx-auto">
             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
           </p>
           <button className="px-12 py-5 bg-primary-green text-white text-[10px] font-black uppercase tracking-[0.5em] hover:bg-green-700 transition-all shadow-2xl">
              Discover more
           </button>
        </div>
      </section>

    </div>
  );
};

export default ConstructionPage;
