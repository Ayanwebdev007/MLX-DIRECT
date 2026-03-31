import React, { useEffect, useRef, useState } from 'react';
import { FaMicrochip, FaRadiation, FaUserTie } from 'react-icons/fa';

const Services = () => {
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

  const services = [
    {
      title: "Strategic Trading",
      subtitle: "Instrumentation & Sourcing",
      icon: <FaMicrochip />,
      image: "/service-trading.png",
      desc: "Provision of high-precision radiation protection instruments, environmental monitoring sensors, and specialized shielding solutions for complex industrial environments."
    },
    {
      title: "Technical Radiography",
      subtitle: "NDT & Flaw Detection",
      icon: <FaRadiation />,
      image: "/service-ndt.png",
      desc: "Comprehensive Non-Destructive Testing (NDT) and industrial radiography services designed to identify internal structural defects without compromising material integrity."
    },
    {
      title: "Safety Consulting",
      subtitle: "Advisory & Compliance",
      icon: <FaUserTie />,
      image: "/service-consulting.png",
      desc: "Expert advisory services for medical X-ray safety, equipment installation audits, and uncompromising quality assurance programs for global regulatory compliance."
    }
  ];

  return (
    <section ref={sectionRef} className="pt-24 lg:pt-32 pb-6 lg:pb-8 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className={`mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-primary-green px-4 py-1 rounded-full">
              <span className="text-white font-black text-xs uppercase tracking-[0.2em]">What We Offer</span>
            </div>
            <div className="h-[1px] w-24 bg-primary-green/20"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-[0.9]">
            Expert Services Tailored <br />
            <span className="text-primary-green italic font-light">to Your Industrial Needs.</span>
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {services.map((service, idx) => (
            <div 
              key={idx} 
              className={`group flex flex-col transition-all duration-1000 delay-[${idx * 200}ms] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
            >
              {/* Image Container with Zoom */}
              <div className="relative h-[350px] overflow-hidden rounded-sm shadow-xl">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-110 group-hover:brightness-105 transition-all duration-1000" 
                />
                
                {/* Floating Icon Badge (Glassmorphic) */}
                <div className="absolute top-6 left-6 p-4 backdrop-blur-md bg-white/10 border border-white/20 rounded-sm shadow-xl text-white group-hover:bg-primary-green group-hover:text-white transition-all duration-500">
                  <div className="text-xl">{service.icon}</div>
                </div>
              </div>

              {/* Content Block */}
              <div className="pt-8 flex flex-col h-full">
                <div className="mb-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-green mb-1">
                    {service.subtitle}
                  </h4>
                  <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter group-hover:text-primary-green transition-colors">
                    {service.title}
                  </h3>
                </div>
                
                <p className="text-gray-500 font-light text-sm leading-relaxed mb-4">
                  {service.desc}
                </p>

                {/* Ghost Action Button */}
                <button className="flex items-center gap-4 group/btn">
                   <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-900 group-hover/btn:text-primary-green transition-colors">
                     Learn More
                   </span>
                   <div className="h-[1px] w-12 bg-gray-900 group-hover/btn:w-16 group-hover/btn:bg-primary-green transition-all duration-500"></div>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Services;
