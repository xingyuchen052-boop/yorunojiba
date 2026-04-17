'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Post {
  id: string;
  username: string;
  time: string;
  content: string;
  mood: string;
}

const initialPosts: Post[] = [
  {
    id: '1',
    username: '名無し',
    time: '2024-06-15 14:30',
    content: '音楽泥棒の集まりへ、ようこそ。在这里分享你此刻听到的夏日。',
    mood: '蓝色'
  }
];

export default function RainyRefuge() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostMood, setNewPostMood] = useState('蓝色');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPostContent.trim()) {
      const newPost: Post = {
        id: Date.now().toString(),
        username: '名無し',
        time: new Date().toLocaleString('ja-JP'),
        content: newPostContent.trim(),
        mood: newPostMood
      };
      setPosts([newPost, ...posts]);
      setNewPostContent('');
    }
  };

  return (
    <div className="min-h-screen bg-background text-text p-4 md:p-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-serif-jiba mb-8 text-center"
      >
        雨宿り
      </motion.h1>

      {/* 发帖表单 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-2xl mx-auto mb-12"
      >
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="mb-4">
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="在这里留下你的共鸣..."
              className="w-full bg-transparent border border-white/30 rounded-md p-4 text-text focus:outline-none focus:ring-2 focus:ring-white/50"
              rows={4}
            />
          </div>
          <div className="flex justify-between items-center">
            <div>
              <label className="text-sm text-white/70 mr-2">心情标签：</label>
              <select
                value={newPostMood}
                onChange={(e) => setNewPostMood(e.target.value)}
                className="bg-transparent border border-white/30 rounded-md p-2 text-text focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <option value="蓝色">蓝色</option>
                <option value="怀念">怀念</option>
                <option value="温暖">温暖</option>
                <option value="清新">清新</option>
                <option value="平静">平静</option>
              </select>
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-text text-background rounded-md hover:bg-opacity-90 transition-colors"
            >
              发送
            </button>
          </div>
        </form>
      </motion.div>

      {/* 帖子列表 - 瀑布流布局 */}
      <div className="max-w-6xl mx-auto columns-1 md:columns-2 lg:columns-3 gap-6">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="break-inside-avoid mb-6"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:border-white/40 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <span className="font-medium">{post.username}</span>
                <span className="text-xs text-white/60">{post.time}</span>
              </div>
              <p className="mb-4 leading-relaxed">{post.content}</p>
              <div className="flex justify-end">
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs">{post.mood}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}