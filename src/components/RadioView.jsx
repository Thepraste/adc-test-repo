import React, { useState } from 'react';
import {
  Radio,
  Play,
  Pause,
  Signal,
  Volume2,
  Clock,
  Sparkles,
  MapPin,
  Headphones,
  SlidersHorizontal,
  Search,
  X,
} from 'lucide-react';
import { RADIO_STATIONS } from '../data/radioData';

export function RadioView({
  currentStation,
  isPlaying,
  onPlayStation,
  onToggleRadioPlay,
  onShowToast,
}) {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Calabar & Regional', 'Music & Hits', 'News & Talk', 'Lagos', 'Sports'];

  const filteredStations = RADIO_STATIONS.filter((station) => {
    const matchesFilter =
      selectedFilter === 'All'
        ? true
        : selectedFilter === 'Lagos'
        ? station.city.includes('Lagos')
        : selectedFilter === 'Calabar & Regional'
        ? station.city.includes('Calabar') || station.category.includes('Regional')
        : station.category === selectedFilter;

    const matchesSearch =
      searchQuery.trim() === '' ||
      station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.frequency.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.currentShow.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.host.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const featuredStation = RADIO_STATIONS[0]; // CRBC Radio Calabar 105.5 FM
  const isFeaturedPlaying = currentStation?.id === featuredStation.id && isPlaying;

  return (
    <div className="w-full bg-[#05080e] text-white min-h-screen pb-32 font-sans select-none animate-in fade-in duration-300">
      
      {/* 1. TOP HERO BANNER FOR RADIO */}
      <div className="relative bg-gradient-to-b from-[#0a1e38] via-[#091526] to-[#05080e] border-b border-white/10 px-4 sm:px-8 md:px-12 lg:px-16 pt-6 sm:pt-10 pb-8 sm:pb-12">
        <div className="max-w-[1920px] mx-auto">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
            <div className="space-y-3 sm:space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span>LIVE</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase">
                Radio For You
              </h1>

              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                Stream live high-definition FM radio broadcasts from Lagos, Calabar, Abuja, and the African diaspora. Enjoy real-time Afrobeats, breaking national news, sports commentary, and cultural talks.
              </p>

              {/* Quick stats pills */}
              <div className="flex items-center gap-3 pt-1 flex-wrap text-xs text-neutral-300 font-semibold">
                <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                  <Signal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{RADIO_STATIONS.length} Live Broadcasters</span>
                </span>
                <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                  <Headphones className="w-3.5 h-3.5 text-[#00a8e1]" />
                  <span>Continuous 24/7 Audio Streams</span>
                </span>
                <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Synchronized West Africa Time (WAT)</span>
                </span>
              </div>
            </div>

            {/* Featured Station Highlight Card */}
            <div className="bg-gradient-to-br from-[#12365e] to-[#0a182a] border border-blue-400/30 rounded-2xl p-5 sm:p-6 shadow-2xl lg:w-[420px] flex-shrink-0 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-red-600 text-white flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span>STATION OF THE DAY</span>
                </span>
                <span className="text-xs font-mono font-bold text-blue-200">
                  {featuredStation.frequency}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-black shadow-lg border border-white/20 bg-gradient-to-br from-neutral-800 to-black p-2 flex-shrink-0"
                  style={{ borderColor: featuredStation.accentColor }}
                >
                  <Radio className="w-6 h-6 text-[#00a8e1]" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-black text-white truncate">
                    {featuredStation.name}
                  </h3>
                  <p className="text-sm text-blue-200 font-semibold flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                    <span>{featuredStation.city}, {featuredStation.state}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (isFeaturedPlaying) {
                    if (onToggleRadioPlay) onToggleRadioPlay();
                  } else {
                    onPlayStation(featuredStation);
                    if (onShowToast) onShowToast(`Tuned into ${featuredStation.name}`);
                  }
                }}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-98 ${
                  isFeaturedPlaying
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    : 'bg-white hover:bg-neutral-200 text-black'
                }`}
              >
                {isFeaturedPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Now Playing Live • Click to Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                    <span>Tune In to {featuredStation.frequency}</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* 2. CATEGORY PILLS BAR & SEARCH */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 pt-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => {
              const isActive = selectedFilter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedFilter(cat)}
                  className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-black shadow-md font-extrabold'
                      : 'bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/5'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search station, frequency, city, host..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111824] border border-neutral-700/80 rounded-full pl-9 pr-8 py-2 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-[#00a8e1] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-0.5 rounded-full cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>
      </div>

      {/* 3. STATIONS GRID */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 pt-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide">
              Radio For You ({filteredStations.length})
            </h2>
          </div>
          <span className="text-xs text-neutral-400">
            Click any station to start audio player
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredStations.map((station) => {
            const isThisPlaying = currentStation?.id === station.id && isPlaying;

            return (
              <div
                key={station.id}
                onClick={() => {
                  if (isThisPlaying) {
                    if (onToggleRadioPlay) onToggleRadioPlay();
                  } else {
                    onPlayStation(station);
                    if (onShowToast) onShowToast(`Tuned into ${station.name}`);
                  }
                }}
                className={`bg-[#0f1724] rounded-2xl p-4 sm:p-5 border transition-all duration-200 cursor-pointer shadow-lg hover:shadow-2xl hover:scale-[1.02] flex flex-col justify-between group active:scale-98 relative overflow-hidden ${
                  isThisPlaying
                    ? 'border-emerald-500 ring-2 ring-emerald-500/40 bg-[#122035]'
                    : 'border-neutral-800 hover:border-neutral-600'
                }`}
              >
                {/* Station Top Accent Light */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 transition-all opacity-80 group-hover:opacity-100"
                  style={{ backgroundColor: station.accentColor || '#00a8e1' }}
                />

                <div className="space-y-3">
                  {/* Frequency Badge + Live Indicator (No station logos) */}
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs font-black px-2.5 py-1 rounded-lg text-white shadow-sm flex items-center gap-1.5"
                      style={{ backgroundColor: station.accentColor || '#1d70b8' }}
                    >
                      <Radio className="w-3.5 h-3.5" />
                      <span>{station.frequency}</span>
                    </span>

                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>LIVE</span>
                    </span>
                  </div>

                  {/* Station Name & Location Only */}
                  <div className="pt-1">
                    <h3 className="text-base sm:text-lg font-black text-white group-hover:text-[#00a8e1] transition-colors">
                      {station.name}
                    </h3>
                    <p className="text-xs text-neutral-300 font-semibold flex items-center gap-1.5 mt-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                      <span>{station.city}, {station.state}</span>
                    </p>
                  </div>
                </div>

                {/* Bottom Action: Tune In Button & Visualizer */}
                <div className="pt-3.5 mt-3.5 border-t border-white/10 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-neutral-400 font-mono">
                    {station.genre?.split(',')[0]}
                  </span>

                  <button
                    type="button"
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                      isThisPlaying
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white group-hover:bg-neutral-200 text-black'
                    }`}
                  >
                    {isThisPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-current" />
                        <span>Listening</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        <span>Tune In</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
