import React, { useEffect, useState, useRef, useMemo } from 'react';
import { fetchGalleryEvents } from '../services/dataService';
import { GalleryEvent } from '../types';

export const Gallery: React.FC = () => {
  const [events, setEvents] = useState<GalleryEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<GalleryEvent | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Custom Video Player States
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [progress, setProgress] = useState(0); 
  
  const containerRef = useRef<HTMLDivElement>(null);
  const thumbStripRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    fetchGalleryEvents().then(data => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  // Optimized Animation Logic
  useEffect(() => {
    const gsap = (window as any).gsap;
    if (!gsap || loading) return;

    const ctx = gsap.context(() => {
      // Reveal items that are not at the immediate top
      gsap.utils.toArray('.gsap-reveal-content').forEach((el: any) => {
        gsap.fromTo(el, 
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none none"
            }
          }
        );
      });
    }, containerRef.current);

    return () => ctx.revert();
  }, [loading, selectedEvent]);

  const mediaItems = useMemo(() => {
    if (!selectedEvent) return [];
    return [
      ...selectedEvent.images.map(url => ({ type: 'image' as const, url })),
      ...selectedEvent.videos.map(url => ({ type: 'video' as const, url }))
    ];
  }, [selectedEvent]);

  const currentMedia = mediaItems[currentIndex];

  useEffect(() => {
    if (currentMedia?.type === 'video' && videoRef.current) {
      const video = videoRef.current;
      video.muted = isMuted;
      
      const onTimeUpdate = () => {
        if (video.duration) {
          setProgress((video.currentTime / video.duration) * 100);
        }
      };
      const onWaiting = () => setIsBuffering(true);
      const onPlaying = () => {
        setIsBuffering(false);
        setIsPlaying(true);
      };
      const onPause = () => setIsPlaying(false);
      const onEnded = () => setIsPlaying(false);

      video.addEventListener('timeupdate', onTimeUpdate);
      video.addEventListener('waiting', onWaiting);
      video.addEventListener('playing', onPlaying);
      video.addEventListener('pause', onPause);
      video.addEventListener('ended', onEnded);

      video.play().catch(() => setIsPlaying(false));

      return () => {
        video.removeEventListener('timeupdate', onTimeUpdate);
        video.removeEventListener('waiting', onWaiting);
        video.removeEventListener('playing', onPlaying);
        video.removeEventListener('pause', onPause);
        video.removeEventListener('ended', onEnded);
      };
    } else {
      setProgress(0);
      setIsBuffering(false);
    }
  }, [currentIndex, currentMedia, isMuted]);

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current || !videoRef.current.duration) return;
    const value = parseFloat(e.target.value);
    const newTime = (value / 100) * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
    setProgress(value);
  };

  const nextItem = () => {
    if (mediaItems.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
    }
  };

  const prevItem = () => {
    if (mediaItems.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setCurrentIndex(0);
    const ScrollTrigger = (window as any).ScrollTrigger;
    if (ScrollTrigger) ScrollTrigger.refresh();
  }, [selectedEvent]);

  const filteredEvents = events.filter(event => 
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-transparent">
      <div className="w-12 h-12 border-t-2 border-[#FFD700] rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div ref={containerRef} className="pt-32 sm:pt-48 pb-48 bg-transparent px-4 sm:px-6 min-h-screen flex flex-col">
      <style>{`
        .video-scrubber { -webkit-appearance: none; width: 100%; background: transparent; }
        .video-scrubber:focus { outline: none; }
        .video-scrubber::-webkit-slider-runnable-track { width: 100%; height: 4px; cursor: pointer; background: rgba(255, 255, 255, 0.1); border-radius: 2px; }
        .video-scrubber::-webkit-slider-thumb { height: 14px; width: 14px; border-radius: 50%; background: #FFD700; cursor: pointer; -webkit-appearance: none; margin-top: -5px; box-shadow: 0 0 10px rgba(255, 215, 0, 0.6); border: 2px solid white; transition: transform 0.2s ease; }
        .video-scrubber::-webkit-slider-thumb:hover { transform: scale(1.3); }
      `}</style>

      <div className="max-w-7xl mx-auto w-full flex-grow">
        {/* Gallery Title & Metadata - Center Aligned */}
        <div className="mb-20 text-center">
          <h1 className="text-[#FFD700] text-5xl sm:text-7xl font-black uppercase tracking-tighter mb-4 italic leading-none">
            {selectedEvent ? 'Album Detail' : 'Gallery'}
          </h1>
          <div className="w-24 h-1.5 bg-[#B33F00] mb-12 mx-auto"></div>

          {selectedEvent ? (
             <div className="max-w-4xl mx-auto space-y-6 animate-fade-in mb-16 text-center">
                <div className="flex flex-col items-center gap-6">
                   <div>
                      <span className="text-[#FFD700] text-[10px] font-black tracking-[0.5em] uppercase opacity-60 block mb-2">
                         {selectedEvent.date}
                      </span>
                      <h2 className="text-white text-3xl sm:text-5xl font-black uppercase tracking-tight leading-none mb-6">
                        {selectedEvent.name}
                      </h2>
                      <p className="text-gray-500 text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] leading-loose max-w-2xl opacity-80 mx-auto">
                        {selectedEvent.description}
                      </p>
                   </div>
                   <button 
                     onClick={() => setSelectedEvent(null)} 
                     className="inline-flex items-center gap-3 text-gray-400 hover:text-white uppercase text-[9px] font-black tracking-[0.3em] transition-all group px-8 py-4 border border-white/5 glass hover:border-[#FFD700]/20 mt-4"
                   >
                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
                     Back
                   </button>
                </div>
             </div>
          ) : (
            <div className="relative max-w-xl group mx-auto">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-700 group-focus-within:text-[#FFD700] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </div>
              <input 
                type="text" 
                placeholder="SEARCH" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#1A1A1A]/90 glass border border-white/10 pl-16 pr-12 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-white outline-none focus:border-[#FFD700]/50 transition-all placeholder:text-gray-800"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute inset-y-0 right-6 flex items-center text-gray-700 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              )}
            </div>
          )}
        </div>

        {selectedEvent ? (
          <div className="space-y-12 pb-24 flex flex-col items-center">
            <div className="relative w-full max-w-5xl aspect-[16/9] glass border border-white/10 overflow-hidden flex items-center justify-center group shadow-2xl">
              <button onClick={prevItem} className="absolute left-4 z-30 p-4 bg-black/40 hover:bg-[#FFD700] text-white hover:text-black transition-all rounded-full opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 duration-500 hidden sm:flex">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              
              {currentMedia?.type === 'video' ? (
                <div className="relative w-full h-full cursor-pointer overflow-hidden group/player" onClick={() => togglePlay()}>
                  {isBuffering && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-md">
                      <div className="w-16 h-16 border-4 border-white/10 border-t-[#FFD700] rounded-full animate-spin"></div>
                    </div>
                  )}
                  <video ref={videoRef} key={currentMedia.url} src={currentMedia.url} className="w-full h-full object-contain" playsInline loop />
                  {!isPlaying && !isBuffering && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                      <div className="w-20 h-20 bg-[#FFD700]/20 rounded-full flex items-center justify-center border border-[#FFD700]/40 backdrop-blur-sm animate-scale-up shadow-2xl">
                         <svg className="w-10 h-10 text-[#FFD700]" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/95 to-transparent translate-y-full group-hover/player:translate-y-0 transition-transform duration-500 z-50 flex flex-col gap-6" onClick={e => e.stopPropagation()}>
                    <div className="w-full relative h-4 flex items-center group/scrubber">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#FFD700] rounded-full pointer-events-none z-[1] shadow-[0_0_10px_#FFD700]" style={{ width: `${progress}%` }}></div>
                      <input type="range" min="0" max="100" step="0.1" value={progress} onChange={handleScrub} className="video-scrubber relative z-[2]" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-8">
                        <button onClick={togglePlay} className="text-white hover:text-[#FFD700] transition-all transform active:scale-90 duration-300">
                          {isPlaying ? <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> : <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>}
                        </button>
                        <button onClick={() => setIsMuted(!isMuted)} className="text-white hover:text-[#FFD700] transition-all transform active:scale-90 duration-300">
                          {isMuted ? <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg> : <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.08"/></svg>}
                        </button>
                      </div>
                      <span className="text-[10px] text-white/40 font-black tracking-widest font-mono">{currentIndex + 1} / {mediaItems.length}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <img key={currentMedia?.url} src={currentMedia?.url} className="w-full h-full object-contain animate-fade-in cursor-zoom-in" onClick={() => setLightboxImage(currentMedia?.url)} alt="" loading="lazy" />
              )}
              <button onClick={nextItem} className="absolute right-4 z-30 p-4 bg-black/40 hover:bg-[#FFD700] text-white hover:text-black transition-all rounded-full opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 duration-500 hidden sm:flex">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
            <div ref={thumbStripRef} className="w-full max-w-5xl flex gap-3 overflow-x-auto pb-4 scrollbar-hide px-2">
              {mediaItems.map((item, i) => (
                <div key={i} onClick={() => setCurrentIndex(i)} className={`relative shrink-0 w-24 sm:w-32 aspect-video cursor-pointer border-2 transition-all duration-500 overflow-hidden shadow-lg ${currentIndex === i ? 'border-[#FFD700] scale-105 shadow-[0_0_20px_rgba(255,215,0,0.2)]' : 'border-transparent opacity-30 hover:opacity-100'}`}>
                  {item.type === 'video' ? (
                    <div className="w-full h-full bg-black flex items-center justify-center">
                      <svg className="w-8 h-8 text-white opacity-40" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      <span className="absolute bottom-1 right-1 text-[7px] text-white/40 font-black uppercase tracking-tighter">VID</span>
                    </div>
                  ) : (
                    <img src={item.url} className="w-full h-full object-cover" alt="" loading="lazy" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 pb-32">
            {filteredEvents.length > 0 ? filteredEvents.map((event) => (
              <div key={event.id} className="group cursor-pointer glass overflow-hidden transition-all hover:border-[#FFD700]/30 shadow-xl border border-white/5 flex flex-col h-full gsap-reveal-content" onClick={() => setSelectedEvent(event)}>
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img src={event.images[0]} alt={event.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-90"></div>
                  <div className="absolute top-4 right-4 flex gap-2">
                      <div className="bg-[#B33F00] text-white text-[8px] font-black px-4 py-2 uppercase tracking-widest">{event.videos.length} V</div>
                      <div className="bg-[#FFD700] text-black text-[8px] font-black px-4 py-2 uppercase tracking-widest">{event.images.length} P</div>
                  </div>
                </div>
                <div className="p-10 flex flex-col flex-grow">
                  <span className="text-[9px] text-[#FFD700] uppercase font-black tracking-[0.4em] mb-4 block opacity-50">{event.date}</span>
                  <h3 className="text-white font-black uppercase tracking-widest text-[13px] group-hover:text-[#FFD700] transition-colors mb-6 leading-relaxed">{event.name}</h3>
                  <p className="text-gray-600 text-[10px] uppercase tracking-widest leading-relaxed line-clamp-2 mt-auto">
                    {event.description}
                  </p>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-40 text-center glass border border-white/5 opacity-40">
                <p className="text-[11px] font-black uppercase tracking-[0.5em] text-gray-500 italic">No events found matching your search</p>
              </div>
            )}
          </div>
        )}
      </div>

      {lightboxImage && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-12 bg-black/98 backdrop-blur-2xl animate-fade-in" onClick={() => setLightboxImage(null)}>
          <button className="absolute top-10 right-10 text-white/40 hover:text-white" onClick={() => setLightboxImage(null)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <img src={lightboxImage} className="max-w-full max-h-full object-contain shadow-[0_50px_100px_rgba(0,0,0,0.8)] rounded-sm animate-scale-up border border-white/10" alt="" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
};