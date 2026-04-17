'use client';

import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';

export default function MoonlightImitation() {
  return (
    <div className="min-h-screen bg-background text-text flex flex-col items-center justify-center p-4 md:p-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-serif-jiba mb-16 text-center"
      >
        月光の模倣
      </motion.h1>

      {/* 待开放状态 */}
      <div className="flex flex-col items-center max-w-2xl text-center">
        <motion.p
          initial={{ opacity: 0.7 }}
          animate={{
            opacity: [0.7, 0.9, 0.7],
            textShadow: [
              '0 0 5px rgba(255, 255, 255, 0.3)',
              '0 0 15px rgba(255, 255, 255, 0.5)',
              '0 0 5px rgba(255, 255, 255, 0.3)'
            ]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="text-2xl md:text-3xl font-serif-jiba mb-12 text-white/80"
        >
          月明かりを盗む、あなたの創作を待っています。
        </motion.p>

        <motion.button
          initial={{ opacity: 0.6, scale: 0.95 }}
          hover={{ opacity: 0.8, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-md border border-white/20 text-white/70 hover:text-white/90 disabled:opacity-50"
          disabled
        >
          <Upload size={18} />
          <span>上传你的模仿作品（暂未开启）</span>
        </motion.button>
      </div>
    </div>
  );
}