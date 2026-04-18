'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

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
  type: 'official' | 'fan';
  created_at: string;
}

export default function WordHole() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [researches, setResearches] = useState<Research[]>([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // 新增主题相关状态
  const [newTopic, setNewTopic] = useState({
    title: '',
    category: '',
    cover_url: '',
    description: ''
  });
  
  // 编辑主题相关状态
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [editTopicForm, setEditTopicForm] = useState({
    title: '',
    category: '',
    cover_url: '',
    description: ''
  });
  const [showEditTopic, setShowEditTopic] = useState(false);
  
  // 新增考据相关状态
  const [newResearch, setNewResearch] = useState({
    sub_title: '',
    content: '',
    image_url: '',
    author: '',
    type: 'fan' as 'official' | 'fan'
  });
  const [showAddResearch, setShowAddResearch] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  
  // 编辑考据相关状态
  const [editingResearch, setEditingResearch] = useState<Research | null>(null);
  const [editResearchForm, setEditResearchForm] = useState({
    sub_title: '',
    content: '',
    image_url: '',
    author: '',
    type: 'fan' as 'official' | 'fan'
  });
  const [showEditResearch, setShowEditResearch] = useState(false);
  
  // 删除确认相关状态
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteType, setDeleteType] = useState<'topic' | 'research'>('topic');
  const [deleteId, setDeleteId] = useState('');

  // 从 Supabase 获取主题列表
  const fetchTopics = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('topics')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setTopics(data);
      }
    } catch (err) {
      setError('获取主题列表失败');
      console.error('Error fetching topics:', err);
    } finally {
      setLoading(false);
    }
  };

  // 从 Supabase 获取考据内容
  const fetchResearches = async (topicId: string) => {
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
    fetchTopics();
  }, []);

  useEffect(() => {
    if (selectedTopic) {
      fetchResearches(selectedTopic.id);
    }
  }, [selectedTopic]);

  // 验证口令
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'amy-elma-2026') {
      setIsAuthenticated(true);
    } else {
      setError('口令错误');
    }
  };

  // 提交新的主题
  const handleTopicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTopic.title.trim() && newTopic.category && newTopic.cover_url.trim() && newTopic.description.trim()) {
      try {
        setSubmitting(true);
        const { data, error } = await supabase
          .from('topics')
          .insert({
            title: newTopic.title.trim(),
            category: newTopic.category,
            cover_url: newTopic.cover_url.trim(),
            description: newTopic.description.trim()
          })
          .select()
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setTopics([data, ...topics]);
          setNewTopic({ title: '', category: '', cover_url: '', description: '' });
        }
      } catch (err) {
        setError('提交主题失败');
        console.error('Error submitting topic:', err);
      } finally {
        setSubmitting(false);
      }
    }
  };

  // 编辑主题
  const handleEditTopic = (topic: Topic) => {
    setEditingTopic(topic);
    setEditTopicForm({
      title: topic.title,
      category: topic.category,
      cover_url: topic.cover_url,
      description: topic.description
    });
    setShowEditTopic(true);
  };

  // 提交编辑主题
  const handleEditTopicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTopic && editTopicForm.title.trim() && editTopicForm.category && editTopicForm.cover_url.trim() && editTopicForm.description.trim()) {
      try {
        setSubmitting(true);
        const { data, error } = await supabase
          .from('topics')
          .update({
            title: editTopicForm.title.trim(),
            category: editTopicForm.category,
            cover_url: editTopicForm.cover_url.trim(),
            description: editTopicForm.description.trim()
          })
          .eq('id', editingTopic.id)
          .select()
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setTopics(topics.map(topic => topic.id === editingTopic.id ? data : topic));
          if (selectedTopic && selectedTopic.id === editingTopic.id) {
            setSelectedTopic(data);
          }
          setShowEditTopic(false);
          setEditingTopic(null);
        }
      } catch (err) {
        setError('编辑主题失败');
        console.error('Error editing topic:', err);
      } finally {
        setSubmitting(false);
      }
    }
  };

  // 删除主题
  const handleDeleteTopic = (topicId: string) => {
    setDeleteType('topic');
    setDeleteId(topicId);
    setShowDeleteConfirm(true);
  };

  // 确认删除主题
  const confirmDeleteTopic = async () => {
    if (deleteId) {
      try {
        setSubmitting(true);
        // 先删除相关的考据内容
        await supabase
          .from('researches')
          .delete()
          .eq('topic_id', deleteId);
        
        // 再删除主题
        const { error } = await supabase
          .from('topics')
          .delete()
          .eq('id', deleteId);

        if (error) {
          throw error;
        }

        setTopics(topics.filter(topic => topic.id !== deleteId));
        if (selectedTopic && selectedTopic.id === deleteId) {
          setSelectedTopic(null);
          setResearches([]);
        }
        setShowDeleteConfirm(false);
      } catch (err) {
        setError('删除主题失败');
        console.error('Error deleting topic:', err);
      } finally {
        setSubmitting(false);
      }
    }
  };

  // 提交新的考据内容
  const handleResearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTopic && newResearch.sub_title.trim() && newResearch.content.trim() && newResearch.author.trim()) {
      try {
        setSubmitting(true);
        const { data, error } = await supabase
          .from('researches')
          .insert({
            topic_id: selectedTopic.id,
            sub_title: newResearch.sub_title.trim(),
            content: newResearch.content.trim(),
            image_url: newResearch.image_url.trim(),
            author: newResearch.author.trim(),
            type: newResearch.type
          })
          .select()
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setResearches([...researches, data]);
          setNewResearch({ sub_title: '', content: '', image_url: '', author: '', type: 'fan' });
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

  // 编辑考据内容
  const handleEditResearch = (research: Research) => {
    setEditingResearch(research);
    setEditResearchForm({
      sub_title: research.sub_title,
      content: research.content,
      image_url: research.image_url,
      author: research.author,
      type: research.type
    });
    setShowEditResearch(true);
  };

  // 提交编辑考据内容
  const handleEditResearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingResearch && editResearchForm.sub_title.trim() && editResearchForm.content.trim() && editResearchForm.author.trim()) {
      try {
        setSubmitting(true);
        const { data, error } = await supabase
          .from('researches')
          .update({
            sub_title: editResearchForm.sub_title.trim(),
            content: editResearchForm.content.trim(),
            image_url: editResearchForm.image_url.trim(),
            author: editResearchForm.author.trim(),
            type: editResearchForm.type
          })
          .eq('id', editingResearch.id)
          .select()
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setResearches(researches.map(research => research.id === editingResearch.id ? data : research));
          setShowEditResearch(false);
          setEditingResearch(null);
        }
      } catch (err) {
        setError('编辑考据内容失败');
        console.error('Error editing research:', err);
      } finally {
        setSubmitting(false);
      }
    }
  };

  // 删除考据内容
  const handleDeleteResearch = (researchId: string) => {
    setDeleteType('research');
    setDeleteId(researchId);
    setShowDeleteConfirm(true);
  };

  // 确认删除考据内容
  const confirmDeleteResearch = async () => {
    if (deleteId) {
      try {
        setSubmitting(true);
        const { error } = await supabase
          .from('researches')
          .delete()
          .eq('id', deleteId);

        if (error) {
          throw error;
        }

        setResearches(researches.filter(research => research.id !== deleteId));
        setShowDeleteConfirm(false);
      } catch (err) {
        setError('删除考据内容失败');
        console.error('Error deleting research:', err);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleTopicClick = (topic: Topic) => {
    setSelectedTopic(topic);
  };

  const handleBackToTopics = () => {
    setSelectedTopic(null);
    setResearches([]);
    setShowAddResearch(false);
  };

  // 简单的 Markdown 渲染
  const renderMarkdown = (text: string) => {
    // 处理标题
    let rendered = text
      .replace(/^# (.*$)/gm, '<h1 className="text-2xl font-bold mt-4 mb-2">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 className="text-xl font-bold mt-3 mb-1">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 className="text-lg font-bold mt-2 mb-1">$1</h3>');
    
    // 处理粗体和斜体
    rendered = rendered
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // 处理链接
    rendered = rendered.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">$1</a>');
    
    // 处理列表
    const listItems = rendered.match(/^\* (.*$)/gm) || [];
    listItems.forEach((item) => {
      const content = item.replace(/^\* /, '');
      rendered = rendered.replace(item, `<li>${content}</li>`);
    });
    // 使用非捕获性匹配合并连续的 li 标签为 ul
    rendered = rendered.replace(/(<li>[\s\S]*?<\/li>)+/g, (match) => {
      return '<ul className="list-disc pl-5 my-2">' + match + '</ul>';
    });
    
    // 处理换行
    rendered = rendered.replace(/\n/g, '<br />');
    
    return rendered;
  };

  // 监听内容变化，更新预览
  useEffect(() => {
    setPreviewContent(renderMarkdown(newResearch.content));
  }, [newResearch.content]);

  // 监听编辑内容变化，更新预览
  useEffect(() => {
    if (showEditResearch) {
      setPreviewContent(renderMarkdown(editResearchForm.content));
    }
  }, [editResearchForm.content, showEditResearch]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-950/30 to-background text-text p-4 md:p-8 relative">
      {/* 极其隐蔽的管理员入口 */}
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
                  <h3 className="text-xl font-serif-jiba mb-4">新增主题</h3>
                  <form onSubmit={handleTopicSubmit}>
                    <div className="mb-4">
                      <input
                        type="text"
                        value={newTopic.title}
                        onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                        placeholder="主题标题"
                        className="w-full bg-transparent border border-white/30 rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-white/50"
                      />
                    </div>
                    <div className="mb-4">
                      <select
                        value={newTopic.category}
                        onChange={(e) => setNewTopic({ ...newTopic, category: e.target.value })}
                        className="w-full bg-transparent border border-white/30 rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-white/50"
                      >
                        <option value="">选择分类</option>
                        <option value="专辑">专辑</option>
                        <option value="角色">角色</option>
                        <option value="物品">物品</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <input
                        type="text"
                        value={newTopic.cover_url}
                        onChange={(e) => setNewTopic({ ...newTopic, cover_url: e.target.value })}
                        placeholder="封面图片链接"
                        className="w-full bg-transparent border border-white/30 rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-white/50"
                      />
                    </div>
                    <div className="mb-4">
                      <textarea
                        value={newTopic.description}
                        onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
                        placeholder="主题简介"
                        className="w-full bg-transparent border border-white/30 rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-white/50"
                        rows={3}
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

        {/* 编辑主题表单 */}
        {showEditTopic && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 max-w-md w-full border border-white/20">
              <h3 className="text-xl font-serif-jiba mb-4">编辑主题</h3>
              <form onSubmit={handleEditTopicSubmit}>
                <div className="mb-4">
                  <input
                    type="text"
                    value={editTopicForm.title}
                    onChange={(e) => setEditTopicForm({ ...editTopicForm, title: e.target.value })}
                    placeholder="主题标题"
                    className="w-full bg-transparent border border-white/30 rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
                <div className="mb-4">
                  <select
                    value={editTopicForm.category}
                    onChange={(e) => setEditTopicForm({ ...editTopicForm, category: e.target.value })}
                    className="w-full bg-transparent border border-white/30 rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    <option value="">选择分类</option>
                    <option value="专辑">专辑</option>
                    <option value="角色">角色</option>
                    <option value="物品">物品</option>
                  </select>
                </div>
                <div className="mb-4">
                  <input
                    type="text"
                    value={editTopicForm.cover_url}
                    onChange={(e) => setEditTopicForm({ ...editTopicForm, cover_url: e.target.value })}
                    placeholder="封面图片链接"
                    className="w-full bg-transparent border border-white/30 rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
                <div className="mb-4">
                  <textarea
                    value={editTopicForm.description}
                    onChange={(e) => setEditTopicForm({ ...editTopicForm, description: e.target.value })}
                    placeholder="主题简介"
                    className="w-full bg-transparent border border-white/30 rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-white/50"
                    rows={3}
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditTopic(false);
                      setEditingTopic(null);
                    }}
                    className="px-4 py-2 bg-white/20 rounded-md hover:bg-white/30 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-text text-background rounded-md hover:bg-opacity-90 transition-colors"
                    disabled={submitting}
                  >
                    {submitting ? '提交中...' : '保存'}
                  </button>
                </div>
                {error && (
                  <div className="mt-4 text-red-400 text-sm">{error}</div>
                )}
              </form>
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
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 max-w-4xl w-full border border-white/20">
              <h3 className="text-xl font-serif-jiba mb-4">新增考据分支</h3>
              <form onSubmit={handleResearchSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <input
                        type="text"
                        value={newResearch.sub_title}
                        onChange={(e) => setNewResearch({ ...newResearch, sub_title: e.target.value })}
                        placeholder="分支标题"
                        className="w-full bg-transparent border border-white/30 rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-white/50"
                      />
                    </div>
                    <div>
                      <select
                        value={newResearch.type}
                        onChange={(e) => setNewResearch({ ...newResearch, type: e.target.value as 'official' | 'fan' })}
                        className="w-full bg-transparent border border-white/30 rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-white/50"
                      >
                        <option value="official">官方设定</option>
                        <option value="fan">同好推测</option>
                      </select>
                    </div>
                    <div>
                      <textarea
                        value={newResearch.content}
                        onChange={(e) => setNewResearch({ ...newResearch, content: e.target.value })}
                        placeholder="考据内容（支持 Markdown 格式）"
                        className="w-full bg-transparent border border-white/30 rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-white/50"
                        rows={8}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={newResearch.image_url}
                        onChange={(e) => setNewResearch({ ...newResearch, image_url: e.target.value })}
                        placeholder="图片链接（可选）"
                        className="w-full bg-transparent border border-white/30 rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-white/50"
                      />
                      {newResearch.image_url && (
                        <div className="mt-2">
                          <img 
                            src={newResearch.image_url} 
                            alt="预览" 
                            className="max-h-32 object-contain rounded"
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        type="text"
                        value={newResearch.author}
                        onChange={(e) => setNewResearch({ ...newResearch, author: e.target.value })}
                        placeholder="贡献者"
                        className="w-full bg-transparent border border-white/30 rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-white/50"
                      />
                    </div>
                    <div className="flex justify-end space-x-4">
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
                  </div>
                  <div>
                    <h4 className="text-lg font-serif-jiba mb-4">预览</h4>
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 h-full overflow-auto">
                      <h2 className="text-xl font-serif-jiba mb-4">{newResearch.sub_title || '分支标题'}</h2>
                      <div dangerouslySetInnerHTML={{ __html: previewContent || '<p>请输入内容...</p>' }} />
                      {newResearch.image_url && (
                        <div className="mt-4">
                          <img 
                            src={newResearch.image_url} 
                            alt="预览" 
                            className="max-w-full h-auto rounded"
                          />
                        </div>
                      )}
                      <div className="mt-4 flex justify-between items-center">
                        <p className="text-sm text-white/60">贡献者: {newResearch.author || '未设置'}</p>
                        <span className={`px-3 py-1 rounded-full text-xs ${newResearch.type === 'official' ? 'bg-blue-500/30 text-blue-300' : 'bg-purple-500/30 text-purple-300'}`}>
                          {newResearch.type === 'official' ? '官方设定' : '同好推测'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {error && (
                  <div className="mt-4 text-red-400 text-sm">{error}</div>
                )}
              </form>
            </div>
          </motion.div>
        )}

        {/* 编辑考据内容表单 */}
        {showEditResearch && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 max-w-4xl w-full border border-white/20">
              <h3 className="text-xl font-serif-jiba mb-4">编辑考据分支</h3>
              <form onSubmit={handleEditResearchSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <input
                        type="text"
                        value={editResearchForm.sub_title}
                        onChange={(e) => setEditResearchForm({ ...editResearchForm, sub_title: e.target.value })}
                        placeholder="分支标题"
                        className="w-full bg-transparent border border-white/30 rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-white/50"
                      />
                    </div>
                    <div>
                      <select
                        value={editResearchForm.type}
                        onChange={(e) => setEditResearchForm({ ...editResearchForm, type: e.target.value as 'official' | 'fan' })}
                        className="w-full bg-transparent border border-white/30 rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-white/50"
                      >
                        <option value="official">官方设定</option>
                        <option value="fan">同好推测</option>
                      </select>
                    </div>
                    <div>
                      <textarea
                        value={editResearchForm.content}
                        onChange={(e) => setEditResearchForm({ ...editResearchForm, content: e.target.value })}
                        placeholder="考据内容（支持 Markdown 格式）"
                        className="w-full bg-transparent border border-white/30 rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-white/50"
                        rows={8}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={editResearchForm.image_url}
                        onChange={(e) => setEditResearchForm({ ...editResearchForm, image_url: e.target.value })}
                        placeholder="图片链接（可选）"
                        className="w-full bg-transparent border border-white/30 rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-white/50"
                      />
                      {editResearchForm.image_url && (
                        <div className="mt-2">
                          <img 
                            src={editResearchForm.image_url} 
                            alt="预览" 
                            className="max-h-32 object-contain rounded"
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        type="text"
                        value={editResearchForm.author}
                        onChange={(e) => setEditResearchForm({ ...editResearchForm, author: e.target.value })}
                        placeholder="贡献者"
                        className="w-full bg-transparent border border-white/30 rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-white/50"
                      />
                    </div>
                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowEditResearch(false);
                          setEditingResearch(null);
                        }}
                        className="px-4 py-2 bg-white/20 rounded-md hover:bg-white/30 transition-colors"
                      >
                        取消
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-text text-background rounded-md hover:bg-opacity-90 transition-colors"
                        disabled={submitting}
                      >
                        {submitting ? '提交中...' : '保存'}
                      </button>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-serif-jiba mb-4">预览</h4>
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 h-full overflow-auto">
                      <h2 className="text-xl font-serif-jiba mb-4">{editResearchForm.sub_title || '分支标题'}</h2>
                      <div dangerouslySetInnerHTML={{ __html: previewContent || '<p>请输入内容...</p>' }} />
                      {editResearchForm.image_url && (
                        <div className="mt-4">
                          <img 
                            src={editResearchForm.image_url} 
                            alt="预览" 
                            className="max-w-full h-auto rounded"
                          />
                        </div>
                      )}
                      <div className="mt-4 flex justify-between items-center">
                        <p className="text-sm text-white/60">贡献者: {editResearchForm.author || '未设置'}</p>
                        <span className={`px-3 py-1 rounded-full text-xs ${editResearchForm.type === 'official' ? 'bg-blue-500/30 text-blue-300' : 'bg-purple-500/30 text-purple-300'}`}>
                          {editResearchForm.type === 'official' ? '官方设定' : '同好推测'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {error && (
                  <div className="mt-4 text-red-400 text-sm">{error}</div>
                )}
              </form>
            </div>
          </motion.div>
        )}

        {/* 删除确认弹窗 */}
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 max-w-md w-full border border-white/20">
              <h3 className="text-xl font-serif-jiba mb-4">确认删除</h3>
              <p className="text-white/80 mb-6">
                {deleteType === 'topic' ? '确定要删除这个主题吗？相关的考据内容也会被删除。' : '确定要删除这个考据分支吗？'}
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-white/20 rounded-md hover:bg-white/30 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={deleteType === 'topic' ? confirmDeleteTopic : confirmDeleteResearch}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  disabled={submitting}
                >
                  {submitting ? '删除中...' : '确认删除'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-serif-jiba mb-8 text-center"
      >
        言の葉の穴
      </motion.h1>

      {/* 主题列表（首页） */}
      {!selectedTopic && (
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-text border-t-transparent rounded-full mx-auto animate-spin"></div>
              <p className="mt-4 text-white/70">加载中...</p>
            </div>
          ) : topics.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 shadow-lg text-center"
            >
              <h2 className="text-2xl font-serif-jiba mb-4">暂无主题</h2>
              <p className="text-white/70 mb-6">管理员可以通过右上角的入口添加新主题</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {topics.map((topic, index) => (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="cursor-pointer group relative"
                  onClick={() => handleTopicClick(topic)}
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden border border-white/20 hover:border-white/40 transition-colors h-full">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={topic.cover_url} 
                        alt={topic.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-70"></div>
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 bg-white/20 rounded-full text-xs">{topic.category}</span>
                      </div>
                      {/* 管理员操作按钮 */}
                      {isAuthenticated && (
                        <div className="absolute top-3 right-3 flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditTopic(topic);
                            }}
                            className="bg-white/20 hover:bg-white/30 rounded-full p-1.5 transition-colors"
                            title="编辑"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTopic(topic.id);
                            }}
                            className="bg-white/20 hover:bg-white/30 rounded-full p-1.5 transition-colors"
                            title="删除"
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-serif-jiba mb-2 line-clamp-2">{topic.title}</h3>
                      <p className="text-sm text-white/70 line-clamp-3">{topic.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 考据详情页 */}
      {selectedTopic && (
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
            <h1 className="text-3xl md:text-4xl font-serif-jiba mb-3">{selectedTopic.title}</h1>
            <p className="text-white/80 mb-4">{selectedTopic.description}</p>
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">{selectedTopic.category}</span>
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
            {loading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-text border-t-transparent rounded-full mx-auto animate-spin"></div>
                <p className="mt-4 text-white/70">加载中...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-400 mb-4">{error}</p>
                <button
                  onClick={() => fetchResearches(selectedTopic.id)}
                  className="px-6 py-2 bg-text text-background rounded-md hover:bg-opacity-90 transition-colors"
                >
                  重试
                </button>
              </div>
            ) : researches.length === 0 ? (
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
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg flex flex-col gap-4 relative"
                >
                  {/* 管理员操作按钮 */}
                  {isAuthenticated && (
                    <div className="absolute top-3 right-3 flex space-x-2 z-10">
                      <button
                        onClick={() => handleEditResearch(research)}
                        className="bg-white/20 hover:bg-white/30 rounded-full p-1.5 transition-colors"
                        title="编辑"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteResearch(research.id)}
                        className="bg-white/20 hover:bg-white/30 rounded-full p-1.5 transition-colors"
                        title="删除"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-serif-jiba">{research.sub_title}</h2>
                    <span className={`px-3 py-1 rounded-full text-xs ${research.type === 'official' ? 'bg-blue-500/30 text-blue-300' : 'bg-purple-500/30 text-purple-300'}`}>
                      {research.type === 'official' ? '官方设定' : '同好推测'}
                    </span>
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: renderMarkdown(research.content) }} />
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
      )}
    </div>
  );
}
