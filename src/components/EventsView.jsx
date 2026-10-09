import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Ticket, Clock, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { upcomingCrackUpComedyShows } from '../data/showsData';

const HERO_VIDEO_SLIDES = [
 /* {
    id: 'slide-1',
    title: 'Crack Up Comedy October Edition',
    city: 'Calabar',
    date: 'OCT 9, 2026',
    venue: 'Small Tent Municipal Headquaters, Calabar',
    category: 'Comedy Shows',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    poster: '/images/crackup-oct.png',
    description: 'October edition of Crack Up Comedy live in Calabar featuring hilarious stand-up comedy and diaspora entertainment.',
    eventId: 'event-1',
  },*/
  {
    id: 'slide-1',
    title: 'Calabar Carnival 1st Dry Run',
    city: 'Calabar',
    date: 'OCT 18, 2026',
    venue: '12km Carnival Route to U.J. Esuene Stadium, Calabar',
    category: 'Carnival Calabar',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    poster: '/images/1st-dryrun.png',
    description: "Africa's biggest street party kicks off with the official 1st Dry Run across the 12km carnival route in Calabar!",
    eventId: 'event-cc-1',
  },
];

export function EventsView({ onPlayMovie, onOpenDetails, onShowToast }) {
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Hero Video Slider State
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlayingVideo, setIsPlayingVideo] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const videoRef = useRef(null);

  const eventCategories = ['All', 'Calabar Carnival'];

  const upcomingEvents = [
   /* {
      id: 'event-1',
      title: 'Crack Up Comedy October Edition',
      category: 'Comedy',
      city: 'Calabar',
      date: 'OCT 9, 2026',
      time: '5:00PM WAT',
      venue: 'Small Tent Municipal Headquaters, Calabar',
      isLiveStreamed: true,
      price: 'Free',
      image: '/images/crackup-oct.png',
      backdrop: '/images/crackup-oct.png',
      description: 'The October edition of Crack Up Comedy live in Calabar! Bringing hilarious pan-African stand-up comedy, vibrant crowd work, and celebrated entertainers.',
      performerHighlights: ['Charliebaz', 'Mcbigpsalm', 'Supaboy'],
      movieRef: upcomingCrackUpComedyShows[0],
    },*/
    {
      id: 'event-cc-1',
      title: 'Calabar Carnival 1st Dry Run',
      category: 'Calabar Carnival',
      city: 'Calabar',
      date: 'OCT 18, 2026',
      time: '10:00 AM WAT',
      venue: '12km Carnival Route to U.J. Esuene Stadium, Calabar',
      isLiveStreamed: true,
      price: 'Free Public Access',
      image: '/images/1st-dryrun.png',
      backdrop: '/images/1st-dryrun.png',
      description: 'The crown jewel of African cultural pageantry! Over 50,000 costumed masqueraders, competing carnival bands, stilt walkers, and vibrant music floats parade through Calabar with live global broadcast on ADC.',
      performerHighlights: ['Seagull Band', 'Bayside Band', 'Masta Blasta', 'Passion 4 Band', 'Freedom Band'],
      movieRef: null,
    },
    
  ];

  const currentSlide = HERO_VIDEO_SLIDES[currentSlideIndex];

  // Advance to next video slide when current video completes
  const handleVideoEnded = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % HERO_VIDEO_SLIDES.length);
    setVideoProgress(0);
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % HERO_VIDEO_SLIDES.length);
    setVideoProgress(0);
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + HERO_VIDEO_SLIDES.length) % HERO_VIDEO_SLIDES.length);
    setVideoProgress(0);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setVideoProgress(progress);
    }
  };

  // Reload and play when slide changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => {
        setIsPlayingVideo(true);
      }).catch(() => {
        // Autoplay policy fallback
        setIsPlayingVideo(false);
      });
    }
  }, [currentSlideIndex]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlayingVideo) {
        videoRef.current.pause();
        setIsPlayingVideo(false);
      } else {
        videoRef.current.play();
        setIsPlayingVideo(true);
      }
    }
  };

  const filteredEvents = activeCategory === 'All'
    ? upcomingEvents
    : upcomingEvents.filter((ev) => {
        if (activeCategory === 'Comedy') {
          return ev.category === 'Comedy' || ev.category.includes('Comedy');
        }
        if (activeCategory === 'Calabar Carnival') {
          return ev.category === 'Calabar Carnival' || ev.title.toLowerCase().includes('calabar carnival');
        }
        return ev.category === activeCategory;
      });

  return (
    <div className="w-full min-h-screen bg-black text-white pb-20 animate-in fade-in duration-300">
      
      {/* 1. HERO VIDEO SLIDER (Shows teasers; advances to next video upon completion) */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] min-h-[440px] max-h-[640px] overflow-hidden bg-neutral-950 border-b border-neutral-800 group">
        
        {/* HTML5 Video Element */}
        <video
          key={currentSlide.videoUrl}
          ref={videoRef}
          src={currentSlide.videoUrl}
          poster={currentSlide.poster}
          autoPlay
          muted={isMuted}
          playsInline
          onEnded={handleVideoEnded}
          onTimeUpdate={handleTimeUpdate}
          className="w-full h-full object-cover md:object-fill opacity-60"
        />

        {/* Gradients Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />

        {/* Video Controls (Mute / Unmute & Play / Pause) */}
        <div className="absolute top-4 right-4 sm:right-8 flex items-center gap-2 z-20">
          <button
            type="button"
            onClick={togglePlayPause}
            className="p-2 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer"
            title={isPlayingVideo ? 'Pause Video' : 'Play Video'}
          >
            {isPlayingVideo ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          </button>
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Hero Content Overlay */}
        <div className="absolute inset-0 flex items-center px-4 sm:px-8 md:px-16 max-w-5xl z-10">
          <div className="space-y-3 sm:space-y-4 pt-12 sm:pt-6">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-md">
              {currentSlide.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-semibold text-neutral-300">
              <span className="flex items-center gap-1.5 text-red-400 font-bold">
                <Calendar className="w-4 h-4" />
                {currentSlide.date}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-neutral-400" />
                {currentSlide.venue}
              </span>
            </div>

            <p className="text-neutral-300 text-xs sm:text-sm md:text-base line-clamp-2 max-w-2xl leading-relaxed">
              {currentSlide.description}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  const matchingEvent = upcomingEvents.find(e => e.id === currentSlide.eventId);
                  if (matchingEvent?.movieRef && onPlayMovie) {
                    onPlayMovie(matchingEvent.movieRef);
                  } else if (onShowToast) {
                    onShowToast(`Streaming full trailer for ${currentSlide.title}`);
                  }
                }}
                className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Watch Full Show</span>
              </button>
            </div>
          </div>
        </div>

        {/* Video Auto-play Progress Bar at the bottom of the slider */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-neutral-900/80 z-30">
          <div 
            className="h-full bg-red-600 transition-all duration-150"
            style={{ width: `${videoProgress}%` }}
          />
        </div>

        {/* Video slide indicator dots */}
        <div className="absolute bottom-3 right-4 sm:right-8 flex items-center gap-2 z-20">
          {HERO_VIDEO_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => {
                setCurrentSlideIndex(idx);
                setVideoProgress(0);
              }}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentSlideIndex === idx ? 'w-6 bg-red-600' : 'w-2 bg-neutral-600 hover:bg-neutral-400'
              }`}
              title={`Switch to ${slide.city}: ${slide.title}`}
            />
          ))}
        </div>

      </div>

      {/* Filter Tabs */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 pt-8 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {eventCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            return (
              <div
                key={event.id}
                className="group bg-[#121212] border border-neutral-800 hover:border-neutral-700 rounded-xl overflow-hidden transition-all duration-300 flex flex-col hover:shadow-2xl hover:shadow-black"
              >
                {/* Image & Badges */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-900">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded bg-black/80 backdrop-blur-xs text-white text-[11px] font-bold border border-white/10">
                      {event.category}
                    </span>
                  </div>

                  {/* Badge on right replaced with the name of the city the show will hold */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-md bg-black/85 backdrop-blur-sm text-white text-xs font-black border border-white/20 shadow-md flex items-center gap-1 uppercase tracking-wider">
                      <MapPin className="w-3 h-3 text-red-500" />
                      <span>{event.city}</span>
                    </span>
                  </div>

                  {event.movieRef && (
                    <button
                      type="button"
                      onClick={() => onPlayMovie && onPlayMovie(event.movieRef)}
                      className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-white/90 text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-2xl hover:scale-110 cursor-pointer"
                    >
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </button>
                  )}
                </div>

                {/* Details Section */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-red-400 font-bold">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{event.date}</span>
                      <span className="text-neutral-600">•</span>
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      <span className="text-neutral-400">{event.time}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-white leading-snug group-hover:text-red-400 transition-colors">
                      {event.title}
                    </h3>

                    <p className="text-xs text-neutral-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-neutral-500" />
                      <span className="line-clamp-1">{event.venue}</span>
                    </p>

                    <p className="text-xs text-neutral-300 line-clamp-2 pt-1 leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  {/* Highlights / Performers */}
                  {event.performerHighlights && (
                    <div className="text-[11px] text-neutral-400 border-t border-neutral-850 pt-3">
                      <span className="font-bold text-neutral-300">Featuring: </span>
                      {event.performerHighlights.join(', ')}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-3 pt-2 border-t border-neutral-850">
                    <div className="text-xs">
                      <span className="text-neutral-500 text-[10px] block">Tickets from</span>
                      <span className="text-white font-black">{event.price}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (onShowToast) onShowToast(`Ticket link for ${event.title} reserved!`);
                        }}
                        className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs tracking-wide transition-all cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95"
                      >
                        <Ticket className="w-3.5 h-3.5" />
                        <span>Get Tickets</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
