'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface Post {
  id: string;
  username: string;
  time: string;
  content: string;
  mood: string;
  created_at: string;
}

export default function RainyRefuge() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostMood, setNewPostMood] = useState('');
  const [newPostUsername, setNewPostUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // 从 Supabase 获取留言列表
  const fetchMessages = async () => {
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
        const formattedPosts: Post[] = data.map((post) => ({
          id: post.id,
          username: post.username,
          time: new Date(post.created_at).toLocaleString('ja-JP'),
          content: post.content,
          mood: post.mood,
          created_at: post.created_at
        }));
        setPosts(formattedPosts);
      }
    } catch (err) {
      setError('获取留言列表失败');
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPostContent.trim()) {
      try {
        setSubmitting(true);
        setError(null);
        
        // 处理署名逻辑
        const username = newPostUsername.trim() || (Math.random() > 0.5 ? '匿名夜行者' : '一位避雨的人');

        const { data, error } = await supabase
          .from('messages')
          .insert({
            username: username,
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
            mood: data.mood,
            created_at: data.created_at
          };
          // 使用函数式更新确保基于最新状态
          setPosts(prevPosts => [newPost, ...prevPosts]);
          setNewPostContent('');
          setNewPostMood('');
          setNewPostUsername('');
        }
      } catch (err) {
        setError('提交留言失败');
        console.error('Error submitting post:', err);
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-950/30 to-background text-text p-4 md:p-8">
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
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg">
          <h2 className="text-xl font-serif-jiba mb-4">在这里留下你的共鸣...</h2>
          <div className="mb-4">
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="分享你此刻的心情..."
              className="w-full bg-transparent border border-white/30 rounded-md p-4 text-text focus:outline-none focus:ring-2 focus:ring-white/50 min-h-[120px]"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <input
                type="text"
                value={newPostUsername}
                onChange={(e) => setNewPostUsername(e.target.value)}
                placeholder="署名（可选）"
                className="w-full bg-transparent border border-white/30 rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
            <div>
              <select
                value={newPostMood}
                onChange={(e) => setNewPostMood(e.target.value)}
                className="w-full bg-transparent border border-white/30 rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <option value="">选择心情</option>
                <option value="蓝色">蓝色</option>
                <option value="怀念">怀念</option>
                <option value="平静">平静</option>
                <option value="忧郁">忧郁</option>
                <option value="温暖">温暖</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3 bg-text text-background rounded-md hover:bg-opacity-90 transition-colors"
            disabled={submitting || !newPostContent.trim()}
          >
            {submitting ? '发送中...' : '发送'}
          </button>
          {error && (
            <div className="mt-4 text-red-400 text-sm">{error}</div>
          )}
        </form>
      </motion.div>

      {/* 留言列表 */}
      <div className="max-w-3xl mx-auto">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-text border-t-transparent rounded-full mx-auto animate-spin"></div>
            <p className="mt-4 text-white/70">加载中...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchMessages}
              className="px-6 py-2 bg-text text-background rounded-md hover:bg-opacity-90 transition-colors"
            >
              重试
            </button>
          </div>
        ) : posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 shadow-lg text-center"
          >
            <h2 className="text-2xl font-serif-jiba mb-4">暂无留言</h2>
            <p className="text-white/70 mb-6">成为第一个留下共鸣的人吧</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg hover:border-white/40 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-white">{post.username}</h3>
                  {post.mood && (
                    <span className="px-2 py-1 bg-white/20 rounded-full text-xs">{post.mood}</span>
                  )}
                </div>
                <p className="text-white/90 mb-4 leading-relaxed">{post.content}</p>
                <div className="flex justify-end">
                  <p className="text-xs text-white/40">{post.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
