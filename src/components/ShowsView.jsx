import React, { useState, useMemo } from 'react';
import { VideoRow } from './VideoRow';
import { tvShows, onNowShows, podcasts, comedyShows } from '../data/showsData';

export function ShowsView({
  onPlayMovie,
  onOpenDetails,
  onSeeMore,
  searchQuery = '',
}) {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filters = ['All', 'TV Shows', 'Podcast', 'Comedy'];

  const filterList = (list) => {
    return (list || []).filter((item) => {
      const matchesSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.genres && item.genres.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase())));

      return matchesSearch;
    });
  };

  const filteredComedyShows = useMemo(() => filterList(comedyShows), [searchQuery]);
  const filteredTvShows = useMemo(() => filterList(tvShows), [searchQuery]);
  const filteredPodcasts = useMemo(() => filterList(podcasts), [searchQuery]);
  const filteredOnNow = useMemo(() => filterList(onNowShows), [searchQuery]);

  return (
    <div className="w-full pb-16 animate-in fade-in duration-300 bg-black text-white">
      {/* Sub-Navigation & Filter Bar */}
      <div className="bg-black/95 border-b border-neutral-800 px-3 sm:px-6 md:px-12 py-3 sm:py-3.5 sticky top-[58px] sm:top-[70px] z-30 backdrop-blur-md">
        <div className="max-w-[1920px] mx-auto flex items-center justify-start gap-2 overflow-x-auto no-scrollbar">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedFilter === filter
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Shows Rows */}
      <div className="pt-4 pb-8 space-y-4 max-w-[1920px] mx-auto">
        {/* Popular TV Shows */}
        {(selectedFilter === 'All' || selectedFilter === 'TV Shows') && filteredTvShows.length > 0 && (
          <VideoRow
            title="Popular TV Shows"
            movies={filteredTvShows}
            onPlayMovie={onPlayMovie}
            onOpenDetails={onOpenDetails}
            onSeeMore={onSeeMore}
          />
        )}

        {/* Podcasts & Talk Shows */}
        {(selectedFilter === 'All' || selectedFilter === 'Podcast') && filteredPodcasts.length > 0 && (
          <VideoRow
            title="Podcasts & Talk Shows"
            movies={filteredPodcasts}
            onPlayMovie={onPlayMovie}
            onOpenDetails={onOpenDetails}
            onSeeMore={onSeeMore}
          />
        )}

        {/* Comedy Category */}
        {(selectedFilter === 'All' || selectedFilter === 'Comedy') && filteredComedyShows.length > 0 && (
          <VideoRow
            title="Comedy"
            movies={filteredComedyShows}
            onPlayMovie={onPlayMovie}
            onOpenDetails={onOpenDetails}
            onSeeMore={onSeeMore}
          />
        )}

        {/* On Now */}
        {selectedFilter === 'All' && filteredOnNow.length > 0 && (
          <VideoRow
            title="On Now"
            movies={filteredOnNow}
            onPlayMovie={onPlayMovie}
            onOpenDetails={onOpenDetails}
            onSeeMore={onSeeMore}
          />
        )}
      </div>
    </div>
  );
}
