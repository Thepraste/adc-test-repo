import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { AlertCircle, RefreshCw, Tv, ExternalLink } from 'lucide-react';

export function LiveStreamPlayer({
  streamUrl,
  youtubeId,
  title = 'Live Stream',
  poster,
  isLive = true,
  className = '',
}) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [retryKey, setRetryKey] = useState(0);
  const [useFallback, setUseFallback] = useState(false);
  const networkErrorCount = useRef(0);

  const isHls = Boolean(!useFallback && streamUrl && (streamUrl.includes('.m3u8') || streamUrl.includes('playlist')));

  useEffect(() => {
    const handleStop = () => {
      if (videoRef.current) {
        try {
          videoRef.current.pause();
        } catch (_) {}
      }
    };
    window.addEventListener('adc-stop-video-playback', handleStop);
    return () => window.removeEventListener('adc-stop-video-playback', handleStop);
  }, []);

  useEffect(() => {
    if (!isHls || !streamUrl) {
      setIsLoading(false);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    setIsLoading(true);
    setErrorMsg(null);
    networkErrorCount.current = 0;

    // Timeout safety net in case stream hangs or cert handshake is blocked
    const loadTimeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setErrorMsg('Connecting took longer than expected. You can retry or switch to the ADC live backup broadcast.');
      }
    }, 7000);

    // Clean up any existing HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 60,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
      });
      hlsRef.current = hls;

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        clearTimeout(loadTimeout);
        setIsLoading(false);
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay with audio was blocked, try muted
            video.muted = true;
            video.play().catch((err) => console.log('Muted play deferred:', err));
          });
        }
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.warn('HLS stream error:', data.type, data.details);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              networkErrorCount.current += 1;
              if (networkErrorCount.current <= 2) {
                console.log(`Network retry attempt ${networkErrorCount.current}...`);
                hls.startLoad();
              } else {
                clearTimeout(loadTimeout);
                setIsLoading(false);
                setErrorMsg('CRBC live feed server is temporarily unreachable. You can switch to the ADC backup broadcast or retry.');
                hls.destroy();
              }
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log('Media error detected, attempting recovery...');
              hls.recoverMediaError();
              break;
            default:
              clearTimeout(loadTimeout);
              setErrorMsg('Live feed is momentarily reconnecting.');
              setIsLoading(false);
              hls.destroy();
              break;
          }
        }
      });

      // When live broadcast is played after being paused, jump immediately to live edge in current time
      const handleSyncOnPlay = () => {
        if (!isLive) return;
        try {
          if (hls && typeof hls.liveSyncPosition === 'number' && hls.liveSyncPosition > 0) {
            const livePos = hls.liveSyncPosition;
            if (Math.abs(video.currentTime - livePos) > 1.2) {
              console.log('Syncing live TV stream to current time:', livePos);
              video.currentTime = livePos;
            }
          } else if (video.seekable && video.seekable.length > 0) {
            const liveEnd = video.seekable.end(video.seekable.length - 1);
            if (Math.abs(video.currentTime - liveEnd) > 1.2) {
              console.log('Seeking live TV video to current live time:', liveEnd);
              video.currentTime = liveEnd;
            }
          }
        } catch (e) {
          console.warn('Could not sync to live edge:', e);
        }
      };

      video.addEventListener('play', handleSyncOnPlay);

      return () => {
        clearTimeout(loadTimeout);
        video.removeEventListener('play', handleSyncOnPlay);
        if (hlsRef.current) {
          hlsRef.current.destroy();
          hlsRef.current = null;
        }
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native Safari / iOS HLS support
      video.src = streamUrl;
      const onLoaded = () => {
        clearTimeout(loadTimeout);
        setIsLoading(false);
        video.play().catch(() => {
          video.muted = true;
          video.play().catch(() => {});
        });
      };
      const onError = () => {
        clearTimeout(loadTimeout);
        setIsLoading(false);
        setErrorMsg('Unable to load live video stream.');
      };

      const handleNativeSyncOnPlay = () => {
        if (!isLive) return;
        try {
          if (video.seekable && video.seekable.length > 0) {
            const liveEnd = video.seekable.end(video.seekable.length - 1);
            if (Math.abs(video.currentTime - liveEnd) > 1.2) {
              video.currentTime = liveEnd;
            }
          }
        } catch (e) {
          console.warn('Could not sync native live stream to current time:', e);
        }
      };

      video.addEventListener('loadedmetadata', onLoaded);
      video.addEventListener('error', onError);
      video.addEventListener('play', handleNativeSyncOnPlay);

      return () => {
        clearTimeout(loadTimeout);
        video.removeEventListener('loadedmetadata', onLoaded);
        video.removeEventListener('error', onError);
        video.removeEventListener('play', handleNativeSyncOnPlay);
      };
    } else {
      clearTimeout(loadTimeout);
      setIsLoading(false);
      setErrorMsg('HLS video playback is not natively supported on this browser.');
    }
  }, [streamUrl, isHls, retryKey, useFallback]);

  const handleRetry = () => {
    setUseFallback(false);
    setRetryKey((prev) => prev + 1);
  };

  const handleSwitchToFallback = () => {
    setUseFallback(true);
    setErrorMsg(null);
    setIsLoading(false);
  };

  // If using HLS player
  if (isHls && !useFallback) {
    return (
      <div className={`relative w-full h-full bg-black flex items-center justify-center overflow-hidden ${className}`}>
        <video
          ref={videoRef}
          controls
          playsInline
          poster={poster}
          className="w-full h-full object-contain bg-black"
          title={title}
        />

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center gap-3 z-10 pointer-events-none">
            <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold text-blue-200 tracking-wide">
              Connecting to Live Stream Feed...
            </span>
          </div>
        )}

        {/* Error / Fallback Overlay */}
        {errorMsg && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-20 space-y-3">
            <div className="w-12 h-12 rounded-full bg-red-950/80 border border-red-500/40 flex items-center justify-center text-red-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="max-w-md">
              <h4 className="text-sm font-bold text-white mb-1">{title}</h4>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {errorMsg}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleSwitchToFallback}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-lg cursor-pointer active:scale-95"
              >
                <Tv className="w-3.5 h-3.5" />
                <span>Switch to ADC Live Backup</span>
              </button>
              <button
                type="button"
                onClick={handleRetry}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Feed</span>
              </button>
              {streamUrl && (
                <a
                  href={streamUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-neutral-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Direct Link</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Fallback to YouTube iframe embed
  const currentVideoId = youtubeId || 'BAhn-P035_M';
  const embedUrl = currentVideoId === 'live'
    ? `https://www.youtube-nocookie.com/embed/live_stream?channel=UCh59LoeUVvZkh10okzwxIjQ&autoplay=1&rel=0`
    : `https://www.youtube-nocookie.com/embed/${currentVideoId}?autoplay=1&rel=0`;

  return (
    <div className={`relative w-full h-full bg-black flex items-center justify-center overflow-hidden ${className}`}>
      <iframe
        src={embedUrl}
        title={title}
        className="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
      {useFallback && streamUrl && (
        <div className="absolute top-2 right-2 z-30">
          <button
            type="button"
            onClick={handleRetry}
            className="px-2.5 py-1 bg-black/80 hover:bg-black text-[11px] text-blue-300 hover:text-white rounded border border-blue-500/40 backdrop-blur-xs flex items-center gap-1 font-semibold cursor-pointer shadow"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Try HLS Stream</span>
          </button>
        </div>
      )}
    </div>
  );
}
