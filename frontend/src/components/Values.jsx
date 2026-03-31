import React, { useEffect, useRef, useState } from 'react';
import { FaLeaf, FaHandshake, FaAward } from 'react-icons/fa';

const Values = () => {
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

  const values = [
    {
      no: "01",
      icon: <FaLeaf />,
      title: "Sustainable Growth",
      desc: "Championing environmental responsibility and long-term viability in every project, ensuring a greener legacy for the industries we serve."
    },
    {
      no: "02",
      icon: <FaHandshake />,
      title: "Uncompromising Integrity",
      desc: "Operating with absolute transparency and ethical rigor, we build foundations of trust that span continents and regulatory landscapes."
    },
    {
      no: "03",
      icon: <FaAward />,
      title: "Elite Quality Assurance",
      desc: "Precision-driven auditing and inspection services that ensure your operations surpass the world's most exacting quality benchmarks."
    }
  ];

  return (
    <section ref={sectionRef} className="pt-32 pb-16 bg-gray-50 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-green/5 -skew-x-12 transform origin-top-right"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className={`mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[2px] w-12 bg-primary-green"></div>
            <span className="text-primary-green font-black uppercase tracking-[0.3em] text-xs">Our Core Foundation</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase">
            Values that Drive <span className="text-primary-green">Excellence</span>
          </h2>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-l border-gray-200">
          {values.map((item, idx) => (
            <div 
              key={idx}
              className={`group relative p-12 bg-white border-r border-b border-gray-200 hover:bg-gray-900 transition-all duration-700 overflow-hidden ${isVisible ? 'opacity-100' : 'opacity-0'}`}
              style={{ transitionDelay: `${idx * 150}ms` }}
            >
              {/* Massive Backdrop Number */}
              <span className="absolute -bottom-4 -right-2 text-9xl font-black text-gray-100 group-hover:text-white/5 transition-colors pointer-events-none">
                {item.no}
              </span>

              {/* Icon Container */}
              <div className="bg-primary-green/10 w-14 h-14 rounded-full flex items-center justify-center text-primary-green text-2xl mb-8 group-hover:bg-primary-green group-hover:text-white transition-all duration-500 transform group-hover:rotate-[360deg]">
                {item.icon}
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-xl font-bold uppercase tracking-widest text-gray-900 group-hover:text-white mb-6 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-500 group-hover:text-gray-400 leading-relaxed font-light transition-colors">
                  {item.desc}
                </p>
              </div>

              {/* Bottom Accent Line */}
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-primary-green group-hover:w-full transition-all duration-700"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Values;
