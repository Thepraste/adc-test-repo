import React, { useState, useEffect } from 'react';
import { Home, Tv, Film, Calendar, Mail } from 'lucide-react';
import { AdcLogo } from './AdcLogo';

export function AdcNav({
  activeTab = 'Home',
  onSelectTab,
  searchQuery = '',
  onSearchChange,
  onProfileClick,
  onSettingsClick,
}) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Main navigation tabs in the center (Home, Live TV, Shows, Events)
  const mainNavTabs = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Live TV', icon: Tv, isLive: true, path: '/live-tv' },
    { name: 'Shows', icon: Film, path: '/shows' },
    { name: 'Events', icon: Calendar, path: '/events' },
  ];

  const allNavTabs = [
    ...mainNavTabs,
    { name: 'Contact', icon: Mail, path: '/contact' },
  ];

  const isTabActive = (tabName) => {
    if (activeTab) {
      return activeTab === tabName;
    }
    if (typeof window !== 'undefined') {
      const p = (window.location.pathname || '').toLowerCase();
      if (tabName === 'Home') return p === '/' || p === '';
      if (tabName === 'Live TV') return p === '/live-tv' || p === '/live';
      if (tabName === 'Shows') return p === '/shows' || p.startsWith('/show') || p.startsWith('/category');
      if (tabName === 'Events') return p === '/events';
      if (tabName === 'Contact') return p === '/contact';
    }
    return false;
  };

  const isContactActive = isTabActive('Contact');

  return (
    <>
      {/* 1. MOBILE TOP HEADER: Centered logo on black background matching bottom mobile nav */}
      <header
        aria-label="Mobile Top Header"
        className="sm:hidden fixed top-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-b border-white/10 px-4 py-2 flex items-center justify-center shadow-[0_8px_25px_rgba(0,0,0,0.9)] supports-[backdrop-filter]:bg-black/85 h-15"
      >
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onSelectTab && onSelectTab('Home');
          }}
          className="flex items-center justify-center cursor-pointer select-none active:scale-95 transition-all p-0.5"
          aria-label="African Diaspora Channels Home"
          id="adc-brand-logo-mobile"
        >
          <AdcLogo
            className="h-12 w-auto drop-shadow-md"
            showText={true}
          />
        </a>
      </header>

      {/* 2. DESKTOP / TABLET TOP HEADER: Glassmorphic translucent blur overlaid on hero */}
      <header
        className={`hidden sm:block fixed top-0 left-0 right-0 z-40 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 select-none transition-all duration-300 border-b border-white/10 ${
          isScrolled
            ? 'bg-black/85 backdrop-blur-xl shadow-2xl shadow-black/80'
            : 'bg-black/35 backdrop-blur-md shadow-lg shadow-black/40'
        }`}
      >
        <div className="max-w-[1920px] mx-auto flex items-center justify-between gap-4">
          
          {/* Left Side: Brand Logo */}
          <div className="flex items-center flex-shrink-0">
            <a
              href="/"
              className="flex items-center select-none cursor-pointer py-0.5 active:scale-95 transition-transform"
              onClick={(e) => {
                e.preventDefault();
                onSelectTab && onSelectTab('Home');
              }}
              id="adc-brand-logo"
            >
              <AdcLogo
                className="h-9 sm:h-11 md:h-13 lg:h-14 w-auto hover:opacity-95 transition-all drop-shadow-md"
                showText={true}
              />
            </a>
          </div>

          {/* Desktop Navigation Links (Center) */}
          <nav className="flex items-center justify-center space-x-6 md:space-x-8 lg:space-x-12 text-sm md:text-base font-bold tracking-wide flex-1 px-4">
            {mainNavTabs.map((tab) => {
              const isActive = isTabActive(tab.name);
              const isLive = tab.isLive;
              return (
                <a
                  key={tab.name}
                  href={tab.path}
                  id={`adc-nav-tab-${tab.name.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectTab && onSelectTab(tab.name);
                  }}
                  className={`relative py-1.5 transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                    isActive
                      ? 'text-white font-black tracking-wide'
                      : 'text-neutral-300 hover:text-white font-bold'
                  }`}
                >
                  {/* Red circle animating for Live TV */}
                  {isLive && (
                    <span className="relative flex h-2.5 w-2.5 mr-0.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                    </span>
                  )}
                  <span>{tab.name}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[3px] bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Side: Contact Us CTA Button */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <a
              href="/contact"
              id="adc-nav-tab-contact"
              onClick={(e) => {
                e.preventDefault();
                onSelectTab && onSelectTab('Contact');
              }}
              className={`group relative inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full font-extrabold text-xs sm:text-sm tracking-wide transition-all duration-200 cursor-pointer shadow-md active:scale-95 ${
                isContactActive
                  ? 'bg-red-600 text-white shadow-red-600/40 ring-2 ring-red-400/50'
                  : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-red-900/30 hover:shadow-red-600/30 hover:scale-105 border border-red-500/40'
              }`}
              title="Contact African Diaspora Channels"
            >
              <Mail className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:-translate-y-0.5 ${isContactActive ? 'stroke-[2.5]' : ''}`} />
              <span>Contact Us</span>
            </a>
          </div>

        </div>
      </header>

      {/* 3. ERGONOMIC MOBILE BOTTOM NAVIGATION BAR */}
      <nav 
        aria-label="Mobile Bottom Navigation"
        className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-white/10 px-2 py-1.5 flex items-center justify-around shadow-[0_-8px_25px_rgba(0,0,0,0.9)] supports-[backdrop-filter]:bg-black/85"
      >
        {allNavTabs.map((tab) => {
          const isActive = isTabActive(tab.name);
          const isContact = tab.name === 'Contact';
          const Icon = tab.icon;
          return (
            <a
              key={tab.name}
              href={tab.path}
              id={`adc-bottom-tab-${tab.name.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={(e) => {
                e.preventDefault();
                onSelectTab && onSelectTab(tab.name);
              }}
              className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-1 rounded-lg transition-all active:scale-90 ${
                isActive
                  ? 'text-white'
                  : isContact
                  ? 'text-red-400 hover:text-red-300'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'}`} />
                {tab.isLive && (
                  <span className="absolute -top-0.5 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 font-bold tracking-tight ${isActive ? 'text-white font-extrabold' : isContact ? 'text-red-400 font-semibold' : 'text-neutral-400'}`}>
                {tab.name}
              </span>
              {isActive && (
                <span className="w-1 h-1 bg-white rounded-full mt-0.5" />
              )}
            </a>
          );
        })}
      </nav>
    </>
  );
}
