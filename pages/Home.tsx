import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchAnnouncements, fetchGalleryEvents, fetchInstructors } from '../services/dataService';
import { Announcement, GalleryEvent, Instructor } from '../types';
import { ACADEMY_NAME } from '../constants';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [gallery, setGallery] = useState<GalleryEvent[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const homeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      const allAnn = await fetchAnnouncements();
      setAnnouncements(allAnn.filter(a => a.showOnHome).slice(0, 3));
      const allGal = await fetchGalleryEvents();
      setGallery(allGal.filter(e => e.showOnHome).slice(0, 3));
      const allIns = await fetchInstructors();
      setInstructors(allIns.slice(0, 3)); 
    };
    loadData();
  }, []);

  useEffect(() => {
    const gsap = (window as any).gsap;
    if (!gsap || !homeRef.current) return;

    const ctx = gsap.context(() => {
      // Hero Entrance (Plays once on load)
      const tl = gsap.timeline();
      tl.to(".hero-title span", {
        y: 0,
        duration: 1.5,
        ease: "expo.out",
        stagger: 0.1
      })
      .from(".hero-sub", { opacity: 0, y: 10, duration: 1 }, "-=1")
      .from(".hero-btns", { opacity: 0, scale: 0.98, duration: 1.2, ease: "power2.out" }, "-=1");

      // Staggered reveals for cards - Re-triggers every time
      gsap.utils.toArray('.gsap-stagger-parent').forEach((parent: any) => {
        gsap.fromTo(parent.querySelectorAll('.gsap-reveal-child'), 
          { opacity: 0, y: 30 },
          {
            scrollTrigger: {
              trigger: parent,
              start: "top 90%",
              end: "bottom 10%",
              toggleActions: "play reverse play reverse",
            },
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power2.out"
          }
        );
      });

      // Titles Reveal - Re-triggers every time
      gsap.utils.toArray('.gsap-title-reveal').forEach((el: any) => {
        gsap.fromTo(el, 
          { opacity: 0, x: -30 },
          {
            scrollTrigger: {
              trigger: el,
              start: "top 95%",
              end: "bottom 5%",
              toggleActions: "play reverse play reverse",
            },
            opacity: 1,
            x: 0,
            duration: 1.2,
            ease: "power3.out"
          }
        );
      });

      // Parallax Background
      gsap.to(".hero-parallax", {
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true
        },
        y: 150,
        ease: "none"
      });

    }, homeRef.current);

    return () => ctx.revert();
  }, [announcements, gallery, instructors]);

  return (
    <div ref={homeRef} className="bg-transparent">
      {/* Hero Section */}
      <section className="hero-section relative h-[90vh] sm:h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?auto=format&fit=crop&q=80&w=1920" 
            className="hero-parallax w-full h-[120%] object-cover opacity-25" 
            alt="Hero Background"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/60 z-[1]"></div>
        
        <div className="relative z-10 text-center px-6">
          <h1 className="hero-title text-5xl sm:text-7xl md:text-9xl font-black text-white mb-6 uppercase tracking-tighter leading-[0.85] italic">
            <div className="reveal-text"><span>{ACADEMY_NAME.split(' ')[0]}</span></div>
            <br />
            <div className="reveal-text"><span className="text-[#FFD700]">{ACADEMY_NAME.split(' ').slice(1).join(' ')}</span></div>
          </h1>
          <p className="hero-sub text-gray-400 text-[9px] sm:text-[11px] tracking-[0.8em] mb-12 uppercase font-black opacity-50">
            Tagline Here
          </p>
          <div className="hero-btns flex flex-col sm:flex-row gap-5 justify-center">
            <Link to="/admission" className="bg-[#B33F00] text-white px-12 py-5 text-[10px] uppercase font-black tracking-widest hover:bg-white hover:text-black transition-all duration-500 shadow-xl tap-scale">
              Join Now
            </Link>
            <Link to="/about" className="glass text-white px-12 py-5 text-[10px] uppercase font-black tracking-widest hover:bg-white hover:text-black transition-all duration-500 tap-scale">
              About Us
            </Link>
          </div>
        </div>
      </section>

      {/* Announcements */}
      <section className="py-24 sm:py-48 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-20 gap-8 gsap-title-reveal">
            <div className="text-center md:text-left">
              <h2 className="text-[#FFD700] text-3xl sm:text-6xl font-black uppercase tracking-tighter mb-4 italic">Announcements</h2>
              <div className="w-16 h-1 bg-[#B33F00] mx-auto md:mx-0"></div>
            </div>
            <Link to="/announcements" className="text-gray-500 hover:text-white text-[9px] uppercase font-black tracking-widest border-b border-white/10 pb-2 transition-all">
              View All Updates
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 gsap-stagger-parent">
            {announcements.map((ann) => (
              <div key={ann.id} className="glass p-10 group gsap-reveal-child hover:border-[#FFD700]/20 transition-all duration-500 flex flex-col h-full">
                <span className="text-[8px] text-[#FFD700] font-black tracking-[0.3em] uppercase mb-6 block opacity-40">{ann.date}</span>
                <h3 className="text-xl font-black text-white mb-6 uppercase leading-tight group-hover:text-[#FFD700] transition-colors">{ann.title}</h3>
                <p className="text-gray-500 text-[10px] mb-10 line-clamp-3 leading-relaxed uppercase tracking-widest font-bold flex-grow">{ann.description}</p>
                <Link to="/announcements" className="text-white text-[8px] font-black uppercase tracking-widest border-b border-white/10 pb-2 hover:border-[#FFD700] transition-all self-start">
                  Read Detail
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 sm:py-48 px-6 bg-transparent relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-20 gap-8 gsap-title-reveal">
            <div className="text-center md:text-left">
              <h2 className="text-[#FFD700] text-3xl sm:text-6xl font-black uppercase tracking-tighter mb-4 italic">Gallery</h2>
              <div className="w-16 h-1 bg-[#B33F00] mx-auto md:mx-0"></div>
            </div>
            <Link to="/gallery" className="text-gray-500 hover:text-white text-[9px] uppercase font-black tracking-widest border-b border-white/10 pb-2 transition-all">
              The Archive
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 gsap-stagger-parent">
            {gallery.map((event) => (
              <div 
                key={event.id} 
                className="relative group cursor-pointer overflow-hidden aspect-[4/5] glass gsap-reveal-child shadow-2xl"
                onClick={() => navigate(`/gallery`)}
              >
                <img src={event.images[0]} alt={event.name} className="w-full h-full object-cover transition-all duration-[1.5s] group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                <div className="absolute inset-0 flex items-end p-10">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                    <span className="text-[#FFD700] text-[7px] font-bold tracking-[0.4em] uppercase mb-3 block">{event.date}</span>
                    <h3 className="text-white font-black uppercase tracking-widest text-lg leading-tight">{event.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructors Section */}
      <section className="py-24 sm:py-48 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 gsap-title-reveal">
            <h2 className="text-[#FFD700] text-3xl sm:text-6xl font-black uppercase tracking-tighter mb-4 italic">Our Instructors</h2>
            <div className="w-16 h-1 bg-[#B33F00] mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-16 sm:gap-12 gsap-stagger-parent">
            {instructors.map((ins) => (
              <div key={ins.id} className="text-center gsap-reveal-child group">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto mb-10 tap-scale">
                   <div className="absolute inset-[-8px] rounded-full border border-white/5 group-hover:border-[#FFD700]/30 transition-all duration-700"></div>
                  <img src={ins.photo} alt={ins.name} className="w-full h-full object-cover rounded-full p-2 transition-all duration-1000" />
                </div>
                <h3 className="text-white font-black text-xl uppercase tracking-widest mb-2 group-hover:text-[#FFD700] transition-colors">{ins.name}</h3>
                <p className="text-[#FFD700] text-[9px] font-bold uppercase tracking-[0.4em] opacity-40">{ins.designation}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};