import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Plus } from 'lucide-react';

const SpotifyMiniPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);
  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <motion.div
      layout
      className={`fixed ${isMobile ? 'top-0 left-0 right-0' : 'bottom-4 left-1/2 transform -translate-x-1/2 w-auto max-w-md'} bg-red-500 backdrop-blur-md rounded-2xl p-4 flex ${isMobile ? 'flex-col' : 'flex-row'} ${!isMobile && !isPlaying ? 'justify-center' : 'justify-between'} items-center`}
      style={{ zIndex: 1000 }}
    >
      {/* Album Art */}
      <motion.div
        className="relative w-12 h-12 rounded-full overflow-hidden"
        animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
        transition={{ duration: 2, repeat: isPlaying ? Infinity : 0, ease: 'linear' }}
      >
        <img
          src="https://i.scdn.co/image/ab67616d0000b2734c8e8e7b4c9b2b2b2b2b2b2b" // Placeholder album art, replace with actual
          alt="Epoch by Tycho"
          className="w-full h-full object-cover"
        />
        {!isPlaying && !isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full"
          >
            <Play className="w-6 h-6 text-white" />
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
            <p className="text-white text-sm font-semibold">Epoch</p>
            <p className="text-gray-300 text-xs">Tycho</p>
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
            <SkipBack className="w-5 h-5 text-white cursor-pointer hover:text-gray-300" />
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
            <SkipForward className="w-5 h-5 text-white cursor-pointer hover:text-gray-300" />
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
  );
};

export default SpotifyMiniPlayer;