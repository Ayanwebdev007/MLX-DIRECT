import React, { useEffect, useState } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaGlobe, FaClock } from 'react-icons/fa';

const ContactPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // TODO: Connect to backend API
    alert("Thank you for contacting us! We will get back to you shortly.");
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="bg-white font-sans overflow-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
           <img 
             src="/service-consulting.png" 
             alt="Contact MLX Direct" 
             className="w-full h-full object-cover brightness-50"
           />
           <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-transparent to-gray-900/80"></div>
        </div>
        
        <div className={`relative z-10 max-w-7xl mx-auto px-6 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <h4 className="text-primary-green text-xs font-black uppercase tracking-[0.5em] mb-6">Reach Out</h4>
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.8] mb-8">
            Contact <span className="text-primary-green">Us</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-200 font-light tracking-wide leading-relaxed">
            We're here to help and answer any question you might have.
          </p>
        </div>
      </section>

      {/* 2. Contact Information & Form */}
      <section className="py-24 lg:py-32 bg-gray-50 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
             
             {/* Left: Contact Info (2 columns) */}
             <div className="lg:col-span-2 space-y-12">
                <div>
                   <h4 className="text-primary-green text-[10px] font-black uppercase tracking-[0.5em] mb-4">Get In Touch</h4>
                   <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-[0.9] mb-6">
                      Let's start a <br/>
                      <span className="text-primary-green italic font-light tracking-tight">conversation.</span>
                   </h2>
                   <p className="text-gray-500 text-sm leading-relaxed">
                      Whether you have a question about our services, pricing, or anything else, our team is ready to answer all your questions.
                   </p>
                </div>

                <div className="space-y-8">
                   <div className="flex items-start gap-6 group">
                      <div className="w-14 h-14 bg-white shadow-xl flex items-center justify-center text-primary-green text-xl group-hover:bg-primary-green group-hover:text-white transition-colors duration-300">
                         <FaMapMarkerAlt />
                      </div>
                      <div>
                         <h6 className="font-black text-xs uppercase tracking-widest text-gray-900 mb-2">Headquarters</h6>
                         <p className="text-sm font-medium text-gray-500">Fort Lauderdale, Florida,<br/> United States</p>
                      </div>
                   </div>

                   <div className="flex items-start gap-6 group">
                      <div className="w-14 h-14 bg-white shadow-xl flex items-center justify-center text-primary-green text-xl group-hover:bg-primary-green group-hover:text-white transition-colors duration-300">
                         <FaPhoneAlt />
                      </div>
                      <div>
                         <h6 className="font-black text-xs uppercase tracking-widest text-gray-900 mb-2">Phone Support</h6>
                         <p className="text-sm font-medium text-gray-500">+1 (806) 429 1952</p>
                      </div>
                   </div>

                   <div className="flex items-start gap-6 group">
                      <div className="w-14 h-14 bg-white shadow-xl flex items-center justify-center text-primary-green text-xl group-hover:bg-primary-green group-hover:text-white transition-colors duration-300">
                         <FaEnvelope />
                      </div>
                      <div>
                         <h6 className="font-black text-xs uppercase tracking-widest text-gray-900 mb-2">Email Address</h6>
                         <p className="text-sm font-medium text-gray-500">admin@mlxdirect.com</p>
                      </div>
                   </div>

                   <div className="flex items-start gap-6 group">
                      <div className="w-14 h-14 bg-white shadow-xl flex items-center justify-center text-primary-green text-xl group-hover:bg-primary-green group-hover:text-white transition-colors duration-300">
                         <FaClock />
                      </div>
                      <div>
                         <h6 className="font-black text-xs uppercase tracking-widest text-gray-900 mb-2">Working Hours</h6>
                         <p className="text-sm font-medium text-gray-500">Mon - Fri: 9:00 AM - 6:00 PM<br/> Weekend: Closed</p>
                      </div>
                   </div>
                </div>
             </div>

             {/* Right: Contact Form (3 columns) */}
             <div className="lg:col-span-3 bg-white p-10 md:p-14 shadow-2xl relative">
                <div className="absolute top-0 right-0 w-2 h-full bg-primary-green"></div>
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 text-gray-900">
                   Send Us A Message
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="flex flex-col relative group">
                         <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 transition-colors group-focus-within:text-primary-green">Your Name</label>
                         <input 
                            type="text" 
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="border-b-2 border-gray-200 py-2 focus:outline-none focus:border-primary-green bg-transparent transition-colors text-sm font-medium text-gray-700" 
                         />
                      </div>
                      <div className="flex flex-col relative group">
                         <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 transition-colors group-focus-within:text-primary-green">Your Email</label>
                         <input 
                            type="email" 
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="border-b-2 border-gray-200 py-2 focus:outline-none focus:border-primary-green bg-transparent transition-colors text-sm font-medium text-gray-700" 
                         />
                      </div>
                   </div>

                   <div className="flex flex-col relative group">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 transition-colors group-focus-within:text-primary-green">Subject</label>
                      <input 
                         type="text" 
                         name="subject"
                         required
                         value={formData.subject}
                         onChange={handleChange}
                         className="border-b-2 border-gray-200 py-2 focus:outline-none focus:border-primary-green bg-transparent transition-colors text-sm font-medium text-gray-700" 
                      />
                   </div>

                   <div className="flex flex-col relative group">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 transition-colors group-focus-within:text-primary-green">Message</label>
                      <textarea 
                         rows="5" 
                         name="message"
                         required
                         value={formData.message}
                         onChange={handleChange}
                         className="border-b-2 border-gray-200 py-2 focus:outline-none focus:border-primary-green bg-transparent transition-colors text-sm font-medium resize-none text-gray-700"
                      ></textarea>
                   </div>
                   
                   <button type="submit" className="bg-gray-900 text-white px-10 py-5 font-black tracking-[0.2em] uppercase text-xs hover:bg-primary-green transition-all duration-300 shadow-xl hover:-translate-y-1">
                      Send Message
                   </button>
                </form>
             </div>

          </div>
        </div>
      </section>

      {/* 3. Global Reach Map Placeholder */}
      <section className="bg-gray-900 text-white py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <FaGlobe className="w-full h-full text-white/5 absolute -top-1/4 right-0 scale-150 rotate-12" />
        </div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-8">
           <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-[0.85]">
              Global Reach. <br />
              <span className="text-primary-green italic font-light">Local Expertise.</span>
           </h2>
           <p className="text-gray-400 text-sm leading-relaxed max-w-xl mx-auto">
             Our robust network of associates allows us to support you wherever your operations take you across the globe.
           </p>
        </div>
      </section>

    </div>
  );
};

export default ContactPage;
