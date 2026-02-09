import React, { useEffect, useState, useRef } from 'react';
import { fetchInstructors } from '../services/dataService';
import { Instructor } from '../types';

export const Instructors: React.FC = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchInstructors().then((data) => setInstructors(data));
  }, []);

  useEffect(() => {
    const gsap = (window as any).gsap;
    if (!gsap || !containerRef.current) return;

    const ctx = gsap.context(() => {
        gsap.utils.toArray('.gsap-reveal-card').forEach((el: any) => {
            gsap.fromTo(el, 
                { opacity: 0, y: 50, scale: 0.98 },
                {
                    opacity: 1, y: 0, scale: 1,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 95%",
                        end: "bottom 5%",
                        toggleActions: "play reverse play reverse"
                    }
                }
            );
        });
    }, containerRef.current);

    return () => ctx.revert();
  }, [instructors]);

  const toggleBiography = (id: string) => {
    const next = new Set(expandedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedIds(next);
  };

  return (
    <div ref={containerRef} className="pt-32 sm:pt-48 pb-48 bg-transparent px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-32 text-center gsap-reveal-card">
          <h1 className="text-[#FFD700] text-4xl sm:text-7xl font-black uppercase tracking-tighter mb-8 italic">
            Our Instructors
          </h1>
          <div className="w-24 h-1.5 bg-[#B33F00] mx-auto mb-8"></div>
          <p className="text-gray-500 tracking-[0.6em] text-[10px] uppercase font-bold opacity-60">
            Quote Text Here
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {instructors.map((ins) => {
            const isExpanded = expandedIds.has(ins.id);
            
            return (
              <div 
                key={ins.id} 
                className="flex flex-col group gsap-reveal-card"
              >
                <div className="glass overflow-hidden transition-all duration-700 hover:translate-y-[-12px] p-8 sm:p-12 flex flex-col h-full border border-white/10 hover:border-[#FFD700]/20 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]">
                  
                  {/* Photo Section */}
                  <div className="relative w-44 h-44 sm:w-56 sm:h-56 mx-auto mb-12 rounded-full p-2 shrink-0">
                    <div className="absolute inset-[-5px] rounded-full border border-white/10 group-hover:border-[#FFD700]/30 transition-all duration-1000"></div>
                    <div className="w-full h-full rounded-full overflow-hidden">
                      <img 
                        src={ins.photo} 
                        alt={ins.name} 
                        className="w-full h-full object-cover transition-transform duration-[2.5s] ease-out group-hover:scale-110" 
                      />
                    </div>
                  </div>

                  {/* Header */}
                  <div className="text-center mb-12">
                    <h3 className="text-white font-black text-2xl uppercase tracking-widest mb-3 group-hover:text-[#FFD700] transition-colors duration-500">
                      {ins.name}
                    </h3>
                    <p className="text-[#FFD700] text-[9px] font-black uppercase tracking-[0.5em] opacity-40">
                      {ins.designation}
                    </p>
                  </div>

                  {/* Collapsible Biography (Merged Journey + Achievements) */}
                  <div className="flex-grow">
                    <button 
                      onClick={() => toggleBiography(ins.id)}
                      className="w-full flex justify-between items-center py-4 border-b border-white/10 text-[10px] uppercase font-black tracking-widest text-gray-400 hover:text-[#FFD700] transition-colors"
                    >
                      <span>Biography</span>
                      <svg 
                        className={`w-3.5 h-3.5 transition-transform duration-700 ${isExpanded ? 'rotate-180' : ''}`} 
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"
                      >
                        <path d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.23, 1, 0.32, 1)] ${isExpanded ? 'max-h-[1000px] opacity-100 py-8' : 'max-h-0 opacity-0'}`}>
                      <div className="space-y-6">
                        <p className="text-gray-500 text-[11px] leading-loose uppercase tracking-[0.2em] font-medium">
                          {ins.journey}
                        </p>
                        
                        {ins.achievements && ins.achievements.length > 0 && (
                          <div className="pt-4 border-t border-white/5">
                            <h4 className="text-[#FFD700] text-[9px] font-black uppercase tracking-[0.4em] mb-4 opacity-60">Hall of Achievement</h4>
                            <ul className="space-y-4">
                              {ins.achievements.map((ach, idx) => (
                                <li key={idx} className="flex items-start gap-4 text-[10px] text-gray-500 uppercase font-black tracking-widest">
                                  <span className="w-1.5 h-1.5 bg-[#FFD700] mt-1.5 rotate-45 shrink-0" />
                                  <span className="leading-relaxed opacity-80">{ach}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};