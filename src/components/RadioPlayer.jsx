import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  X,
  Radio,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  SkipForward,
  SkipBack,
  Signal,
  MapPin,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { RADIO_STATIONS, RADIO_SPONSOR_ADS } from '../data/radioData';

export function RadioPlayer({
  station,
  isPlaying,
  onTogglePlay,
  onClose,
  onSelectStation,
}) {
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [streamError, setStreamError] = useState(false);
  const [activeAdIndex, setActiveAdIndex] = useState(0);
  const [isVideoAdMuted, setIsVideoAdMuted] = useState(true);
  const [isAutoPlayEnabled, setIsAutoPlayEnabled] = useState(true);
  const [isAdPaused, setIsAdPaused] = useState(false);
  const [adProgress, setAdProgress] = useState(0);

  const audioRef = useRef(null);
  const videoAdRef = useRef(null);
  const currentStationIdRef = useRef(null);

  const currentAd = RADIO_SPONSOR_ADS[activeAdIndex] || RADIO_SPONSOR_ADS[0];

  // Ads carousel autoplay timer
  useEffect(() => {
    if (isMinimized || !isAutoPlayEnabled || isAdPaused) return;

    // 7.5 seconds for image ads, 11 seconds for video ad
    const duration = currentAd.type === 'video' ? 11000 : 7500;
    const intervalStep = 100;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += intervalStep;
      setAdProgress(Math.min(100, (elapsed / duration) * 100));

      if (elapsed >= duration) {
        elapsed = 0;
        setAdProgress(0);
        setActiveAdIndex((prev) => (prev + 1) % RADIO_SPONSOR_ADS.length);
      }
    }, intervalStep);

    return () => {
      clearInterval(timer);
    };
  }, [isMinimized, isAutoPlayEnabled, isAdPaused, currentAd.type, activeAdIndex]);

  const handlePrevAd = () => {
    setAdProgress(0);
    setActiveAdIndex((prev) => (prev > 0 ? prev - 1 : RADIO_SPONSOR_ADS.length - 1));
  };

  const handleNextAd = () => {
    setAdProgress(0);
    setActiveAdIndex((prev) => (prev + 1) % RADIO_SPONSOR_ADS.length);
  };

  // Safe Audio Stream Setup & Playback management without reload loop
  useEffect(() => {
    if (!station || !audioRef.current) return;
    const audio = audioRef.current;

    // Only update audio source when the station ID actually changes
    const stationChanged = currentStationIdRef.current !== station.id;
    if (stationChanged || !audio.src) {
      currentStationIdRef.current = station.id;
      setStreamError(false);
      setIsLoading(true);

      audio.src = station.streamUrl;
      audio.volume = isMuted ? 0 : volume;

      if (isPlaying) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsLoading(false);
            })
            .catch((err) => {
              console.warn('Primary stream playback issue, attempting backup:', err);
              if (station.backupStreamUrl && audio.src !== station.backupStreamUrl) {
                audio.src = station.backupStreamUrl;
                audio.play().catch(() => {
                  setStreamError(true);
                  setIsLoading(false);
                });
              } else {
                setStreamError(true);
                setIsLoading(false);
              }
            });
        }
      } else {
        audio.pause();
        setIsLoading(false);
      }
    } else {
      // Station did NOT change, just handle play / pause toggle
      if (isPlaying) {
        if (audio.paused) {
          setIsLoading(true);
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => setIsLoading(false))
              .catch((err) => {
                console.warn('Audio resume error:', err);
                setIsLoading(false);
              });
          }
        }
      } else {
        if (!audio.paused) {
          audio.pause();
          setIsLoading(false);
        }
      }
    }
  }, [station?.id, station?.streamUrl, isPlaying]);

  // Volume change sync
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  if (!station) return null;

  const currentIndex = RADIO_STATIONS.findIndex((s) => s.id === station.id);
  const handlePrevStation = () => {
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : RADIO_STATIONS.length - 1;
    if (onSelectStation) onSelectStation(RADIO_STATIONS[prevIndex]);
  };
  const handleNextStation = () => {
    const nextIndex = currentIndex < RADIO_STATIONS.length - 1 ? currentIndex + 1 : 0;
    if (onSelectStation) onSelectStation(RADIO_STATIONS[nextIndex]);
  };

  return (
    <>
      <audio
        ref={audioRef}
        preload="none"
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => {
          setIsLoading(false);
          setStreamError(false);
        }}
        onError={() => {
          if (station.backupStreamUrl && audioRef.current?.src !== station.backupStreamUrl) {
            audioRef.current.src = station.backupStreamUrl;
            audioRef.current.play().catch(() => {
              setStreamError(true);
              setIsLoading(false);
            });
          } else {
            setStreamError(true);
            setIsLoading(false);
          }
        }}
      />

      {/* Global Radio Stage & Player Container */}
      <div
        id="global-radio-player-stage"
        className={`fixed z-50 select-none transition-all duration-300 ease-in-out ${
          isMinimized
            ? 'bottom-14 sm:bottom-0 left-0 right-0 max-h-[92px] bg-[#0c1420]/95 backdrop-blur-xl border-t border-blue-500/30 shadow-[0_-8px_30px_rgba(0,0,0,0.8)]'
            : 'inset-0 bg-black/95 backdrop-blur-2xl flex flex-col justify-between overflow-y-auto'
        } text-white`}
      >
        {/* 1. TOP SPONSOR & AD SHOWCASE STAGE (With Autoplay Carousel) */}
        {!isMinimized && (
          <div
            className="flex-1 w-full max-w-[1920px] mx-auto flex flex-col justify-center items-center px-4 sm:px-8 py-3 sm:py-5 relative min-h-0"
            onMouseEnter={() => setIsAdPaused(true)}
            onMouseLeave={() => setIsAdPaused(false)}
            onTouchStart={() => setIsAdPaused(true)}
            onTouchEnd={() => setIsAdPaused(false)}
          >
            {/* Top Header Row within Player Stage */}
            <div className="w-full flex items-center justify-between pb-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-white/90 font-medium text-xs sm:text-sm tracking-wide">
                  Radio for you!
                </span>
              </div>

              {/* City of the radio station & Minimize button */}
              <div className="flex items-center gap-2.5 sm:gap-3">
                <span className="font-mono text-xs sm:text-sm md:text-base font-bold text-white tracking-widest uppercase">
                  Live &ndash; {station?.city || 'Calabar'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsMinimized(true)}
                  className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                  title="Minimize Player Bar"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Dynamic Multi-Color Progress Line */}
            <div className="w-full h-[3px] bg-white/10 rounded-full overflow-hidden mb-3 sm:mb-4">
              <div
                className="h-full bg-gradient-to-r from-red-500 via-[#00a8e1] to-emerald-400 transition-all duration-100 ease-linear rounded-full"
                style={{ width: `${adProgress}%` }}
              />
            </div>

            {/* Central Media Layout with Prev/Next Controls, Flyer, and QR Code Space */}
            <div className="flex-1 w-full flex items-center justify-center my-auto relative px-2 sm:px-12">
              
              {/* Prev Ad Arrow */}
              <button
                type="button"
                onClick={handlePrevAd}
                className="flex absolute left-0 sm:left-2 md:left-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/80 hover:bg-black border border-white/20 text-white items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 cursor-pointer backdrop-blur-sm shadow-xl"
                title="Previous Ad"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Next Ad Arrow */}
              <button
                type="button"
                onClick={handleNextAd}
                className="flex absolute right-0 sm:right-2 md:right-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/80 hover:bg-black border border-white/20 text-white items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 cursor-pointer backdrop-blur-sm shadow-xl"
                title="Next Ad"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Center Group: Flyer + QR Code space side by side */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-10 max-w-4xl mx-auto w-full">
                
                {/* 1. Flyer / Video Container */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group bg-neutral-950 flex items-center justify-center max-w-[460px] lg:max-w-[530px] max-h-[38vh] sm:max-h-[44vh] md:max-h-[48vh]">
                  {currentAd.type === 'video' && currentAd.videoUrl ? (
                    /* Video Ad Container */
                    <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black">
                      <video
                        key={currentAd.id}
                        ref={videoAdRef}
                        src={currentAd.videoUrl}
                        poster={currentAd.imageUrl}
                        autoPlay
                        loop
                        muted={isVideoAdMuted}
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2.5 right-2.5 z-20">
                        <button
                          type="button"
                          onClick={() => setIsVideoAdMuted(!isVideoAdMuted)}
                          className="p-1.5 rounded-full bg-black/75 hover:bg-black text-white text-xs border border-white/20 transition-all cursor-pointer flex items-center gap-1"
                          title={isVideoAdMuted ? 'Unmute Promo Video' : 'Mute Promo Video'}
                        >
                          {isVideoAdMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                          <span className="text-[10px] font-bold">{isVideoAdMuted ? 'Muted' : 'Sound'}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Image Ad Container */
                    <img
                      key={currentAd.id}
                      src={currentAd.imageUrl}
                      alt={currentAd.title}
                      className="w-full h-auto max-h-[38vh] sm:max-h-[44vh] md:max-h-[48vh] object-contain rounded-2xl drop-shadow-2xl"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>

                {/* 2. Space for the QR Code with "SCAN TO" label underneath */}
                <div className="flex flex-col items-center justify-center flex-shrink-0">
                  <div className="bg-white p-2.5 sm:p-3 rounded-xl sm:rounded-2xl shadow-2xl border border-neutral-200/40 flex flex-col items-center">
                    <QRCodeSVG
                      value={currentAd.qrUrl || 'https://africandiasporachannels.com'}
                      size={135}
                      className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36"
                      bgColor="#ffffff"
                      fgColor="#000000"
                      level="M"
                    />
                    <div className="w-full bg-white pt-2 pb-0.5 border-t border-neutral-100 flex items-center justify-center">
                      <span className="font-mono text-xs sm:text-sm font-black text-black tracking-widest uppercase">
                        {currentAd.qrLabel || 'SCAN TO'}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Text beneath the flyer carrying details on the ads */}
            <div className="w-full text-center mt-3 sm:mt-4 space-y-1 font-mono select-text px-4">
              <div className="text-xs sm:text-sm md:text-base font-bold text-white tracking-widest flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
                <span>
                  {currentAd.dateDetail || `${currentAd.date || 'OCT 9'}    |    ${currentAd.time || '10:00pm WAT'}    |    Gate:  ${currentAd.entry || 'Free'}`}
                </span>
              </div>
              <div className="text-xs sm:text-sm md:text-base text-neutral-200 font-bold tracking-widest">
                <span>
                  {currentAd.phoneDetail || `${currentAd.phone || '234 916 847 9466'}    or    ${currentAd.altPhone || '234 707 185 8592'}`}
                </span>
              </div>
            </div>

            {/* Bottom Dots Indicator */}
            <div className="flex items-center justify-center gap-2 pt-2 pb-1">
              {RADIO_SPONSOR_ADS.map((ad, idx) => (
                <button
                  key={ad.id}
                  type="button"
                  onClick={() => {
                    setAdProgress(0);
                    setActiveAdIndex(idx);
                  }}
                  className={`h-1.5 transition-all cursor-pointer ${
                    activeAdIndex === idx
                      ? 'w-7 sm:w-8 bg-[#00a8e1] rounded-full'
                      : 'w-1.5 sm:w-2 bg-neutral-600 hover:bg-neutral-400 rounded-full'
                  }`}
                  title={`Go to ${ad.title}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* 2. DEDICATED BOTTOM RADIO PLAYER BAR */}
        <div className="w-full bg-[#0d131c] border-t border-neutral-800 shadow-[0_-8px_30px_rgba(0,0,0,0.9)]">
          {/* Top Thin Status Strip */}
          <div className="flex items-center justify-between px-3 sm:px-6 py-1 bg-black/60 border-b border-white/5 text-[11px] text-neutral-400">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-black uppercase tracking-wider text-emerald-400">
                LIVE RADIO BROADCAST
              </span>
              <span className="text-neutral-500">•</span>
              <span className="text-neutral-300 font-bold">
                {station.frequency} — {station.city}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-neutral-400 hover:text-white p-1 rounded transition-colors cursor-pointer flex items-center gap-1 font-semibold text-[11px]"
                title={isMinimized ? 'Expand Full Ad & Radio Stage' : 'Minimize to Bottom Bar'}
              >
                {isMinimized ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    <span className="hidden xs:inline">Show Ad Stage</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    <span className="hidden xs:inline">Minimize</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="text-neutral-400 hover:text-red-400 p-1 rounded transition-colors cursor-pointer"
                title="Stop & Close Radio"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Controls Bar */}
          <div className="max-w-[1920px] mx-auto px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-3 sm:gap-6">
            
            {/* Left: Station Identity (No logo, No descriptions - Just location) */}
            <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 max-w-[42%] sm:max-w-[34%]">
              {/* Station Badge with Accent Border */}
              <div
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex flex-col items-center justify-center font-black text-center shadow-lg border-2 flex-shrink-0 relative bg-black/80 px-1"
                style={{ borderColor: station.accentColor || '#00a8e1' }}
              >
                <Radio className="w-4 h-4 text-[#00a8e1] mb-0.5" />
                <span className="text-[9px] font-black text-white leading-none">
                  {station.frequency.split(' ')[0]}
                </span>
              </div>

              {/* Station Title & Location Only */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-black text-white truncate">
                    {station.name}
                  </h4>
                  <span
                    className="hidden sm:inline-block text-[10px] font-bold px-1.5 py-0.2 rounded text-white shadow-xs"
                    style={{ backgroundColor: station.accentColor || '#1d70b8' }}
                  >
                    {station.frequency}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-neutral-300 truncate font-semibold flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-red-500 flex-shrink-0" />
                  <span>{station.city}, {station.state}</span>
                </p>
              </div>
            </div>

            {/* Center: Playback Controls & Animated Waveform Equalizer */}
            <div className="flex flex-col items-center justify-center gap-1 flex-1 max-w-[380px]">
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Previous Station */}
                <button
                  type="button"
                  onClick={handlePrevStation}
                  className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Previous Radio Station"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                {/* Big White Circular Play/Pause Button */}
                <button
                  type="button"
                  onClick={onTogglePlay}
                  disabled={isLoading}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white hover:bg-neutral-200 text-black flex items-center justify-center transition-transform active:scale-95 shadow-lg shadow-white/20 cursor-pointer disabled:opacity-60"
                  title={isPlaying ? 'Pause Station' : 'Play Station'}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  )}
                </button>

                {/* Next Station */}
                <button
                  type="button"
                  onClick={handleNextStation}
                  className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Next Radio Station"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Live Waveform Equalizer Animation */}
              <div className="flex items-center gap-1 h-3 pointer-events-none">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((bar) => (
                  <div
                    key={bar}
                    className={`w-1 rounded-full transition-all duration-200 ${
                      isPlaying && !isLoading
                        ? 'bg-emerald-400 animate-pulse'
                        : 'bg-neutral-600 h-1'
                    }`}
                    style={{
                      height: isPlaying && !isLoading ? `${Math.floor((bar % 5) * 2.2 + 3)}px` : '2px',
                      animationDelay: `${bar * 100}ms`,
                      animationDuration: '550ms',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Right: Volume & Status Badge */}
            <div className="flex items-center justify-end gap-3 min-w-0">
              {/* Volume Slider with Cyan Accent */}
              <div className="hidden sm:flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-neutral-400 hover:text-white transition-colors cursor-pointer p-1"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-red-400" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    if (isMuted) setIsMuted(false);
                  }}
                  className="w-16 md:w-24 h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-[#00a8e1]"
                />
              </div>

              {/* Station Frequency Pill Badge */}
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-xs font-mono text-neutral-300">
                <Signal className="w-3 h-3 text-emerald-400" />
                <span>128k Live</span>
              </div>
            </div>

          </div>

          {/* Stream Error Notice if stream URL blocked */}
          {streamError && (
            <div className="bg-red-950/80 border-t border-red-500/30 px-4 py-1.5 text-center text-xs text-red-300 flex items-center justify-center gap-2">
              <span>Broadcaster stream offline, Retrying...</span>
              <button
                type="button"
                onClick={handleNextStation}
                className="underline font-bold text-white ml-2 cursor-pointer"
              >
                Try Next Station
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
