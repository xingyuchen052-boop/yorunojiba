'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Song {
  id: string;
  title: string;
  lyric: string;
  neteaseUrl: string;
  bilibiliUrl: string;
  imageUrl: string;
}

const songs: Song[] = [
  {
    id: '1',
    title: '夜明けと蛍',
    lyric: '夜明けと蛍のように、消えてしまいそうな光',
    neteaseUrl: 'https://music.163.com/song?id=28806111',
    bilibiliUrl: 'https://www.bilibili.com/video/BV1xs41127Ko',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fireflies%20at%20dawn%2C%20soft%20light%2C%20peaceful%20atmosphere%2C%20anime%20style&image_size=landscape_4_3'
  },
  {
    id: '2',
    title: 'ウミユリ海底譚',
    lyric: '海百合海底谭',
    neteaseUrl: 'https://music.163.com/song?id=36990297',
    bilibiliUrl: 'https://www.bilibili.com/video/BV1ds41127Yd',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=seafloor%20scene%2C%20sea%20lilies%2C%20deep%20ocean%2C%20anime%20style&image_size=landscape_4_3'
  },
  {
    id: '3',
    title: 'ただ君に晴れ',
    lyric: 'ただ君に晴れ',
    neteaseUrl: 'https://music.163.com/song?id=1330874881',
    bilibiliUrl: 'https://www.bilibili.com/video/BV1Vb411C7Jq',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sunny%20day%2C%20warm%20light%2C%20summer%20atmosphere%2C%20anime%20style&image_size=landscape_4_3'
  },
  {
    id: '4',
    title: '盗作',
    lyric: '盗作',
    neteaseUrl: 'https://music.163.com/song?id=1330874880',
    bilibiliUrl: 'https://www.bilibili.com/video/BV1Wb411C7fS',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=melancholic%20mood%2C%20night%20scene%2C%20anime%20style&image_size=landscape_4_3'
  },
  {
    id: '5',
    title: '花に亡霊',
    lyric: '花に亡霊',
    neteaseUrl: 'https://music.163.com/song?id=1330874879',
    bilibiliUrl: 'https://www.bilibili.com/video/BV1ib411C7iH',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ghost%20in%20flowers%2C%20ethereal%20beauty%2C%20soft%20colors%2C%20anime%20style&image_size=landscape_4_3'
  }
];

export default function JunePole() {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  return (
    <div className="min-h-screen bg-background text-text p-4 md:p-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-serif-jiba mb-8 text-center"
      >
        六月、電柱の陰
      </motion.h1>

      {/* 歌曲网格布局 */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {songs.map((song, index) => (
          <motion.div
            key={song.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="cursor-pointer group"
            onClick={() => setSelectedSong(song)}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden border border-white/20 hover:border-white/40 transition-colors">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={song.imageUrl} 
                  alt={song.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-70"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="text-xl font-serif-jiba">{song.title}</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-white/70 line-clamp-2">{song.lyric}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 弹出窗口 */}
      <AnimatePresence>
        {selectedSong && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedSong(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/10 backdrop-blur-md rounded-lg p-6 max-w-md w-full border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-serif-jiba">{selectedSong.title}</h3>
                <button 
                  onClick={() => setSelectedSong(null)}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="mb-6">
                <p className="text-white/80 italic">{selectedSong.lyric}</p>
              </div>
              <div className="flex space-x-4">
                <a 
                  href={selectedSong.neteaseUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-2 bg-white/20 rounded-md text-center hover:bg-white/30 transition-colors"
                >
                  网易云音乐
                </a>
                <a 
                  href={selectedSong.bilibiliUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-2 bg-white/20 rounded-md text-center hover:bg-white/30 transition-colors"
                >
                  B站
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}