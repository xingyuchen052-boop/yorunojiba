'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Album {
  id: number;
  name: string;
  picUrl: string;
  blurPicUrl: string;
  publishTime: number;
  size: number;
}

interface Song {
  id: number;
  name: string;
  artists?: Array<{ name: string }>;
  ar?: Array<{ name: string }>;
  album: { name: string };
}

export default function JunePole() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [albumLoading, setAlbumLoading] = useState(false);
  const [albumError, setAlbumError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // 获取 Yorushika 的所有专辑
  const fetchAlbums = async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const currentOffset = isLoadMore ? offset : 0;
      const response = await fetch(`https://api-enhanced-3cbx.vercel.app/artist/album?id=12390232&limit=30&offset=${currentOffset}`);
      if (!response.ok) {
        throw new Error('Failed to fetch albums');
      }
      const data = await response.json();
      if (data.code === 200 && data.hotAlbums) {
        if (isLoadMore) {
          setAlbums(prevAlbums => [...prevAlbums, ...data.hotAlbums]);
          setOffset(prevOffset => prevOffset + 30);
        } else {
          setAlbums(data.hotAlbums);
          setOffset(30);
        }
        setHasMore(data.hotAlbums.length === 30);
      } else {
        throw new Error('Invalid response data');
      }
    } catch (err) {
      setError('获取专辑列表失败');
      console.error('Error fetching albums:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // 获取专辑下的所有歌曲
  const fetchSongs = async (albumId: number) => {
    try {
      setAlbumLoading(true);
      setAlbumError(null);
      const response = await fetch(`https://api-enhanced-3cbx.vercel.app/album?id=${albumId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch songs');
      }
      const data = await response.json();
      if (data.code === 200 && data.songs) {
        setSongs(data.songs);
      } else {
        throw new Error('Invalid response data');
      }
    } catch (err) {
      setAlbumError('获取歌曲列表失败');
      console.error('Error fetching songs:', err);
    } finally {
      setAlbumLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const handleAlbumClick = (album: Album) => {
    setSelectedAlbum(album);
    setSongs([]);
    setSelectedSong(null);
    fetchSongs(album.id);
  };

  const handleSongClick = (song: Song) => {
    setSelectedSong(song);
  };

  // 获取歌手名称
  const getArtistNames = (song: Song) => {
    const artists = song.artists || song.ar || [];
    return artists.map(artist => artist?.name || '').filter(Boolean).join(', ');
  };

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

      {/* 专辑列表 */}
      <div className="max-w-6xl mx-auto mb-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-text border-t-transparent rounded-full mx-auto animate-spin"></div>
            <p className="mt-4 text-white/70">加载专辑中...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => fetchAlbums()}
              className="px-6 py-2 bg-text text-background rounded-md hover:bg-opacity-90 transition-colors"
            >
              重试
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {albums.map((album, index) => (
                <motion.div
                  key={album.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="cursor-pointer group"
                  onClick={() => handleAlbumClick(album)}
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden border border-white/20 hover:border-white/40 transition-colors">
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={album.blurPicUrl || album.picUrl}
                        alt={album.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-70"></div>
                      <div className="absolute bottom-0 left-0 p-3">
                        <h3 className="text-sm font-serif-jiba line-clamp-2">{album.name}</h3>
                        <p className="text-xs text-white/60 mt-1">
                          {new Date(album.publishTime).toLocaleDateString('ja-JP')}
                        </p>
                        <p className="text-xs text-white/60 mt-1">{album.size} 首歌曲</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* 加载更多按钮 */}
            {hasMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => fetchAlbums(true)}
                  disabled={loadingMore}
                  className="px-6 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-md hover:bg-white/20 transition-colors disabled:opacity-50"
                >
                  {loadingMore ? '加载中...' : '加载更多专辑'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* 歌曲列表 */}
      {selectedAlbum && (
        <div className="max-w-6xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <button
              onClick={() => setSelectedAlbum(null)}
              className="text-white/70 hover:text-white transition-colors mb-4 inline-flex items-center"
            >
              ← 返回专辑列表
            </button>
            <h2 className="text-2xl font-serif-jiba">{selectedAlbum.name}</h2>
          </motion.div>

          {albumLoading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-text border-t-transparent rounded-full mx-auto animate-spin"></div>
              <p className="mt-4 text-white/70">正在调频...</p>
            </div>
          ) : albumError ? (
            <div className="text-center py-12">
              <p className="text-red-400 mb-4">{albumError}</p>
              <button
                onClick={() => fetchSongs(selectedAlbum.id)}
                className="px-6 py-2 bg-text text-background rounded-md hover:bg-opacity-90 transition-colors"
              >
                重试
              </button>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="space-y-2">
                {songs.map((song, index) => (
                  <motion.div
                    key={song.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-md hover:bg-white/10 cursor-pointer transition-colors"
                    onClick={() => handleSongClick(song)}
                  >
                    <div className="flex items-center">
                      <span className="text-white/50 mr-4 w-6 text-center">{index + 1}</span>
                      <div>
                        <h3 className="text-sm">{song.name || '未知歌曲'}</h3>
                        <p className="text-xs text-white/60">
                          {getArtistNames(song)}
                        </p>
                      </div>
                    </div>
                    <div className="text-white/50">
                      ▶
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 播放器 */}
      <AnimatePresence>
        {selectedSong && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-2xl z-50"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 flex items-center justify-between">
              <div className="flex items-center flex-1">
                <div className="w-12 h-12 bg-white/20 rounded mr-4 flex items-center justify-center">
                  <span className="text-xl">🎵</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium">{selectedSong.name || '未知歌曲'}</h3>
                  <p className="text-xs text-white/60">
                    {getArtistNames(selectedSong)} - {selectedSong.album?.name || '未知专辑'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <iframe
                  src={`https://music.163.com/outchain/player?type=2&id=${selectedSong.id}&auto=1&height=66`}
                  width="280"
                  height="66"
                  frameBorder="0"
                  allowFullScreen
                  className="block"
                  title="网易云音乐播放器"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
