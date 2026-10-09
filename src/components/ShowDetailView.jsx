import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Play,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import { getShowEpisodes } from '../data/episodesData';
import { LiveStreamPlayer } from './LiveStreamPlayer';

export function ShowDetailView({
  show,
  onBack,
  previousPageName = 'Home',
  onSelectOtherShow,
  onStopRadio,
  isRadioPlaying = false,
}) {
  const scrollContainerRef = useRef(null);
  const [isVideoPausedByRadio, setIsVideoPausedByRadio] = useState(false);

  // When ShowDetailView opens: stop radio so show video plays
  useEffect(() => {
    if (onStopRadio) {
      onStopRadio();
    }
  }, [show?.id]);

  // When radio starts playing while on this page, pause video
  useEffect(() => {
    if (isRadioPlaying) {
      setIsVideoPausedByRadio(true);
      if (typeof document !== 'undefined') {
        document.querySelectorAll('video').forEach((v) => {
          try { v.pause(); } catch (_) {}
        });
      }
    } else {
      setIsVideoPausedByRadio(false);
    }
  }, [isRadioPlaying]);

  useEffect(() => {
    const handleStop = () => {
      setIsVideoPausedByRadio(true);
      if (typeof document !== 'undefined') {
        document.querySelectorAll('video').forEach((v) => {
          try { v.pause(); } catch (_) {}
        });
      }
    };
    window.addEventListener('adc-stop-video-playback', handleStop);
    return () => window.removeEventListener('adc-stop-video-playback', handleStop);
  }, []);

  // Retrieve all episodes for this show and sort strictly in DESCENDING order (latest first)
  const episodes = useMemo(() => {
    if (!show) return [];
    const list = getShowEpisodes(show) || [];
    return [...list].sort((a, b) => (b.episodeNumber || 0) - (a.episodeNumber || 0));
  }, [show]);

  const isMorningBrew = Boolean(
    (show?.title || '').toLowerCase().includes('morning brew') ||
    (show?.id || '').toLowerCase().includes('morning-brew') ||
    (show?.category || '').toLowerCase().includes('morning brew')
  );

  const isDestinationCrossRiver = Boolean(
    (show?.title || '').toLowerCase().includes('destination cross river') ||
    (show?.id || '').toLowerCase().includes('destination-cross-river') ||
    (show?.id || '').toLowerCase().includes('podcast-3')
  );

  const isComedyShow = Boolean(
    (show?.category || '').toLowerCase().includes('comedy') ||
    (show?.title || '').toLowerCase().includes('comedy') ||
    (show?.title || '').toLowerCase().includes('crack up') ||
    (show?.id || '').toLowerCase().includes('comedy') ||
    (show?.id || '').toLowerCase().includes('crack-up')
  );

  const noEpisodeTitling = Boolean(isMorningBrew || isDestinationCrossRiver || isComedyShow);

  // Default active episode: The first one (or matching show youtubeId)
  const [activeEpisode, setActiveEpisode] = useState(null);

  useEffect(() => {
    if (episodes && episodes.length > 0) {
      const matched = episodes.find((e) => e.youtubeId === show.youtubeId || e.id === show.id);
      setActiveEpisode(matched || episodes[0]);
    } else {
      setActiveEpisode(null);
    }
  }, [show, episodes]);

  // Horizontal slider navigation
  const scrollHorizontal = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth < 640 ? 300 : 660;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!show) return null;

  const currentYoutubeId = activeEpisode?.youtubeId || show.youtubeId || 'BAhn-P035_M';

  return (
    <div className="w-full bg-[#070a0f] text-white min-h-screen pb-24 font-sans select-none animate-in fade-in duration-300">
      
      {/* 1. TOP STICKY BAR: BACK BUTTON & SHOW BREADCRUMB */}
      <div className="w-full bg-[#0a0e17]/95 backdrop-blur-md border-b border-white/10 sticky top-[58px] sm:top-[70px] z-40 px-3 sm:px-8 md:px-12 py-3">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-neutral-300 hover:text-white px-3 sm:px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all font-bold shadow-md active:scale-95 cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-red-500 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to {previousPageName || 'Previous Page'}</span>
          </button>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-400 truncate">
            <span className="hidden xs:inline text-neutral-500">Shows</span>
            <span className="hidden xs:inline text-neutral-600">/</span>
            <span className="font-extrabold text-white truncate max-w-[200px] sm:max-w-md">
              {show.title}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-3 sm:px-8 md:px-12 py-4 sm:py-6 space-y-8">
        
        {/* 2. FEATURED VIDEO PLAYER & SHOW DETAILS */}
        <div className="bg-[#0e1422] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Column: Video Player */}
            <div className="lg:col-span-8 bg-black relative aspect-video flex items-center justify-center">
              {isVideoPausedByRadio ? (
                <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden group">
                  <img
                    src={activeEpisode?.image || show.backdrop || show.image}
                    alt={activeEpisode?.title || show.title}
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center gap-3 p-4 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        if (onStopRadio) onStopRadio();
                        setIsVideoPausedByRadio(false);
                      }}
                      className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                      title="Play Show Video (Stops Radio)"
                    >
                      <Play className="w-8 h-8 fill-current ml-1" />
                    </button>
                    <span className="text-xs sm:text-sm font-bold text-white drop-shadow">
                      Click to Play Video • Radio will stop
                    </span>
                  </div>
                </div>
              ) : (
                <LiveStreamPlayer
                  key={currentYoutubeId}
                  streamUrl={show.streamUrl}
                  youtubeId={currentYoutubeId}
                  title={activeEpisode ? `${show.title} - ${activeEpisode.title}` : show.title}
                  isLive={false}
                  poster={activeEpisode?.image || show.backdrop || show.image}
                  className="w-full h-full"
                />
              )}

              {/* Episode Playing Now Badge */}
              {activeEpisode && (
                <div className="absolute top-3 left-3 pointer-events-none flex items-center gap-2 z-20">
                  <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded shadow flex items-center gap-1.5 tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span>{noEpisodeTitling ? activeEpisode.title : `EPISODE ${activeEpisode.episodeNumber}`}</span>
                  </span>
                  <span className="bg-black/80 backdrop-blur-md border border-white/20 text-blue-200 text-xs font-bold px-2 py-0.5 rounded shadow">
                    {activeEpisode.duration}
                  </span>
                </div>
              )}
            </div>

            {/* Right Column: Show & Active Episode Metadata */}
            <div className="lg:col-span-4 p-5 sm:p-6 flex flex-col justify-between bg-gradient-to-b from-[#121a2d] to-[#0c1220] border-t lg:border-t-0 lg:border-l border-white/10 overflow-y-auto">
              <div className="space-y-4">
                
                {/* Show Title */}
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    {show.title}
                  </h1>
                </div>

                {/* Active Episode Synopsis Card */}
                {activeEpisode ? (
                  <div className="bg-white/5 rounded-xl p-3.5 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-xs text-neutral-400 flex-wrap gap-1">
                      <span className="text-[#00a8e1] font-bold">
                        {noEpisodeTitling ? activeEpisode.title : `EPISODE ${activeEpisode.episodeNumber}`}
                      </span>
                      {!noEpisodeTitling && activeEpisode.airDate && (
                        <span className="font-mono text-[11px] text-neutral-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{activeEpisode.airDate}</span>
                        </span>
                      )}
                    </div>

                    <h2 className="text-sm sm:text-base font-extrabold text-white leading-snug">
                      {noEpisodeTitling ? (activeEpisode.description ? activeEpisode.title : '') : activeEpisode.title}
                    </h2>

                    <p className="text-xs text-neutral-300 leading-relaxed line-clamp-4">
                      {activeEpisode.description}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    {show.description}
                  </p>
                )}

                {/* Genre Tags */}
                {show.genres && show.genres.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {show.genres.map((genre, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-semibold text-neutral-300 bg-neutral-800/80 px-2.5 py-1 rounded-full border border-neutral-700/60"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>

        {/* 3. EPISODES CARD SLIDER (Matching Homepage VideoRow with Descending Episodes) */}
        <section className="relative py-2 select-none group/row space-y-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
                <span>All Episodes</span>
                <span className="text-xs font-bold text-neutral-400 bg-neutral-800/80 px-2.5 py-0.5 rounded-full border border-neutral-700">
                  {episodes.length} Episodes • Latest First
                </span>
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Click any episode card to instantly stream in the player above
              </p>
            </div>
          </div>

          {/* Horizontal Scrolling Episode Card Slider */}
          <div className="relative">
            {/* Scroll Left Button */}
            <button
              type="button"
              onClick={() => scrollHorizontal('left')}
              className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-30 w-10 sm:w-12 h-20 sm:h-24 bg-black/85 hover:bg-black text-white items-center justify-center rounded-r transition-all opacity-0 group-hover/row:opacity-100 hover:scale-105 cursor-pointer backdrop-blur-xs shadow-2xl border border-neutral-800"
              aria-label="Scroll episodes left"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Scroll Right Button */}
            <button
              type="button"
              onClick={() => scrollHorizontal('right')}
              className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-30 w-10 sm:w-12 h-20 sm:h-24 bg-black/85 hover:bg-black text-white items-center justify-center rounded-l transition-all opacity-0 group-hover/row:opacity-100 hover:scale-105 cursor-pointer backdrop-blur-xs shadow-2xl border border-neutral-800"
              aria-label="Scroll episodes right"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Cards Container */}
            <div
              ref={scrollContainerRef}
              className="flex items-start gap-4 overflow-x-auto scrollbar-none scroll-smooth py-3 px-1 no-scrollbar touch-pan-x"
            >
              {episodes.map((ep, idx) => {
                const isActive = activeEpisode?.id === ep.id;
                const thumb = ep.image || (ep.youtubeId ? `https://img.youtube.com/vi/${ep.youtubeId}/hqdefault.jpg` : show.backdrop || show.image);

                return (
                  <div
                    key={ep.id}
                    onClick={() => {
                      if (onStopRadio) onStopRadio();
                      setIsVideoPausedByRadio(false);
                      setActiveEpisode(ep);
                      window.scrollTo({ top: 120, behavior: 'smooth' });
                    }}
                    className={`relative flex-shrink-0 w-[240px] xs:w-[280px] sm:w-[320px] md:w-[360px] aspect-[16/9] rounded-xl overflow-hidden cursor-pointer transition-all duration-200 border shadow-lg group/card ${
                      isActive
                        ? 'border-red-500 ring-2 ring-red-500/80 scale-[1.02] shadow-red-900/30'
                        : 'border-neutral-800 hover:border-neutral-600 hover:scale-[1.02]'
                    } bg-[#121620]`}
                  >
                    <img
                      src={thumb}
                      alt={ep.title}
                      className="w-full h-full object-cover object-center transition-transform duration-300 group-hover/card:scale-105"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = show.backdrop || show.image || '/images/hero/morning-brew-thumb.png';
                      }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded shadow tracking-wider ${
                        isActive ? 'bg-red-600 text-white' : 'bg-black/80 text-white border border-white/20'
                      }`}>
                        {idx === 0 ? 'LATEST • ' : ''}{noEpisodeTitling ? ep.title : `EPISODE ${ep.episodeNumber}`}
                      </span>
                      <span className="bg-black/80 backdrop-blur-xs text-blue-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-white/10">
                        {ep.duration}
                      </span>
                    </div>

                    {/* Play Button Overlay on Hover */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-2xl transition-transform group-hover/card:scale-110">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Bottom Metadata */}
                    <div className="absolute inset-x-0 bottom-0 p-3 pointer-events-none z-10">
                      <h3 className="text-xs sm:text-sm font-extrabold text-white truncate drop-shadow-md">
                        {ep.title}
                      </h3>
                      {!noEpisodeTitling && ep.airDate && (
                        <span className="text-[11px] text-neutral-400 font-mono mt-0.5 block truncate">
                          {ep.airDate}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </div>

    </div>
  );
}
