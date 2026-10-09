import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { AdcNav } from './components/AdcNav';
import { HeroBanner } from './components/HeroBanner';
import { VideoRow } from './components/VideoRow';
import { Footer } from './components/Footer';
import { MovieDetailModal } from './components/MovieDetailModal';
import { ProfileModal } from './components/ProfileModal';
import { SettingsModal } from './components/SettingsModal';
import { LiveTvView } from './components/LiveTvView';
import { ShowsView } from './components/ShowsView';
import { EventsView } from './components/EventsView';
import { ContactView } from './components/ContactView';
import { RadioView } from './components/RadioView';
import { RadioRow } from './components/RadioRow';
import { RadioPlayer } from './components/RadioPlayer';
import { ShowDetailView } from './components/ShowDetailView';
import { RADIO_STATIONS } from './data/radioData';
import { useRouter, slugifyCategory, findShowByIdOrSlug } from './utils/router';

// Curated data with variable names strictly matching current front-end texts
import {
  heroShows,
  onNowShows,
  tvShows,
  podcasts,
  comedyShows,
  upcomingEventsShows,
  upcomingCrackUpComedyShows,
  allShows,
} from './data/showsData';

import { Check, Search, ArrowLeft } from 'lucide-react';

const TAB_PATH_MAP = {
  'Home': '/',
  'Live TV': '/live-tv',
  'Shows': '/shows',
  'Radio': '/radio',
  'Events': '/events',
  'Contact': '/contact',
};

export default function AdcStreamingPage() {
  const { route, navigate } = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(route?.tab || 'Home');
  const [selectedShow, setSelectedShow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [selectedCategoryView, setSelectedCategoryView] = useState(route?.category || null);
  const [selectedShowDetail, setSelectedShowDetail] = useState(
    route?.showId ? findShowByIdOrSlug(route.showId) : null
  );
  const [previousPageName, setPreviousPageName] = useState('Home');

  // Sync route changes (URL direct load, link click, browser back/forward)
  useEffect(() => {
    if (!route) return;

    if (route.showId) {
      const show = findShowByIdOrSlug(route.showId);
      if (show) {
        setSelectedShowDetail(show);
        setSelectedCategoryView(null);
        setActiveTab('Shows');
        return;
      }
    }

    if (route.category) {
      setSelectedCategoryView(route.category);
      setSelectedShowDetail(null);
      return;
    }

    if (route.watchId) {
      const item = findShowByIdOrSlug(route.watchId);
      if (item) {
        setSelectedShow(item);
        setIsModalOpen(true);
      }
    }

    setSelectedShowDetail(null);
    setSelectedCategoryView(null);
    if (route.tab) {
      setActiveTab(route.tab);
    }
  }, [route]);

  // Persistent Radio Player State
  const [radioStation, setRadioStation] = useState(null);
  const [isRadioPlaying, setIsRadioPlaying] = useState(false);

  // Modals for profile & settings
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const showToast = useCallback((message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((curr) => (curr === message ? null : curr));
    }, 3000);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedShow(null);
  }, []);

  // Helper checks for event and live TV items
  const isUpcomingEvent = (item) => {
    if (!item) return false;
    const cat = (item.category || '').toLowerCase();
    const title = (item.title || '').toLowerCase();
    return (
      cat.includes('upcoming event') ||
      cat.includes('event') ||
      cat.includes('crack up') ||
      title.includes('calabar carnival') ||
      title.includes('crack up comedy') ||
      item.isEvent === true ||
      item.id === 'calabar-carnival-parade' ||
      item.id === 'event-1' ||
      upcomingEventsShows.some((s) => s.id === item.id)
    );
  };

  const isLiveTvChannel = (item) => {
    if (!item) return false;
    return Boolean(
      item.isChannel ||
      item.isLive ||
      item.category === 'Live TV' ||
      item.category === 'Live Channels' ||
      item.duration === 'LIVE NOW' ||
      item.channelName ||
      onNowShows.some((s) => s.id === item.id)
    );
  };

  // Stop radio stream playback immediately (pauses audio, keeps station docked)
  const stopRadioPlayback = useCallback(() => {
    setIsRadioPlaying(false);
    if (typeof document !== 'undefined') {
      document.querySelectorAll('audio').forEach((a) => {
        try {
          a.pause();
        } catch (_) {}
      });
    }
  }, []);

  // Stop video & TV stream playback immediately
  const stopVideoAndTvPlayback = useCallback(() => {
    setIsModalOpen(false);
    setSelectedShow(null);

    if (typeof document !== 'undefined') {
      document.querySelectorAll('video').forEach((v) => {
        try {
          v.pause();
        } catch (_) {}
      });
    }
    // Dispatches custom event so all mounted video players (LiveTvView, ShowDetailView, MovieDetailModal) stop
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('adc-stop-video-playback'));
    }
  }, []);

  // Stop all players across the platform
  const stopAllOtherPlayers = useCallback(() => {
    stopRadioPlayback();
    stopVideoAndTvPlayback();
  }, [stopRadioPlayback, stopVideoAndTvPlayback]);

  // Unified show & video interaction handler:
  // - When any show or TV channel is clicked: STOP radio immediately, and play the clicked video
  // - Radio can play in background while browsing, but stops as soon as a video is started!
  const handleShowInteraction = (show) => {
    if (!show) return;

    // 1. Upcoming Events category -> Navigate directly to the Events page
    if (isUpcomingEvent(show)) {
      if (activeTab !== 'Events') {
        setActiveTab('Events');
        setSelectedShowDetail(null);
        setSelectedCategoryView(null);
        setIsModalOpen(false);
        navigate('/events');
        showToast(`Navigated to Events - ${show.title}`);
        return;
      }
      // If already on Events page: Stop radio and open video playback modal
      stopRadioPlayback();
      stopVideoAndTvPlayback();
      setSelectedShow(show);
      setIsModalOpen(true);
      return;
    }

    // 2. TV Station / Live Channel -> Stop radio & all other players, play fullscreen live stream
    if (isLiveTvChannel(show)) {
      stopRadioPlayback();
      stopVideoAndTvPlayback();
      setSelectedShowDetail(null);
      setSelectedShow(show);
      setIsModalOpen(true);
      return;
    }

    // 3. Shows page slider cards -> Stop radio & all other players and play video linked to it directly
    if (activeTab === 'Shows') {
      stopRadioPlayback();
      stopVideoAndTvPlayback();
      setSelectedShowDetail(null);
      setSelectedShow(show);
      setIsModalOpen(true);
      return;
    }

    // 4. Shows apart from radio and TV -> Stop radio, lead to dedicated page with episode sliders & video
    stopRadioPlayback();
    stopVideoAndTvPlayback();
    const previous = selectedCategoryView || activeTab || 'Home';
    setPreviousPageName(previous);
    setSelectedShowDetail(show);
    setSelectedCategoryView(null);
    setIsModalOpen(false);
    navigate(`/show/${show.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTab = (tab) => {
    setActiveTab(tab);
    setSelectedCategoryView(null);
    setSelectedShowDetail(null);
    const target = TAB_PATH_MAP[tab] || '/';
    navigate(target);
    showToast(`Navigated to ${tab}`);
  };

  const handleSeeMore = (title) => {
    setSelectedCategoryView(title);
    navigate(`/category/${slugifyCategory(title)}`);
  };

  const handlePlayShow = (show) => {
    handleShowInteraction(show);
  };

  const handleOpenDetails = (show) => {
    handleShowInteraction(show);
  };

  // Radio Station Handlers:
  // - When radio is clicked, let radio station play
  // - If a TV channel or show was playing or was played previously, stop them immediately!
  // - Radio can play in the background too while browsing tabs!
  const handlePlayStation = (station) => {
    if (!station) return;
    // 1. Stop all TV channels, show videos, and modals
    stopVideoAndTvPlayback();

    // 2. Start radio playback
    setRadioStation(station);
    setIsRadioPlaying(true);
    showToast(`Streaming ${station.name} (${station.frequency})`);
  };

  const handleToggleRadioPlay = () => {
    setIsRadioPlaying((prev) => {
      const next = !prev;
      if (next) {
        // Resuming radio -> Stop all video players
        stopVideoAndTvPlayback();
      }
      return next;
    });
  };

  const handleCloseRadio = () => {
    setIsRadioPlaying(false);
    setRadioStation(null);
  };

  // Helper search filter
  const filterByQuery = (list) => {
    if (!searchQuery.trim()) return list;
    const query = searchQuery.toLowerCase();
    return list.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        (item.genres && item.genres.some((g) => g.toLowerCase().includes(query)))
    );
  };

  // Section filtered lists matching front-end section texts
  const filteredOnNowShows = useMemo(() => filterByQuery(onNowShows), [searchQuery]);
  const filteredTvShows = useMemo(() => filterByQuery(tvShows), [searchQuery]);
  const filteredPodcasts = useMemo(() => filterByQuery(podcasts), [searchQuery]);
  const filteredComedyShows = useMemo(() => filterByQuery(comedyShows), [searchQuery]);
  const filteredUpcomingEventsShows = useMemo(
    () => filterByQuery(upcomingEventsShows),
    [searchQuery]
  );
  const filteredUpcomingCrackUpComedyShows = filteredUpcomingEventsShows;

  // Total matching search count
  const totalSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return 0;
    return filterByQuery(allShows).length;
  }, [searchQuery]);

  // Shows for "See more >" category drill-down
  const categoryDrillDownShows = useMemo(() => {
    if (!selectedCategoryView) return [];
    if (selectedCategoryView === 'On Now') return filteredOnNowShows;
    if (selectedCategoryView === 'Comedy') return filteredComedyShows;
    if (selectedCategoryView === 'TV Shows' || selectedCategoryView === 'Popular TV Shows') {
      return filteredTvShows;
    }
    if (
      selectedCategoryView === 'Podcasts' ||
      selectedCategoryView === 'Podcasts & Talk Shows'
    ) {
      return filteredPodcasts;
    }
    if (
      selectedCategoryView === 'Upcoming Events' ||
      selectedCategoryView === 'Upcoming Crack Up Comedy'
    ) {
      return filteredUpcomingEventsShows;
    }

    return allShows.filter(
      (s) =>
        s.category &&
        s.category.toLowerCase().includes(selectedCategoryView.toLowerCase())
    );
  }, [
    selectedCategoryView,
    filteredOnNowShows,
    filteredComedyShows,
    filteredTvShows,
    filteredPodcasts,
    filteredUpcomingEventsShows,
  ]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-neutral-800 selection:text-white">
      {/* ADC Navigation Bar */}
      <AdcNav
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onProfileClick={() => setIsProfileOpen(true)}
        onSettingsClick={() => setIsSettingsOpen(true)}
      />

      {/* Active Search Notification Banner */}
      {searchQuery && (
        <div className="bg-[#111111] border-b border-neutral-800 px-4 md:px-12 py-3 flex items-center justify-between sticky top-[58px] sm:top-[70px] z-30">
          <div className="flex items-center gap-2 text-sm text-neutral-300">
            <Search className="w-4 h-4 text-red-500" />
            <span>Search results for:</span>
            <span className="font-bold text-white">&ldquo;{searchQuery}&rdquo;</span>
            <span className="text-neutral-400">({totalSearchResults} titles found)</span>
          </div>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-xs text-white hover:underline flex items-center gap-1 cursor-pointer font-bold"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Main Content Body: Responsive, proportional, never overstretched */}
      <main className={`flex-1 bg-black w-full ${
        !selectedShowDetail && activeTab === 'Home' && !selectedCategoryView && !searchQuery
          ? 'pt-12 sm:pt-0'
          : 'pt-[58px] sm:pt-[70px]'
      }`}>
        {selectedShowDetail ? (
          /* Dedicated Show Details & Episodes Page (Card Slider + Back Button) */
          <ShowDetailView
            show={selectedShowDetail}
            onBack={() => {
              setSelectedShowDetail(null);
              const target = previousPageName === 'Home' ? '/' : (TAB_PATH_MAP[previousPageName] || '/shows');
              navigate(target);
            }}
            previousPageName={previousPageName}
            onSelectOtherShow={(otherShow) => {
              stopRadioPlayback();
              setSelectedShowDetail(otherShow);
              navigate(`/show/${otherShow.id}`);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onStopRadio={stopRadioPlayback}
            isRadioPlaying={isRadioPlaying}
          />
        ) : selectedCategoryView ? (
          /* "See more >" Detailed Category View */
          <div className="max-w-[1920px] mx-auto px-3 sm:px-8 md:px-12 lg:px-16 py-4 sm:py-8 animate-in fade-in duration-200">
            <button
              type="button"
              onClick={() => {
                setSelectedCategoryView(null);
                navigate(TAB_PATH_MAP[activeTab] || '/');
              }}
              className="inline-flex items-center gap-2 text-sm text-neutral-300 hover:text-white hover:underline mb-4 sm:mb-6 cursor-pointer font-semibold py-2 px-1 min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to {activeTab}</span>
            </button>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-4 sm:mb-6">
              {selectedCategoryView}
            </h1>

            <div className={`grid ${
              selectedCategoryView === 'Upcoming Events' || selectedCategoryView === 'Upcoming Crack Up Comedy'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7'
                : selectedCategoryView === 'On Now'
                ? 'grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4'
                : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6'
            }`}>
              {categoryDrillDownShows.map((show) => (
                <div
                  key={show.id}
                  onClick={() => handleOpenDetails(show)}
                  className="bg-[#111111] rounded-xl overflow-hidden border border-neutral-800 hover:border-neutral-700 hover:scale-[1.02] transition-all cursor-pointer shadow-xl active:scale-99"
                >
                  <div className={`${
                    selectedCategoryView === 'On Now' ? 'aspect-square p-2.5 flex items-center justify-center bg-[#1b222c]' : 'aspect-[16/9]'
                  } relative overflow-hidden`}>
                    <img
                      src={show.backdrop || show.image}
                      alt={show.title}
                      className={`w-full h-full ${
                        selectedCategoryView === 'On Now' ? 'object-contain max-h-[80%] max-w-[85%] drop-shadow' : 'object-cover object-center'
                      }`}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                    {(selectedCategoryView === 'On Now' || show.isLive || show.duration?.toLowerCase() === 'live now') && (
                      <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1 uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span>LIVE</span>
                      </span>
                    )}
                  </div>
                  <div className="p-3.5 sm:p-4">
                    <h3 className="font-bold text-white text-sm sm:text-base mb-1 truncate">{show.title}</h3>
                    <p className="text-xs text-neutral-400 line-clamp-2 mb-3">{show.description}</p>
                    <div className="flex items-center justify-between text-xs text-neutral-400">
                      <span>{show.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'Live TV' ? (
          /* Live TV View */
          <LiveTvView
            onPlayMovie={handlePlayShow}
            onOpenDetails={handleOpenDetails}
            onShowToast={showToast}
            onStopRadio={stopRadioPlayback}
            isRadioPlaying={isRadioPlaying}
          />
        ) : activeTab === 'Radio' ? (
          /* Radio Stations View */
          <RadioView
            currentStation={radioStation}
            isPlaying={isRadioPlaying}
            onPlayStation={handlePlayStation}
            onToggleRadioPlay={handleToggleRadioPlay}
            onShowToast={showToast}
          />
        ) : activeTab === 'Shows' ? (
          /* Shows View */
          <ShowsView
            onPlayMovie={(show) => {
              stopAllOtherPlayers();
              setSelectedShowDetail(null);
              setSelectedShow(show);
              setIsModalOpen(true);
            }}
            onOpenDetails={(show) => {
              stopAllOtherPlayers();
              setSelectedShowDetail(null);
              setSelectedShow(show);
              setIsModalOpen(true);
            }}
            onSeeMore={handleSeeMore}
            searchQuery={searchQuery}
          />
        ) : activeTab === 'Events' ? (
          /* Events View */
          <EventsView
            onPlayMovie={handlePlayShow}
            onOpenDetails={handleOpenDetails}
            onShowToast={showToast}
          />
        ) : activeTab === 'Contact' ? (
          /* Contact View */
          <ContactView onShowToast={showToast} />
        ) : (
          /* Home Page: Hero Banner directly followed by Content Rows with Proportional Layout */
          <div className="w-full pb-12 animate-in fade-in duration-300 bg-black">
            {/* Hero Banner Section (Proportional sizing on all views, Videos & Pictures) */}
            {!searchQuery && (
              <HeroBanner
                movies={heroShows}
                onPlayMovie={handlePlayShow}
                onOpenDetails={handleOpenDetails}
              />
            )}

            {/* Content Rows Section: Proportional container that does not stretch */}
            <div className="max-w-[1920px] mx-auto pt-2 pb-8 space-y-2 md:space-y-4">
              {/* Row 1: "On Now" */}
              <VideoRow
                title="On Now"
                movies={filteredOnNowShows}
                onPlayMovie={handlePlayShow}
                onOpenDetails={handleOpenDetails}
                onSeeMore={handleSeeMore}
              />

              {/* Row 2: "TV Shows" */}
              <VideoRow
                title="TV Shows"
                movies={filteredTvShows}
                onPlayMovie={handlePlayShow}
                onOpenDetails={handleOpenDetails}
                onSeeMore={handleSeeMore}
              />

              {/* Row 3: "Podcasts" */}
              <VideoRow
                title="Podcasts"
                movies={filteredPodcasts}
                onPlayMovie={handlePlayShow}
                onOpenDetails={handleOpenDetails}
                onSeeMore={handleSeeMore}
              />

              {/* Row 4: "Radio For You" (between Podcasts and Upcoming Events) */}
              <RadioRow
                title="Radio For You"
                currentStation={radioStation}
                isRadioPlaying={isRadioPlaying}
                onPlayStation={handlePlayStation}
                onToggleRadioPlay={handleToggleRadioPlay}
                onSeeMoreRadio={() => handleSelectTab('Radio')}
              />

              {/* Row 5: "Upcoming Events" */}
              <VideoRow
                title="Upcoming Events"
                movies={filteredUpcomingEventsShows}
                cardSize="large"
                onPlayMovie={handlePlayShow}
                onOpenDetails={handleOpenDetails}
                onSeeMore={() => handleSelectTab('Events')}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer onNavigateTab={handleSelectTab} activeTab={activeTab} />

      {/* Persistent Live Radio Player Bar */}
      <RadioPlayer
        station={radioStation}
        isPlaying={isRadioPlaying}
        onTogglePlay={handleToggleRadioPlay}
        onClose={handleCloseRadio}
        onSelectStation={handlePlayStation}
      />

      {/* Show Details / Playback Modal */}
      {isModalOpen && selectedShow && (
        <MovieDetailModal
          movie={selectedShow}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onStopRadio={stopRadioPlayback}
          autoPlay={true}
        />
      )}

      {/* User Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onShowToast={showToast}
        onSelectTab={handleSelectTab}
      />

      {/* ADC Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onShowToast={showToast}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#141414] border border-neutral-700 text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-black">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
