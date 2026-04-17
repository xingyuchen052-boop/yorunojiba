'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface Knowledge {
  id: string;
  content: string;
  created_at: string;
}

export default function WordHole() {
  const [knowledge, setKnowledge] = useState<Knowledge[]>([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [newContent, setNewContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 从 Supabase 获取考据内容
  useEffect(() => {
    const fetchKnowledge = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('knowledge')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          setKnowledge(data);
        }
      } catch (err) {
        setError('获取考据内容失败');
        console.error('Error fetching knowledge:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchKnowledge();
  }, []);

  // 验证口令
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'amy-elma-2026') {
      setIsAuthenticated(true);
    } else {
      setError('口令错误');
    }
  };

  // 提交新的考据内容
  const handleContentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newContent.trim()) {
      try {
        setSubmitting(true);
        const { data, error } = await supabase
          .from('knowledge')
          .insert({
            content: newContent.trim()
          })
          .select()
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setKnowledge([data, ...knowledge]);
          setNewContent('');
        }
      } catch (err) {
        setError('提交考据内容失败');
        console.error('Error submitting knowledge:', err);
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-text p-4 md:p-8 relative">
      {/* 极其隐蔽的管理员入口 */}
      <div 
        className="absolute top-2 right-2 w-4 h-4 bg-white/5 hover:bg-white/10 rounded-full cursor-pointer"
        onClick={() => setShowAdmin(!showAdmin)}
        title="管理员入口"
      />

      {/* 管理员登录和提交表单 */}
      {showAdmin && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 max-w-md w-full border border-white/20">
            {!isAuthenticated ? (
              <>
                <h3 className="text-xl font-serif-jiba mb-4">管理员登录</h3>
                <form onSubmit={handlePasswordSubmit}>
                  <div className="mb-4">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="输入口令"
                      className="w-full bg-transparent border border-white/30 rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-text text-background rounded-md hover:bg-opacity-90 transition-colors"
                  >
                    登录
                  </button>
                  {error && (
                    <div className="mt-4 text-red-400 text-sm">{error}</div>
                  )}
                </form>
              </>
            ) : (
              <>
                <h3 className="text-xl font-serif-jiba mb-4">提交考据内容</h3>
                <form onSubmit={handleContentSubmit}>
                  <div className="mb-4">
                    <textarea
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      placeholder="输入考据内容..."
                      className="w-full bg-transparent border border-white/30 rounded-md p-4 text-text focus:outline-none focus:ring-2 focus:ring-white/50"
                      rows={6}
                    />
                  </div>
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setIsAuthenticated(false)}
                      className="px-4 py-2 bg-white/20 rounded-md hover:bg-white/30 transition-colors"
                    >
                      退出
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-text text-background rounded-md hover:bg-opacity-90 transition-colors"
                      disabled={submitting}
                    >
                      {submitting ? '提交中...' : '提交'}
                    </button>
                  </div>
                  {error && (
                    <div className="mt-4 text-red-400 text-sm">{error}</div>
                  )}
                </form>
              </>
            )}
            <button
              onClick={() => setShowAdmin(false)}
              className="mt-4 w-full text-center text-white/60 hover:text-white transition-colors"
            >
              关闭
            </button>
          </div>
        </motion.div>
      )}

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
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-text border-t-transparent rounded-full mx-auto animate-spin"></div>
            <p className="mt-4 text-white/70">加载中...</p>
          </div>
        ) : knowledge.length === 0 ? (
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
        ) : (
          knowledge.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 shadow-lg"
            >
              <div className="flex flex-col items-center">
                <h2 className="text-2xl font-serif-jiba mb-6">Amy 和 Elma 的故事</h2>
                <div className="w-full max-w-2xl">
                  <div className="writing-mode-vertical text-lg leading-relaxed space-y-4">
                    <p className="text-white/90">
                      {item.content}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
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