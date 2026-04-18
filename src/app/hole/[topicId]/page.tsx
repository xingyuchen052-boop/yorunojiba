'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../../lib/supabase';
import { useRouter, useParams } from 'next/navigation';

interface Topic {
  id: string;
  title: string;
  category: string;
  cover_url: string;
  description: string;
  created_at: string;
}

interface Research {
  id: string;
  topic_id: string;
  sub_title: string;
  content: string;
  image_url: string;
  author: string;
  created_at: string;
}

export default function TopicDetail() {
  const [topic, setTopic] = useState<Topic | null>(null);
  const [researches, setResearches] = useState<Research[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // 新增考据相关状态
  const [newResearch, setNewResearch] = useState({
    sub_title: '',
    content: '',
    image_url: '',
    author: ''
  });
  const [showAddResearch, setShowAddResearch] = useState(false);
  
  const router = useRouter();
  const params = useParams();
  const topicId = params.topicId as string;

  // 从 Supabase 获取主题详情
  const fetchTopic = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('topics')
        .select('*')
        .eq('id', topicId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setTopic(data);
      }
    } catch (err) {
      setError('获取主题详情失败');
      console.error('Error fetching topic:', err);
    } finally {
      setLoading(false);
    }
  };

  // 从 Supabase 获取考据内容
  const fetchResearches = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('researches')
        .select('*')
        .eq('topic_id', topicId)
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      if (data) {
        setResearches(data);
      }
    } catch (err) {
      setError('获取考据内容失败');
      console.error('Error fetching researches:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (topicId) {
      fetchTopic();
      fetchResearches();
    }
  }, [topicId]);

  // 验证口令
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'amy-elma-2026') {
      setIsAuthenticated(true);
      setShowAdmin(false);
    } else {
      setError('口令错误');
    }
  };

  // 提交新的考据内容
  const handleResearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (topicId && newResearch.sub_title.trim() && newResearch.content.trim() && newResearch.author.trim()) {
      try {
        setSubmitting(true);
        const { data, error } = await supabase
          .from('researches')
          .insert({
            topic_id: topicId,
            sub_title: newResearch.sub_title.trim(),
            content: newResearch.content.trim(),
            image_url: newResearch.image_url.trim(),
            author: newResearch.author.trim()
          })
          .select()
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setResearches([...researches, data]);
          setNewResearch({ sub_title: '', content: '', image_url: '', author: '' });
          setShowAddResearch(false);
        }
      } catch (err) {
        setError('提交考据内容失败');
        console.error('Error submitting research:', err);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleBackToTopics = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-950/30 to-background text-text p-4 md:p-8 relative">
      {/* 管理员入口 */}
      <div 
        className="absolute top-2 right-2 w-4 h-4 bg-white/5 hover:bg-white/10 rounded-full cursor-pointer"
        onClick={() => setShowAdmin(!showAdmin)}
        title="管理员入口"
      />

      {/* 管理员登录和提交表单 */}
      <AnimatePresence>
        {showAdmin && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 max-w-md w-full border border-white/20">
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
              <button
                onClick={() => setShowAdmin(false)}
                className="mt-4 w-full text-center text-white/60 hover:text-white transition-colors"
              >
                关闭
              </button>
            </div>
          </motion.div>
        )}

        {/* 新增考据内容表单 */}
        {showAddResearch && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 max-w-md w-full border border-white/20">
              <h3 className="text-xl font-serif-jiba mb-4">新增考据分支</h3>
              <form onSubmit={handleResearchSubmit}>
                <div className="mb-4">
                  <input
                    type="text"
                    value={newResearch.sub_title}
                    onChange={(e) => setNewResearch({ ...newResearch, sub_title: e.target.value })}
                    placeholder="分支标题"
                    className="w-full bg-transparent border border-white/30 rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
                <div className="mb-4">
                  <textarea
                    value={newResearch.content}
                    onChange={(e) => setNewResearch({ ...newResearch, content: e.target.value })}
                    placeholder="考据内容"
                    className="w-full bg-transparent border border-white/30 rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-white/50"
                    rows={4}
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="text"
                    value={newResearch.image_url}
                    onChange={(e) => setNewResearch({ ...newResearch, image_url: e.target.value })}
                    placeholder="图片链接（可选）"
                    className="w-full bg-transparent border border-white/30 rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="text"
                    value={newResearch.author}
                    onChange={(e) => setNewResearch({ ...newResearch, author: e.target.value })}
                    placeholder="贡献者"
                    className="w-full bg-transparent border border-white/30 rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setShowAddResearch(false)}
                    className="px-4 py-2 bg-white/20 rounded-md hover:bg-white/30 transition-colors"
                  >
                    取消
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-text border-t-transparent rounded-full mx-auto animate-spin"></div>
          <p className="mt-4 text-white/70">加载中...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => {
              fetchTopic();
              fetchResearches();
            }}
            className="px-6 py-2 bg-text text-background rounded-md hover:bg-opacity-90 transition-colors"
          >
            重试
          </button>
        </div>
      ) : topic ? (
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <button
              onClick={handleBackToTopics}
              className="text-white/70 hover:text-white transition-colors mb-4 inline-flex items-center"
            >
              ← 返回主题列表
            </button>
            <h1 className="text-3xl md:text-4xl font-serif-jiba mb-3">{topic.title}</h1>
            <p className="text-white/80 mb-4">{topic.description}</p>
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">{topic.category}</span>
          </motion.div>

          {/* 悬浮的添加考据分支按钮 */}
          {isAuthenticated && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddResearch(true)}
              className="fixed bottom-6 right-6 w-16 h-16 bg-text text-background rounded-full flex items-center justify-center shadow-lg z-40"
              title="添加考据分支"
            >
              +
            </motion.button>
          )}

          {/* 考据内容 */}
          <div className="space-y-6">
            {researches.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 shadow-lg text-center"
              >
                <h3 className="text-xl font-serif-jiba mb-4">暂无考据内容</h3>
                {isAuthenticated && (
                  <button
                    onClick={() => setShowAddResearch(true)}
                    className="px-4 py-2 bg-text text-background rounded-md hover:bg-opacity-90 transition-colors"
                  >
                    新增考据内容
                  </button>
                )}
              </motion.div>
            ) : (
              researches.map((research, index) => (
                <motion.div
                  key={research.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg flex flex-col gap-4"
                >
                  <h2 className="text-xl font-serif-jiba">{research.sub_title}</h2>
                  <p className="text-white/90 leading-relaxed">{research.content}</p>
                  {research.image_url && (
                    <div className="w-full">
                      <img 
                        src={research.image_url} 
                        alt={research.sub_title} 
                        className="w-full h-auto object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-white/60">贡献者: {research.author}</p>
                    <p className="text-xs text-white/40">{new Date(research.created_at).toLocaleString('ja-JP')}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-2xl font-serif-jiba mb-4">主题不存在</h3>
          <button
            onClick={handleBackToTopics}
            className="px-6 py-2 bg-text text-background rounded-md hover:bg-opacity-90 transition-colors"
          >
            返回主题列表
          </button>
        </div>
      )}
    </div>
  );
}
