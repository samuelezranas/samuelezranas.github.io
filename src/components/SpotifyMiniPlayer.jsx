import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, Volume2, VolumeX } from 'lucide-react';

// Embedded CSV data for Foo Fighters tracks
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

// CSV Parser
function parseCSV(csv) {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return [];

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
          albumArt: '/packages/images/hand-disc.jpg',
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
  const [isMobile, setIsMobile] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  // Path gambar disesuaikan dengan folder proyekmu
  const DISC_IMAGE = '/packages/images/hand-disc.jpg'; 

  useEffect(() => {
    const parsedTracks = parseCSV(csvText);
    setTracks(parsedTracks);
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const updateProgress = () => {
        if (!isNaN(audio.duration)) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      };
      audio.addEventListener('timeupdate', updateProgress);
      return () => audio.removeEventListener('timeupdate', updateProgress);
    }
  }, [isPlaying]);

  const togglePlay = (e) => {
    if (e) e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(err => console.log("User interaction needed"));
      setIsPlaying(true);
    }
  };

  const nextTrack = () => {
    if (tracks.length === 0) return;
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIndex);
    
    // Reset progress & play next
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.src = tracks[nextIndex].previewUrl;
        if (isPlaying) audioRef.current.play();
      }
    }, 100);
  };

  // Safety Check agar tidak error saat tracks kosong
  if (tracks.length === 0) return null;

  const currentTrack = tracks[currentTrackIndex];

  return (
    <>
      <audio
        ref={audioRef}
        src={currentTrack.previewUrl}
        onEnded={nextTrack}
        muted={isMuted}
      />
      <motion.div
        layout
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`fixed z-[9999] transition-all duration-500 ease-in-out ${
          isMobile
            ? 'top-0 left-0 w-full bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-purple-500/20'
            : isPlaying
            ? 'bottom-8 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(168,85,247,0.4)] rounded-full px-4 py-2'
            : 'bottom-8 left-1/2 -translate-x-1/2 w-[70px] h-[70px] rounded-full bg-purple-600/20 backdrop-blur-lg border border-purple-500/30 flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95'
        }`}
        onClick={!isMobile && !isPlaying ? togglePlay : undefined}
      >
        <AnimatePresence mode="wait">
          {isMobile ? (
             /* Mobile View - Top Navbar */
            <motion.div key="mobile" className="flex items-center justify-between px-4 py-3 w-full">
               <div className="flex items-center space-x-3 overflow-hidden">
                <div className="relative w-10 h-10 flex-shrink-0">
                  <motion.img
                    animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    src={DISC_IMAGE}
                    className="w-full h-full rounded-full border-2 border-purple-500/50 object-cover"
                  />
                  <div className="absolute inset-0 m-auto w-2 h-2 bg-[#0a0a0a] rounded-full border border-white/20" />
                </div>
                <div className="truncate">
                  <p className="text-white text-xs font-bold truncate">{currentTrack.title}</p>
                  <p className="text-purple-400 text-[10px] truncate">{currentTrack.artist}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button onClick={togglePlay} className="p-2 bg-purple-500/20 rounded-full">{isPlaying ? <Pause size={18} className="text-white"/> : <Play size={18} className="text-white"/>}</button>
                <button onClick={nextTrack}><SkipForward size={20} className="text-gray-400"/></button>
              </div>
            </motion.div>
          ) : isPlaying ? (
            /* Desktop View - Expanded Pill */
            <motion.div key="expanded" className="flex items-center space-x-4 min-w-[320px]">
              <div className="relative w-14 h-14 flex-shrink-0">
                <motion.img
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  src={DISC_IMAGE}
                  className="w-full h-full rounded-full border-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                />
                <div className="absolute inset-0 m-auto w-3 h-3 bg-black rounded-full border border-white/30" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-bold truncate">{currentTrack.title}</p>
                <p className="text-purple-300 text-xs truncate mb-2">{currentTrack.artist}</p>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-3 pr-2">
                <button onClick={togglePlay} className="hover:scale-110 transition-transform"><Pause className="text-white" size={24}/></button>
                <button onClick={nextTrack} className="hover:scale-110 transition-transform"><SkipForward className="text-gray-400" size={20}/></button>
              </div>
            </motion.div>
          ) : (
            /* Desktop View - Collapsed Disk */
            <motion.div key="collapsed" className="relative group">
               <motion.img
                src={DISC_IMAGE}
                className="w-[55px] h-[55px] rounded-full border-2 border-purple-500/50"
              />
              <div className="absolute inset-0 m-auto w-2 h-2 bg-black rounded-full" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Play size={20} className="text-white fill-white"/>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}