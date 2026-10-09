import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MovieCard } from './MovieCard';

export function VideoRow({
  title,
  movies = [],
  onPlayMovie,
  onOpenDetails,
  onSeeMore,
  cardSize = 'normal',
}) {
  const scrollContainerRef = useRef(null);

  const isLarge = Boolean(
    cardSize === 'large' ||
    title?.toLowerCase().includes('upcoming events') ||
    title?.toLowerCase().includes('upcoming crack up comedy') ||
    title?.toLowerCase().includes('crack up')
  );

  const isOnNow = Boolean(
    title?.toLowerCase() === 'on now' ||
    title?.toLowerCase().includes('on now')
  );

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth < 640 ? 280 : (isLarge ? 740 : (isOnNow ? 420 : 640));
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="relative py-2.5 sm:py-4 md:py-5 px-3 sm:px-8 md:px-12 lg:px-16 select-none group/row">
      {/* Category Header with Title and "See more >" */}
      <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-3.5">
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-white tracking-tight">
            <span>{title}</span>
          </h2>
        </div>

        {/* Right arrow span "See more >" with touch-friendly min 44px hit area */}
        {onSeeMore && (
          <button
            type="button"
            onClick={() => onSeeMore(title)}
            className="text-xs sm:text-sm font-semibold text-neutral-300 hover:text-white hover:underline flex items-center gap-0.5 cursor-pointer transition-colors py-1.5 px-2 -mr-2 active:opacity-75"
            id={`see-more-${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
          >
            <span>See more &gt;</span>
          </button>
        )}
      </div>

      {/* Horizontal scrolling row with cards */}
      <div className="relative">
        {/* Scroll Left Button - Desktop Only */}
        <button
          type="button"
          onClick={() => scroll('left')}
          className={`hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-30 w-9 md:w-12 ${
            isLarge ? 'h-24 md:h-32' : (isOnNow ? 'h-20 md:h-28' : 'h-20 md:h-24')
          } bg-black/80 hover:bg-black text-white items-center justify-center rounded-r transition-all opacity-0 group-hover/row:opacity-100 hover:scale-105 cursor-pointer backdrop-blur-xs shadow-xl border border-neutral-800`}
          aria-label={`Scroll ${title} left`}
        >
          <ChevronLeft className="w-5 md:w-6 h-5 md:h-6" />
        </button>

        {/* Horizontal Card Container with responsive padding */}
        <div
          ref={scrollContainerRef}
          className={`flex items-start gap-3.5 sm:gap-4 md:gap-5 overflow-x-auto scrollbar-none scroll-smooth pt-2 sm:pt-4 ${
            isOnNow
              ? 'pb-2 sm:pb-3'
              : isLarge
                ? 'pb-4 sm:pb-32 md:pb-36 -mt-1 sm:-mt-4 -mb-2 sm:-mb-28 md:-mb-32'
                : 'pb-4 sm:pb-28 md:pb-32 -mt-1 sm:-mt-4 -mb-2 sm:-mb-24 md:-mb-28'
          } px-1 no-scrollbar touch-pan-x`}
        >
          {movies.map((movie, index) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              cardIndex={index}
              totalCards={movies.length}
              rowTitle={title}
              cardSize={isLarge ? 'large' : 'normal'}
              cardShape={isOnNow ? 'square' : 'normal'}
              noHover={isOnNow}
              onPlay={onPlayMovie}
              onOpenDetails={onOpenDetails}
            />
          ))}
        </div>

        {/* Scroll Right Button - Desktop Only */}
        <button
          type="button"
          onClick={() => scroll('right')}
          className={`hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-30 w-9 md:w-12 ${
            isLarge ? 'h-24 md:h-32' : (isOnNow ? 'h-20 md:h-28' : 'h-20 md:h-24')
          } bg-black/80 hover:bg-black text-white items-center justify-center rounded-l transition-all opacity-0 group-hover/row:opacity-100 hover:scale-105 cursor-pointer backdrop-blur-xs shadow-xl border border-neutral-800`}
          aria-label={`Scroll ${title} right`}
        >
          <ChevronRight className="w-5 md:w-6 h-5 md:h-6" />
        </button>
      </div>
    </section>
  );
}
