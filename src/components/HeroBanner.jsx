import React, { useState, useEffect, useRef } from 'react';
import { Play, Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react';

export function HeroBanner({
  movies = [],
  onPlayMovie,
  onOpenDetails,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [viewMode, setViewMode] = useState('video'); // 'video' | 'picture'
  const videoRefs = useRef({});

  // Touch swipe support for mobile
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Auto-advance hero banner every 8 seconds if not interacting
  useEffect(() => {
    if (!movies || movies.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [movies]);

  // Manage playback of active slide video
  useEffect(() => {
    Object.keys(videoRefs.current).forEach((key) => {
      const vid = videoRefs.current[key];
      if (vid) {
        if (parseInt(key, 10) === currentIndex && viewMode === 'video') {
          vid.currentTime = 0;
          vid.play().catch(() => {});
        } else {
          vid.pause();
        }
      }
    });
  }, [currentIndex, viewMode]);

  if (!movies || movies.length === 0) return null;
  const currentMovie = movies[currentIndex] || movies[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 45; // min swipe distance in px
    if (diff > threshold) {
      handleNext();
    } else if (diff < -threshold) {
      handlePrev();
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <section 
      id="hero-banner-section"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full aspect-[16/7.5] xs:aspect-[16/7.5] sm:aspect-auto sm:h-[60vh] md:h-[75vh] lg:h-[80vh] max-h-[820px] min-h-0 overflow-hidden bg-black select-none touch-pan-y"
    >
      {/* Background Slides with Fade-In Transition */}
      {movies.map((movie, index) => {
        const isActive = index === currentIndex;
        const hasVideo = Boolean(movie.videoUrl);

        return (
          <div
            key={movie.id || index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
            }`}
            aria-hidden={!isActive}
          >
            {/* Background Container: Proportional object-cover (Never stretched or distorted) */}
            <div
              onClick={() => onPlayMovie && onPlayMovie(movie)}
              className="absolute inset-0 w-full h-full overflow-hidden bg-black cursor-pointer group/hero-slide"
              title={`View ${movie.title}`}
            >
              {/* Picture Placeholder / Background */}
              <img
                src={movie.backdrop || movie.poster || movie.image}
                alt={movie.title}
                className={`w-full h-full object-cover object-center block transition-opacity duration-700 ${
                  viewMode === 'video' && hasVideo ? 'opacity-0' : 'opacity-100'
                }`}
                referrerPolicy="no-referrer"
              />

              {/* Video Element: Plays seamlessly in background, fully proportional with object-cover */}
              {hasVideo && (
                <video
                  ref={(el) => (videoRefs.current[index] = el)}
                  src={movie.videoUrl}
                  poster={movie.backdrop || movie.poster || movie.image}
                  autoPlay={isActive && viewMode === 'video'}
                  loop
                  muted={isMuted}
                  playsInline
                  className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ${
                    viewMode === 'video' ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                />
              )}
            </div>

            {/* Overlaid Hero Content (No dark gradients overlay per request) */}
            <div className="absolute inset-0 z-10 max-w-[1920px] mx-auto h-full flex flex-col justify-end px-4 sm:px-8 md:px-12 lg:px-16 pb-3 sm:pb-6 md:pb-8 pointer-events-none">
              <div className={`space-y-2 sm:space-y-3.5 transition-all duration-700 delay-100 ${
                isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}>
                
                {/* CTA Action Button */}
                <div className="flex items-center gap-3 pt-1 sm:pt-4 flex-wrap pointer-events-auto">
                  {/* Mobile-only: Play button with just a play icon */}
                  <button
                    type="button"
                    id={`hero-watch-btn-mobile-${movie.id}`}
                    onClick={() => onPlayMovie && onPlayMovie(movie)}
                    className="sm:hidden flex items-center justify-center w-11 h-11 rounded-full bg-white hover:bg-neutral-100 text-black shadow-[0_4px_24px_rgba(0,0,0,0.8)] transition-all transform active:scale-95 cursor-pointer"
                    aria-label={`Play ${movie.title}`}
                  >
                    <Play className="w-5 h-5 fill-current text-black ml-0.5" />
                  </button>

                  {/* Desktop: Full Watch on ADC button */}
                  <button
                    type="button"
                    id={`hero-watch-btn-${movie.id}`}
                    onClick={() => onPlayMovie && onPlayMovie(movie)}
                    className="hidden sm:flex items-center justify-center gap-2 bg-white hover:bg-neutral-100 text-black font-black px-7 py-3.5 rounded-lg shadow-[0_4px_24px_rgba(0,0,0,0.8)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer text-base min-h-[44px]"
                  >
                    <Play className="w-5 h-5 fill-current text-black" />
                    <span>Watch on ADC</span>
                  </button>
                </div>

              </div>
            </div>

          </div>
        );
      })}

      {/* Right-Side Floating Controls: Audio Mute/Unmute */}
      <div className="absolute right-3 sm:right-6 md:right-12 bottom-3.5 sm:bottom-4 md:bottom-6 z-20 flex items-center gap-2 sm:gap-2.5">
        <button
          type="button"
          onClick={() => setIsMuted(!isMuted)}
          className="p-2 sm:p-2.5 rounded-full bg-black/70 hover:bg-black/90 text-neutral-300 hover:text-white border border-neutral-700 transition-colors backdrop-blur-sm cursor-pointer shadow-md min-h-[36px] min-w-[36px] flex items-center justify-center"
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          title={isMuted ? "Unmute preview" : "Mute preview"}
        >
          {isMuted ? <VolumeX className="w-3.5 sm:w-4 h-3.5 sm:h-4" /> : <Volume2 className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-white" />}
        </button>
      </div>

      {/* Navigation Arrows for Slider (Desktop) */}
      {movies.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="hidden sm:flex absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/50 hover:bg-black/85 text-white/80 hover:text-white transition-all backdrop-blur-sm border border-neutral-800 cursor-pointer shadow-lg"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="hidden sm:flex absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/50 hover:bg-black/85 text-white/80 hover:text-white transition-all backdrop-blur-sm border border-neutral-800 cursor-pointer shadow-lg"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Carousel Slide Indicators */}
          <div className="absolute bottom-2 sm:bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2">
            {movies.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                  currentIndex === idx ? 'w-6 sm:w-8 bg-white' : 'w-2 sm:w-2.5 bg-neutral-600 hover:bg-neutral-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
