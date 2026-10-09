import React, { useState, useRef, useEffect } from 'react';
import { getShowEpisodes } from '../data/episodesData';

export function MovieCard({
  movie,
  onPlay,
  onOpenDetails,
  cardIndex = 1,
  totalCards = 10,
  rowTitle = '',
  isLive = false,
  cardSize = 'normal',
  cardShape = 'normal',
  isGray = false,
  noHover = false,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const enterTimeoutRef = useRef(null);
  const leaveTimeoutRef = useRef(null);

  const isLarge = Boolean(
    cardSize === 'large' ||
    rowTitle?.toLowerCase().includes('upcoming events') ||
    rowTitle?.toLowerCase().includes('upcoming crack up comedy') ||
    rowTitle?.toLowerCase().includes('crack up') ||
    movie?.category?.toLowerCase().includes('upcoming crack up comedy')
  );

  const isOnNow = Boolean(
    cardShape === 'square' ||
    rowTitle?.toLowerCase() === 'on now' ||
    rowTitle?.toLowerCase().includes('on now') ||
    movie?.category?.toLowerCase() === 'on now'
  );

  const isLiveCard = Boolean(
    isLive ||
    isOnNow ||
    movie?.isLive ||
    movie?.duration?.toLowerCase() === 'live now'
  );

  const shouldDisableHover = Boolean(noHover || isOnNow);

  useEffect(() => {
    // Detect if device supports hover (mouse/pointer vs touch)
    if (typeof window !== 'undefined' && window.matchMedia) {
      setCanHover(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
    }

    return () => {
      if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current);
      if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    };
  }, []);

  if (!movie) return null;

  const handleMouseEnter = () => {
    if (!canHover || shouldDisableHover) return;
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    enterTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 180);
  };

  const handleMouseLeave = () => {
    if (!canHover || shouldDisableHover) return;
    if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current);
    leaveTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 120);
  };

  const originClass =
    cardIndex === 0
      ? 'origin-top-left'
      : cardIndex === totalCards - 1
        ? 'origin-top-right'
        : 'origin-top';

  return (
    <div
      className={`relative flex-shrink-0 ${
        isOnNow
          ? 'w-[96px] xs:w-[110px] sm:w-[124px] md:w-[136px] aspect-square'
          : isLarge
            ? 'w-[250px] xs:w-[290px] sm:w-[360px] md:w-[420px] lg:w-[450px] aspect-[16/9]'
            : 'w-[185px] xs:w-[220px] sm:w-[270px] md:w-[310px] aspect-[16/9]'
      } select-none touch-pan-x transition-all duration-200`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      id={`movie-card-slot-${movie.id}`}
    >
      {/* 1. Base Resting Card */}
      {isOnNow ? (
        /* Reduced-size squarish card for On Now channels: fits logos cleanly, no progress bar, no hover popup */
        <div
          className="w-full h-full rounded-xl overflow-hidden p-2 sm:p-2.5 flex flex-col items-center justify-between transition-all duration-200 cursor-pointer shadow-md relative group active:scale-95 bg-[#1b222c] hover:bg-[#242d3a] border border-neutral-700/80 hover:border-neutral-500"
          onClick={() => {
            if (onOpenDetails) onOpenDetails(movie);
            else if (onPlay) onPlay(movie);
          }}
          id={`movie-card-${movie.id}`}
        >
          {/* Top Live Badge */}
          <div className="w-full flex items-center justify-between pointer-events-none z-10">
            <span className="bg-red-600 text-white font-extrabold text-[8px] sm:text-[9px] tracking-wider px-1.5 py-0.5 rounded shadow uppercase inline-flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
              <span>LIVE</span>
            </span>
          </div>

          {/* Logo container: squarish shape, object-contain fits station logo cleanly without cropping */}
          <div className="w-full flex-1 flex items-center justify-center p-1 min-h-0 overflow-hidden my-auto">
            <img
              src={movie.backdrop || movie.image}
              alt={movie.title}
              className="max-w-full max-h-full object-contain select-none transition-transform duration-200 group-hover:scale-105 drop-shadow-md"
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/images/hero/morning-brew-thumb.png';
              }}
            />
          </div>

          {/* Bottom Title Bar (Clean, compact, progress bar completely removed) */}
          <div className="w-full pt-1 sm:pt-1.5 border-t border-white/10 text-center">
            <h4 className="text-[10.5px] sm:text-xs font-bold text-white truncate drop-shadow-sm">
              {movie.title}
            </h4>
          </div>
        </div>
      ) : (
        /* Standard 16/9 Rectangular Card */
        <div
          className="w-full h-full rounded-lg overflow-hidden bg-[#121212] border border-neutral-800/80 hover:border-neutral-600 transition-all duration-300 cursor-pointer shadow-md relative group active:scale-98"
          onClick={() => {
            if (onOpenDetails) onOpenDetails(movie);
            else if (onPlay) onPlay(movie);
          }}
          id={`movie-card-${movie.id}`}
        >
          <img
            src={movie.backdrop || movie.image}
            alt={movie.title}
            className="w-full h-full object-cover object-center"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/images/hero/morning-brew-thumb.png';
            }}
          />

          {/* Resting badge on card - LIVE for live content */}
          {isLiveCard && (
            <div className="absolute top-2 left-2 pointer-events-none z-10">
              <span className="bg-red-600 text-white font-black text-[9px] tracking-wider px-2 py-0.5 rounded shadow-md uppercase inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>LIVE</span>
              </span>
            </div>
          )}

          {/* Bottom subtle title bar for touch/mobile devices on standard cards */}
          <div className="sm:hidden absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2 pt-4 pointer-events-none">
            <h4 className="text-[11px] font-bold text-white truncate leading-tight">
              {movie.title}
            </h4>
          </div>
        </div>
      )}

      {/* 2. Amazon Prime Video Expanded Hover Card (Pop-out Tray on Hover-Capable Desktop Devices - Disabled for On Now squarish cards) */}
      {canHover && isHovered && !shouldDisableHover && (
        <div
          className={`absolute -top-3 left-0 right-0 z-50 w-full rounded-xl overflow-hidden bg-[#131a22] border border-neutral-700/90 shadow-[0_20px_45px_rgba(0,0,0,0.96)] transform ${
            isLarge ? 'scale-[1.10]' : 'scale-[1.18]'
          } ${originClass} transition-all duration-200 ease-out cursor-pointer animate-in fade-in zoom-in-95`}
          onClick={() => {
            if (onOpenDetails) onOpenDetails(movie);
            else if (onPlay) onPlay(movie);
          }}
          id={`movie-card-hover-${movie.id}`}
        >
          {/* Top Video Thumbnail with Badges */}
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
            <img
              src={movie.backdrop || movie.image}
              alt={movie.title}
              className="w-full h-full object-cover object-center scale-102"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/images/hero/morning-brew-thumb.png';
              }}
            />

            {/* Bottom Gradient Fade into Dark Tray */}
            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#131a22] to-transparent pointer-events-none" />
          </div>

          {/* Bottom info on hover: show name and episode count badge (or Daily for Morning Brew) */}
          {(() => {
            const titleLower = (movie?.title || '').toLowerCase();
            const idLower = (movie?.id || '').toLowerCase();
            const categoryLower = (movie?.category || '').toLowerCase();

            // 1. Morning brew with coco and mimi carries Daily on its own badge
            const isMorningBrew = Boolean(
              titleLower.includes('morning brew') ||
              idLower.includes('morning-brew') ||
              categoryLower.includes('morning brew')
            );

            let badgeText = '';
            let isLiveBadge = Boolean(isLiveCard || movie?.duration?.toLowerCase() === 'live now');

            if (isMorningBrew) {
              badgeText = 'Daily';
            } else if (isLiveBadge) {
              badgeText = 'LIVE NOW';
            } else {
              const isEvent = Boolean(
                movie?.isEvent ||
                categoryLower.includes('event') ||
                idLower.includes('carnival') ||
                titleLower.includes('carnival')
              );
              if (isEvent && movie?.duration) {
                badgeText = movie.duration;
              } else {
                const episodes = getShowEpisodes(movie) || [];
                if (episodes.length > 0) {
                  badgeText = `${episodes.length} ${episodes.length === 1 ? 'Episode' : 'Episodes'}`;
                } else {
                  badgeText = movie?.duration || '';
                }
              }
            }

            return (
              <div className="p-3 sm:p-3.5 bg-[#131a22] border-t border-neutral-800/90 flex items-center justify-between gap-2.5 text-left">
                <h3 className="text-sm font-bold text-white truncate flex-1 drop-shadow-sm">
                  {movie.title}
                </h3>
                {badgeText && (
                  <span className={`text-[11px] font-semibold flex-shrink-0 px-2 py-0.5 rounded ${
                    isLiveBadge
                      ? 'bg-red-600 text-white font-black uppercase tracking-wider text-[10px]'
                      : 'text-neutral-300 bg-neutral-800 border border-neutral-700/60'
                  }`}>
                    {badgeText}
                  </span>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
