'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LoadingScreen from '../components/LoadingScreen';
import JunePole from '../components/JunePole';
import WordHole from '../components/WordHole';
import RainyRefuge from '../components/RainyRefuge';
import MoonlightImitation from '../components/MoonlightImitation';
import RainEffect from '../components/RainEffect';
import RippleButton from '../components/RippleButton';
import { Lamp, Bird, Sparkles } from 'lucide-react';

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

type Section = 'home' | 'june' | 'word' | 'rainy' | 'moonlight';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState<Section>('home');
  const [currentLyric, setCurrentLyric] = useState(lyrics[0]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * lyrics.length);
      setCurrentLyric(lyrics[randomIndex]);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleEnter = () => {
    setIsLoading(false);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
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
            className="w-16 h-16 border-4 border-text border-t-transparent rounded-full mb-16 mx-auto"
          />
          
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 1 }}
            onClick={handleEnter}
            className="px-8 py-3 bg-text text-background rounded-full font-medium hover:bg-opacity-90 transition-colors"
          >
            进入磁场
          </motion.button>
        </div>
      </div>
    );
  }

  const renderSection = () => {
    switch (currentSection) {
      case 'june':
        return <JunePole />;
      case 'word':
        return <WordHole />;
      case 'rainy':
        return <RainyRefuge />;
      case 'moonlight':
        return <MoonlightImitation />;
      default:
        return (
          <main className="py-12 px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 1 }}
                className="text-center"
              >
                <h2 className="text-3xl font-serif-jiba mb-8">音楽との出会い</h2>
                <p className="text-lg mb-12">欢迎来到夜の磁場，在这里我们分享对音乐的热爱与感动。</p>
              </motion.div>
            </div>
          </main>
        );
    }
  };
  
  return (
    <div className="min-h-screen bg-background text-text relative">
      {/* 背景雨滴效果 */}
      <RainEffect />
      
      {/* 装饰小图标 */}
      <div className="fixed top-8 left-8 opacity-20 z-10">
        <Lamp size={32} />
      </div>
      <div className="fixed bottom-8 right-8 opacity-20 z-10">
        <Bird size={32} />
      </div>
      <div className="fixed top-1/2 right-8 opacity-20 z-10">
        <Sparkles size={24} />
      </div>
      
      <header className="py-8 px-4 border-b border-gray-700 relative z-20">
        <div className="max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-serif-jiba mb-6"
          >
            夜の磁場
          </motion.h1>
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <ul className="flex space-x-8">
              <li>
                <RippleButton 
                  className="hover:text-gray-400 transition-colors font-serif-jiba bg-transparent border-none text-text cursor-pointer"
                  onClick={() => setCurrentSection('june')}
                >
                  六月、電柱の陰
                </RippleButton>
              </li>
              <li>
                <RippleButton 
                  className="hover:text-gray-400 transition-colors font-serif-jiba bg-transparent border-none text-text cursor-pointer"
                  onClick={() => setCurrentSection('word')}
                >
                  言の葉の穴
                </RippleButton>
              </li>
              <li>
                <RippleButton 
                  className="hover:text-gray-400 transition-colors font-serif-jiba bg-transparent border-none text-text cursor-pointer"
                  onClick={() => setCurrentSection('rainy')}
                >
                  雨宿り
                </RippleButton>
              </li>
              <li>
                <RippleButton 
                  className="hover:text-gray-400 transition-colors font-serif-jiba bg-transparent border-none text-text cursor-pointer"
                  onClick={() => setCurrentSection('moonlight')}
                >
                  月光の模倣
                </RippleButton>
              </li>
            </ul>
          </motion.nav>
        </div>
      </header>
      
      <div className="relative z-20">
        {renderSection()}
      </div>
    </div>
  );
}