import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  X,
  Play,
  Check,
  ExternalLink,
  Copy,
  ListVideo,
  Clock,
  Minimize2,
  Maximize2,
  Tv,
} from 'lucide-react';
import { getShowEpisodes } from '../data/episodesData';
import { onNowShows } from '../data/showsData';
import { LiveStreamPlayer } from './LiveStreamPlayer';

export function MovieDetailModal({
  movie,
  isOpen,
  onClose,
  autoPlay = false,
  onStopRadio,
}) {
  const [activeMovie, setActiveMovie] = useState(movie);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isModalFullscreen, setIsModalFullscreen] = useState(false);
  const [activeEpisode, setActiveEpisode] = useState(null);
  const [copiedEpisodeId, setCopiedEpisodeId] = useState(null);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const modalContainerRef = useRef(null);

  // Monitor device dimensions and orientation
  useEffect(() => {
    const handleDeviceCheck = () => {
      setIsMobileOrTablet(window.innerWidth <= 1024);
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    handleDeviceCheck();
    window.addEventListener('resize', handleDeviceCheck);
    window.addEventListener('orientationchange', handleDeviceCheck);
    return () => {
      window.removeEventListener('resize', handleDeviceCheck);
      window.removeEventListener('orientationchange', handleDeviceCheck);
    };
  }, []);

  const isLiveStream = Boolean(
    activeMovie?.isLive ||
    activeMovie?.isChannel ||
    activeMovie?.category === 'Live TV' ||
    activeMovie?.category === 'On Now' ||
    activeMovie?.duration === 'LIVE NOW' ||
    activeMovie?.channelName ||
    activeMovie?.id?.startsWith('on-now-')
  );

  const isMorningBrew = Boolean(
    (activeMovie?.title || '').toLowerCase().includes('morning brew') ||
    (activeMovie?.id || '').toLowerCase().includes('morning-brew') ||
    (activeMovie?.category || '').toLowerCase().includes('morning brew')
  );

  const isDestinationCrossRiver = Boolean(
    (activeMovie?.title || '').toLowerCase().includes('destination cross river') ||
    (activeMovie?.id || '').toLowerCase().includes('destination-cross-river') ||
    (activeMovie?.id || '').toLowerCase().includes('podcast-3')
  );

  const isComedyContent = Boolean(
    (activeMovie?.category || '').toLowerCase().includes('comedy') ||
    (activeMovie?.title || '').toLowerCase().includes('comedy') ||
    (activeMovie?.title || '').toLowerCase().includes('crack up') ||
    (activeMovie?.id || '').toLowerCase().includes('comedy') ||
    (activeMovie?.id || '').toLowerCase().includes('crack-up')
  );

  const noEpisodeTitling = Boolean(isMorningBrew || isDestinationCrossRiver || isComedyContent);

  // Sync activeMovie whenever incoming movie prop changes or modal opens
  // Stop radio and other players, and play the video linked to the card immediately
  useEffect(() => {
    if (!isOpen || !movie) {
      setIsPlaying(false);
      return;
    }

    setActiveMovie(movie);
    const isLive = Boolean(
      movie?.isLive ||
      movie?.isChannel ||
      movie?.category === 'Live TV' ||
      movie?.category === 'On Now' ||
      movie?.duration === 'LIVE NOW' ||
      movie?.channelName ||
      movie?.id?.startsWith('on-now-')
    );
    setIsPlaying(true);

    if (onStopRadio) {
      onStopRadio();
    }
    if (typeof document !== 'undefined') {
      document.querySelectorAll('audio').forEach((a) => {
        try {
          a.pause();
        } catch (_) {}
      });
      document.querySelectorAll('video').forEach((v) => {
        try {
          v.pause();
        } catch (_) {}
      });
    }

    if (isLive) {
      setIsModalFullscreen(true);
      try {
        if (screen.orientation && screen.orientation.lock) {
          screen.orientation.lock('landscape').catch(() => {});
        }
      } catch (_) {}
    } else {
      setIsModalFullscreen(false);
    }

    const eps = getShowEpisodes(movie) || [];
    const matched = eps.find((e) => e.youtubeId === movie.youtubeId || e.id === movie.id);
    setActiveEpisode(matched || (eps.length > 0 ? eps[0] : null));
  }, [movie?.id, isOpen]);

  // Compute episodes list for this show
  const episodes = useMemo(() => {
    return getShowEpisodes(activeMovie);
  }, [activeMovie]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // When an episode is clicked: show video player and stream that episode
  const handlePlayEpisode = (ep) => {
    if (onStopRadio) onStopRadio();
    setActiveEpisode(ep);
    setIsPlaying(true);
    if (modalContainerRef.current) {
      modalContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleStop = () => {
      setIsPlaying(false);
    };
    window.addEventListener('adc-stop-video-playback', handleStop);
    return () => window.removeEventListener('adc-stop-video-playback', handleStop);
  }, []);

  const handleClosePlayer = () => {
    setIsPlaying(false);
  };

  const handleCopyLink = (url, epId) => {
    if (!url) return;
    navigator.clipboard?.writeText(url).then(() => {
      setCopiedEpisodeId(epId);
      setTimeout(() => {
        setCopiedEpisodeId(null);
      }, 2500);
    });
  };

  if (!isOpen || !activeMovie) return null;

  const currentYoutubeId = activeEpisode?.youtubeId || activeMovie.youtubeId;

  return (
    <>
      {/* Fullscreen Overlay for Live TV Broadcast on Mobile/Tablet (Landscape) */}
      {isLiveStream && isPlaying && isModalFullscreen && (
        <div
          className="fixed bg-black overflow-hidden flex flex-col justify-between"
          style={
            isMobileOrTablet && isPortrait
              ? {
                  position: 'fixed',
                  top: 0,
                  left: '100vw',
                  width: '100vh',
                  height: '100vw',
                  transform: 'rotate(90deg)',
                  transformOrigin: 'top left',
                  zIndex: 9999,
                }
              : {
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  zIndex: 9999,
                }
          }
        >
          {/* Top Control Bar in Fullscreen */}
          <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/90 via-black/40 to-transparent p-3 sm:p-4 flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-2">
              <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded shadow flex items-center gap-1.5 tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                LIVE
              </span>
              <span className="text-white font-extrabold text-xs sm:text-sm truncate">
                {activeMovie.channelName || activeMovie.title}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsModalFullscreen(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/75 hover:bg-neutral-800 text-white text-xs font-bold border border-white/20 transition-all cursor-pointer shadow-lg active:scale-95"
                title="Minimize Fullscreen"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Minimize</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsModalFullscreen(false);
                  setIsPlaying(false);
                  onClose();
                }}
                className="p-1.5 sm:p-2 rounded-full bg-black/75 hover:bg-red-600 text-white transition-all cursor-pointer border border-white/20 shadow-lg active:scale-95"
                title="Close"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          <div className="w-full h-full flex items-center justify-center bg-black relative">
            <LiveStreamPlayer
              key={currentYoutubeId}
              streamUrl={activeMovie.streamUrl}
              youtubeId={currentYoutubeId}
              title={activeMovie.title}
              isLive={true}
              className="w-full h-full"
            />
          </div>
        </div>
      )}

      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop overlay */}
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal Container */}
        <div
          ref={modalContainerRef}
          className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-black text-white rounded-xl sm:rounded-2xl shadow-2xl border border-neutral-800 z-10 my-auto no-scrollbar scroll-smooth"
        >
          {/* Top Close Modal Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 z-40 p-2 sm:p-2.5 rounded-full bg-black/80 hover:bg-neutral-800 text-white transition-colors cursor-pointer border border-neutral-700 min-h-[44px] min-w-[44px] flex items-center justify-center shadow-lg"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* HEADER: SHOWS VIDEO PLAYER FOR EPISODES OR LIVE CHANNELS (only when not in fullscreen to prevent duplicate audio) */}
          {!isModalFullscreen && isPlaying && (currentYoutubeId || activeMovie.streamUrl) ? (
            <div className="relative aspect-[16/9] w-full bg-neutral-950 overflow-hidden border-b border-neutral-800 animate-in fade-in duration-300">
              {/* Control to dismiss/close the player and return to thumbnail list */}
              <div className="absolute top-3 left-3 z-30 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClosePlayer}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/85 hover:bg-neutral-800 text-neutral-200 hover:text-white text-xs font-bold border border-neutral-700 transition-colors shadow-lg cursor-pointer min-h-[38px]"
                  title={isLiveStream ? "Show channel info" : "Hide video player and browse episodes"}
                >
                  <Minimize2 className="w-3.5 h-3.5 text-neutral-300" />
                  <span>{isLiveStream ? 'Show Info' : 'Hide Player'}</span>
                </button>
                
                {isLiveStream && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalFullscreen(true);
                      try {
                        if (screen.orientation && screen.orientation.lock) {
                          screen.orientation.lock('landscape').catch(() => {});
                        }
                      } catch (_) {}
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/85 hover:bg-neutral-800 text-neutral-200 hover:text-white text-xs font-bold border border-neutral-700 transition-colors shadow-lg cursor-pointer min-h-[38px]"
                    title="Fullscreen"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-neutral-300" />
                    <span>Fullscreen</span>
                  </button>
                )}

                <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded shadow uppercase flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span>{isLiveStream ? 'LIVE' : noEpisodeTitling ? (activeEpisode?.title || 'Video') : `Ep ${activeEpisode?.episodeNumber || 1}`}</span>
                </span>

                {isLiveStream && (
                  <span className="hidden sm:inline-flex bg-black/85 backdrop-blur-sm text-neutral-200 text-xs font-bold px-2.5 py-1 rounded border border-neutral-700">
                    {activeMovie.channelName || activeMovie.title}
                  </span>
                )}
              </div>

            <div className="absolute inset-0 w-full h-full z-20">
              <LiveStreamPlayer
                key={currentYoutubeId}
                streamUrl={activeMovie.streamUrl}
                youtubeId={currentYoutubeId}
                title={activeEpisode ? `${activeMovie.title} - ${activeEpisode.title}` : activeMovie.title}
                isLive={isLiveStream}
                poster={activeMovie.backdrop || activeMovie.image}
              />
            </div>
          </div>
        ) : (
          /* Static Show Header Banner (Clean proportional image display) */
          <div className="relative aspect-[21/9] sm:aspect-[16/7] md:aspect-[16/6] min-h-[220px] w-full bg-neutral-950 overflow-hidden">
            <img
              src={activeMovie.backdrop || activeMovie.image}
              alt={activeMovie.title}
              className="w-full h-full object-cover object-center brightness-75 transition-transform duration-700"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/images/hero/morning-brew-thumb.png';
              }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

            {/* Show Title & Overview Info */}
            <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 pointer-events-none">
              <span className="text-neutral-300 text-[11px] sm:text-xs font-semibold uppercase tracking-wider block">
                African Diaspora Channels
              </span>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-white drop-shadow-md line-clamp-1 mt-0.5">
                {activeMovie.title}
              </h2>
              <div className="flex items-center gap-2 sm:gap-3 text-xs text-neutral-300 font-medium flex-wrap mt-1.5">
                <span className="border border-neutral-700 px-1.5 py-0.5 rounded text-[10px] text-neutral-200">
                  {activeMovie.rating || '13+'}
                </span>
                <span>{episodes.length} Episodes</span>
              </div>
            </div>
          </div>
        )}

        {/* Modal Body & Controls */}
        <div className="p-4 sm:p-6 md:p-8 space-y-6 bg-black">
          {/* Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              {isLiveStream ? (
                <button
                  type="button"
                  onClick={() => setIsPlaying(true)}
                  className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-5 sm:px-6 py-2.5 rounded-lg shadow-md transition-all active:scale-98 cursor-pointer min-h-[44px]"
                >
                  <Play className="w-4 h-4 fill-current text-white" />
                  <span>{isPlaying ? 'LIVE' : 'Watch Live'}</span>
                </button>
              ) : episodes.length > 0 ? (
                <button
                  type="button"
                  onClick={() => handlePlayEpisode(activeEpisode || episodes[0])}
                  className="flex items-center justify-center gap-2 bg-white hover:bg-neutral-200 text-black font-bold px-5 sm:px-6 py-2.5 rounded-lg shadow-md transition-all active:scale-98 cursor-pointer min-h-[44px]"
                >
                  <Play className="w-4 h-4 fill-current text-black" />
                  <span>{isPlaying ? (noEpisodeTitling ? 'Now Playing: ' + (activeEpisode?.title || '') : 'Now Playing Ep ' + (activeEpisode?.episodeNumber || 1)) : (noEpisodeTitling ? 'Watch Video' : 'Watch Episode 1')}</span>
                </button>
              ) : null}
            </div>

            {/* Metadata Pills */}
            <div className="flex items-center gap-2 sm:gap-2.5 text-xs text-neutral-300 font-medium flex-wrap pt-1 sm:pt-0">
              <span className="text-neutral-400">{activeMovie.category || 'Series'}</span>
              <span className="text-neutral-600">•</span>
              <span className="border border-neutral-700 px-1.5 py-0.5 rounded text-[11px] text-neutral-200">
                {isLiveStream ? 'HD LIVE' : '4K UHD'}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm md:text-base text-neutral-300 leading-relaxed">
            {activeMovie.description}
          </p>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-neutral-800 text-xs md:text-sm text-neutral-300">
            <div>
              <span className="text-neutral-500 font-medium">Genres: </span>
              <span className="text-neutral-200">{activeMovie.genres ? activeMovie.genres.join(', ') : 'Talk Show, Culture'}</span>
            </div>
            <div>
              <span className="text-neutral-500 font-medium">Audio languages: </span>
              <span className="text-neutral-200">{activeMovie.audioLangs ? activeMovie.audioLangs.join(', ') : 'English [Original]'}</span>
            </div>
            <div>
              <span className="text-neutral-500 font-medium">{isLiveStream ? 'Broadcast Type: ' : 'Subtitles: '}</span>
              <span className="text-neutral-200">{isLiveStream ? 'Direct 24/7 Satellite Feed' : (activeMovie.subtitles ? activeMovie.subtitles.join(', ') : 'English [CC]')}</span>
            </div>
            {activeMovie.officialUrl ? (
              <div>
                <span className="text-neutral-500 font-medium">Official Portal: </span>
                <a
                  href={activeMovie.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-400 hover:underline font-semibold"
                >
                  {activeMovie.channelName || activeMovie.title}
                </a>
              </div>
            ) : activeMovie.starring ? (
              <div>
                <span className="text-neutral-500 font-medium">Starring: </span>
                <span className="text-neutral-200">{activeMovie.starring.join(', ')}</span>
              </div>
            ) : null}
          </div>

          {/* FOR LIVE TV CHANNELS: RENDER THE LIVE CHANNELS DIRECTORY */}
          {isLiveStream ? (
            <div className="pt-6 border-t border-neutral-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-neutral-900/60 p-3.5 sm:p-4 rounded-xl border border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500">
                    <Tv className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white">Live Channels Directory</h3>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Click any channel to switch the livestream player directly
                    </p>
                  </div>
                </div>

                <div className="text-xs text-red-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span>LIVE: {activeMovie.title}</span>
                </div>
              </div>

              {/* Grid of All Live Channels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {onNowShows.map((ch) => {
                  const isCurrent = activeMovie.id === ch.id;

                  return (
                    <div
                      key={ch.id}
                      onClick={() => {
                        if (onStopRadio) onStopRadio();
                        if (typeof document !== 'undefined') {
                          document.querySelectorAll('audio').forEach((a) => {
                            try { a.pause(); } catch (_) {}
                          });
                          document.querySelectorAll('video').forEach((v) => {
                            try { v.pause(); } catch (_) {}
                          });
                        }
                        setActiveMovie(ch);
                        setIsPlaying(true);
                        setIsModalFullscreen(true);
                        try {
                          if (screen.orientation && screen.orientation.lock) {
                            screen.orientation.lock('landscape').catch(() => {});
                          }
                        } catch (_) {}
                        if (modalContainerRef.current) {
                          modalContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      className={`group relative rounded-xl border overflow-hidden transition-all duration-200 cursor-pointer p-3.5 flex flex-col justify-between ${
                        isCurrent
                          ? 'bg-neutral-900/90 border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.35)]'
                          : 'bg-neutral-950/80 border-neutral-800/80 hover:border-neutral-600 hover:bg-neutral-900/50'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2.5">
                        <div className="w-12 h-12 rounded-lg bg-black border border-neutral-800 overflow-hidden flex items-center justify-center flex-shrink-0 p-1">
                          <img
                            src={ch.image || ch.backdrop}
                            alt={ch.title}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/images/hero/morning-brew-thumb.png';
                            }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-bold text-white truncate group-hover:text-red-400 transition-colors">
                            {ch.title}
                          </h4>
                          <span className="text-[11px] text-neutral-400 truncate block">
                            {ch.channelName || ch.category}
                          </span>
                        </div>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase flex items-center gap-1 flex-shrink-0 ${
                          isCurrent ? 'bg-red-600 text-white' : 'bg-neutral-800 text-neutral-300'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? 'bg-white animate-pulse' : 'bg-neutral-400'}`} />
                          <span>LIVE</span>
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 line-clamp-2">
                        {ch.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              {/* SECTION 1: ALL EPISODES OF THIS SHOW */}
          <div className="pt-6 border-t border-neutral-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-neutral-900/60 p-3.5 sm:p-4 rounded-xl border border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500">
                  <ListVideo className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">Episodes of {activeMovie.title}</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Click any episode thumbnail below to play
                  </p>
                </div>
              </div>

              {activeEpisode && isPlaying && (
                <div className="text-xs text-red-400 sm:text-right font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span>Now Playing: {noEpisodeTitling ? activeEpisode.title : `Ep ${activeEpisode.episodeNumber}`}</span>
                </div>
              )}
            </div>

            {/* Visual Thumbnails Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {episodes.map((ep) => {
                const isCurrentlyPlaying = isPlaying && activeEpisode?.id === ep.id;

                return (
                  <div
                    key={ep.id}
                    className={`group relative rounded-xl border overflow-hidden transition-all duration-200 flex flex-col justify-between ${
                      isCurrentlyPlaying
                        ? 'bg-neutral-900/90 border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.35)]'
                        : 'bg-neutral-950/80 border-neutral-800/80 hover:border-neutral-600 hover:bg-neutral-900/50'
                    }`}
                  >
                    <div
                      onClick={() => handlePlayEpisode(ep)}
                      className="relative aspect-[16/9] w-full bg-neutral-900 overflow-hidden cursor-pointer group/thumb"
                      title={noEpisodeTitling ? `Click to play ${ep.title}` : `Click to play Episode ${ep.episodeNumber}: ${ep.title}`}
                    >
                      <img
                        src={ep.image || activeMovie.backdrop || activeMovie.image}
                        alt={ep.title}
                        className="w-full h-full object-cover object-center transition-transform duration-300 group-hover/thumb:scale-105"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = activeMovie.backdrop || activeMovie.image;
                        }}
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover/thumb:bg-black/20 flex items-center justify-center transition-colors">
                        <div
                          className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover/thumb:scale-110 ${
                            isCurrentlyPlaying
                              ? 'bg-red-600 text-white'
                              : 'bg-white/95 group-hover/thumb:bg-red-600 text-black group-hover/thumb:text-white'
                          }`}
                        >
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </div>

                      <span className="absolute top-2 left-2 bg-black/85 text-white text-[11px] font-black px-2 py-0.5 rounded shadow border border-white/10">
                        {noEpisodeTitling ? ep.title : `EP ${ep.episodeNumber}`}
                      </span>

                      <span className="absolute bottom-2 right-2 bg-black/85 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow flex items-center gap-1">
                        <Clock className="w-3 h-3 text-neutral-400" />
                        <span>{ep.duration}</span>
                      </span>
                    </div>

                    <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between gap-2.5">
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] uppercase font-bold text-neutral-400">
                            {noEpisodeTitling ? '' : (ep.airDate || `Episode ${ep.episodeNumber}`)}
                          </span>
                          {isCurrentlyPlaying && (
                            <span className="bg-red-600 text-white text-[8.5px] font-black uppercase px-1.5 py-0.5 rounded animate-pulse">
                              Now Playing
                            </span>
                          )}
                        </div>

                        <h4
                          onClick={() => handlePlayEpisode(ep)}
                          className="text-xs sm:text-sm font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1 cursor-pointer"
                          title={ep.title}
                        >
                          {ep.title}
                        </h4>

                        <p className="text-[11px] sm:text-xs text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
                          {ep.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-neutral-800/80">
                        <button
                          type="button"
                          onClick={() => handlePlayEpisode(ep)}
                          className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
                            isCurrentlyPlaying
                              ? 'bg-red-600 text-white shadow-md'
                              : 'bg-white hover:bg-neutral-200 text-black'
                          }`}
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>{isCurrentlyPlaying ? 'Playing' : (noEpisodeTitling ? 'Play' : 'Play Ep ' + ep.episodeNumber)}</span>
                        </button>

                        {ep.youtubeUrl && (
                          <a
                            href={ep.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-1.5 px-2.5 rounded-lg text-xs font-bold bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-700 hover:border-neutral-500 transition-all flex items-center justify-center gap-1 cursor-pointer"
                            title={`Open direct link to ${ep.title} on YouTube in new tab`}
                          >
                            <span>Link</span>
                            <ExternalLink className="w-3 h-3 text-neutral-400" />
                          </a>
                        )}

                        {ep.youtubeUrl && (
                          <button
                            type="button"
                            onClick={() => handleCopyLink(ep.youtubeUrl, ep.id)}
                            className="p-1.5 rounded-lg text-xs font-bold bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-600 transition-all flex items-center justify-center cursor-pointer min-h-[30px] min-w-[30px]"
                            title="Copy direct link to episode"
                          >
                            {copiedEpisodeId === ep.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          </>
        )}
        </div>
      </div>
    </div>
    </>
  );
}
