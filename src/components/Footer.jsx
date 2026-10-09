import React, { useState } from 'react';
import { AdcLogo } from './AdcLogo';
import { PrivacyPolicyModal } from './PrivacyPolicyModal';

export function Footer({ onNavigateTab, activeTab = 'Home' }) {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  React.useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#privacy' || window.location.hash === '#privacy-policy') {
        setIsPrivacyOpen(true);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const socialLinks = [
    {
      name: 'YouTube',
      url: 'https://youtube.com/@africandiasporachannels-adc?si=siXbvluYHodESKDq',
      ariaLabel: 'Follow African Diaspora Channels on YouTube',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
      hoverColor: 'hover:text-red-500 hover:border-red-500/50 hover:bg-red-500/10',
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/share/19XYbdRzm7/?mibextid=wwXIfr',
      ariaLabel: 'Follow African Diaspora Channels on Facebook',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      hoverColor: 'hover:text-blue-500 hover:border-blue-500/50 hover:bg-blue-500/10',
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/africandiasporachannels?stkn=eGo1bTNyam5zZ2xy',
      ariaLabel: 'Follow African Diaspora Channels on Instagram',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      hoverColor: 'hover:text-pink-500 hover:border-pink-500/50 hover:bg-pink-500/10',
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@african.diaspora27?_r=1&_t=ZS-99yH6QNL8IG',
      ariaLabel: 'Follow African Diaspora Channels on TikTok',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
        </svg>
      ),
      hoverColor: 'hover:text-[#25F4EE] hover:border-[#25F4EE]/50 hover:bg-[#25F4EE]/10',
    },
  ];

  return (
    <>
      <footer className="w-full text-white text-xs select-none bg-black border-t border-neutral-800">
        <div className="max-w-[1280px] mx-auto py-8 sm:py-10 pb-24 sm:pb-8 px-4 sm:px-6">
          {/* 3-column layout: Social Icons (Left) | Logo (Center) | Privacy Policy (Right) */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-5 md:gap-4">
            
            {/* Left: Social Media Icons */}
            <div className="flex items-center gap-3 order-2 md:order-1 flex-1 md:justify-start">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.ariaLabel}
                  title={`Follow ADC on ${social.name}`}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 flex items-center justify-center transition-all duration-200 transform hover:scale-110 active:scale-95 shadow-sm ${social.hoverColor}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Center: Footer Logo */}
            <div className="flex items-center justify-center order-1 md:order-2 flex-shrink-0 py-1">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateTab && onNavigateTab('Home');
                }}
                className="cursor-pointer select-none active:scale-95 transition-transform"
                aria-label="African Diaspora Channels Home"
              >
                <AdcLogo className="h-9 md:h-11 w-auto hover:opacity-90 transition-opacity" />
              </a>
            </div>

            {/* Right: Privacy Policy Link */}
            <div className="order-3 flex-1 flex items-center justify-center md:justify-end">
              <button
                type="button"
                onClick={() => setIsPrivacyOpen(true)}
                className="text-neutral-400 hover:text-white transition-colors cursor-pointer text-xs font-semibold underline-offset-4 hover:underline"
              >
                Privacy Policy
              </button>
            </div>

          </div>

          {/* Copyright Notice */}
          <div className="border-t border-neutral-900 mt-5 pt-4 text-center">
            <p className="text-xs text-neutral-500">
              &copy; 2026 African Diaspora Channels (ADC). All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
    </>
  );
}
