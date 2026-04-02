import React, { useEffect, useRef, useState } from 'react';
import { FaCheckCircle, FaMapMarkerAlt, FaRegCalendarAlt } from 'react-icons/fa';

const Portfolio = () => {
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

  const projects = [
    { id: "BOA-P01", title: "STRUCTURAL SITE AUDIT", cat: "INDUSTRIAL RADIOGRAPHY", img: "/portfolio/MLX 1.webp" },
    { id: "BOA-P02", title: "ENGINEERING SYNERGY", cat: "TECHNICAL TEAM", img: "/port-team.png" }, // Human
    { id: "BOA-P03", title: "INFRASTRUCTURE SCALE", cat: "LAND DEVELOPMENT", img: "/portfolio/MLX 11.webp" },
    { id: "BOA-P04", title: "SITE PLANNING", cat: "INDUSTRIAL DESIGN", img: "/port-site.png" }, // Unique Human (Replaced duplicate)
    { id: "BOA-P05", title: "ADVANCED RADIOGRAPHY", cat: "SAFETY AUDIT", img: "/portfolio/MLX 13.webp" },
    { id: "BOA-P06", title: "PROCESS OPTIMIZATION", cat: "INDUSTRIAL OPERATIONS", img: "/about-industrial.png" }, // Human
    { id: "BOA-P07", title: "INDUSTRIAL TRADING", cat: "GLOBAL LOGISTICS", img: "/portfolio/MLX 15.webp" },
    { id: "BOA-P08", title: "OPERATIONAL INTELLIGENCE", cat: "MANAGEMENT", img: "/port-vision.png" }, // Human
    { id: "BOA-P09", title: "ELITE OPERATIONS", cat: "STRATEGIC PLANNING", img: "/portfolio/MLX 28.webp" },
    { id: "BOA-P10", title: "ASSET INTEGRITY", cat: "INSPECTION", img: "/portfolio/MLX 30.webp" },
    { id: "BOA-P11", title: "PROJECT SYNERGY", cat: "TECHNICAL DESIGN", img: "/portfolio/MLX 6.webp" },
    { id: "BOA-P12", title: "PRECISION TRADING", cat: "SUPPLY CHAIN", img: "/portfolio/MLX 7.webp" }
  ];

  return (
    <section ref={sectionRef} className="pt-6 lg:pt-8 pb-12 lg:pb-16 bg-white relative overflow-hidden">
      
      {/* Structural Drafting Lines (Minimalist Accent) */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gray-100"></div>
      <div className="absolute top-1/2 left-[10%] w-[1px] h-32 bg-primary-green/10"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Elite Section Header */}
        <div className={`mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-primary-green px-4 py-1 rounded-full">
              <span className="text-white font-black text-xs uppercase tracking-[0.2em]">Our Recent Work</span>
            </div>
            <div className="h-[1px] w-24 bg-gray-200"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-[0.9]">
            Architectural Precision. <br />
            <span className="text-primary-green italic font-light">Global Impact.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {projects.map((project, idx) => (
            <div 
              key={project.id}
              className={`group relative overflow-hidden rounded-sm shadow-sm transition-all duration-1000 delay-[${idx * 50}ms] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              {/* Visual Area */}
              <div className="relative h-[300px] overflow-hidden bg-gray-50 border border-gray-100">
                <img 
                  src={project.img} 
                  alt="Portfolio Work" 
                  className="w-full h-full object-cover brightness-[0.95] group-hover:brightness-110 group-hover:scale-110 transition-all duration-1000 ease-out" 
                />
                
                {/* Subtle Emerald Inset Border on Hover */}
                <div className="absolute inset-4 border border-primary-green opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Portfolio;
