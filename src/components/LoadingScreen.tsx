'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const lyrics = [
  '夜の磁場に包まれて',
  '六月の電柱の陰で',
  '言の葉の穴から見る',
  '雨宿りの中で',
  '旋律が心を撫でる',
  '星空の下で歌う',
  '音符が空を舞う',
  '心の奥に響く音',
];

export default function LoadingScreen() {
  const [currentLyric, setCurrentLyric] = useState(lyrics[0]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * lyrics.length);
      setCurrentLyric(lyrics[randomIndex]);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-text">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 1, ease: 'easeInOut' }}
        className="text-4xl font-serif-jiba mb-8"
      >
        夜の磁場
      </motion.div>
      
      <motion.div
        key={currentLyric}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 1, ease: 'easeInOut' }}
        className="text-2xl mb-16 font-serif-jiba"
      >
        {currentLyric}
      </motion.div>
      
      <motion.div
        animate={{
          opacity: [0.3, 1, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="w-16 h-16 border-4 border-text border-t-transparent rounded-full mb-8"
      />
    </div>
  );
}