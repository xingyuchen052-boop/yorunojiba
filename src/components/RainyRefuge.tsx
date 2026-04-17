'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface Post {
  id: string;
  username: string;
  time: string;
  content: string;
  mood: string;
}

export default function RainyRefuge() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostMood, setNewPostMood] = useState('蓝色');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 从 Supabase 获取留言
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          setPosts(data.map(post => ({
            id: post.id,
            username: post.username,
            time: new Date(post.created_at).toLocaleString('ja-JP'),
            content: post.content,
            mood: post.mood
          })));
        }
      } catch (err) {
        setError('获取留言失败');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // 提交新留言到 Supabase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPostContent.trim()) {
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
          .from('messages')
          .insert({
            username: '名無し',
            content: newPostContent.trim(),
            mood: newPostMood
          })
          .select()
          .single();

        if (error) {
          console.error('Error submitting post:', error);
          throw error;
        }

        if (data) {
          const newPost: Post = {
            id: data.id,
            username: data.username,
            time: new Date(data.created_at).toLocaleString('ja-JP'),
            content: data.content,
            mood: data.mood
          };
          // 使用函数式更新确保基于最新状态
          setPosts(prevPosts => [newPost, ...prevPosts]);
          setNewPostContent('');
        }
      } catch (err) {
        setError('提交留言失败');
        console.error('Error submitting post:', err);
      } finally {
        setLoading(false);
      }
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
              disabled={loading}
            >
              {loading ? '发送中...' : '发送'}
            </button>
          </div>
          {error && (
            <div className="mt-4 text-red-400 text-sm">{error}</div>
          )}
        </form>
      </motion.div>

      {/* 帖子列表 - 瀑布流布局 */}
      <div className="max-w-6xl mx-auto columns-1 md:columns-2 lg:columns-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <div className="w-12 h-12 border-4 border-text border-t-transparent rounded-full mx-auto animate-spin"></div>
            <p className="mt-4 text-white/70">加载中...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-white/70">暂无留言，快来分享你的共鸣吧！</p>
          </div>
        ) : (
          posts.map((post, index) => (
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
          ))
        )}
      </div>
    </div>
  );
}