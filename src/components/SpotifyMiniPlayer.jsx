import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Plus } from 'lucide-react';

// CSV data embedded directly
const csvText = `"Track URI","Track Name","Artist URI(s)","Artist Name(s)","Album URI","Album Name","Album Artist URI(s)","Album Artist Name(s)","Album Release Date","Album Image URL","Disc Number","Track Number","Track Duration (ms)","Track Preview URL","Explicit","Popularity","ISRC","Added By","Added At"
"spotify:track:0bORa4VpL8NzyMXEI6UFGK","Long Road To Ruin","spotify:artist:7jy3rLJdDQY21OgRLCZ9sD","Foo Fighters","spotify:album:3ilXDEG0xiajK8AbqboeJz","Echoes, Silence, Patience & Grace","spotify:artist:7jy3rLJdDQY21OgRLCZ9sD","Foo Fighters","2007-09-25","https://i.scdn.co/image/ab67616d0000b2739d957247c6c610cb7c4da1c5","1","4","224804","https://p.scdn.co/mp3-preview/98f670237c4edaedf9e244f7c30d7d823d13a00c?cid=9950ac751e34487dbbe027c4fd7f8e99","false","59","USRW30700010","spotify:user:212evkjibuisarid6stvinxoq","2026-03-18T19:52:24Z"
"spotify:track:4NPI2n6mINvcgNejPefpoY","Lonely As You","spotify:artist:7jy3rLJdDQY21OgRLCZ9sD","Foo Fighters","spotify:album:1zQ6F8gMagKcPL4SoA80cx","One By One (Expanded Edition)","spotify:artist:7jy3rLJdDQY21OgRLCZ9sD","Foo Fighters","2002-10-22","https://i.scdn.co/image/ab67616d0000b273bfff163b0602156a983fa079","1","8","277146","https://p.scdn.co/mp3-preview/08f76b523c82d3ca902ab074ab9effbb1beb2296?cid=9950ac751e34487dbbe027c4fd7f8e99","false","40","USRW30200009","spotify:user:212evkjibuisarid6stvinxoq","2026-03-18T19:52:29Z"
"spotify:track:2XvrMHbSO077Ajg7QTTNdY","Let It Die","spotify:artist:7jy3rLJdDQY21OgRLCZ9sD","Foo Fighters","spotify:album:3ilXDEG0xiajK8AbqboeJz","Echoes, Silence, Patience & Grace","spotify:artist:7jy3rLJdDQY21OgRLCZ9sD","Foo Fighters","2007-09-25","https://i.scdn.co/image/ab67616d0000b2739d957247c6c610cb7c4da1c5","1","2","245269","https://p.scdn.co/mp3-preview/706f37e35dee5498e0a0f4161e20388183c5db85?cid=9950ac751e34487dbbe027c4fd7f8e99","false","57","USRW30700008","spotify:user:212evkjibuisarid6stvinxoq","2026-03-18T19:53:11Z"
"spotify:track:5TOYgNohZAFEPOtnchPhZS","Arlandria","spotify:artist:7jy3rLJdDQY21OgRLCZ9sD","Foo Fighters","spotify:album:5lnQLEUiVDkLbFJHXHQu9m","Wasting Light","spotify:artist:7jy3rLJdDQY21OgRLCZ9sD","Foo Fighters","2011-04-12","https://i.scdn.co/image/ab67616d0000b273fc14d5117520d5bce369a543","1","5","267445","https://p.scdn.co/mp3-preview/4108e874b02c7a800ec03f6a7a0a596d14662c36?cid=9950ac751e34487dbbe027c4fd7f8e99","false","59","USRW31100007","spotify:user:212evkjibuisarid6stvinxoq","2026-03-18T19:53:55Z"
"spotify:track:6HeFCUg1F1v0bnE3JFTlxz","Dear Rosemary","spotify:artist:7jy3rLJdDQY21OgRLCZ9sD","Foo Fighters","spotify:album:5lnQLEUiVDkLbFJHXHQu9m","Wasting Light","spotify:artist:7jy3rLJdDQY21OgRLCZ9sD","Foo Fighters","2011-04-12","https://i.scdn.co/image/ab67616d0000b273fc14d5117520d5bce369a543","1","3","265944","https://p.scdn.co/mp3-preview/71e8c471ffdf9c9d072e1aed08087a69d6842b2f?cid=9950ac751e34487dbbe027c4fd7f8e99","false","54","USRW31100005","spotify:user:212evkjibuisarid6stvinxoq","2026-03-18T19:54:12Z"
"spotify:track:7v0mtl6oInUtHOmTk2b0gC","Rope","spotify:artist:7jy3rLJdDQY21OgRLCZ9sD","Foo Fighters","spotify:album:5lnQLEUiVDkLbFJHXHQu9m","Wasting Light","spotify:artist:7jy3rLJdDQY21OgRLCZ9sD","Foo Fighters","2011-04-12","https://i.scdn.co/image/ab67616d0000b273fc14d5117520d5bce369a543","1","2","258039","https://p.scdn.co/mp3-preview/722daa3bbeda3be0598f02fc22fe8d504fcb6031?cid=9950ac751e34487dbbe027c4fd7f8e99","false","62","USRW31100001","spotify:user:212evkjibuisarid6stvinxoq","2026-03-18T19:54:22Z"
"spotify:track:76Je5Wklky23mVoxiRszcN","Walk","spotify:artist:7jy3rLJdDQY21OgRLCZ9sD","Foo Fighters","spotify:album:5lnQLEUiVDkLbFJHXHQu9m","Wasting Light","spotify:artist:7jy3rLJdDQY21OgRLCZ9sD","Foo Fighters","2011-04-12","https://i.scdn.co/image/ab67616d0000b273fc14d5117520d5bce369a543","1","11","257376","https://p.scdn.co/mp3-preview/dace3c68c15eefa3174dc096dfa9a37f837ed004?cid=9950ac751e34487dbbe027c4fd7f8e99","false","70","USRW31100002","spotify:user:212evkjibuisarid6stvinxoq","2026-03-18T19:54:29Z"
"spotify:track:0bHD1nLe7Nhw55ZGJ92332","Bridge Burning","spotify:artist:7jy3rLJdDQY21OgRLCZ9sD","Foo Fighters","spotify:album:5lnQLEUiVDkLbFJHXHQu9m","Wasting Light","spotify:artist:7jy3rLJdDQY21OgRLCZ9sD","Foo Fighters","2011-04-12","https://i.scdn.co/image/ab67616d0000b273fc14d5117520d5bce369a543","1","1","285825","https://p.scdn.co/mp3-preview/424abaa8fd2b04e124f3b4bf802a1773006deb8e?cid=9950ac751e34487dbbe027c4fd7f8e99","false","58","USRW31100004","spotify:user:212evkjibuisarid6stvinxoq","2026-03-18T19:54:54Z"
"spotify:track:46GHi1UJz1yEumZcMkbJN9","A Matter Of Time","spotify:artist:7jy3rLJdDQY21OgRLCZ9sD","Foo Fighters","spotify:album:5lnQLEUiVDkLbFJHXHQu9m","Wasting Light","spotify:artist:7jy3rLJdDQY21OgRLCZ9sD","Foo Fighters","2011-04-12","https://i.scdn.co/image/ab67616d0000b273fc14d5117520d5bce369a543","1","8","275437","https://p.scdn.co/mp3-preview/cd61fa622520c5d5ccd4ba6b28742af9a531cfb4?cid=9950ac751e34487dbbe027c4fd7f8e99","false","49","USRW31100010","spotify:user:212evkjibuisarid6stvinxoq","2026-03-18T19:55:20Z"`;

function parseCSV(csv) {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return [];

  // Parse header
  const headerLine = lines[0];
  const headers = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < headerLine.length; i++) {
    const char = headerLine[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      headers.push(current.replace(/"/g, '').trim());
      current = '';
    } else {
      current += char;
    }
  }
  headers.push(current.replace(/"/g, '').trim());

  const tracks = [];

  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const values = [];
    current = '';
    inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.replace(/"/g, '').trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.replace(/"/g, '').trim());

    if (values.length >= headers.length) {
      const track = {};
      headers.forEach((header, index) => {
        track[header] = values[index] || '';
      });

      if (track['Track Name'] && track['Track Preview URL']) {
        tracks.push({
          title: track['Track Name'],
          artist: track['Artist Name(s)'],
          albumArt: '/images/hand-disc.jpg',
          previewUrl: track['Track Preview URL']
        });
      }
    }
  }

  return tracks;
}

export default function SpotifyPlayer() {
  const [tracks, setTracks] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    try {
      const parsedTracks = parseCSV(csvText);
      console.log('Parsed tracks count:', parsedTracks.length);
      console.log('First track:', parsedTracks[0]);
      console.log('All tracks:', parsedTracks);
      setTracks(parsedTracks);
    } catch (error) {
      console.error('Error parsing CSV:', error);
    }
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    audioRef.current.muted = !isMuted;
  };

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const nextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIndex);
    if (isPlaying) {
      audioRef.current.src = tracks[nextIndex].previewUrl;
      audioRef.current.play();
    }
  };

  const prevTrack = () => {
    const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrackIndex(prevIndex);
    if (isPlaying) {
      audioRef.current.src = tracks[prevIndex].previewUrl;
      audioRef.current.play();
    }
  };

  const currentTrack = tracks.length > 0 ? tracks[currentTrackIndex] : { title: 'Loading...', artist: '', albumArt: '/images/hand-disc.jpg' };

  try {
    console.log('Rendering SpotifyPlayer, tracks:', tracks.length, 'currentTrackIndex:', currentTrackIndex);
    return (
      <>
        {/* Debug visible element */}
        <div style={{
          position: 'fixed',
          top: '50px',
          right: '50px',
          background: 'red',
          color: 'white',
          padding: '20px',
          zIndex: 10000,
          border: '2px solid yellow'
        }}>
          🎵 MUSIC PLAYER DEBUG<br/>
          Tracks: {tracks.length}<br/>
          Current: {currentTrack.title}<br/>
          Playing: {isPlaying ? 'YES' : 'NO'}
        </div>
        <audio
          ref={audioRef}
          src={currentTrack.previewUrl}
          onEnded={nextTrack}
          muted={isMuted}
        />
        <motion.div
          layout
          className={`fixed ${isMobile ? 'top-0 left-0 right-0' : 'bottom-20 left-1/2 -translate-x-1/2'} z-[9999] bg-red-500 border-4 border-yellow-400 rounded-2xl p-4 flex ${isMobile ? 'flex-col' : 'flex-row'} ${!isMobile && !isPlaying ? 'justify-center' : 'justify-between'} items-center max-w-md shadow-2xl`}
        >
          <div className="text-white font-bold text-lg mr-4">🎵 SPOTIFY PLAYER</div>
        {/* Album Art */}
        <motion.div
          className="relative w-12 h-12 rounded-full overflow-hidden"
          animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 2, repeat: isPlaying ? Infinity : 0, ease: 'linear' }}
        >
          <img
            src={currentTrack.albumArt}
            alt={`${currentTrack.title} by ${currentTrack.artist}`}
            className="w-full h-full object-cover"
          />
          {!isPlaying && !isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full"
            >
              <Play className="w-6 h-6 text-white cursor-pointer" onClick={togglePlay} />
            </motion.div>
          )}
        </motion.div>

        {/* Track Info */}
        <AnimatePresence>
          {(isMobile || isPlaying) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex-1 mx-4"
            >
              <p className="text-white text-sm font-semibold">{currentTrack.title}</p>
              <p className="text-gray-300 text-xs">{currentTrack.artist}</p>
              <p className="text-gray-400 text-xs">My Coding Beats</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <AnimatePresence>
          {((isMobile && isExpanded) || (!isMobile && isPlaying)) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center space-x-2"
            >
              <SkipBack className="w-5 h-5 text-white cursor-pointer hover:text-gray-300" onClick={prevTrack} />
              <motion.button
                onClick={togglePlay}
                className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-400"
                animate={isPlaying ? {
                  boxShadow: [
                    '0 0 0 0 rgba(34, 197, 94, 0.7)',
                    '0 0 0 10px rgba(34, 197, 94, 0)',
                    '0 0 0 0 rgba(34, 197, 94, 0.7)'
                  ]
                } : {}}
                transition={{ repeat: isPlaying ? Infinity : 0, duration: 1.5, ease: 'easeInOut' }}
              >
                {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
              </motion.button>
              <SkipForward className="w-5 h-5 text-white cursor-pointer hover:text-gray-300" onClick={nextTrack} />
              <motion.button
                onClick={toggleMute}
                className="w-5 h-5 text-white cursor-pointer hover:text-gray-300"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isMuted ? 'muted' : 'unmuted'}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isMuted ? <VolumeX /> : <Volume2 />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expand Button for Mobile */}
        {isMobile && !isExpanded && (
          <button onClick={toggleExpand} className="text-white ml-4">
            <Plus className="w-5 h-5" />
          </button>
        )}
      </motion.div>
    </>
  );
  } catch (error) {
    console.error('Error rendering SpotifyPlayer:', error);
    return <div style={{ color: 'red', position: 'fixed', top: '10px', right: '10px', zIndex: 10000 }}>Error loading player</div>;
  }
}