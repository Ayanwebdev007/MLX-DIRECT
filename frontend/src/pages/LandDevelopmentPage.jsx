import React, { useEffect, useState } from 'react';
import { FaPlay, FaShieldAlt, FaClock, FaHeadset, FaCheckCircle, FaCheckSquare } from 'react-icons/fa';

const LandDevelopmentPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
  }, []);

  const featureList = [
    "Faucibus felis rutrum convallis ultricies",
    "Etiam taciti imperdiet id tempor",
    "Ligula ornare ullamcorper",
    "Porta tortor eleifend egestas taciti",
    "Sit risus nec ligula consectetur"
  ];

  return (
    <div className="bg-white font-sans overflow-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
           <img 
             src="/dev-commercial.png" 
             alt="Land Development" 
             className="w-full h-full object-cover brightness-50"
           />
           <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-transparent to-gray-900/80"></div>
        </div>
        
        <div className={`relative z-10 max-w-7xl mx-auto px-6 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <h4 className="text-primary-green text-xs font-black uppercase tracking-[0.5em] mb-6">Land Development</h4>
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.8] mb-8">
            Commercial <br /> Building <span className="text-primary-green">Developments</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-200 font-light tracking-wide leading-relaxed">
            Mus pellentesque aliquet amet maximus risus est facilisis feugiat laoreet litora parturient
          </p>
        </div>
      </section>

      {/* 2. Descriptions & Featured Services */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
             {/* Left: Description */}
             <div className="space-y-8">
                <div>
                   <h4 className="text-primary-green text-[10px] font-black uppercase tracking-[0.5em] mb-4">About the Project</h4>
                   <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-[0.9] mb-8">
                      Descriptions
                   </h2>
                </div>
                <p className="text-gray-500 text-lg leading-relaxed">
                  Facilisi duis vestibulum finibus conubia efficitur ipsum turpis magna condimentum. Potenti urna at est faucibus porttitor lorem habitasse aptent tortor. Ornare magnis scelerisque consectetuer amet dolor quis felis tellus laoreet. Eu eget lorem viverra est ornare efficitur urna tortor neque augue nulla. Praesent si iaculis dis vitae egestas eu interdum id maximus euismod.
                </p>
                <p className="text-gray-500 text-lg leading-relaxed">
                  Facilisi duis vestibulum finibus conubia efficitur ipsum turpis magna condimentum. Potenti urna at est faucibus porttitor lorem habitasse aptent tortor. Ornare magnis scelerisque consectetuer amet dolor quis felis tellus laoreet. Eu eget lorem viverra est ornare efficitur urna tortor neque augue nulla. Praesent si iaculis dis vitae egestas eu interdum id maximus euismod.
                </p>
             </div>

             {/* Right: Featured Services */}
             <div className="bg-gray-50 p-12 shadow-xl border-l-4 border-primary-green flex flex-col justify-center">
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 text-gray-900 relative inline-block">
                   Featured Service
                   <div className="absolute -bottom-2 left-0 w-12 h-[2px] bg-primary-green"></div>
                </h3>
                <div className="space-y-4">
                   {featureList.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-4">
                         <FaCheckSquare className="text-primary-green text-xl mt-1 flex-shrink-0" />
                         <span className="text-gray-700 font-medium">{item}</span>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 3. Appointment & How it works */}
      <section className="py-24 lg:py-32 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
             
             {/* Left: Get an Appointment */}
             <div className="bg-white p-10 md:p-14 shadow-2xl text-gray-900 rounded-sm">
                <h4 className="text-primary-green text-[10px] font-black uppercase tracking-[0.5em] mb-4">Let's Talk</h4>
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase leading-[0.9] mb-4">
                   Get an Appointments
                </h2>
                <p className="text-gray-500 text-sm mb-8">Blandit mollis sociosqu senectus vulputate per dis rhoncus</p>
                
                <form className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col">
                         <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Name</label>
                         <input type="text" placeholder="Your Name" className="border-b-2 border-gray-200 py-3 focus:outline-none focus:border-primary-green bg-transparent transition-colors text-sm font-medium" />
                      </div>
                      <div className="flex flex-col">
                         <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Phone</label>
                         <input type="text" placeholder="Your Phone" className="border-b-2 border-gray-200 py-3 focus:outline-none focus:border-primary-green bg-transparent transition-colors text-sm font-medium" />
                      </div>
                   </div>
                   <div className="flex flex-col">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email</label>
                      <input type="email" placeholder="Your Email" className="border-b-2 border-gray-200 py-3 focus:outline-none focus:border-primary-green bg-transparent transition-colors text-sm font-medium" />
                   </div>
                   <div className="flex flex-col">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Message</label>
                      <textarea rows="4" placeholder="How can we help?" className="border-b-2 border-gray-200 py-3 focus:outline-none focus:border-primary-green bg-transparent transition-colors text-sm font-medium resize-none"></textarea>
                   </div>
                   <button type="button" className="w-full bg-primary-green text-white py-4 font-black tracking-[0.2em] uppercase text-xs hover:bg-green-700 transition-colors mt-4 shadow-lg shadow-primary-green/20">
                      Submit Application
                   </button>
                </form>
             </div>

             {/* Right: How it works & Play Video */}
             <div className="flex flex-col justify-center space-y-12 py-8">
                <div>
                   <h4 className="text-primary-green text-[10px] font-black uppercase tracking-[0.5em] mb-4">Process</h4>
                   <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-[0.9] mb-6">
                      How it works
                   </h2>
                   <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
                   </p>
                </div>

                <div className="space-y-8">
                   {[
                      { step: "01", title: "Free Consultations" },
                      { step: "02", title: "Get Estimate Budget" },
                      { step: "03", title: "Project Production" }
                   ].map((item, idx) => (
                      <div key={idx} className="flex gap-6 group cursor-pointer">
                         <div className="text-3xl font-black text-gray-700 group-hover:text-primary-green transition-colors italic">{item.step}</div>
                         <div>
                            <h5 className="font-bold text-lg uppercase tracking-tight mb-2 group-hover:text-primary-green transition-colors">{item.title}</h5>
                            <p className="text-gray-400 text-xs leading-relaxed max-w-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>
                         </div>
                      </div>
                   ))}
                </div>

                <div className="pt-4">
                   <button className="flex items-center gap-4 group">
                      <div className="w-16 h-16 rounded-full bg-primary-green flex items-center justify-center text-white text-xl shadow-lg shadow-primary-green/30 group-hover:scale-110 transition-transform">
                         <FaPlay className="ml-1" />
                      </div>
                      <span className="font-black uppercase tracking-[0.2em] text-xs group-hover:text-primary-green transition-colors">Play Video</span>
                   </button>
                </div>
             </div>

          </div>
        </div>
      </section>

      {/* 4. Why Choose Us */}
      <section className="py-24 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
             <div className="relative h-[600px] overflow-hidden shadow-2xl">
                <img src="/dev-office.png" alt="Why Choose Us" className="w-full h-full object-cover" />
                <div className="absolute top-10 right-10 bg-white p-8 shadow-2xl border-l-4 border-primary-green">
                   <div className="text-gray-900 text-5xl font-black italic">32<span className="text-sm font-normal not-italic ml-2">YRS</span></div>
                   <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-2">Over 32 years of experience</div>
                </div>
             </div>

             <div className="space-y-12">
                <div>
                   <h4 className="text-primary-green text-[10px] font-black uppercase tracking-[0.5em] mb-4">Why Choose Us</h4>
                   <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-[0.9]">
                      The earth is our foundation, <br />
                      <span className="text-primary-green italic font-light font-sans tracking-tight">the future is our ambition.</span>
                   </h2>
                </div>

                <div className="space-y-8">
                   {[
                     { icon: <FaShieldAlt />, title: "Certified Professional & Expert" },
                     { icon: <FaClock />, title: "We're Fast, Accurate & Reliable" },
                     { icon: <FaHeadset />, title: "24/7 Premium Support" }
                   ].map((item, i) => (
                     <div key={i} className="flex gap-6 group">
                        <div className="text-3xl text-primary-green group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                        <div className="space-y-2">
                           <h6 className="font-black text-sm uppercase tracking-widest text-gray-900">{item.title}</h6>
                           <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 5. Final CTA */}
      <section className="py-24 lg:py-32 bg-primary-green text-white">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-10">
           <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.85]">
              Building your visions. <br />
              <span className="italic font-light">Creating reality.</span>
           </h2>
           <p className="text-lg text-white/80 font-medium leading-relaxed max-w-2xl mx-auto">
             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
           </p>
           <button className="px-12 py-5 bg-white text-primary-green text-[10px] font-black uppercase tracking-[0.5em] hover:bg-gray-100 transition-all shadow-2xl">
              Discover more
           </button>
        </div>
      </section>

    </div>
  );
};

export default LandDevelopmentPage;
