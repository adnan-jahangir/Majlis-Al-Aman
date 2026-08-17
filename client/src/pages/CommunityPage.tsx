import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Users, 
  Flame, 
  Send, 
  MessageSquare, 
  Sparkles, 
  Heart,
  RefreshCw,
  Clock,
  Smile
} from 'lucide-react';
import { api } from '../services/api';
import { CommunityPost } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

// Helper for human-friendly relative time
const formatRelativeTime = (dateString: string): string => {
  try {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 30) return 'Just now';
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return 'Recently';
  }
};

export const CommunityPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newPostContent, setNewPostContent] = useState<string>('');
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [activeCommentPostId, setActiveCommentPostId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittingCommentId, setSubmittingCommentId] = useState<number | null>(null);

  const isMountedRef = useRef(true);

  const loadFeed = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsRefreshing(true);
    try {
      const res = await api.getCommunityFeed();
      if (isMountedRef.current) {
        setPosts(res.feed || []);
      }
    } catch (err: any) {
      console.error('Failed to load community feed:', err);
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    loadFeed();

    // Auto-poll every 12 seconds so all users see real-time updates & messages from others
    const interval = setInterval(() => {
      loadFeed(true);
    }, 12000);

    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, [loadFeed]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await api.createPost({ content: newPostContent.trim() });
      if (res.post) {
        setPosts(prev => [res.post, ...prev]);
      }
      setNewPostContent('');
      showToast({ message: 'Message shared with the community! 🌿', type: 'success' });
      // Re-fetch to ensure sync
      loadFeed(true);
    } catch (err: any) {
      showToast({ message: err.message || 'Failed to share post', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleReaction = async (postId: number, reactionType: string) => {
    if (!isAuthenticated) {
      showToast({ message: 'Please sign in to react to posts', type: 'info' });
      return;
    }

    try {
      const res = await api.reactToPost(postId, reactionType);
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            reactions: res.reactions as any,
            userReactions: res.userReactions || [],
            totalReactions: res.totalReactions || 0
          };
        }
        return p;
      }));
    } catch (err) {
      console.error('Reaction error:', err);
    }
  };

  const handleAddComment = async (postId: number) => {
    const commentText = commentInputs[postId];
    if (!commentText || !commentText.trim()) return;

    setSubmittingCommentId(postId);
    try {
      const res = await api.addComment(postId, commentText.trim());
      if (res.comment) {
        setPosts(prev => prev.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              comments: [...(p.comments || []), res.comment],
              commentsCount: (p.commentsCount || 0) + 1
            };
          }
          return p;
        }));
      }
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    } catch (err: any) {
      showToast({ message: err.message || 'Failed to post comment', type: 'error' });
    } finally {
      setSubmittingCommentId(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header with Live Sync Status */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/[0.08] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
            <Users className="w-4 h-4" />
            <span>Fellowship & Mutual Dua</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Community Encouragement
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            A live feed to share reflections, spiritual milestones, and make du’a for one another.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadFeed()}
          disabled={isRefreshing}
          className="self-start sm:self-center flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-all disabled:opacity-50 shadow-sm"
          title="Refresh Feed"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Syncing...' : 'Refresh Feed'}</span>
        </button>
      </div>

      {/* Share Post Card */}
      {isAuthenticated ? (
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-emerald-500/30 shadow-xl shadow-emerald-950/20">
          <form onSubmit={handleCreatePost}>
            <div className="flex items-start space-x-3.5">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                alt={user?.name || 'User'}
                className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0 mt-0.5"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.username || 'user'}`;
                }}
              />
              <div className="flex-1">
                <textarea
                  rows={2}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Share a thought, Ayah reflection, milestone, or dua for the community..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 transition-colors resize-none placeholder:text-slate-500"
                />
                <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                  <span className="text-xs text-slate-500 flex items-center space-x-1">
                    <Smile className="w-3.5 h-3.5 text-emerald-400 inline" />
                    <span>Visible instantly to all community members</span>
                  </span>
                  <button
                    type="submit"
                    disabled={isSubmitting || !newPostContent.trim()}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all disabled:opacity-50"
                  >
                    <span>{isSubmitting ? 'Sharing...' : 'Share Update'}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
          Sign in to post updates, comment, and send du'as to the community.
        </div>
      )}

      {/* Feed Posts */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin mx-auto" />
            <p className="text-sm text-slate-400">Loading community feed...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="py-16 text-center space-y-3 p-8 rounded-3xl bg-slate-900/40 border border-slate-800">
            <Users className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No posts yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Be the first to share an inspiring reflection, Ayah, or prayer milestone with fellow believers!
            </p>
          </div>
        ) : (
          posts.map((post) => {
            const hasBarakallah = (post.userReactions || []).includes('barakallah');
            const hasMashallah = (post.userReactions || []).includes('mashallah');
            const hasMabrook = (post.userReactions || []).includes('mabrook');
            const hasHeart = (post.userReactions || []).includes('heart');

            return (
              <div
                key={post.id}
                className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-white/[0.08] shadow-lg hover:border-slate-700 transition-all space-y-4"
              >
                {/* Author Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={post.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={post.name || 'User'}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/bottts/svg?seed=${post.username || 'user'}`;
                      }}
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-sm text-white">{post.name}</h3>
                        {post.current_streak ? (
                          <span className="inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                            <Flame className="w-3 h-3 text-amber-400" />
                            <span>{post.current_streak}d</span>
                          </span>
                        ) : null}
                      </div>
                      <p className="text-[11px] text-slate-400">@{post.username}</p>
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-500 flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-slate-600 inline" />
                    <span>{formatRelativeTime(post.created_at)}</span>
                  </span>
                </div>

                {/* Milestone Badge Pill (if any) */}
                {post.badge_info && (
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-emerald-500/15 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{typeof post.badge_info === 'string' ? JSON.parse(post.badge_info).title : post.badge_info.title}</span>
                  </div>
                )}

                {/* Content */}
                <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>

                {/* Reactions Bar */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => handleToggleReaction(post.id, 'barakallah')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                      hasBarakallah
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                        : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border-slate-700/60'
                    }`}
                  >
                    <span>🤲 BarakAllah</span>
                    <span className="text-[11px] font-bold text-emerald-400">
                      {post.reactions?.barakallah || 0}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleReaction(post.id, 'mashallah')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                      hasMashallah
                        ? 'bg-teal-500/20 text-teal-300 border-teal-500/50'
                        : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border-slate-700/60'
                    }`}
                  >
                    <span>✨ MashAllah</span>
                    <span className="text-[11px] font-bold text-teal-400">
                      {post.reactions?.mashallah || 0}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleReaction(post.id, 'mabrook')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                      hasMabrook
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border-slate-700/60'
                    }`}
                  >
                    <span>🎉 Mabrook</span>
                    <span className="text-[11px] font-bold text-amber-400">
                      {post.reactions?.mabrook || 0}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleReaction(post.id, 'heart')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                      hasHeart
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                        : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border-slate-700/60'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${hasHeart ? 'text-rose-400 fill-rose-400' : 'text-slate-400'}`} />
                    <span className="text-[11px] font-bold text-rose-400">
                      {post.reactions?.heart || 0}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60 ml-auto"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{post.commentsCount || (post.comments ? post.comments.length : 0)} comments</span>
                  </button>
                </div>

                {/* Comments Section (Toggled) */}
                {activeCommentPostId === post.id && (
                  <div className="pt-3 border-t border-slate-800/80 space-y-3">
                    {/* Existing Comments */}
                    {post.comments && post.comments.length > 0 ? (
                      post.comments.map((c) => (
                        <div key={c.id} className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-slate-800/40 text-xs">
                          <img
                            src={c.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                            alt={c.name || 'Commenter'}
                            className="w-6 h-6 rounded-lg object-cover border border-slate-700 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/bottts/svg?seed=${c.username || 'user'}`;
                            }}
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-slate-200">{c.name}</span>
                              <span className="text-[10px] text-slate-500">
                                {formatRelativeTime(c.created_at)}
                              </span>
                            </div>
                            <p className="text-slate-300 mt-0.5">{c.comment}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 italic py-1">No comments yet. Write a response below.</p>
                    )}

                    {/* Add Comment Input */}
                    {isAuthenticated && (
                      <div className="flex items-center space-x-2 pt-1">
                        <input
                          type="text"
                          value={commentInputs[post.id] || ''}
                          onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(post.id); }}
                          placeholder="Write an encouraging comment or du'a..."
                          className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                        />
                        <button
                          type="button"
                          disabled={submittingCommentId === post.id || !commentInputs[post.id]?.trim()}
                          onClick={() => handleAddComment(post.id)}
                          className="px-3 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors disabled:opacity-50"
                        >
                          {submittingCommentId === post.id ? 'Sending...' : 'Reply'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
