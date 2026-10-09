import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Play, 
  Tv, 
  ExternalLink, 
  Volume2, 
  VolumeX, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Radio, 
  Star,
  Info,
  Maximize2,
  Minimize2,
  Calendar,
  Clock,
  Layers,
  Film,
  CheckCircle2,
  ListFilter,
  Signal,
  RotateCw,
  Search
} from 'lucide-react';
import { 
  getWestAfricaTime, 
  formatWatTime, 
  getChannelCurrentWatProgram 
} from '../data/tvScheduleEngine';
import { LiveStreamPlayer } from './LiveStreamPlayer';

const ADC_CHANNEL_ID = 'UCh59LoeUVvZkh10okzwxIjQ';
const ADC_YOUTUBE_URL = 'https://www.youtube.com/@AFRICANDIASPORACHANNELS-ADC';

// Category pills: Only All and Nigeria
const CATEGORIES = [
  'All',
  'Nigeria'
];

// Nigerian TV Stations and schedules matching the screenshot format
const NIGERIAN_CHANNELS = [
  /*{
    id: 'leased-channel',
    name: 'Leased Channel',
    shortName: 'Leased Channel',
    logoType: 'leased-access',
    logoImg: '/images/channels/leac-logo.png',
    category: 'Nigeria',
    country: 'Nigeria',
    videoId: 'BAhn-P035_M',
    officialUrl: 'https://africandiasporachannels.com/',
    currentlyAiring: {
      timeLeft: '12 min left',
      progressPercent: 72,
      title: 'ADC Leased Access: Independent Producers & Community Voice',
      timeSlot: '8:00 PM - 9:30 PM',
      description: 'Dedicated independent and public leased programming serving community voices, diaspora creative talents, civic forums, and cultural organizations.'
    },
    programs: [
      {
        time: '9:30 PM',
        title: 'Diaspora Filmmakers & Indie Showcase',
        durationSpan: 1,
        description: 'Spotlighting independent short films, cultural essays, and creative talents from the pan-African diaspora.'
      },
      {
        time: '10:00 PM',
        title: 'Community Forum & Public Dialogue',
        durationSpan: 2,
        description: 'An open microphone civic broadcast platform addressing community health, immigration, and diaspora entrepreneurship.'
      },
      {
        time: '11:00 PM',
        title: 'Indie Sounds & Spoken Word Naija',
        durationSpan: 1,
        description: 'Acoustic performances and poetry from emerging African artists in London, Atlanta, and Lagos.'
      },
      {
        time: '11:30 PM',
        title: 'African Diaspora Business Exchange',
        durationSpan: 1,
        description: 'Empowering cross-border trade, tech innovation hubs, and economic partnerships across continents.'
      },
      {
        time: '12:00 AM',
        title: 'Midnight Cultural Archive',
        durationSpan: 2,
        description: 'Curated historical and cultural documentaries celebrating African civilization and diaspora heritage.'
      }
    ]
  },
  {
    id: 'crbc',
    name: 'Cross River Broadcasting Corporation',
    shortName: 'CRBC Calabar',
    logoType: 'crbc',
    logoImg: '/images/channels/crbc-logo.png',
    category: 'Nigeria',
    country: 'Nigeria',
    streamUrl: 'https://media.dnwayne.org:9443/afdc/_definst_/crbc.stream/playlist.m3u8',
    videoId: 'BAhn-P035_M',
    officialUrl: 'https://crossriverstate.gov.ng/',
    currentlyAiring: {
      timeLeft: '3 min left',
      progressPercent: 86,
      title: 'Cross River Today: Live From Calabar',
      timeSlot: '8:30 PM - 9:30 PM',
      description: 'Direct reports from the People’s Paradise, covering governance, tourism, and community welfare across the 18 LGAs.'
    },
    programs: [
      {
        time: '9:30 PM',
        title: 'Canaan City Live Edition',
        durationSpan: 1,
        description: 'Evening civic affairs, community voices, and development projects in the ancient capital city of Calabar.'
      },
      {
        time: '10:00 PM',
        title: 'CRBC Nightly Network News',
        durationSpan: 2, // 60 mins
        description: 'The definitive state news hour covering state executive council decisions, agriculture, and civic life.'
      },
      {
        time: '11:00 PM',
        title: 'Calabar Carnival & Cultural Heritage',
        durationSpan: 1,
        description: 'Celebrating Africa’s biggest street party, traditional masquerades, Efik folklore, and Moninkim dance.'
      },
      {
        time: '11:30 PM',
        title: 'Obudu Lens: Highlands & Ecotourism',
        durationSpan: 1,
        description: 'A visual journey exploring the Obudu Mountain Resort, canopy walkway, and conservation sanctuaries.'
      },
      {
        time: '12:00 AM',
        title: 'Voice of the South-South',
        durationSpan: 2,
        description: 'Late night regional documentary and musical performances from Cross River and the Niger Delta.'
      }
    ]
  },*/
  {
    id: 'channels-tv',
    name: 'Channels Television',
    shortName: 'Channels TV',
    logoType: 'channels',
    logoImg: '/images/channels/channelstv.png',
    category: 'Nigeria',
    country: 'Nigeria',
    videoId: 'W8nThq62Vb4', // Channels TV live stream
    officialUrl: 'https://www.channelstv.com/',
    currentlyAiring: {
      timeLeft: '3 min left',
      progressPercent: 88,
      title: 'Politics Today with Seun Okinbaloye',
      timeSlot: '8:00 PM - 9:30 PM',
      description: 'Nigeria’s premier political debate show confronting key state and federal policymakers, analysts, and governance advocates.'
    },
    programs: [
      {
        time: '9:30 PM',
        title: 'News Track Primetime Recap',
        durationSpan: 1, // 30 mins
        description: 'Comprehensive nationwide news bulletin covering security, judiciary, and state affairs.'
      },
      {
        time: '10:00 PM',
        title: 'The News at 10',
        durationSpan: 2, // 60 mins
        description: 'Flagship multi-award winning broadcast detailing the most significant national and international events.'
      },
      {
        time: '11:00 PM',
        title: 'Business Morning Digest',
        durationSpan: 1,
        description: 'Analysis of Nigerian Stock Exchange, CBN monetary policy, inflation rates, and African trade.'
      },
      {
        time: '11:30 PM',
        title: 'Hard Copy with Maupe Ogun-Yusuf',
        durationSpan: 1,
        description: 'Uncompromising investigative conversations interrogating national security and policy documents.'
      },
      {
        time: '12:00 AM',
        title: 'Diplomatic Channel',
        durationSpan: 2,
        description: 'Foreign relations, consular affairs, and diplomatic engagements in ECOWAS and worldwide.'
      }
    ]
  },
  {
    id: 'arise-news',
    name: 'ARISE News TV',
    shortName: 'ARISE News',
    logoType: 'arise',
    logoImg: '/images/channels/arisenews.png',
    category: 'Nigeria',
    country: 'Nigeria',
    videoId: 'Fy_03Aorpq8',
    fallbackEmbed: 'https://www.youtube-nocookie.com/embed/Fy_03Aorpq8?autoplay=1&rel=0',
    officialUrl: 'https://www.arise.tv/',
    currentlyAiring: {
      timeLeft: '3 min left',
      progressPercent: 91,
      title: 'The Morning Show Nightcap (Rufai Oseni & Reuben Abati)',
      timeSlot: '8:30 PM - 9:30 PM',
      description: 'Passionate debate and incisive analysis with Dr. Reuben Abati, Rufai Oseni, and Ayo Mairo-Ese.'
    },
    programs: [
      {
        time: '9:30 PM',
        title: 'Prime Time News Bulletin',
        durationSpan: 1,
        description: 'Up-to-the-minute reports on continental politics, finance, and diplomacy.'
      },
      {
        time: '10:00 PM',
        title: 'Arise News Night Tonight',
        durationSpan: 2, // 60 mins
        description: 'Global news hour bringing real-time reporting from Lagos, Abuja, London, and Washington DC bureaus.'
      },
      {
        time: '11:00 PM',
        title: 'The Global Business Report',
        durationSpan: 1,
        description: 'In-depth coverage of African commodities, energy transitions, and emerging markets.'
      },
      {
        time: '11:30 PM',
        title: 'Perspectives with Ayo Mairo-Ese',
        durationSpan: 1,
        description: 'Spotlighting social evolution, youth innovation, and women leadership in modern Nigeria.'
      },
      {
        time: '12:00 AM',
        title: 'What In The World: Global Affairs',
        durationSpan: 2,
        description: 'Late-night international analysis from Arise foreign correspondents.'
      }
    ]
  },
  {
    id: 'tvc-news',
    name: 'TVC News Nigeria',
    shortName: 'TVC News',
    logoType: 'tvc',
    logoImg: '/images/channels/tvcnews.png',
    category: 'Nigeria',
    country: 'Nigeria',
    videoId: '5qZKM7m1Moc',
    officialUrl: 'https://tvcnews.tv/',
    currentlyAiring: {
      timeLeft: '3 min left',
      progressPercent: 85,
      title: 'Journalists\' Hangout with Babajide Kolade-Otitoju',
      timeSlot: '8:30 PM - 9:30 PM',
      description: 'Hard-hitting journalistic breakdown of national security, elections, and socio-political matters.'
    },
    programs: [
      {
        time: '9:30 PM',
        title: 'Standpoint: Investigative Debate',
        durationSpan: 1,
        description: 'Deep dives into controversial national policies and legal battles.'
      },
      {
        time: '10:00 PM',
        title: 'TVC News at 10',
        durationSpan: 2, // 60 mins
        description: 'Comprehensive nightly news package broadcasting from Ikosi, Ketu, Lagos.'
      },
      {
        time: '11:00 PM',
        title: 'Your View Primetime Highlights',
        durationSpan: 1,
        description: 'Highlights from Nigeria’s most-watched morning talk show with Morayo Afolabi-Brown.'
      },
      {
        time: '11:30 PM',
        title: 'Business Nigeria Tonight',
        durationSpan: 1,
        description: 'Microeconomics, SME funding, and port logistics across Nigerian trade hubs.'
      },
      {
        time: '12:00 AM',
        title: 'Beyond The Headlines',
        durationSpan: 2,
        description: 'Post-broadcast analysis with senior TVC editorial board members.'
      }
    ]
  },
  /*{
    id: 'ait',
    name: 'Africa Independent Television',
    shortName: 'AIT (DAAR Communications)',
    logoType: 'ait',
    logoImg: '/images/channels/ait.png',
    category: 'Nigeria',
    country: 'Nigeria',
    videoId: 'BAhn-P035_M',
    officialUrl: 'https://ait.live/',
    currentlyAiring: {
      timeLeft: '4 min left',
      progressPercent: 87,
      title: 'Kaakaki: The African Voice (Evening Edition)',
      timeSlot: '8:30 PM - 9:30 PM',
      description: 'Pioneering African independent broadcast analyzing continental unity, politics, and civic justice.'
    },
    programs: [
      {
        time: '9:30 PM',
        title: 'Focus Nigeria with Gbenga Aruleba',
        durationSpan: 1,
        description: 'Thought-provoking interview series spotlighting high-ranking legislators and legal luminaries.'
      },
      {
        time: '10:00 PM',
        title: 'AIT Network News Hour',
        durationSpan: 2, // 60 mins
        description: 'Nigeria’s foremost private satellite television network news with nationwide bureau correspondents.'
      },
      {
        time: '11:00 PM',
        title: 'Security Watch Africa',
        durationSpan: 1,
        description: 'Special reports on military operations, peacekeeping forces, and maritime safety in the Gulf of Guinea.'
      },
      {
        time: '11:30 PM',
        title: 'Inside the National Assembly',
        durationSpan: 1,
        description: 'Bills, legislative chambers, and senate committee oversight investigations.'
      },
      {
        time: '12:00 AM',
        title: 'Jigi Bola Health Hour',
        durationSpan: 2,
        description: 'Grassroots medical health advisory and wellness education.'
      }
    ]
  },
  {
    id: 'nta-network',
    name: 'NTA Network News',
    shortName: 'NTA Network',
    logoType: 'nta',
    logoImg: '/images/channels/nta.png',
    category: 'Nigeria',
    country: 'Nigeria',
    videoId: 'yvWO9qODHKY',
    officialUrl: 'https://www.nta.ng/',
    currentlyAiring: {
      timeLeft: '7 min left',
      progressPercent: 80,
      title: 'NTA Network News at 9',
      timeSlot: '8:30 PM - 9:30 PM',
      description: 'The historic Nigerian Television Authority network broadcast reaching all 36 states and the FCT.',
    },
    programs: [
      {
        time: '9:30 PM',
        title: 'Panorama: Federal Capital Digest',
        durationSpan: 1,
        description: 'Special feature reports from the presidency, ministries, and federal parastatals.'
      },
      {
        time: '10:00 PM',
        title: 'Newsline: 40 Million Viewers Tonight',
        durationSpan: 2, // 60 mins
        description: 'Heartwarming human interest stories, cultural wonders, and grassroots investigative journalism.'
      },
      {
        time: '11:00 PM',
        title: 'Good Morning Nigeria Primetime',
        durationSpan: 1,
        description: 'Expert panel discussions on agriculture, educational reforms, and monetary policy.'
      },
      {
        time: '11:30 PM',
        title: 'NTA Sports Extra',
        durationSpan: 1,
        description: 'Highlights from the Nigeria Premier Football League (NPFL) and Super Eagles updates.'
      },
      {
        time: '12:00 AM',
        title: 'Night Train: Heritage of Nigeria',
        durationSpan: 2,
        description: 'Archival cultural documentaries celebrating Nigerian dance, crafts, and historical kingdoms.'
      }
    ]
  },
  */{
    id: 'silverbird-tv',
    name: 'Silverbird Television',
    shortName: 'STV Nigeria',
    logoType: 'silverbird',
    logoImg: '/images/channels/silverbird.png',
    category: 'Nigeria',
    country: 'Nigeria',
    videoId: '-0-bhs92_ZU',
    officialUrl: 'https://silverbirdtv.com/',
    currentlyAiring: {
      timeLeft: '5 min left',
      progressPercent: 79,
      title: 'Today on STV Primetime',
      timeSlot: '8:30 PM - 9:30 PM',
      description: 'Urban lifestyles, entertainment, business insights, and youth culture across metropolitan Nigeria.'
    },
    programs: [
      {
        time: '9:30 PM',
        title: 'Silverbird News Express',
        durationSpan: 1,
        description: 'Fast-paced evening news bulletin with high-octane coverage of business and society.'
      },
      {
        time: '10:00 PM',
        title: 'Showbiz Africa & MBGN Special',
        durationSpan: 1,
        description: 'Behind the scenes with African celebrities, fashion runway designers, and Nollywood premieres.'
      },
      {
        time: '10:30 PM',
        title: 'Rhythm 93.7 Live In Concert',
        durationSpan: 1,
        description: 'Reliving historic Rhythm Unplugged stage performances from Afrobeats legends.'
      },
      {
        time: '11:00 PM',
        title: 'Lagos Big Screen Review',
        durationSpan: 1.5,
        description: 'Box office rankings and cinema releases reviewed by leading film critics.'
      },
      {
        time: '11:45 PM',
        title: 'Night Beats Jamz',
        durationSpan: 1.5,
        description: 'Non-stop Nigerian music videos and dance party vibes.'
      }
    ]
  },
  /*{
    id: 'soundcity-tv',
    name: 'Soundcity TV Nigeria',
    shortName: 'Soundcity',
    logoType: 'soundcity',
    logoImg: '/images/channels/soundcity.png',
    category: 'Nigeria',
    country: 'Nigeria',
    videoId: 'Q1KFsR5r3Ac',
    officialUrl: 'https://soundcity.tv/',
    currentlyAiring: {
      timeLeft: '9 min left',
      progressPercent: 72,
      title: 'Top 10 Nigeria: Official Afrobeats Chart',
      timeSlot: '8:30 PM - 9:30 PM',
      description: 'The definitive countdown of the hottest songs making waves across streaming platforms and radio airwaves.'
    },
    programs: [
      {
        time: '9:30 PM',
        title: 'City Buzz with Moet Abebe',
        durationSpan: 1,
        description: 'Music industry gossip, festival highlights, and exclusive studio interviews.'
      },
      {
        time: '10:00 PM',
        title: 'Soundcity MVP Live Archives',
        durationSpan: 2, // 60 mins
        description: 'Electrifying award-show performances from Burna Boy, Wizkid, Davido, and Tiwa Savage.'
      },
      {
        time: '11:00 PM',
        title: 'Rap Attack Naija',
        durationSpan: 1,
        description: 'Hardcore bars, street rap battles, and hip-hop underground showcases.'
      },
      {
        time: '11:30 PM',
        title: 'Lagos Night Club Non-Stop Anthems',
        durationSpan: 1,
        description: 'High-energy DJ mixes spinning the hottest Amapiano and Afrobeats anthems.'
      }
    ]
  }, */
  {
    id: 'wazobia-max',
    name: 'Wazobia Max TV',
    shortName: 'Wazobia TV',
    logoType: 'wazobia',
    logoImg: '/images/channels/wazobia.svg',
    category: 'Nigeria',
    country: 'Nigeria',
    videoId: 'zLrMQyxUO4U',
    officialUrl: 'https://wazobiamax.ng/',
    currentlyAiring: {
      timeLeft: '6 min left',
      progressPercent: 81,
      title: 'As E Dey Hot Live Talkshow',
      timeSlot: '8:30 PM - 9:30 PM',
      description: 'Unapologetic everyday talk in vibrant Nigerian Pidgin discussing matters arising in the society.'
    },
    programs: [
      {
        time: '9:30 PM',
        title: 'Kulele Zone Comedy Special',
        durationSpan: 1,
        description: 'Rib-cracking stand-up comedy sketches and hilarious viral parodies.'
      },
      {
        time: '10:00 PM',
        title: 'Wazobia Tori: Pidgin News Digest',
        durationSpan: 1,
        description: 'Original news bulletin delivered strictly in pure Nigerian Pidgin English.'
      },
      {
        time: '10:30 PM',
        title: 'Gudu Gudu Sports Naija',
        durationSpan: 1,
        description: 'Passionate football fan banter, transfers, and weekend fixture debates.'
      },
      {
        time: '11:00 PM',
        title: 'Ogbonge Comedy Jamz',
        durationSpan: 2,
        description: 'The funniest comedic performances from Nigeria’s beloved humorists.'
      }
    ]
  },
  {
    id: 'news-central',
    name: 'News Central TV',
    shortName: 'News Central',
    logoType: 'news-central',
    logoImg: '/images/channels/news-central.png',
    category: 'Nigeria',
    country: 'Nigeria',
    videoId: 'uNUPuUTvyH8',
    fallbackEmbed: 'https://www.youtube-nocookie.com/embed/uNUPuUTvyH8?autoplay=1&rel=0',
    officialUrl: 'https://newscentral.ng/',
    currentlyAiring: {
      timeLeft: '4 min left',
      progressPercent: 86,
      title: 'Politics 360 Live Debate',
      timeSlot: '8:30 PM - 9:30 PM',
      description: 'Pan-African perspectives on critical political events, economic treaties, and regional governance.'
    },
    programs: [
      {
        time: '9:30 PM',
        title: 'Central Primetime News Bulletin',
        durationSpan: 1,
        description: 'Comprehensive continental news recap detailing the major African stories of the day.'
      },
      {
        time: '10:00 PM',
        title: 'Jasiri: African Changemakers Spotlight',
        durationSpan: 1,
        description: 'Celebrating dynamic innovators, entrepreneurs, and women breaking barriers across Africa.'
      },
      {
        time: '10:30 PM',
        title: 'The Continental Business Review',
        durationSpan: 1,
        description: 'Deep dive into AfCFTA cross-border trading, currency markets, and tech ecosystems.'
      },
      {
        time: '11:00 PM',
        title: 'Eco Africa & Climate Perspectives',
        durationSpan: 1,
        description: 'Environmental innovations, renewable energy transitions, and green agriculture in Africa.'
      },
      {
        time: '11:30 PM',
        title: 'Behind the Headlines & Night Debrief',
        durationSpan: 1.5,
        description: 'Late evening journalistic analysis dissecting key headlines across Africa.'
      }
    ]
  },
  {
    id: 'trust-tv',
    name: 'Trust Television (Trust TV)',
    shortName: 'Trust TV',
    logoType: 'trust-tv',
    logoImg: '/images/channels/trusttv.svg',
    category: 'Nigeria',
    country: 'Nigeria',
    videoId: 'ilwAJyuS1vE',
    fallbackEmbed: 'https://www.youtube-nocookie.com/embed/ilwAJyuS1vE?autoplay=1&rel=0',
    officialUrl: 'https://trusttv.com/',
    currentlyAiring: {
      timeLeft: '5 min left',
      progressPercent: 82,
      title: 'Daily Politics with Media Trust Editors',
      timeSlot: '8:30 PM - 9:30 PM',
      description: 'Uncompromising scrutiny of national policies, governance challenges, and political intrigues from Abuja.'
    },
    programs: [
      {
        time: '9:30 PM',
        title: 'Trust TV News at 9: Primetime Edition',
        durationSpan: 1,
        description: 'The definitive nightly network news package delivering verified reports from across all geopolitical zones.'
      },
      {
        time: '10:00 PM',
        title: 'Security & Peace: National Defence Forum',
        durationSpan: 1,
        description: 'Investigative reviews on security strategy, counter-insurgency, and community policing.'
      },
      {
        time: '10:30 PM',
        title: 'Focus on the States & Constituency Watch',
        durationSpan: 1,
        description: 'Tracking grassroots governance, healthcare, and educational infrastructure in Nigerian states.'
      },
      {
        time: '11:00 PM',
        title: 'Trust Business Monitor',
        durationSpan: 1,
        description: 'Tracking agricultural value chains, energy supply, MSME financing, and the northern economy.'
      },
      {
        time: '11:30 PM',
        title: 'Late Night Investigative Documentary',
        durationSpan: 1.5,
        description: 'Award-winning investigative documentaries revealing untold human stories from northern Nigeria and beyond.'
      }
    ]
  }
];

// Branded Fallback Station Badges ensuring 100% reliable logo presentation
function FallbackStationLogo({ channel }) {
  const id = channel.id;

  if (id === 'leased-access-channel' || id === 'leased-channel') {
    return (
      <div className="w-full h-full rounded-lg bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 flex flex-col items-center justify-center text-center p-1 border border-amber-500/40 shadow-inner">
        <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest leading-none">LEASED</span>
        <span className="text-xs font-black text-white tracking-wider mt-0.5">ACCESS</span>
        <span className="text-[7.5px] uppercase tracking-wider text-neutral-300 mt-0.5">CHANNEL 01</span>
      </div>
    );
  }
  if (id === 'crbc') {
    return (
      <div className="w-full h-full rounded-lg bg-[#0a3262] flex flex-col items-center justify-center text-center p-1 border border-orange-500/40">
        <span className="text-xs font-black text-orange-400 leading-none">CRBC</span>
        <span className="text-[8px] uppercase tracking-wider text-blue-200 mt-0.5">Calabar</span>
      </div>
    );
  }
  if (id === 'channels-tv') {
    return (
      <div className="w-full h-full rounded-lg bg-[#0047ba] flex flex-col items-center justify-center text-white font-black p-1 text-center border border-white/20">
        <span className="text-xs tracking-wider leading-none">CHANNELS</span>
        <span className="text-[8px] bg-red-600 px-1.5 py-0.2 rounded text-white font-bold mt-1">TELEVISION</span>
      </div>
    );
  }
  if (id === 'arise-news') {
    return (
      <div className="w-full h-full rounded-lg bg-black flex flex-col items-center justify-center text-white font-black p-1 text-center border border-red-600/60">
        <span className="text-xs tracking-widest text-red-500 font-extrabold leading-none">ARISE</span>
        <span className="text-[8px] text-white tracking-wider mt-0.5">NEWS</span>
      </div>
    );
  }
  if (id === 'tvc-news') {
    return (
      <div className="w-full h-full rounded-lg bg-[#081b33] flex flex-col items-center justify-center text-white font-black p-1 text-center border border-red-500/40">
        <span className="text-xs text-red-500 font-black leading-none">TVC</span>
        <span className="text-[8px] text-[#00a8e1] tracking-wider font-bold mt-0.5">NEWS</span>
      </div>
    );
  }
  if (id === 'ait') {
    return (
      <div className="w-full h-full rounded-lg bg-[#660909] flex flex-col items-center justify-center text-white font-black p-1 text-center border border-amber-400/40">
        <span className="text-xs text-amber-300 font-black tracking-widest leading-none">AIT</span>
        <span className="text-[7px] text-white/90 uppercase tracking-tighter mt-0.5">Independent TV</span>
      </div>
    );
  }
  if (id === 'nta-network') {
    return (
      <div className="w-full h-full rounded-lg bg-[#004d1a] flex flex-col items-center justify-center text-white font-black p-1 text-center border border-emerald-400/40">
        <span className="text-xs text-white font-black tracking-wider leading-none">NTA</span>
        <span className="text-[7px] text-lime-300 tracking-wider mt-0.5">NETWORK NEWS</span>
      </div>
    );
  }
  if (id === 'silverbird-tv') {
    return (
      <div className="w-full h-full rounded-lg bg-[#111827] flex flex-col items-center justify-center text-white font-black p-1 text-center border border-neutral-600">
        <span className="text-xs text-gray-100 font-black tracking-wider leading-none">SILVERBIRD</span>
        <span className="text-[8px] text-red-500 font-bold mt-0.5">TELEVISION</span>
      </div>
    );
  }
  if (id === 'soundcity-tv') {
    return (
      <div className="w-full h-full rounded-lg bg-[#1a0505] flex flex-col items-center justify-center text-white font-black p-1 text-center border border-red-600/40">
        <span className="text-xs text-red-500 font-black tracking-wider leading-none">SOUNDCITY</span>
        <span className="text-[8px] text-white/80 font-semibold mt-0.5">TV NIGERIA</span>
      </div>
    );
  }
  if (id === 'wazobia-max') {
    return (
      <div className="w-full h-full rounded-lg bg-[#18202c] flex flex-col items-center justify-center text-white font-black p-1 text-center border border-orange-500/40">
        <span className="text-xs text-orange-500 font-black tracking-wider leading-none">WAZOBIA</span>
        <span className="text-[8px] bg-green-600 text-white px-1 py-0.2 rounded font-bold mt-0.5">MAX TV</span>
      </div>
    );
  }
  if (id === 'news-central' || id === 'on-now-news-central') {
    return (
      <div className="w-full h-full rounded-lg bg-[#0f172a] flex flex-col items-center justify-center text-white font-black p-1 text-center border border-rose-600/40">
        <span className="text-xs text-white font-black tracking-wider leading-none">NEWS</span>
        <span className="text-[8px] bg-rose-600 text-white px-1.5 py-0.2 rounded font-bold mt-0.5 tracking-wider">CENTRAL</span>
      </div>
    );
  }
  if (id === 'trust-tv' || id === 'on-now-trust-tv') {
    return (
      <div className="w-full h-full rounded-lg bg-[#1c1917] flex flex-col items-center justify-center text-white font-black p-1 text-center border border-red-700/40">
        <span className="text-xs text-white font-black tracking-widest leading-none">TRUST</span>
        <span className="text-[8px] bg-red-700 text-white px-1.5 py-0.2 rounded font-bold mt-0.5 tracking-wider">TV</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-lg bg-blue-900/60 flex items-center justify-center p-1 text-center">
      <span className="text-xs font-black text-white truncate max-w-full px-1">
        {channel.shortName || channel.name}
      </span>
    </div>
  );
}

// Official Broadcaster Logo Badges using real channel image assets with responsive container-fitting
function ChannelLogoBadge({ channel, className = '' }) {
  const [imgError, setImgError] = useState(false);

  // If image fails, attempt secondary fallback formats before showing branded badge
  const handleImgError = (e) => {
    if (channel.id === 'nta-network' && e.target.src.includes('nta.svg')) {
      e.target.src = '/images/channels/nta_clean.png';
      return;
    }
    if (channel.id === 'nta-network' && e.target.src.includes('nta_clean.png')) {
      e.target.src = '/images/channels/nta.png';
      return;
    }
    setImgError(true);
  };

  // If channel is NTA and using PNG, provide a clean white card backing
  const isNTAWithPng = (channel.id === 'nta-network' || channel.logoType === 'nta') && (channel.logoImg?.endsWith('.png') || channel.logoImg?.includes('nta.png'));

  if (channel.logoImg && !imgError) {
    return (
      <div className={`w-full h-full flex items-center justify-center p-1 relative select-none overflow-hidden ${className}`}>
        {isNTAWithPng ? (
          <div className="bg-white rounded px-2 py-0.5 flex items-center justify-center shadow-sm max-w-full max-h-full">
            <img
              src={channel.logoImg}
              alt={channel.name}
              onError={handleImgError}
              className="max-h-full max-w-full w-auto h-auto object-contain select-none"
              loading="eager"
            />
          </div>
        ) : (
          <img
            src={channel.logoImg}
            alt={channel.name}
            onError={handleImgError}
            className={`max-h-full max-w-full w-auto h-auto object-contain transition-transform duration-200 select-none ${
              channel.id === 'channels-tv' ? 'brightness-110 drop-shadow-sm' : ''
            }`}
            loading="eager"
          />
        )}
      </div>
    );
  }

  return <FallbackStationLogo channel={channel} />;
}

export function LiveTvView({ onPlayMovie, onOpenDetails, onShowToast, onStopRadio, isRadioPlaying }) {
  const [watTime, setWatTime] = useState(() => getWestAfricaTime());
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChannel, setActiveChannel] = useState(NIGERIAN_CHANNELS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedUpcomingProgram, setSelectedUpcomingProgram] = useState(null);
  const [mobileGuideMode, setMobileGuideMode] = useState('cards'); // 'cards' | 'grid'
  const [expandedChannelId, setExpandedChannelId] = useState(null);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const fullscreenContainerRef = useRef(null);

  // When radio plays or external stop occurs, close Live TV stream player
  useEffect(() => {
    if (isRadioPlaying && isPlaying) {
      handleClosePlayer();
    }
  }, [isRadioPlaying]);

  useEffect(() => {
    const handleStop = () => {
      handleClosePlayer();
    };
    window.addEventListener('adc-stop-video-playback', handleStop);
    return () => window.removeEventListener('adc-stop-video-playback', handleStop);
  }, []);

  // Monitor device dimensions and orientation
  useEffect(() => {
    const handleDeviceCheck = () => {
      const isSmall = window.innerWidth <= 1024;
      setIsMobileOrTablet(isSmall);
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

  // Synchronize 24-hour schedule with West Africa Time (WAT: UTC+1)
  useEffect(() => {
    const timer = setInterval(() => {
      setWatTime(getWestAfricaTime());
    }, 10000); // Check every 10s so container switches automatically at program boundaries
    return () => clearInterval(timer);
  }, []);

  // Filter channels based on selected top category pill and search query
  const filteredChannels = useMemo(() => {
    let list = NIGERIAN_CHANNELS;
    if (selectedCategory !== 'All' && selectedCategory !== 'Nigeria') {
      list = list.filter(ch => 
        ch.category?.toLowerCase() === selectedCategory.toLowerCase() ||
        ch.country?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(ch =>
        ch.name.toLowerCase().includes(q) ||
        (ch.shortName && ch.shortName.toLowerCase().includes(q)) ||
        (ch.currentlyAiring?.title && ch.currentlyAiring.title.toLowerCase().includes(q)) ||
        (ch.currentlyAiring?.description && ch.currentlyAiring.description.toLowerCase().includes(q)) ||
        (ch.programs && ch.programs.some(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)))
      );
    }
    return list;
  }, [selectedCategory, searchQuery]);

  // Dynamic WAT Schedule data for active playing channel
  const activeChannelWatData = useMemo(() => {
    return getChannelCurrentWatProgram(activeChannel.id, watTime);
  }, [activeChannel.id, watTime]);

  // Click on a channel or program: Stop radio and every other player, then start live broadcast in fullscreen only
  const handleTuneIntoChannel = (channel, toastMsg) => {
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

    setActiveChannel(channel);
    setIsPlaying(true);
    setIsFullscreen(true); // Always launch in full screen first!

    // Lock orientation to landscape on mobile/tablet if API supported
    try {
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').catch(() => {});
      }
    } catch (_) {}

    if (onShowToast) {
      onShowToast(toastMsg || `Tuned into ${channel.name}`);
    }
  };

  const handleExitFullscreen = () => {
    setIsFullscreen(false);
    try {
      if (screen.orientation && screen.orientation.unlock) {
        screen.orientation.unlock();
      }
    } catch (_) {}
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const handleClosePlayer = () => {
    setIsPlaying(false);
    setIsFullscreen(false);
    try {
      if (screen.orientation && screen.orientation.unlock) {
        screen.orientation.unlock();
      }
    } catch (_) {}
  };

  // Video embed URL
  const currentVideoId = activeChannel.videoId || 'BAhn-P035_M';
  const embedUrl = currentVideoId === 'live'
    ? `https://www.youtube-nocookie.com/embed/live_stream?channel=${ADC_CHANNEL_ID}&autoplay=1&rel=0`
    : `https://www.youtube-nocookie.com/embed/${currentVideoId}?autoplay=1&rel=0`;

  return (
    <div className="w-full bg-[#05080e] text-white min-h-screen pb-24 font-sans select-none animate-in fade-in duration-300">
      
      {/* 1. TOP HORIZONTAL CATEGORY PILLS BAR & SEARCH */}
      <div className="w-full bg-[#05080e]/95 backdrop-blur-md border-b border-white/5 sticky top-0 sm:top-[58px] z-40 px-3 sm:px-4 md:px-8 py-2 sm:py-2.5">
        <div className="max-w-[1920px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-0.5">
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`transition-all cursor-pointer text-xs sm:text-sm md:text-[15px] font-bold whitespace-nowrap ${
                    isSelected
                      ? 'bg-white text-black px-4 py-1.5 rounded-full shadow-md font-extrabold'
                      : 'text-neutral-300 hover:text-white px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Quick TV Channel Search */}
          <div className="relative w-full sm:w-64 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search channels, shows, news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111824] border border-neutral-700/80 rounded-full pl-9 pr-8 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-red-500 transition-colors"
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

      {/* 2. FULLSCREEN BROADCAST STREAM PLAYER (Landscape on Mobile/Tablet) */}
      {isPlaying && isFullscreen && (
        <div
          ref={fullscreenContainerRef}
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
          <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/90 via-black/50 to-transparent p-3 sm:p-4 flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-2.5">
              <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded shadow flex items-center gap-1.5 tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                LIVE
              </span>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-black/60 border border-white/20 p-0.5 overflow-hidden flex items-center justify-center">
                  <ChannelLogoBadge channel={activeChannel} />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-white truncate max-w-[180px] sm:max-w-md">
                    {activeChannel.name}
                  </h3>
                  <span className="text-[10px] sm:text-xs text-blue-200 font-medium truncate block">
                    Now: {activeChannelWatData.activeProgram.title} ({activeChannelWatData.activeProgram.timeSlot})
                  </span>
                </div>
              </div>
            </div>

            {/* Exit Fullscreen (Minimize to in-page player) & Close Player buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExitFullscreen}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/75 hover:bg-neutral-800 text-white text-xs font-bold border border-white/20 transition-all cursor-pointer shadow-lg active:scale-95"
                title="Exit Fullscreen (Minimize to Guide)"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Minimize</span>
              </button>

              <button
                type="button"
                onClick={handleClosePlayer}
                className="p-1.5 sm:p-2 rounded-full bg-black/75 hover:bg-red-600 text-white transition-all cursor-pointer border border-white/20 shadow-lg active:scale-95"
                title="Close Player"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Full Screen Video Stream Player */}
          <div className="w-full h-full flex items-center justify-center bg-black relative">
            <LiveStreamPlayer
              streamUrl={activeChannel.streamUrl}
              youtubeId={activeChannel.videoId}
              title={`${activeChannel.name} Live Broadcast`}
              isLive={true}
              className="w-full h-full"
            />
          </div>
        </div>
      )}

      {/* 2b. IN-PAGE EMBEDDED STREAM PLAYER & TODAY'S PROGRAM SCHEDULE (when minimized / not in fullscreen) */}
      {isPlaying && !isFullscreen && (
        <div className="max-w-[1920px] mx-auto px-3 sm:px-4 md:px-8 pt-3 sm:pt-4 pb-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-[#0b1c33] rounded-xl border border-blue-400/40 overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              
              {/* Video frame */}
              <div className="lg:col-span-8 bg-black relative aspect-video flex items-center justify-center">
                <LiveStreamPlayer
                  streamUrl={activeChannel.streamUrl}
                  youtubeId={activeChannel.videoId}
                  title={`${activeChannel.name} Live Broadcast`}
                  isLive={true}
                />

                {/* Top Action Buttons (Fullscreen & Close) */}
                <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
                  <button
                    type="button"
                    onClick={() => {
                      setIsFullscreen(true);
                      try {
                        if (screen.orientation && screen.orientation.lock) {
                          screen.orientation.lock('landscape').catch(() => {});
                        }
                      } catch (_) {}
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/80 hover:bg-neutral-800 text-white text-xs font-bold border border-white/20 transition-all cursor-pointer backdrop-blur-sm shadow-lg active:scale-95"
                    title="Expand to Full Screen"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Fullscreen</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClosePlayer}
                    className="p-2 rounded-full bg-black/75 hover:bg-black text-white hover:text-red-400 transition-colors cursor-pointer backdrop-blur-sm border border-white/10 min-h-[38px] min-w-[38px] flex items-center justify-center"
                    title="Close Live Player"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Live stream badge */}
                <div className="absolute top-3 left-3 pointer-events-none flex items-center gap-1.5 sm:gap-2 z-20">
                  <span className="bg-red-600 text-white text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded flex items-center gap-1.5 shadow-lg tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    LIVE
                  </span>
                  <span className="bg-black/85 backdrop-blur-md border border-white/20 px-2 py-0.5 rounded text-[11px] sm:text-xs font-bold text-white shadow-lg truncate max-w-[160px] sm:max-w-none">
                    {activeChannel.name}
                  </span>
                </div>
              </div>

              {/* Station Live Info & Today's Schedule for the Day */}
              <div className="lg:col-span-4 p-4 sm:p-5 flex flex-col justify-between bg-gradient-to-b from-[#102d52] to-[#0a1b30] border-t lg:border-t-0 lg:border-l border-blue-400/20 max-h-[520px] lg:max-h-none overflow-y-auto">
                <div className="space-y-3.5">
                  {/* Station Logo & Live Badge */}
                  <div className="flex items-center gap-2.5">
                    <div
                      className="h-10 w-16 sm:h-11 sm:w-20 rounded-lg p-1 flex items-center justify-center border border-neutral-800 bg-black flex-shrink-0 overflow-hidden shadow-sm"
                      title={activeChannel.name}
                    >
                      <ChannelLogoBadge channel={activeChannel} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                        ● Broadcasting Live (WAT)
                      </span>
                      <h3 className="text-sm sm:text-base font-extrabold text-white truncate">
                        {activeChannel.name}
                      </h3>
                    </div>
                  </div>

                  {/* Active Program Card */}
                  <div className="bg-white/5 rounded-xl p-3 sm:p-3.5 border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#00a8e1] font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        <span>ON NOW: {activeChannelWatData.activeProgram.timeLeft}</span>
                      </span>
                      <span className="text-blue-200 font-mono text-[11px]">
                        {activeChannelWatData.activeProgram.timeSlot}
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-black text-white leading-snug">
                      {activeChannelWatData.activeProgram.title}
                    </h4>

                    <p className="text-xs text-neutral-200 line-clamp-3 leading-relaxed">
                      {activeChannelWatData.activeProgram.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden mt-2 border border-white/5">
                      <div 
                        className="bg-red-600 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${activeChannelWatData.activeProgram.progressPercent}%` }} 
                      />
                    </div>
                  </div>

                  {/* Other Program Schedule For The Day */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-xs text-blue-200 font-bold border-b border-white/10 pb-1.5">
                      <span className="flex items-center gap-1.5 text-white font-extrabold">
                        <Calendar className="w-3.5 h-3.5 text-[#00a8e1]" />
                        <span>Today&apos;s Program Schedule (WAT)</span>
                      </span>
                      <span className="text-[11px] text-neutral-400 font-mono">
                        {activeChannelWatData.upcomingToday.length} more today
                      </span>
                    </div>

                    <div className="space-y-1.5 max-h-[190px] sm:max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
                      {activeChannelWatData.upcomingToday.map((prog, pIdx) => (
                        <div
                          key={pIdx}
                          onClick={() => setSelectedUpcomingProgram({ channel: activeChannel, program: prog })}
                          className="p-2 sm:p-2.5 rounded-lg bg-black/40 border border-white/5 hover:border-blue-400/30 flex items-start justify-between gap-2 text-xs transition-colors cursor-pointer group"
                          title={`${prog.title} (${prog.time}) - Click for details`}
                        >
                          <div className="min-w-0 flex-1">
                            <span className="font-bold text-white block truncate group-hover:text-blue-200">
                              {prog.title}
                            </span>
                            <span className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                              {prog.description}
                            </span>
                          </div>
                          <span className="font-mono text-[11px] text-[#00a8e1] font-semibold whitespace-nowrap bg-blue-900/40 px-2 py-0.5 rounded">
                            {prog.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Bottom Actions */}
                <div className="pt-3 mt-3 border-t border-blue-400/20 flex items-center gap-2">
                  {activeChannel.officialUrl && (
                    <a
                      href={activeChannel.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-white hover:bg-neutral-200 text-black font-bold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[40px]"
                    >
                      <span>Station Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={handleClosePlayer}
                    className="bg-[#164479] hover:bg-[#1e589c] text-blue-100 hover:text-white text-xs font-semibold py-2.5 px-3 rounded-lg border border-blue-400/30 transition-colors cursor-pointer min-h-[40px]"
                  >
                    Hide Player
                  </button>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}



      {/* 3. MOBILE MODE SWITCHER (Channel Feed vs Full Grid) */}
      <div className="sm:hidden max-w-[1920px] mx-auto px-3 pt-3">
        <div className="flex items-center justify-between bg-[#123966] p-1 rounded-lg border border-blue-400/20 w-full">
          <button
            type="button"
            onClick={() => setMobileGuideMode('cards')}
            className={`flex-1 py-1.5 px-3 rounded text-xs font-bold transition-all text-center ${
              mobileGuideMode === 'cards' ? 'bg-[#00a8e1] text-white shadow-sm' : 'text-blue-200'
            }`}
          >
            Channel Feed
          </button>
          <button
            type="button"
            onClick={() => setMobileGuideMode('grid')}
            className={`flex-1 py-1.5 px-3 rounded text-xs font-bold transition-all text-center ${
              mobileGuideMode === 'grid' ? 'bg-[#00a8e1] text-white shadow-sm' : 'text-blue-200'
            }`}
          >
            EPG Grid
          </button>
        </div>
      </div>

      {/* 4. MOBILE CHANNEL FEED VIEW (Optimized thumb-friendly layout on phones) */}
      <div className="sm:hidden px-3 pt-3">
        {mobileGuideMode === 'cards' && (
          <div className="space-y-3 pb-6">
            {/* Mobile "On Now" blue rectangle header lower in brightness than upcoming programs */}
            <div className="w-full h-11 bg-[#0b2647] border border-blue-900/60 rounded-xs flex items-center justify-center gap-2.5 shadow-md mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0 inline-block" />
              <span className="text-white font-extrabold text-lg tracking-tight">On Now</span>
            </div>
            {filteredChannels.map((channel) => {
              const channelWatData = getChannelCurrentWatProgram(channel.id, watTime);
              const activeProg = channelWatData.activeProgram;
              const isActiveChannel = activeChannel.id === channel.id && isPlaying;
              const isExpanded = expandedChannelId === channel.id;

              return (
                <div
                  key={channel.id}
                  className={`bg-[#123966] rounded-xl border p-3.5 space-y-3 transition-all duration-200 shadow-md ${
                    isActiveChannel ? 'border-[#00a8e1] ring-2 ring-[#00a8e1]/70 bg-[#164479]' : 'border-blue-400/20 hover:border-blue-400/50'
                  }`}
                >
                  {/* Channel Header + Linked Logo + Watch Button */}
                  <div className="flex items-center justify-between gap-2.5">
                    <div 
                      className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
                      onClick={() => handleTuneIntoChannel(channel)}
                      title={`Tune into ${channel.name}`}
                    >
                      <div className="w-[74px] sm:w-[84px] h-[46px] sm:h-[50px] rounded-lg bg-black border border-neutral-800 flex items-center justify-center p-1.5 flex-shrink-0 relative overflow-hidden shadow-sm">
                        <ChannelLogoBadge channel={channel} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-extrabold text-sm text-white truncate flex items-center gap-1.5">
                          <span className="truncate">{channel.name}</span>
                        </h4>
                        <span className="text-[11px] text-blue-200 font-medium flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                          <span>Nigeria</span>
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleTuneIntoChannel(channel)}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 min-h-[38px] flex-shrink-0 transition-transform duration-200 active:scale-95 ${
                        isActiveChannel 
                          ? 'bg-red-600 text-white shadow-md' 
                          : 'bg-white hover:bg-neutral-200 text-black'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isActiveChannel ? 'Playing' : 'Watch'}</span>
                    </button>
                  </div>

                  {/* Airing Now Active Container (Dynamically selected by West Africa Time) */}
                  <div
                    onClick={() => handleTuneIntoChannel(channel, `Now showing: ${activeProg.title}`)}
                    className="bg-[#18467a] hover:bg-[#1f5799] rounded-lg p-3 border border-blue-300/20 hover:border-[#00a8e1] cursor-pointer active:scale-95 transition-all duration-200 space-y-1.5 overflow-hidden shadow-sm"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#00a8e1] font-bold">
                        ● LIVE NOW ({activeProg.timeLeft})
                      </span>
                      <span className="text-blue-200 text-[11px] font-mono">
                        {activeProg.timeSlot}
                      </span>
                    </div>

                    <p className="text-sm font-bold text-white leading-snug">
                      {activeProg.title}
                    </p>

                    {/* Red progress line */}
                    <div className="w-full bg-neutral-800/80 h-[3px] rounded-full overflow-hidden mt-1.5">
                      <div 
                        className="bg-red-600 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${activeProg.progressPercent}%` }} 
                      />
                    </div>
                  </div>

                  {/* Upcoming Schedule Accordion Toggle */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setExpandedChannelId(isExpanded ? null : channel.id)}
                      className="w-full py-1 text-center text-[11px] text-blue-200 hover:text-white font-semibold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>{isExpanded ? 'Hide Schedule' : `Next: ${channelWatData.upcomingToday[0]?.title || 'Upcoming Shows'}`}</span>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>

                    {isExpanded && (
                      <div className="mt-2 space-y-1.5 pt-2 border-t border-blue-400/20 animate-in fade-in duration-200">
                        {channelWatData.upcomingToday.map((prog, pIdx) => (
                          <div
                            key={pIdx}
                            onClick={() => setSelectedUpcomingProgram({ channel, program: prog })}
                            className="flex items-center justify-between text-xs p-2 rounded bg-[#0e2d52] hover:bg-[#164375] transition-all cursor-pointer border border-blue-400/10 hover:border-blue-400/40 gap-2 group"
                            title={`${prog.title} - Click for upcoming details`}
                          >
                            <span className="font-bold text-white truncate flex-1 min-w-0 group-hover:text-blue-200">
                              {prog.title}
                            </span>
                            <Info className="w-3.5 h-3.5 text-blue-300 opacity-60 group-hover:opacity-100 flex-shrink-0" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. CHANNELS AND SCHEDULE TILES (Grid Guide on Desktop, or when Grid is toggled on mobile) */}
      <div className={`max-w-[1920px] mx-auto px-3 sm:px-4 md:px-8 ${mobileGuideMode === 'cards' ? 'hidden sm:block' : 'block'}`}>
        <div className="overflow-x-auto pt-4 pb-12 -mb-6 select-none no-scrollbar touch-pan-x">
          <div className="min-w-[1020px] space-y-3.5 py-2 px-2">

            {/* Header row with shifted "On Now" blue rectangle (aligned with On Now column, lower in brightness than upcoming programs) */}
            <div className="flex items-center gap-2 pb-1.5 pt-1">
              {/* Channel logo column space */}
              <div className="w-[130px] sm:w-[145px] flex-shrink-0" />

              {/* Shifted "On Now" in blue rectangle lower in brightness than upcoming programs */}
              <div className="w-[230px] sm:w-[260px] flex-shrink-0 h-11 sm:h-12 bg-[#0b2647] border border-blue-900/60 rounded-xs flex items-center justify-center gap-2.5 shadow-md">
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-600 shrink-0 inline-block" />
                <span className="text-white font-extrabold text-lg sm:text-2xl tracking-tight">On Now</span>
              </div>

              {/* Right Side Schedule Hint */}
              <div className="flex-1 flex items-center justify-end pr-3">
                <span className="text-xs text-neutral-400 font-medium">
                  Scroll horizontally for 24-hour schedules →
                </span>
              </div>
            </div>
            
            {filteredChannels.map((channel) => {
              const isActiveChannel = activeChannel.id === channel.id && isPlaying;
              const channelWatData = getChannelCurrentWatProgram(channel.id, watTime);
              const activeProg = channelWatData.activeProgram;
              const remainingPrograms = channelWatData.upcomingToday;

              return (
                <div 
                  key={channel.id}
                  className="flex items-center gap-2 group relative z-10"
                >
                  
                  {/* Left Column: Channel Logo Card - black container, no hover effects */}
                  <div
                    onClick={() => handleTuneIntoChannel(channel)}
                    className={`relative w-[130px] sm:w-[145px] flex-shrink-0 h-[88px] sm:h-[92px] rounded-lg bg-black border ${
                      isActiveChannel ? 'border-[#00a8e1] ring-2 ring-[#00a8e1]' : 'border-neutral-800'
                    } flex flex-col items-center justify-center p-2 shadow-md overflow-hidden cursor-pointer select-none`}
                    title={`Tune into ${channel.name}`}
                  >
                    <div className="w-full h-full flex items-center justify-center overflow-hidden">
                      <ChannelLogoBadge channel={channel} />
                    </div>
                  </div>

                  {/* Program 1: Currently Airing Active Container dynamically chosen by West African Time */}
                  <div
                    onClick={() => handleTuneIntoChannel(channel, `Now showing: ${activeProg.title}`)}
                    className="relative w-[230px] sm:w-[260px] flex-shrink-0 h-[88px] sm:h-[92px] rounded-lg bg-[#164377] hover:bg-[#1f5799] border border-blue-400/30 hover:border-[#00a8e1] p-3 flex flex-col justify-between transition-all duration-200 ease-out cursor-pointer shadow-md hover:shadow-2xl hover:shadow-[#00a8e1]/40 hover:scale-[1.08] hover:z-30 origin-center group/card overflow-hidden"
                    title={`${activeProg.title} (Live Now: ${activeProg.timeSlot})`}
                  >
                    <div className="w-full h-full flex flex-col justify-between">
                      {/* Time left header + live badge */}
                      <div className="text-xs sm:text-[13px] font-semibold text-blue-200 flex items-center justify-between">
                        <span className="text-[#00a8e1] font-bold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                          {activeProg.timeLeft}
                        </span>
                        <span className="text-[10px] font-bold text-[#00a8e1] uppercase tracking-wider opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center gap-1">
                          <span>Tune In</span>
                          <Play className="w-2.5 h-2.5 fill-current" />
                        </span>
                      </div>

                      {/* Program title + red progress bar */}
                      <div>
                        <h4 className="text-sm sm:text-[15px] font-extrabold text-white truncate leading-tight">
                          {activeProg.title}
                        </h4>

                        {/* Red underline progress bar calculated from elapsed WAT */}
                        <div className="w-full bg-neutral-800/80 h-[3px] rounded-full mt-2 overflow-hidden">
                          <div 
                            className="bg-red-600 h-full rounded-full transition-all duration-500" 
                            style={{ width: `${activeProg.progressPercent}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Subsequent Program Cards for the day in chronological order (Time removed) */}
                  {remainingPrograms.map((prog, idx) => {
                    const widthClass = prog.durationSpan === 2
                      ? 'w-[320px] sm:w-[360px]'
                      : prog.durationSpan === 1.5
                      ? 'w-[230px] sm:w-[260px]'
                      : 'w-[165px] sm:w-[185px]';

                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedUpcomingProgram({ channel, program: prog })}
                        className={`relative ${widthClass} flex-shrink-0 h-[88px] sm:h-[92px] rounded-lg bg-[#123966] hover:bg-[#1a4f8b] border border-blue-400/20 hover:border-blue-300/70 p-3 flex flex-col justify-between transition-all duration-200 ease-out cursor-pointer shadow-md hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-[1.08] hover:z-30 origin-center group/card overflow-hidden`}
                        title={`${prog.title} (Click for upcoming details)`}
                      >
                        <div className="w-full h-full flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-end text-xs sm:text-[12.5px] font-bold text-blue-200 tracking-wide mb-1">
                              <Info className="w-3 h-3 text-amber-300 opacity-60 group-hover/card:opacity-100 transition-opacity" />
                            </div>

                            <h4 className="text-sm sm:text-[15px] font-bold text-white line-clamp-2 leading-snug group-hover/card:text-blue-100">
                              {prog.title}
                            </h4>
                          </div>

                          <div className="w-full h-[2px] bg-transparent group-hover/card:bg-amber-400/80 rounded-full transition-colors mt-auto" />
                        </div>
                      </div>
                    );
                  })}

                </div>
              );
            })}

          </div>
        </div>
      </div>

      {/* 6. UPCOMING PROGRAM DETAILS POPUP */}
      {selectedUpcomingProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="fixed inset-0"
            onClick={() => setSelectedUpcomingProgram(null)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-md bg-[#0a1829] border border-blue-400/50 rounded-2xl shadow-2xl p-5 text-white z-10 space-y-4 animate-in zoom-in-95 duration-200">
            {/* Header: Station info + Close Button */}
            <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-14 h-10 rounded-lg bg-black border border-neutral-700 p-1 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
                  <ChannelLogoBadge channel={selectedUpcomingProgram.channel} />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-white leading-tight">
                    {selectedUpcomingProgram.channel.name}
                  </h3>
                  <span className="text-[11px] text-blue-300 font-medium flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{selectedUpcomingProgram.channel.shortName} • {selectedUpcomingProgram.channel.country || 'Nigeria'}</span>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedUpcomingProgram(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Upcoming Program Badge & Time */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 tracking-wider shadow-sm">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>UPCOMING PROGRAM</span>
                </span>
                <span className="text-xs font-mono font-bold text-[#00a8e1] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{selectedUpcomingProgram.program.timeSlot || selectedUpcomingProgram.program.time} (WAT)</span>
                </span>
              </div>

              <h4 className="text-base sm:text-lg font-black text-white leading-snug">
                {selectedUpcomingProgram.program.title}
              </h4>

              {selectedUpcomingProgram.program.description && (
                <p className="text-xs text-neutral-300 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/10">
                  {selectedUpcomingProgram.program.description}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  const ch = selectedUpcomingProgram.channel;
                  setSelectedUpcomingProgram(null);
                  handleTuneIntoChannel(ch, `Tuned into ${ch.name}`);
                }}
                className="flex-1 bg-white hover:bg-neutral-200 text-black font-extrabold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Watch Live Channel Now</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedUpcomingProgram(null)}
                className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
