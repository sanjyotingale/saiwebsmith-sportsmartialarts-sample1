import React, { useEffect, useRef } from 'react';
import { ACADEMY_NAME } from '../constants';

export const About: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sampleText = "Dedicated to forging spirit and strength, our academy represents excellence in martial arts training. ";
  const repeatedText = sampleText.repeat(8);

  useEffect(() => {
    const gsap = (window as any).gsap;
    if (!gsap || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Reveal all blocks with gsap-reveal class
      gsap.utils.toArray('.gsap-reveal').forEach((el: any) => {
        gsap.fromTo(el, 
          { opacity: 0, y: 30 },
          {
            scrollTrigger: {
              trigger: el,
              start: "top 95%",
              end: "bottom 5%",
              toggleActions: "play reverse play reverse"
            },
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power2.out"
          }
        );
      });

      // Stats stagger
      gsap.fromTo(".stat-item", 
        { opacity: 0, y: 20 },
        {
          scrollTrigger: {
            trigger: ".stat-container",
            start: "top 95%",
            toggleActions: "play reverse play reverse"
          },
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.7)"
        }
      );
    }, containerRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="pt-32 sm:pt-40 pb-24 sm:pb-32 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 sm:mb-20 text-center px-4 gsap-reveal">
          <h1 className="text-[#FFD700] text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter mb-4 leading-tight">
            ABOUT {ACADEMY_NAME}
          </h1>
          <div className="w-20 h-1.5 bg-[#B33F00] mx-auto"></div>
          <p className="text-gray-500 mt-8 tracking-[0.3em] sm:tracking-[0.4em] text-[8px] sm:text-[10px] uppercase font-bold px-2">Strength Through Discipline</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 sm:gap-20 mb-32 items-center">
          <div className="space-y-8 sm:space-y-10 text-center lg:text-left glass p-8 sm:p-12 gsap-reveal">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-[0.2em] text-white">OUR PHILOSOPHY</h2>
            <p className="text-gray-400 leading-relaxed uppercase tracking-widest text-[10px] sm:text-xs font-medium px-2 sm:px-0">
              {repeatedText}
            </p>
            <div className="grid grid-cols-2 gap-10 pt-6 justify-center lg:justify-start stat-container">
              <div className="stat-item">
                <span className="text-[#FFD700] text-2xl sm:text-3xl font-black block mb-1">10+</span>
                <span className="text-gray-500 text-[7px] sm:text-[8px] font-black uppercase tracking-widest">Years Legacy</span>
              </div>
              <div className="stat-item">
                <span className="text-[#FFD700] text-2xl sm:text-3xl font-black block mb-1">500+</span>
                <span className="text-gray-500 text-[7px] sm:text-[8px] font-black uppercase tracking-widest">Active Students</span>
              </div>
            </div>
          </div>
          <div className="relative border border-[#FFD700]/10 rounded-sm overflow-hidden group max-w-lg mx-auto lg:max-w-none shadow-2xl gsap-reveal">
             <img src="https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?auto=format&fit=crop&q=80&w=1200" className="w-full h-[300px] sm:h-[400px] object-cover rounded-sm group-hover:scale-105 transition-transform duration-[2000ms]" alt="Academy Training" />
             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 mb-20 gsap-stagger-parent">
          {[
            { title: "FOUNDATIONAL ARTS", desc: "Our core curriculum focuses on structural integrity, discipline, and essential techniques for all practitioners." },
            { title: "ADVANCED MASTERY", desc: "Refining combat skills through elite technical workshops and high-intensity conditioning sessions." },
            { title: "COMBATIVE SPIRIT", desc: "Specialized training focusing on tactical awareness and competition-level excellence." }
          ].map((item, idx) => (
            <div key={idx} className="glass p-10 border-t-4 border-[#FFD700] shadow-xl group hover:-translate-y-2 transition-transform duration-500 gsap-reveal">
              <h3 className="text-white font-black uppercase tracking-widest mb-6 text-sm group-hover:text-[#FFD700] transition-colors">{item.title}</h3>
              <p className="text-gray-500 text-[10px] leading-loose uppercase tracking-widest font-bold">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};