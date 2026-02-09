import React, { useEffect, useState, useRef } from 'react';
import { fetchBranches } from '../services/dataService';
import { Branch } from '../types';

export const Branches: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchBranches().then(setBranches);
  }, []);

  useEffect(() => {
    const gsap = (window as any).gsap;
    if (!gsap || !containerRef.current || branches.length === 0) return;

    const ctx = gsap.context(() => {
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
            duration: 1,
            ease: "power2.out"
          }
        );
      });
    }, containerRef.current);

    return () => ctx.revert();
  }, [branches]);

  return (
    <div ref={containerRef} className="pt-32 sm:pt-40 pb-32 bg-transparent px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 text-center gsap-reveal">
          <h1 className="text-[#FFD700] text-4xl sm:text-6xl font-black uppercase tracking-tighter mb-4">OUR BRANCHES</h1>
          <div className="w-16 h-1.5 bg-[#B33F00] mx-auto mb-6"></div>
          <p className="text-gray-500 tracking-widest text-[9px] uppercase font-bold">Find an academy center near you</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
          {branches.map(branch => (
            <div key={branch.id} className="glass overflow-hidden group hover:border-[#FFD700]/30 transition-all duration-500 shadow-2xl gsap-reveal">
              <div className="aspect-video overflow-hidden">
                 <img src={branch.image} alt={branch.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" />
              </div>
              <div className="p-8">
                <h3 className="text-white text-xl font-black uppercase tracking-widest mb-4 group-hover:text-[#FFD700] transition-colors">{branch.name}</h3>
                <div className="space-y-3 mb-8">
                  <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold leading-relaxed">{branch.address}</p>
                  <p className="text-[#FFD700] text-[10px] uppercase font-black tracking-widest">{branch.contactNumber}</p>
                </div>
                <div className="flex gap-4">
                  <a href={`tel:${branch.contactNumber}`} className="bg-[#B33F00] text-white px-6 py-3 font-black uppercase tracking-widest text-[9px] hover:bg-white hover:text-black transition-all">Call Now</a>
                  <a href={branch.googleMapsLink} className="border border-white/10 text-white px-6 py-3 font-black uppercase tracking-widest text-[9px] hover:border-[#FFD700] hover:text-[#FFD700] transition-all">Directions</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};