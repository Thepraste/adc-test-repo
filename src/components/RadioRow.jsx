import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Radio, Play, Pause, Signal, MapPin } from 'lucide-react';
import { RADIO_STATIONS } from '../data/radioData';

export function RadioRow({
  title = 'Radio For You',
  currentStation,
  isRadioPlaying,
  onPlayStation,
  onToggleRadioPlay,
  onSeeMoreRadio,
}) {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth < 640 ? 280 : 520;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="relative py-2.5 sm:py-4 md:py-5 px-3 sm:px-8 md:px-12 lg:px-16 select-none group/row">
      {/* Category Header */}
      <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-3.5">
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>{title}</span>
          </h2>
          <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>LIVE</span>
          </span>
        </div>

        {onSeeMoreRadio && (
          <button
            type="button"
            onClick={onSeeMoreRadio}
            className="text-xs sm:text-sm font-semibold text-neutral-300 hover:text-white hover:underline flex items-center gap-0.5 cursor-pointer transition-colors py-1.5 px-2 -mr-2 active:opacity-75"
          >
            <span>See more &gt;</span>
          </button>
        )}
      </div>

      {/* Horizontal Carousel */}
      <div className="relative">
        {/* Scroll Left Button */}
        <button
          type="button"
          onClick={() => scroll('left')}
          className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-30 w-9 md:w-11 h-20 bg-black/80 hover:bg-black text-white items-center justify-center rounded-r transition-all opacity-0 group-hover/row:opacity-100 hover:scale-105 cursor-pointer backdrop-blur-xs shadow-xl border border-neutral-800"
          aria-label="Scroll radio left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Stations Row */}
        <div
          ref={scrollContainerRef}
          className="flex items-start gap-3 sm:gap-3.5 overflow-x-auto scrollbar-none scroll-smooth pt-1 pb-3 px-1 no-scrollbar touch-pan-x"
        >
          {RADIO_STATIONS.map((station) => {
            const isPlayingThis = currentStation?.id === station.id && isRadioPlaying;

            return (
              <div
                key={station.id}
                onClick={() => {
                  if (isPlayingThis) {
                    if (onToggleRadioPlay) onToggleRadioPlay();
                  } else {
                    onPlayStation(station);
                  }
                }}
                className={`relative flex-shrink-0 w-[155px] xs:w-[175px] sm:w-[195px] rounded-xl p-3 bg-[#161d27] hover:bg-[#1f2836] border transition-all duration-200 cursor-pointer shadow-md active:scale-95 group flex flex-col justify-between h-[130px] sm:h-[136px] ${
                  isPlayingThis
                    ? 'border-emerald-500 ring-2 ring-emerald-500/40 bg-[#162738]'
                    : 'border-neutral-700/80 hover:border-neutral-500'
                }`}
                title={`Tune into ${station.name}`}
              >
                {/* Frequency badge + Live dot */}
                <div className="flex items-center justify-between w-full gap-2">
                  <span
                    className="text-[10px] sm:text-xs font-black px-2 py-0.5 rounded text-white shadow-xs"
                    style={{ backgroundColor: station.accentColor || '#1d70b8' }}
                  >
                    {station.frequency}
                  </span>
                  <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-1 uppercase flex-shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>LIVE</span>
                  </span>
                </div>

                {/* Station title & location only (No logos, no show descriptions) */}
                <div className="my-auto py-1">
                  <h4 className="text-xs sm:text-[13px] font-bold text-white truncate group-hover:text-[#00a8e1] transition-colors">
                    {station.name}
                  </h4>
                  <p className="text-[11px] text-neutral-300 font-medium truncate mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-red-500 flex-shrink-0" />
                    <span>{station.city}, {station.state}</span>
                  </p>
                </div>

                {/* Bottom play button bar */}
                <div className="w-full pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] text-neutral-400">
                  <span className="truncate">{station.genre?.split(',')[0]}</span>
                  <button
                    type="button"
                    className={`p-1 rounded-full ${
                      isPlayingThis
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white/10 group-hover:bg-white text-white group-hover:text-black'
                    } transition-colors`}
                  >
                    {isPlayingThis ? (
                      <Pause className="w-3 h-3 fill-current" />
                    ) : (
                      <Play className="w-3 h-3 fill-current ml-0.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Scroll Right Button */}
        <button
          type="button"
          onClick={() => scroll('right')}
          className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-30 w-9 md:w-11 h-20 bg-black/80 hover:bg-black text-white items-center justify-center rounded-l transition-all opacity-0 group-hover/row:opacity-100 hover:scale-105 cursor-pointer backdrop-blur-xs shadow-xl border border-neutral-800"
          aria-label="Scroll radio right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
