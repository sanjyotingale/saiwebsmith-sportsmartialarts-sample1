import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ACADEMY_NAME, ACADEMY_LOGO_URL, NAV_LINKS, ICONS, ACADEMY_ADDRESS, ACADEMY_PHONE, ACADEMY_EMAIL, SOCIAL_LINKS } from '../constants';

const Navbar: React.FC = () => {
  const { pathname } = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMenuOpen]);

  useEffect(() => setIsMenuOpen(false), [pathname]);

  const isNavActive = isScrolled || isMenuOpen;

  return (
    <>
      <nav ref={navRef} className={`fixed top-0 left-0 w-full z-[110] transition-all duration-700 ${isNavActive ? 'py-4 glass border-b border-white/10 shadow-2xl' : 'py-8 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="relative">
                <div className="absolute inset-0 bg-[#FFD700]/10 rounded-full blur-xl scale-0 group-hover:scale-125 transition-transform duration-700"></div>
                <img src={ACADEMY_LOGO_URL} alt="Logo" className="w-10 h-10 sm:w-14 sm:h-14 object-contain relative z-10 transition-transform duration-700 group-hover:rotate-[15deg]" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-black tracking-tighter text-sm sm:text-lg uppercase leading-none group-hover:text-[#FFD700] transition-colors">{ACADEMY_NAME}</span>
              <span className="text-gray-500 font-bold tracking-[0.4em] text-[8px] uppercase opacity-60">Professional Portal</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            {NAV_LINKS.map(link => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`text-[9px] uppercase font-black tracking-[0.3em] transition-all relative group py-2 ${pathname === link.path ? 'text-[#FFD700]' : 'text-gray-400 hover:text-white'}`}
              >
                {link.name}
                <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-[#FFD700] origin-left transition-transform duration-500 ${pathname === link.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </Link>
            ))}
            <Link to="/admission" className="bg-[#B33F00] text-white px-8 py-3.5 text-[9px] uppercase font-black tracking-widest hover:bg-white hover:text-black transition-all shadow-lg hover:shadow-[#B33F00]/20">
              Admission
            </Link>
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-white tap-scale relative z-[120]">
            <div className="w-6 flex flex-col items-end gap-1.5">
                <div className={`h-[2px] bg-white transition-all duration-500 ${isMenuOpen ? 'w-6 rotate-45 translate-y-[8px]' : 'w-6'}`}></div>
                <div className={`h-[2px] bg-[#FFD700] transition-all duration-500 ${isMenuOpen ? 'w-6 -rotate-45' : 'w-4'}`}></div>
            </div>
          </button>
        </div>
      </nav>

      <div className={`fixed inset-0 z-[100] transition-all duration-700 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div onClick={() => setIsMenuOpen(false)} className="absolute inset-0 bg-transparent"/>
        <div className={`absolute top-0 right-0 w-[85%] max-w-sm h-full glass border-l border-white/10 flex flex-col p-12 pt-32 shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.23, 1, 0.32, 1)] ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col gap-8">
            {NAV_LINKS.map((link, i) => (
              <Link 
                key={link.path} 
                to={link.path} 
                style={{ transitionDelay: `${i * 50}ms` }}
                className={`text-xl uppercase font-black tracking-widest transition-all ${isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'} ${pathname === link.path ? 'text-[#FFD700]' : 'text-white/40 hover:text-white'}`}
              >
                {link.name}
              </Link>
            ))}
            <Link 
              to="/admission" 
              className={`text-xl uppercase font-black tracking-widest text-[#B33F00] mt-4 transition-all ${isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}
              style={{ transitionDelay: `${NAV_LINKS.length * 50}ms` }}
            >
              Admission Portal
            </Link>
          </div>
          <div className="mt-auto border-t border-white/5 pt-12">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-4">Support Center</p>
            <p className="text-white font-black text-sm tracking-tighter mb-1">{ACADEMY_PHONE}</p>
            <p className="text-gray-600 text-[10px] uppercase tracking-widest font-bold">{ACADEMY_EMAIL}</p>
          </div>
        </div>
      </div>
    </>
  );
};

const Footer: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const gsap = (window as any).gsap;
    if (!gsap || !footerRef.current) return;

    gsap.fromTo(".footer-col", 
      { opacity: 0, y: 30 },
      {
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 95%",
          end: "bottom 5%",
          toggleActions: "play reverse play reverse",
        },
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power2.out"
      }
    );
  }, []);

  // WhatsApp link generator
  const whatsappUrl = `https://wa.me/${ACADEMY_PHONE.replace(/\D/g, '')}`;

  return (
    <footer ref={footerRef} className="bg-transparent text-white pt-48 pb-16 border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-12 gap-16">
        <div className="md:col-span-5 footer-col">
          <img src={ACADEMY_LOGO_URL} alt="Logo" className="w-12 h-12 mb-10 transition-all duration-700" />
          <h2 className="text-[#FFD700] text-3xl font-black uppercase tracking-tighter mb-6 italic">{ACADEMY_NAME}</h2>
          <p className="text-gray-500 text-[11px] uppercase tracking-[0.2em] shadow-sm leading-loose max-w-sm mb-10 font-bold">
            We forge character through physical mastery. Our academy is a sanctuary for those seeking discipline, strength, and traditional values in a modern world.
          </p>
          <div className="flex items-center gap-6">
            {SOCIAL_LINKS.map(social => (
              <a key={social.name} href={social.url} className="text-gray-600 hover:text-[#FFD700] transition-colors tap-scale" aria-label={social.name}>
                <social.icon />
              </a>
            ))}
          </div>
        </div>
        
        <div className="md:col-span-3 footer-col">
          <h3 className="text-white font-black mb-10 uppercase tracking-[0.4em] text-[10px]">Directory</h3>
          <ul className="space-y-4">
            {NAV_LINKS.map(link => (
              <li key={link.path}>
                <Link to={link.path} className="text-gray-500 text-[9px] uppercase font-black hover:text-[#FFD700] transition-colors tracking-[0.2em]">{link.name}</Link>
              </li>
            ))}
            <li>
                <Link to="/admission" className="text-[#B33F00] text-[9px] uppercase font-black tracking-[0.2em]">Admission Portal</Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-4 footer-col">
          <h3 className="text-white font-black mb-10 uppercase tracking-[0.4em] text-[10px]">Headquarters</h3>
          <p className="text-gray-500 text-[10px] uppercase tracking-[0.15em] font-bold leading-relaxed mb-6">{ACADEMY_ADDRESS}</p>
          <div className="space-y-2">
            <p className="text-[#FFD700] text-lg font-black tracking-tighter italic">{ACADEMY_PHONE}</p>
            <p className="text-gray-600 text-[9px] uppercase tracking-widest font-black">{ACADEMY_EMAIL}</p>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-32 pt-12 border-t border-white/5 flex flex-col items-center justify-center text-center gap-6">
        <p className="text-[9px] text-gray-700 uppercase tracking-[0.5em] font-black">
          © {new Date().getFullYear()} {ACADEMY_NAME}. ALL RIGHTS RESERVED.
        </p>
        <div className="flex flex-col items-center gap-4">
          <span className="text-[8px] text-gray-600 uppercase tracking-[0.3em] font-black block">
            Meticulously crafted and Expertly developed end-to-end by Sanjyot (Avaneesh) Ingale.
          </span>
        </div>
      </div>
    </footer>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  const isAdmissionPage = pathname === '/admission';

  return (
    <div className="min-h-screen flex flex-col selection:bg-[#FFD700] selection:text-black">
      <Navbar />
      <main className="flex-grow">{children}</main>
      {!isAdmissionPage && <Footer />}
    </div>
  );
};