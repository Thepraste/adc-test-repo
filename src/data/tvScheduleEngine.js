// 24-Hour Functional Television Schedule Engine for Nigerian Channels
// Configured to synchronize automatically with West Africa Time (WAT: UTC+1)

export function getWestAfricaTime() {
  const now = new Date();
  // WAT is UTC+1 (Nigeria, West Africa)
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  return new Date(utc + (3600000 * 1));
}

export function formatWatTime(date) {
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

// 24-Hour Full Day Schedules (00:00 - 24:00) for all channels
const LEASED_CHANNEL_SCHEDULE = [
  { startMinutes: 0, endMinutes: 120, timeSlot: '12:00 AM - 2:00 AM', time: '12:00 AM', durationSpan: 2, title: 'Midnight Cultural Archive & Global Diaspora Voices', description: 'Curated historical and cultural documentaries celebrating African civilization, diaspora heritage, and grassroots community narratives.' },
  { startMinutes: 120, endMinutes: 240, timeSlot: '2:00 AM - 4:00 AM', time: '2:00 AM', durationSpan: 2, title: 'Pan-African Educational & Independent Cinema', description: 'Independent student films, educational lectures, and creative works from universities across the diaspora.' },
  { startMinutes: 240, endMinutes: 360, timeSlot: '4:00 AM - 6:00 AM', time: '4:00 AM', durationSpan: 2, title: 'Early Dawn Civic & Faith Forum', description: 'Multi-faith community addresses, peaceful inter-religious dialogue, and civic awakening messages.' },
  { startMinutes: 360, endMinutes: 480, timeSlot: '6:00 AM - 8:00 AM', time: '6:00 AM', durationSpan: 2, title: 'ADC Morning Community Horizon', description: 'Morning discussions highlighting diaspora entrepreneurs, community health clinics, and grassroots organizing.' },
  { startMinutes: 480, endMinutes: 600, timeSlot: '8:00 AM - 10:00 AM', time: '8:00 AM', durationSpan: 2, title: 'Public Access Spotlight: Independent Producers', description: 'Showcasing unreleased pilot episodes, local documentary projects, and public advocacy broadcasts.' },
  { startMinutes: 600, endMinutes: 720, timeSlot: '10:00 AM - 12:00 PM', time: '10:00 AM', durationSpan: 2, title: 'Diaspora Business & Tech Hub Naija', description: 'Conversations with African tech founders, fintech innovators, cross-continental trade champions, and angel investors.' },
  { startMinutes: 720, endMinutes: 840, timeSlot: '12:00 PM - 2:00 PM', time: '12:00 PM', durationSpan: 2, title: 'Midday Civic Forum & Open Townhall', description: 'Live interactive call-in townhall on immigration policies, consular affairs, and dual-citizenship integration.' },
  { startMinutes: 840, endMinutes: 960, timeSlot: '2:00 PM - 4:00 PM', time: '2:00 PM', durationSpan: 2, title: 'Afro-Indie Sounds & Spoken Word Naija', description: 'Acoustic musical sets, spoken word poetry, and visual arts from emerging talents in Lagos, London, and New York.' },
  { startMinutes: 960, endMinutes: 1080, timeSlot: '4:00 PM - 6:00 PM', time: '4:00 PM', durationSpan: 2, title: 'Youth Perspectives: Next Generation Africa', description: 'Youth leaders discuss creative technology, sports development, climate resilience, and community activism.' },
  { startMinutes: 1080, endMinutes: 1200, timeSlot: '6:00 PM - 8:00 PM', time: '6:00 PM', durationSpan: 2, title: 'ADC Evening Documentary Showcase', description: 'Feature-length investigative and historical documentaries exploring continental history and Pan-African achievements.' },
  { startMinutes: 1200, endMinutes: 1290, timeSlot: '8:00 PM - 9:30 PM', time: '8:00 PM', durationSpan: 1.5, title: 'ADC Leased Access: Independent Producers & Community Voice', description: 'Dedicated independent and public leased programming serving community voices, civic forums, and cultural organizations.' },
  { startMinutes: 1290, endMinutes: 1350, timeSlot: '9:30 PM - 10:30 PM', time: '9:30 PM', durationSpan: 1, title: 'Diaspora Filmmakers & Indie Showcase', description: 'Spotlighting independent short films, cultural essays, and creative talents from the pan-African diaspora.' },
  { startMinutes: 1350, endMinutes: 1440, timeSlot: '10:30 PM - 12:00 AM', time: '10:30 PM', durationSpan: 1.5, title: 'Community Forum & Midnight Cultural Archive', description: 'Open microphone civic broadcast platform addressing community health, diaspora trade, and cultural preservation.' }
];

export const CHANNEL_24H_SCHEDULES = {
  'leased-channel': LEASED_CHANNEL_SCHEDULE,
  'leased-access-channel': LEASED_CHANNEL_SCHEDULE,

  'crbc': [
    { startMinutes: 0, endMinutes: 120, timeSlot: '12:00 AM - 2:00 AM', time: '12:00 AM', durationSpan: 2, title: 'Voice of the South-South & Niger Delta Rhythms', description: 'Late night regional documentary and traditional musical performances from Cross River State and the Niger Delta.' },
    { startMinutes: 120, endMinutes: 300, timeSlot: '2:00 AM - 5:00 AM', time: '2:00 AM', durationSpan: 2, title: 'Cross River Heritage & Ecotourism Archive', description: 'Visual documentaries showcasing the lush rain forests, wildlife preservation sanctuaries, and Drill Ranch of Cross River.' },
    { startMinutes: 300, endMinutes: 390, timeSlot: '5:00 AM - 6:30 AM', time: '5:00 AM', durationSpan: 1.5, title: 'Morning Devotional & Canaan Sunrise', description: 'Early morning civic and spiritual reflections for the people of Cross River State across the 18 LGAs.' },
    { startMinutes: 390, endMinutes: 510, timeSlot: '6:30 AM - 8:30 AM', time: '6:30 AM', durationSpan: 2, title: 'Cross River AM: Good Morning People’s Paradise', description: 'Breakfast show with news roundups, traffic reports from Calabar, weather updates, and community highlights.' },
    { startMinutes: 510, endMinutes: 630, timeSlot: '8:30 AM - 10:30 AM', time: '8:30 AM', durationSpan: 2, title: 'Calabar Carnival Countdown & Band Rehearsals', description: 'Exclusive behind-the-scenes footage with Masta Blasta, Seagull, Passion 4, Bayside, and Freedom bands.' },
    { startMinutes: 630, endMinutes: 720, timeSlot: '10:30 AM - 12:00 PM', time: '10:30 AM', durationSpan: 1.5, title: 'Obudu Lens: Highlands, Cattle Ranch & Eco-Travel', description: 'A breathtaking journey exploring the Obudu Mountain Resort, cable car system, and mountain hiking trails.' },
    { startMinutes: 720, endMinutes: 810, timeSlot: '12:00 PM - 1:30 PM', time: '12:00 PM', durationSpan: 1.5, title: 'CRBC Midday News Bulletin Live', description: 'Direct news broadcast from Calabar covering state executive council decisions, agriculture, and civic life.' },
    { startMinutes: 810, endMinutes: 930, timeSlot: '1:30 PM - 3:30 PM', time: '1:30 PM', durationSpan: 2, title: 'Efik Cultural Odyssey & Ekpe Society Showcase', description: 'Celebrating ancient Efik traditions, Moninkim maidens, coronation rites, and indigenous musical heritage.' },
    { startMinutes: 930, endMinutes: 1050, timeSlot: '3:30 PM - 5:30 PM', time: '3:30 PM', durationSpan: 2, title: 'South-South Youth & Creative Enterprise', description: 'Empowering young entrepreneurs, cocoa farmers, fashion designers, and hospitality professionals in Cross River.' },
    { startMinutes: 1050, endMinutes: 1170, timeSlot: '5:30 PM - 7:30 PM', time: '5:30 PM', durationSpan: 2, title: 'Canaan City Live Edition', description: 'Evening civic affairs, community voices, and development projects in the ancient capital city of Calabar.' },
    { startMinutes: 1170, endMinutes: 1260, timeSlot: '7:30 PM - 9:00 PM', time: '7:30 PM', durationSpan: 1.5, title: 'Cross River Today: Live From Calabar', description: 'Direct reports from the People’s Paradise, covering governance, tourism, and community welfare across the 18 LGAs.' },
    { startMinutes: 1260, endMinutes: 1350, timeSlot: '9:00 PM - 10:30 PM', time: '9:00 PM', durationSpan: 1.5, title: 'CRBC Nightly Network News', description: 'The definitive state news hour covering state administration decisions, commerce, and national affairs.' },
    { startMinutes: 1350, endMinutes: 1440, timeSlot: '10:30 PM - 12:00 AM', time: '10:30 PM', durationSpan: 1.5, title: 'Calabar Carnival & Cultural Heritage Extravaganza', description: 'Celebrating Africa’s biggest street party, traditional masquerades, Efik folklore, and Moninkim dance.' }
  ],

  'channels-tv': [
    { startMinutes: 0, endMinutes: 120, timeSlot: '12:00 AM - 2:00 AM', time: '12:00 AM', durationSpan: 2, title: 'Diplomatic Channel & Global Perspectives', description: 'Foreign relations, consular affairs, and diplomatic engagements in ECOWAS, African Union, and worldwide.' },
    { startMinutes: 120, endMinutes: 270, timeSlot: '2:00 AM - 4:30 AM', time: '2:00 AM', durationSpan: 2, title: 'Channels Overnight News Track & Global Briefing', description: 'Overnight recap of Nigerian security, economy, National Assembly hearings, and global partner updates.' },
    { startMinutes: 270, endMinutes: 360, timeSlot: '4:30 AM - 6:00 AM', time: '4:30 AM', durationSpan: 1.5, title: 'Business Morning Early Edition', description: 'Pre-market analysis of the Nigerian Stock Exchange (NGX), central bank monetary policies, and commodities.' },
    { startMinutes: 360, endMinutes: 540, timeSlot: '6:00 AM - 9:00 AM', time: '6:00 AM', durationSpan: 2, title: 'Sunrise Daily Live Breakfast Show', description: 'Nigeria’s premier morning public affairs show tackling governance, socio-economic debates, and breaking news.' },
    { startMinutes: 540, endMinutes: 660, timeSlot: '9:00 AM - 11:00 AM', time: '9:00 AM', durationSpan: 2, title: 'Business Morning with Boason Omofaye', description: 'Detailed market analysis, macro-economic indices, fiscal policies, and corporate earnings on the NGX.' },
    { startMinutes: 660, endMinutes: 720, timeSlot: '11:00 AM - 12:00 PM', time: '11:00 AM', durationSpan: 1, title: 'Earthfile & Environmental Perspectives', description: 'Investigating ecological conservation, oil spillage remedies in the Niger Delta, and renewable clean energy.' },
    { startMinutes: 720, endMinutes: 810, timeSlot: '12:00 PM - 1:30 PM', time: '12:00 PM', durationSpan: 1.5, title: 'Channels News Track Live at Midday', description: 'Live nationwide bulletin from Abuja and Lagos studios covering politics, security, and courts.' },
    { startMinutes: 810, endMinutes: 930, timeSlot: '1:30 PM - 3:30 PM', time: '1:30 PM', durationSpan: 2, title: 'Dateline Abuja & State House Focus', description: 'Inside the Presidency, Federal Executive Council deliberations, and ministerial policies.' },
    { startMinutes: 930, endMinutes: 1020, timeSlot: '3:30 PM - 5:00 PM', time: '3:30 PM', durationSpan: 1.5, title: 'The Gavel: National Assembly Under Review', description: 'Scrutinizing bills, motions, and oversight committee hearings from the Senate and House of Representatives.' },
    { startMinutes: 1020, endMinutes: 1140, timeSlot: '5:00 PM - 7:00 PM', time: '5:00 PM', durationSpan: 2, title: 'News Track Primetime Bulletin', description: 'Comprehensive nationwide news broadcast covering high-level politics, security, and foreign affairs.' },
    { startMinutes: 1140, endMinutes: 1260, timeSlot: '7:00 PM - 9:00 PM', time: '7:00 PM', durationSpan: 2, title: 'Politics Today with Seun Okinbaloye', description: 'Nigeria’s highest-rated political debate show confronting key state and federal policymakers, governors, and analysts.' },
    { startMinutes: 1260, endMinutes: 1350, timeSlot: '9:00 PM - 10:30 PM', time: '9:00 PM', durationSpan: 1.5, title: 'The News at 10 (Flagship Live Broadcast)', description: 'Multi-award winning flagship broadcast detailing the most significant national and international events of the day.' },
    { startMinutes: 1350, endMinutes: 1440, timeSlot: '10:30 PM - 12:00 AM', time: '10:30 PM', durationSpan: 1.5, title: 'Hard Copy with Maupe Ogun-Yusuf', description: 'Uncompromising investigative conversations interrogating national security, public audits, and policy.' }
  ],

  'arise-news': [
    { startMinutes: 0, endMinutes: 180, timeSlot: '12:00 AM - 3:00 AM', time: '12:00 AM', durationSpan: 2, title: 'ARISE Global Live: London & Washington Nightcap', description: 'Live reporting from the Arise News London studios covering international diplomatic relations, African trade, and Wall Street.' },
    { startMinutes: 180, endMinutes: 360, timeSlot: '3:00 AM - 6:00 AM', time: '3:00 AM', durationSpan: 2, title: 'The World Today: Overnight African Analysis', description: 'Comprehensive continental news digest analyzing African Union policies, currency movements, and elections.' },
    { startMinutes: 360, endMinutes: 600, timeSlot: '6:00 AM - 10:00 AM', time: '6:00 AM', durationSpan: 2, title: 'The Morning Show with Dr. Reuben Abati & Rufai Oseni', description: 'Passionate live debate and incisive political cross-examination with Dr. Reuben Abati, Rufai Oseni, and Ayo Mairo-Ese.' },
    { startMinutes: 600, endMinutes: 720, timeSlot: '10:00 AM - 12:00 PM', time: '10:00 AM', durationSpan: 2, title: 'Global Business Report with Boason Omofaye', description: 'In-depth financial intelligence, commodities, African Continental Free Trade Area (AfCFTA), and sovereign debt.' },
    { startMinutes: 720, endMinutes: 840, timeSlot: '12:00 PM - 2:00 PM', time: '12:00 PM', durationSpan: 2, title: 'ARISE NewsDay Live Bulletin', description: 'Midday breaking news coverage from Lagos, Abuja, London, and Johannesburg newsrooms.' },
    { startMinutes: 840, endMinutes: 960, timeSlot: '2:00 PM - 4:00 PM', time: '2:00 PM', durationSpan: 2, title: 'Perspective with Charles Aniagolu', description: 'In-depth interviews with global African changemakers, scholars, writers, and cultural icons.' },
    { startMinutes: 960, endMinutes: 1080, timeSlot: '4:00 PM - 6:00 PM', time: '4:00 PM', durationSpan: 2, title: 'NewsNight Early Digest & Judiciary Monitor', description: 'Reporting on landmark Supreme Court decisions, anti-corruption hearings, and electoral petitions.' },
    { startMinutes: 1080, endMinutes: 1200, timeSlot: '6:00 PM - 8:00 PM', time: '6:00 PM', durationSpan: 2, title: 'ThisDay Live & Special Reports', description: 'High-level policy dialogue connecting business moguls, senators, and public administrators.' },
    { startMinutes: 1200, endMinutes: 1320, timeSlot: '8:00 PM - 10:00 PM', time: '8:00 PM', durationSpan: 2, title: 'ARISE Primetime News Hour', description: 'Authoritative evening broadcast reviewing the day’s paramount national headlines, governance, and business.' },
    { startMinutes: 1320, endMinutes: 1440, timeSlot: '10:00 PM - 12:00 AM', time: '10:00 PM', durationSpan: 2, title: 'The Morning Show Nightcap & Late Analysis', description: 'Late evening recap of the most talked-about moments, fiery studio exchanges, and citizen reactions.' }
  ],

  'tvc-news': [
    { startMinutes: 0, endMinutes: 180, timeSlot: '12:00 AM - 3:00 AM', time: '12:00 AM', durationSpan: 2, title: 'TVC Midnight World Round-Up', description: 'Late night international news review connecting Nigerian viewers to global headlines and regional developments.' },
    { startMinutes: 180, endMinutes: 360, timeSlot: '3:00 AM - 6:00 AM', time: '3:00 AM', durationSpan: 2, title: 'Dawn Digest & Community Voice', description: 'Grassroots reporting from Lagos, Ogun, Oyo, Rivers, and Kano on community infrastructure and public utilities.' },
    { startMinutes: 360, endMinutes: 540, timeSlot: '6:00 AM - 9:00 AM', time: '6:00 AM', durationSpan: 2, title: 'Your View (Breakfast Talk Show)', description: 'Dynamic and empowering female-led breakfast talk show discussing societal welfare, relationships, and governance.' },
    { startMinutes: 540, endMinutes: 660, timeSlot: '9:00 AM - 11:00 AM', time: '9:00 AM', durationSpan: 2, title: 'TVC Business Nigeria', description: 'Comprehensive look at MSMEs, exchange rates, corporate investments, and consumer rights.' },
    { startMinutes: 660, endMinutes: 780, timeSlot: '11:00 AM - 1:00 PM', time: '11:00 AM', durationSpan: 2, title: 'TVC News at 12 & Crime Check', description: 'Midday news bulletin spotlighting state security, police community relations, and law enforcement reforms.' },
    { startMinutes: 780, endMinutes: 900, timeSlot: '1:00 PM - 3:00 PM', time: '1:00 PM', durationSpan: 2, title: 'StandPoint with TVC Correspondents', description: 'In-depth reporting from TVC correspondents deployed across all 36 states of the federation.' },
    { startMinutes: 900, endMinutes: 1020, timeSlot: '3:00 PM - 5:00 PM', time: '3:00 PM', durationSpan: 2, title: 'Entertainment Splash & Nollywood Buzz', description: 'The latest updates from Nollywood film premieres, music concerts, and celebrity lifestyle.' },
    { startMinutes: 1020, endMinutes: 1140, timeSlot: '5:00 PM - 7:00 PM', time: '5:00 PM', durationSpan: 2, title: 'Journalists’ Hangout (Flagship Analysis)', description: 'Nigeria’s most watched public affairs program featuring veteran journalists Babajide Kolade-Otitoju and guests.' },
    { startMinutes: 1140, endMinutes: 1260, timeSlot: '7:00 PM - 9:00 PM', time: '7:00 PM', durationSpan: 2, title: 'TVC News at 7 (Primetime Live)', description: 'Flagship primetime news covering state executive decisions, National Assembly legislative acts, and diplomacy.' },
    { startMinutes: 1260, endMinutes: 1350, timeSlot: '9:00 PM - 10:30 PM', time: '9:00 PM', durationSpan: 1.5, title: 'Journalists’ Hangout Night Edition', description: 'Extended investigative debrief examining national security, defence spending, and democratic governance.' },
    { startMinutes: 1350, endMinutes: 1440, timeSlot: '10:30 PM - 12:00 AM', time: '10:30 PM', durationSpan: 1.5, title: 'Behind the Headlines & Nightly Recap', description: 'Final recap of critical events that shaped the nation’s social and political landscape.' }
  ],

  'nta-network': [
    { startMinutes: 0, endMinutes: 180, timeSlot: '12:00 AM - 3:00 AM', time: '12:00 AM', durationSpan: 2, title: 'NTA Cultural Showcase: Unity in Diversity', description: 'Traditional arts, tribal dances, and documentary preservation of Nigerian cultural heritage.' },
    { startMinutes: 180, endMinutes: 360, timeSlot: '3:00 AM - 6:00 AM', time: '3:00 AM', durationSpan: 2, title: 'NTA Agro-Nigeria & Agricultural Revolution', description: 'Showcasing food security projects, grain farming, cassava processing, and farmer cooperatives.' },
    { startMinutes: 360, endMinutes: 540, timeSlot: '6:00 AM - 9:00 AM', time: '6:00 AM', durationSpan: 2, title: 'Good Morning Nigeria (Live from Abuja)', description: 'The nation’s primary state breakfast forum bringing federal ministers, parastatals, and civil society together.' },
    { startMinutes: 540, endMinutes: 660, timeSlot: '9:00 AM - 11:00 AM', time: '9:00 AM', durationSpan: 2, title: 'NTA Network Mid-Morning News', description: 'Federal news summaries from the NTA Abuja International Media Centre.' },
    { startMinutes: 660, endMinutes: 780, timeSlot: '11:00 AM - 1:00 PM', time: '11:00 AM', durationSpan: 2, title: 'One Nigeria: States & Community Development', description: 'Tracking constituency projects, hospital equipment upgrades, and education across geopolitical zones.' },
    { startMinutes: 780, endMinutes: 900, timeSlot: '1:00 PM - 3:00 PM', time: '1:00 PM', durationSpan: 2, title: 'NTA News 24 Midday Digest', description: 'Live broadcast connecting regional NTA stations from Kaduna, Enugu, Ibadan, Maiduguri, and Port Harcourt.' },
    { startMinutes: 900, endMinutes: 1020, timeSlot: '3:00 PM - 5:00 PM', time: '3:00 PM', durationSpan: 2, title: 'Tales by Moonlight & Heritage Dramas', description: 'Classic Nigerian folk tales, morality plays, and educational children’s cultural programming.' },
    { startMinutes: 1020, endMinutes: 1140, timeSlot: '5:00 PM - 7:00 PM', time: '5:00 PM', durationSpan: 2, title: 'Panorama Live Network Feed', description: 'Comprehensive national overview with special focus on security forces, military updates, and peace missions.' },
    { startMinutes: 1140, endMinutes: 1260, timeSlot: '7:00 PM - 9:00 PM', time: '7:00 PM', durationSpan: 2, title: 'NTA Network News at 9 (Flagship)', description: 'Nigeria’s historic flagship national network news broadcast, reaching millions across all 774 local governments.' },
    { startMinutes: 1260, endMinutes: 1350, timeSlot: '9:00 PM - 10:30 PM', time: '9:00 PM', durationSpan: 1.5, title: 'Federal Focus & Policy Watch', description: 'In-depth interviews with heads of government agencies, armed forces chiefs, and international dignitaries.' },
    { startMinutes: 1350, endMinutes: 1440, timeSlot: '10:30 PM - 12:00 AM', time: '10:30 PM', durationSpan: 1.5, title: 'NTA Late Edition & State House Roundup', description: 'Reviewing presidential executive orders, bilateral summits, and official state gazettes.' }
  ],

  'silverbird-tv': [
    { startMinutes: 0, endMinutes: 180, timeSlot: '12:00 AM - 3:00 AM', time: '12:00 AM', durationSpan: 2, title: 'Silverbird Midnight Movie Cinema', description: 'Contemporary Nollywood blockbusters and African cinematic indie features.' },
    { startMinutes: 180, endMinutes: 360, timeSlot: '3:00 AM - 6:00 AM', time: '3:00 AM', durationSpan: 2, title: 'Silverbird Rhythm Beats', description: 'Non-stop Afrobeats music videos and DJ mixes from the Silverbird media library.' },
    { startMinutes: 360, endMinutes: 540, timeSlot: '6:00 AM - 9:00 AM', time: '6:00 AM', durationSpan: 2, title: 'Silverbird Today: Breakfast Edition', description: 'Urban lifestyle, beauty pageantry news, entertainment interviews, and morning news headlines.' },
    { startMinutes: 540, endMinutes: 720, timeSlot: '9:00 AM - 12:00 PM', time: '9:00 AM', durationSpan: 2, title: 'Most Beautiful Girl in Nigeria (MBGN) Spotlight', description: 'Archive and live preparations for the annual MBGN pageant and Miss Universe/Miss World delegates.' },
    { startMinutes: 720, endMinutes: 840, timeSlot: '12:00 PM - 2:00 PM', time: '12:00 PM', durationSpan: 2, title: 'Silverbird Midday News Track', description: 'Fast-paced business and national news summary.' },
    { startMinutes: 840, endMinutes: 1020, timeSlot: '2:00 PM - 5:00 PM', time: '2:00 PM', durationSpan: 2, title: 'Silverbird Entertainment Countdown', description: 'Chart rankings of the top 20 music tracks in Africa, movie trailers, and red carpet gossip.' },
    { startMinutes: 1020, endMinutes: 1200, timeSlot: '5:00 PM - 8:00 PM', time: '5:00 PM', durationSpan: 2, title: 'Silverbird Prime News Live', description: 'Evening news delivery focusing on commerce, entertainment industry legislation, and national updates.' },
    { startMinutes: 1200, endMinutes: 1320, timeSlot: '8:00 PM - 10:00 PM', time: '8:00 PM', durationSpan: 2, title: 'Laughter Unlimited: Stand-Up Comedy', description: 'Live performances from Nigeria’s celebrated comedians at Silverbird Cinemas.' },
    { startMinutes: 1320, endMinutes: 1440, timeSlot: '10:00 PM - 12:00 AM', time: '10:00 PM', durationSpan: 2, title: 'Late Night Cinema & Celebrity Talk', description: 'Unfiltered celebrity conversation and premiere short films.' }
  ],

  'soundcity-tv': [
    { startMinutes: 0, endMinutes: 180, timeSlot: '12:00 AM - 3:00 AM', time: '12:00 AM', durationSpan: 2, title: 'Midnight Afrobeats Jam Sessions', description: 'High-energy Afropop, Amapiano, and street-hop music videos.' },
    { startMinutes: 180, endMinutes: 360, timeSlot: '3:00 AM - 6:00 AM', time: '3:00 AM', durationSpan: 2, title: 'Soundcity Non-Stop Club Mixes', description: 'Exclusive DJ sets from top Lagos and diaspora nightclub resident DJs.' },
    { startMinutes: 360, endMinutes: 540, timeSlot: '6:00 AM - 9:00 AM', time: '6:00 AM', durationSpan: 2, title: 'Soundcity Rise & Grind', description: 'Uplifting morning Afrobeats rhythms to kickstart the day.' },
    { startMinutes: 540, endMinutes: 720, timeSlot: '9:00 AM - 12:00 PM', time: '9:00 AM', durationSpan: 2, title: 'Soundcity Top 10 Naija Countdown', description: 'Daily countdown of Nigeria’s most streamed songs across digital platforms.' },
    { startMinutes: 720, endMinutes: 900, timeSlot: '12:00 PM - 3:00 PM', time: '12:00 PM', durationSpan: 2, title: 'Soundcity VIP: Artist In The Studio', description: 'Exclusive intimate acoustic performances and interviews with Afrobeats superstars.' },
    { startMinutes: 900, endMinutes: 1080, timeSlot: '3:00 PM - 6:00 PM', time: '3:00 PM', durationSpan: 2, title: 'Soundcity Global Chart Show', description: 'Tracking African crossover hits in the UK Official Charts, US Billboard Afrobeats, and European charts.' },
    { startMinutes: 1080, endMinutes: 1260, timeSlot: '6:00 PM - 9:00 PM', time: '6:00 PM', durationSpan: 2, title: 'Soundcity MVP Special', description: 'Showcasing nominees, historic performances, and stage designs from the Soundcity MVP Awards Festival.' },
    { startMinutes: 1260, endMinutes: 1440, timeSlot: '9:00 PM - 12:00 AM', time: '9:00 PM', durationSpan: 2, title: 'Late Night Afrobeats Party', description: 'Weekend energy every night with live dance battles and premiere music video drops.' }
  ],

  'wazobia-max': [
    { startMinutes: 0, endMinutes: 180, timeSlot: '12:00 AM - 3:00 AM', time: '12:00 AM', durationSpan: 2, title: 'Wazobia Kulele Night Jam', description: 'Pidgin comedy sketches, street street jokes, and highlife classic dance tunes.' },
    { startMinutes: 180, endMinutes: 360, timeSlot: '3:00 AM - 6:00 AM', time: '3:00 AM', durationSpan: 2, title: 'Wazobia Praise & Thanksgiving', description: 'Soul-stirring indigenous gospel music from Eastern and Western Nigeria.' },
    { startMinutes: 360, endMinutes: 540, timeSlot: '6:00 AM - 9:00 AM', time: '6:00 AM', durationSpan: 2, title: 'Una Wake Up? (Morning Pidgin Show)', description: 'Lively morning breakfast talk in pure Pidgin English with traffic reports and market prices.' },
    { startMinutes: 540, endMinutes: 720, timeSlot: '9:00 AM - 12:00 PM', time: '9:00 AM', durationSpan: 2, title: 'Wazobia Market Palava', description: 'Live on-the-ground reports from Balogun, Bodija, and Main Market Onitsha on commodity prices.' },
    { startMinutes: 720, endMinutes: 900, timeSlot: '12:00 PM - 3:00 PM', time: '12:00 PM', durationSpan: 2, title: 'Wazobia Tori at Noon (Pidgin News)', description: 'Straight-talking, authentic news translation breaking down complex government policies into clear Pidgin.' },
    { startMinutes: 900, endMinutes: 1080, timeSlot: '3:00 PM - 6:00 PM', time: '3:00 PM', durationSpan: 2, title: 'Ogbonge Comedy Showcase', description: 'Top Nigerian comedy festival stand-up clips and sketch comedy.' },
    { startMinutes: 1080, endMinutes: 1260, timeSlot: '6:00 PM - 9:00 PM', time: '6:00 PM', durationSpan: 2, title: 'Wazobia Evening Tori Live', description: 'Flagship evening news bulletin in Pidgin covering national security, football, and community triumphs.' },
    { startMinutes: 1260, endMinutes: 1440, timeSlot: '9:00 PM - 12:00 AM', time: '9:00 PM', durationSpan: 2, title: 'Night Time Palava with Wazobia All-Stars', description: 'Late evening relationship debates, caller confessions, and soothing Afrobeats.' }
  ],

  'ait-network': [
    { startMinutes: 0, endMinutes: 180, timeSlot: '12:00 AM - 3:00 AM', time: '12:00 AM', durationSpan: 2, title: 'AIT African World Nightly Roundup', description: 'Reviewing news across ECOWAS, SADC, and East African Community member states.' },
    { startMinutes: 180, endMinutes: 360, timeSlot: '3:00 AM - 6:00 AM', time: '3:00 AM', durationSpan: 2, title: 'AIT Documentary: The African Experience', description: 'Documenting the liberation struggles, cultural roots, and great leaders of Africa.' },
    { startMinutes: 360, endMinutes: 540, timeSlot: '6:00 AM - 9:00 AM', time: '6:00 AM', durationSpan: 2, title: 'Kakaaki: The African Voice (Live from Abuja)', description: 'Nigeria’s iconic morning current affairs broadcast featuring political debates and social commentary.' },
    { startMinutes: 540, endMinutes: 720, timeSlot: '9:00 AM - 12:00 PM', time: '9:00 AM', durationSpan: 2, title: 'AIT Business & Economic Review', description: 'Analyzing the Nigerian exchange rate, oil benchmarks, and manufacturing sector reports.' },
    { startMinutes: 720, endMinutes: 840, timeSlot: '12:00 PM - 2:00 PM', time: '12:00 PM', durationSpan: 2, title: 'AIT Midday News Live', description: 'Direct news coverage from DAAR Communications headquarters in Abuja.' },
    { startMinutes: 840, endMinutes: 1020, timeSlot: '2:00 PM - 5:00 PM', time: '2:00 PM', durationSpan: 2, title: 'Democracy Today & Governance Review', description: 'Assessing democratic institutions, judicial independence, and rule of law across Nigerian states.' },
    { startMinutes: 1020, endMinutes: 1200, timeSlot: '5:00 PM - 8:00 PM', time: '5:00 PM', durationSpan: 2, title: 'AIT Primetime News Bulletin', description: 'Comprehensive national broadcast covering the Federal Executive Council, military updates, and politics.' },
    { startMinutes: 1200, endMinutes: 1320, timeSlot: '8:00 PM - 10:00 PM', time: '8:00 PM', durationSpan: 2, title: 'Focus Nigeria with Gbenga Aruleba', description: 'Hard-hitting political interrogation confronting governors, ministers, and opposition leaders.' },
    { startMinutes: 1320, endMinutes: 1440, timeSlot: '10:00 PM - 12:00 AM', time: '10:00 PM', durationSpan: 2, title: 'AIT Late Night African News Hour', description: 'Late night summary of Pan-African commerce, diplomatic affairs, and sports victories.' }
  ],

  'news-central': [
    { startMinutes: 0, endMinutes: 180, timeSlot: '12:00 AM - 3:00 AM', time: '12:00 AM', durationSpan: 2, title: 'Central Nightcap & African Perspectives', description: 'Late night continental analysis, diplomatic developments, and Pan-African viewpoints.' },
    { startMinutes: 180, endMinutes: 360, timeSlot: '3:00 AM - 6:00 AM', time: '3:00 AM', durationSpan: 2, title: 'Dawn Dispatch: Africa Live Overview', description: 'Early morning news roundup across East, West, Central, and Southern African capitals.' },
    { startMinutes: 360, endMinutes: 540, timeSlot: '6:00 AM - 9:00 AM', time: '6:00 AM', durationSpan: 2, title: 'The Breakfast Central (Live Morning Broadcast)', description: 'Pan-African flagship breakfast show discussing politics, continental trade, civil rights, and social transformation.' },
    { startMinutes: 540, endMinutes: 660, timeSlot: '9:00 AM - 11:00 AM', time: '9:00 AM', durationSpan: 2, title: 'Central Business Exchange', description: 'Tracking African sovereign wealth, AfCFTA trade pacts, commodities, and financial technology.' },
    { startMinutes: 660, endMinutes: 780, timeSlot: '11:00 AM - 1:00 PM', time: '11:00 AM', durationSpan: 2, title: 'Jasiri: African Women Trailblazers', description: 'Spotlighting inspiring female African innovators, political leaders, and grassroots community changemakers.' },
    { startMinutes: 780, endMinutes: 900, timeSlot: '1:00 PM - 3:00 PM', time: '1:00 PM', durationSpan: 2, title: 'Central NewsLive at Midday', description: 'Live news reports streaming from newsrooms in Lagos, Nairobi, Johannesburg, and Accra.' },
    { startMinutes: 900, endMinutes: 1020, timeSlot: '3:00 PM - 5:00 PM', time: '3:00 PM', durationSpan: 2, title: 'Inside Out with Central Correspondents', description: 'Investigative reporting on public health, infrastructure challenges, and democratic freedoms.' },
    { startMinutes: 1020, endMinutes: 1140, timeSlot: '5:00 PM - 7:00 PM', time: '5:00 PM', durationSpan: 2, title: 'Eco Africa & Climate Horizon', description: 'Focusing on clean energy, climate action, wildlife preservation, and agricultural innovation across Africa.' },
    { startMinutes: 1140, endMinutes: 1260, timeSlot: '7:00 PM - 9:00 PM', time: '7:00 PM', durationSpan: 2, title: 'Politics 360: Pan-African Policy Forum', description: 'Critical political dissection confronting diplomats, policy advisers, and civil society advocates.' },
    { startMinutes: 1260, endMinutes: 1350, timeSlot: '9:00 PM - 10:30 PM', time: '9:00 PM', durationSpan: 1.5, title: 'Central Primetime News Bulletin (The Center Hour)', description: 'Authoritative evening news broadcast breaking down the defining global and continental events.' },
    { startMinutes: 1350, endMinutes: 1440, timeSlot: '10:30 PM - 12:00 AM', time: '10:30 PM', durationSpan: 1.5, title: 'Behind the Headlines & Night Debrief', description: 'Analytical recap and sharp commentary with senior News Central broadcast editors.' }
  ],

  'trust-tv': [
    { startMinutes: 0, endMinutes: 180, timeSlot: '12:00 AM - 3:00 AM', time: '12:00 AM', durationSpan: 2, title: 'Trust TV Midnight World & Continental Digest', description: 'In-depth review of major international headlines and bilateral cooperation in the African region.' },
    { startMinutes: 180, endMinutes: 360, timeSlot: '3:00 AM - 6:00 AM', time: '3:00 AM', durationSpan: 2, title: 'Dawn Perspectives & Grassroots Digest', description: 'Early morning community issues, agrarian reports, and public utilities across Northern Nigeria.' },
    { startMinutes: 360, endMinutes: 540, timeSlot: '6:00 AM - 9:00 AM', time: '6:00 AM', durationSpan: 2, title: 'Trust TV Breakfast (Live from Abuja)', description: 'Comprehensive morning public affairs discussion confronting governance, national security, and legal reforms.' },
    { startMinutes: 540, endMinutes: 660, timeSlot: '9:00 AM - 11:00 AM', time: '9:00 AM', durationSpan: 2, title: 'Trust Business Monitor', description: 'Scrutinizing northern commerce, grain markets, mining investments, and SME financing across Nigeria.' },
    { startMinutes: 660, endMinutes: 780, timeSlot: '11:00 AM - 1:00 PM', time: '11:00 AM', durationSpan: 2, title: 'Security & Peace: National Defence Forum', description: 'In-depth assessments of counter-insurgency operations, peacebuilding dialogues, and border security.' },
    { startMinutes: 780, endMinutes: 900, timeSlot: '1:00 PM - 3:00 PM', time: '1:00 PM', durationSpan: 2, title: 'Midday News Bulletin Live from FCT', description: 'Live reporting from the Federal Capital Territory, National Assembly, and state capitals.' },
    { startMinutes: 900, endMinutes: 1020, timeSlot: '3:00 PM - 5:00 PM', time: '3:00 PM', durationSpan: 2, title: 'Focus on the States & Constituency Watch', description: 'Tracking governor performance, rural roads, hospital services, and education in the 36 states.' },
    { startMinutes: 1020, endMinutes: 1140, timeSlot: '5:00 PM - 7:00 PM', time: '5:00 PM', durationSpan: 2, title: 'Issues in the News with Media Trust Editors', description: 'Veteran journalists debate contentious national policies, executive decrees, and public integrity.' },
    { startMinutes: 1140, endMinutes: 1260, timeSlot: '7:00 PM - 9:00 PM', time: '7:00 PM', durationSpan: 2, title: 'Daily Politics with Media Trust Editors', description: 'Uncompromising political interrogations with party chieftains, ministers, and legal experts.' },
    { startMinutes: 1260, endMinutes: 1350, timeSlot: '9:00 PM - 10:30 PM', time: '9:00 PM', durationSpan: 1.5, title: 'Trust TV News at 9 (Flagship Evening Broadcast)', description: 'Credible, investigative nightly news delivering balanced reporting from all six geopolitical zones.' },
    { startMinutes: 1350, endMinutes: 1440, timeSlot: '10:30 PM - 12:00 AM', time: '10:30 PM', durationSpan: 1.5, title: 'Late Night Investigative Documentary', description: 'Award-winning investigative documentaries revealing untold human stories from northern Nigeria and beyond.' }
  ]
};

// Calculate active program and remaining schedule based on current WAT time
export function getChannelCurrentWatProgram(channelId, watDate = getWestAfricaTime()) {
  const schedule = CHANNEL_24H_SCHEDULES[channelId] || CHANNEL_24H_SCHEDULES['channels-tv'];
  const hours = watDate.getHours();
  const minutes = watDate.getMinutes();
  const currentMinutes = hours * 60 + minutes;

  // Find the program encompassing currentMinutes
  let activeIndex = schedule.findIndex((p) => currentMinutes >= p.startMinutes && currentMinutes < p.endMinutes);
  if (activeIndex === -1) {
    activeIndex = 0;
  }

  const active = schedule[activeIndex];
  const duration = active.endMinutes - active.startMinutes;
  const elapsed = currentMinutes - active.startMinutes;
  const progressPercent = Math.max(5, Math.min(100, Math.round((elapsed / duration) * 100)));
  const minutesRemaining = Math.max(1, active.endMinutes - currentMinutes);
  const timeLeft = minutesRemaining >= 60 
    ? `${Math.floor(minutesRemaining / 60)}h ${minutesRemaining % 60}m left`
    : `${minutesRemaining} min left`;

  // Programs for the rest of today
  const upcomingToday = schedule.slice(activeIndex + 1);

  return {
    activeProgram: {
      ...active,
      progressPercent,
      timeLeft,
    },
    upcomingToday,
    allPrograms: schedule,
    activeIndex,
    watTimeString: formatWatTime(watDate),
  };
}
