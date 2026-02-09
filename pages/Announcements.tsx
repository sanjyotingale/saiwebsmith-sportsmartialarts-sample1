import React, { useEffect, useState, useRef } from 'react';
import { fetchAnnouncements } from '../services/dataService';
import { Announcement } from '../types';
import { ICONS } from '../constants';

export const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAnnouncements().then(setAnnouncements);
  }, []);

  useEffect(() => {
    const gsap = (window as any).gsap;
    if (!gsap || !containerRef.current || announcements.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray('.gsap-reveal').forEach((el: any) => {
        gsap.fromTo(el, 
          { opacity: 0, x: -20 },
          {
            scrollTrigger: {
              trigger: el,
              start: "top 95%",
              end: "bottom 5%",
              toggleActions: "play reverse play reverse"
            },
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power2.out"
          }
        );
      });
    }, containerRef.current);

    return () => ctx.revert();
  }, [announcements, searchTerm]); // Added searchTerm to dependency to re-trigger reveals on filter

  const filteredAnnouncements = announcements.filter(ann => 
    ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ann.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ann.date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div ref={containerRef} className="pt-32 pb-24 bg-transparent min-h-screen px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center gsap-reveal">
          <h1 className="text-[#FFD700] text-4xl sm:text-6xl font-black uppercase tracking-tighter mb-4">Announcements</h1>
          <div className="w-20 h-1 bg-[#B33F00] mx-auto mb-10"></div>
          
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 group-focus-within:text-[#FFD700] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            <input 
              type="text" 
              placeholder="SEARCH" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1A1A1A]/80 glass border border-white/5 pl-14 pr-12 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white outline-none focus:border-[#FFD700]/50 transition-all placeholder:text-gray-700"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-5 flex items-center text-gray-600 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            )}
          </div>
        </div>

        <div className="space-y-8">
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((ann) => (
              <div key={ann.id} className="glass p-8 sm:p-12 gsap-reveal border border-white/5 hover:border-[#FFD700]/10 transition-colors">
                <span className="text-[#FFD700] text-[10px] font-black tracking-widest uppercase block mb-4">{ann.date}</span>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider mb-6 leading-tight">{ann.title}</h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-8 uppercase tracking-widest font-medium opacity-80">{ann.description}</p>
                
                {ann.attachmentUrl && (
                  <a 
                    href={ann.attachmentUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-[#B33F00] text-white px-8 py-3 font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all tap-scale"
                  >
                    View Attachment <ICONS.ExternalLink />
                  </a>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-32 glass border border-white/5 opacity-40">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">No announcements found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};