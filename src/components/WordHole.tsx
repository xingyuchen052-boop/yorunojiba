'use client';

import { motion } from 'framer-motion';

export default function WordHole() {
  return (
    <div className="min-h-screen bg-background text-text p-4 md:p-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-serif-jiba mb-8 text-center"
      >
        言の葉の穴
      </motion.h1>

      {/* 旧信纸布局 */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* 信纸 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 shadow-lg"
        >
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-serif-jiba mb-6">Amy 和 Elma 的故事</h2>
            <div className="w-full max-w-2xl">
              <div className="writing-mode-vertical text-lg leading-relaxed space-y-4">
                <p className="text-white/90">
                  エイミー写给エルマ的信件，记录了关于夏天、音乐与自杀的倒计时。
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .writing-mode-vertical {
          writing-mode: vertical-rl;
          text-orientation: upright;
          height: 600px;
          margin: 0 auto;
        }
        
        @media (max-width: 768px) {
          .writing-mode-vertical {
            writing-mode: horizontal-tb;
            height: auto;
          }
        }
      `}</style>
    </div>
  );
}