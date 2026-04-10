import React, { useEffect, useRef, useState } from 'react';

const ContactForm = () => {
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

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: '', message: '' });

    const apiUrl = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://mlx-direct-api.onrender.com/api' : 'http://localhost:5000/api');

    try {
      const response = await fetch(`${apiUrl.replace('/api', '')}/api/contact/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus({ type: 'success', message: 'Message sent successfully! We will contact you soon.' });
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to send message.');
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Something went wrong. Please try again later.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section ref={sectionRef} id="contact" className="pt-12 lg:pt-16 pb-24 lg:pb-32 bg-white relative overflow-hidden">
      
      {/* Subtle Architectural Drafting Lines */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gray-100"></div>
      <div className="absolute top-1/2 left-[5%] w-[1px] h-48 bg-primary-green/5"></div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Elite Section Header */}
        <div className={`mb-16 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="bg-primary-green px-6 py-1.5 rounded-full shadow-lg shadow-primary-green/20">
              <span className="text-white font-black text-xs uppercase tracking-[0.3em]">Send Us a Note</span>
            </div>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase leading-[0.9]">
            Let's Build the <br />
            <span className="text-primary-green italic font-light">Future Together.</span>
          </h2>
        </div>

        {/* Status Message */}
        {status.message && (
          <div className={`mb-8 p-4 rounded-sm text-center text-sm font-bold uppercase tracking-widest ${status.type === 'success' ? 'bg-green-50 text-primary-green border border-primary-green/20' : 'bg-red-50 text-red-600 border border-red-200'}`}>
            {status.message}
          </div>
        )}

        {/* High-Impact Contact Form (Light Mode) */}
        <form onSubmit={handleSubmit} className={`space-y-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Name Field */}
            <div className="group flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1 group-focus-within:text-primary-green transition-colors">Name *</label>
              <input 
                type="text" 
                placeholder="Enter your name"
                className="bg-gray-50 border border-gray-200 px-6 py-4 text-gray-900 text-sm focus:bg-white focus:border-primary-green focus:outline-none focus:ring-4 focus:ring-primary-green/5 transition-all duration-300 rounded-sm placeholder:text-gray-400"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            {/* Email Field */}
            <div className="group flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1 group-focus-within:text-primary-green transition-colors">Email *</label>
              <input 
                type="email" 
                placeholder="Enter your email"
                className="bg-gray-50 border border-gray-200 px-6 py-4 text-gray-900 text-sm focus:bg-white focus:border-primary-green focus:outline-none focus:ring-4 focus:ring-primary-green/5 transition-all duration-300 rounded-sm placeholder:text-gray-400"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Phone Field */}
          <div className="group flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1 group-focus-within:text-primary-green transition-colors">Phone Number</label>
            <input 
              type="tel" 
              placeholder="Type your phone number"
              className="bg-gray-50 border border-gray-200 px-6 py-4 text-gray-900 text-sm focus:bg-white focus:border-primary-green focus:outline-none focus:ring-4 focus:ring-primary-green/5 transition-all duration-300 rounded-sm placeholder:text-gray-400"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          {/* Message Field */}
          <div className="group flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1 group-focus-within:text-primary-green transition-colors">Message</label>
            <textarea 
              rows="5"
              placeholder="Type your message here..."
              className="bg-gray-50 border border-gray-200 px-6 py-4 text-gray-900 text-sm focus:bg-white focus:border-primary-green focus:outline-none focus:ring-4 focus:ring-primary-green/5 transition-all duration-300 rounded-sm placeholder:text-gray-400 resize-none"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            ></textarea>
          </div>

          {/* Form Action Button */}
          <div className="flex justify-end pt-4">
             <button 
               type="submit" 
               disabled={isLoading}
               className="group relative px-16 py-5 bg-gray-900 overflow-hidden rounded-sm shadow-xl transition-all duration-500 hover:shadow-primary-green/20 disabled:opacity-50"
             >
                <span className="relative z-10 text-white text-[10px] font-black uppercase tracking-[0.5em] group-hover:text-white transition-colors duration-500">
                  {isLoading ? 'Processing...' : 'Send Message'}
                </span>
                <div className="absolute inset-0 bg-primary-green translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
             </button>
          </div>

        </form>

      </div>
    </section>
  );
};

export default ContactForm;
