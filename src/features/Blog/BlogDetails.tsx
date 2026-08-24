"use client";

import React, { useMemo, useState, useEffect } from "react";
import { ArrowLeft, Clock, User, Tag, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import RichEditor from "@/components/rich-text-editor/RichEditor";
import { api } from "@/lib/api";

interface BlogDetailsProps {
  blog: any;
}

function BlogDetails({ blog }: BlogDetailsProps) {
  const readTime = useMemo(() => {
    return Math.max(1, Math.ceil((blog.content?.length || 0) / 100)); // rough estimation
  }, [blog.content]);

  // Comments State
  const [comments, setComments] = useState<any[]>([]);
  const [newCommentName, setNewCommentName] = useState("");
  const [newCommentText, setNewCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (blog._id) {
      api.get(`/comments/post/${blog._id}`)
        .then((res) => {
          if (res.data) setComments(res.data);
        })
        .catch(console.error);
    }
  }, [blog._id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentName.trim() || !newCommentText.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await api.post("/comments", {
        post: blog._id,
        name: newCommentName,
        text: newCommentText,
      });
      if (res.data) {
        setComments((prev) => [res.data, ...prev]);
        setNewCommentName("");
        setNewCommentText("");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20 animate-fade-in">
      {/* Back link */}
      <Link 
        href="/blogs" 
        className="inline-flex items-center text-zinc-500 dark:text-zinc-400 hover:text-[#FF4F18] dark:hover:text-[#FF4F18] transition-colors mb-8 md:mb-12 font-bold text-xs uppercase tracking-widest gap-2 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> 
        <span>Back to all articles</span>
      </Link>
      
      <header className="mb-12">
        {/* Category & Time */}
        <div className="flex items-center gap-4 mb-6 text-xs sm:text-sm">
          <span className="bg-[#FFF3EF] dark:bg-[#FF4F18]/10 text-[#FF4F18] border border-orange-100 dark:border-transparent px-3.5 py-1.5 rounded-full font-extrabold tracking-widest uppercase text-[10px] sm:text-[11px]">
            {typeof blog.category === 'object' && blog.category ? blog.category.name : (blog.category || "Article")}
          </span>
          <span className="text-zinc-400 dark:text-zinc-500 flex items-center font-semibold text-xs uppercase tracking-wider">
            <Clock size={14} className="mr-1.5 text-zinc-400" /> {readTime} min read
          </span>
        </div>
        
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-[52px] font-[850] tracking-tight text-zinc-900 dark:text-white leading-[1.1] mb-8">
          {blog.title}
        </h1>
        
        {/* Author / Share row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-zinc-200/60 dark:border-zinc-800/60">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-850 rounded-full flex items-center justify-center text-zinc-500 overflow-hidden">
              <User size={22} className="text-zinc-400 dark:text-zinc-600" />
            </div>
            <div>
              <p className="font-extrabold text-zinc-900 dark:text-white text-sm">
                {typeof blog.author === 'object' && blog.author ? blog.author.name : (blog.author || "Admin")}
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold mt-0.5">
                {new Date(blog.createdAt).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Share:</span>
            <button className="w-9 h-9 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-[#FFF3EF] hover:text-[#FF4F18] hover:border-orange-200 dark:hover:bg-[#FF4F18]/10 dark:hover:border-transparent transition-all font-extrabold text-[10px] tracking-widest cursor-pointer">
              TW
            </button>
            <button className="w-9 h-9 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-[#FFF3EF] hover:text-[#FF4F18] hover:border-orange-200 dark:hover:bg-[#FF4F18]/10 dark:hover:border-transparent transition-all font-extrabold text-[10px] tracking-widest cursor-pointer">
              FB
            </button>
            <button className="w-9 h-9 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-[#FFF3EF] hover:text-[#FF4F18] hover:border-orange-200 dark:hover:bg-[#FF4F18]/10 dark:hover:border-transparent transition-all font-extrabold text-[10px] tracking-widest cursor-pointer">
              LI
            </button>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {blog.featuredImage && (
        <div className="w-full aspect-[21/9] bg-zinc-100 dark:bg-zinc-900 rounded-[28px] overflow-hidden mb-16 relative border border-zinc-200/60 dark:border-zinc-800/60 shadow-2xs">
          <Image 
            src={blog.featuredImage} 
            alt={blog.title} 
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Excerpt */}
      {blog.excerpt && (
        <div className="text-lg md:text-xl text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed mb-12 italic border-l-4 border-[#FF4F18] pl-6">
          {blog.excerpt}
        </div>
      )}

      {/* Rich content editor */}
      <div className="prose prose-lg prose-orange dark:prose-invert max-w-none text-zinc-850 dark:text-zinc-200
        [&_.rich-editorjs]:max-w-none [&_.rich-editorjs]:w-full [&_.ProseMirror]:bg-transparent [&_.ProseMirror]:border-none [&_.ProseMirror]:text-zinc-800 dark:[&_.ProseMirror]:text-zinc-200 [&_.ProseMirror]:px-0 [&_.ProseMirror]:py-0 [&_.ProseMirror]:min-h-0 focus:outline-none select-none
      ">
        <RichEditor 
          defaultValue={blog.content} 
          notionMode={true} 
          editable={false} 
        />
      </div>

      {/* Tags */}
      {(blog.tags && blog.tags.length > 0) && (
        <div className="mt-16 pt-8 border-t border-zinc-200/60 dark:border-zinc-800/60">
          <div className="flex items-center gap-3 flex-wrap">
            <Tag size={16} className="text-zinc-400 dark:text-zinc-550" />
            {blog.tags.map((tag: any, idx: number) => (
              <span 
                key={idx} 
                className="bg-zinc-100 dark:bg-zinc-900/50 text-zinc-700 dark:text-zinc-300 px-4 py-1.5 rounded-full text-xs font-extrabold hover:bg-[#FFF3EF] dark:hover:bg-[#FF4F18]/15 hover:text-[#FF4F18] dark:hover:text-[#FF4F18] transition-colors border border-transparent hover:border-orange-100 dark:hover:border-transparent cursor-pointer"
              >
                {tag.tag || tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Discussion / Comments Section */}
      <div className="mt-16 pt-12 border-t border-zinc-200/60 dark:border-zinc-800/60 space-y-10">
        <h3 className="text-2xl font-[850] text-[#111111] dark:text-white tracking-tight">
          Discussion ({comments.length})
        </h3>

        {/* Comments List */}
        <div className="space-y-6">
          {comments.map((comment: any) => (
            <div
              key={comment._id}
              className="bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-250/30 dark:border-zinc-800/60 p-6 rounded-[24px] flex flex-col sm:flex-row gap-5"
            >
              <div className="w-12 h-12 bg-[#FFF3EF] dark:bg-[#FF4F18]/10 text-[#FF4F18] rounded-full flex items-center justify-center font-extrabold text-lg shrink-0 border border-orange-100/50 dark:border-transparent">
                {comment.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h4 className="font-extrabold text-zinc-900 dark:text-white text-base">{comment.name}</h4>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-semibold mb-3 mt-0.5">{new Date(comment.createdAt).toLocaleDateString()}</p>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-sm">{comment.text}</p>
              </div>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-zinc-400 dark:text-zinc-500 italic text-sm">No comments yet. Be the first to share your thoughts!</p>
          )}
        </div>

        {/* Add Comment Form */}
        <div className="bg-white dark:bg-zinc-900/40 p-6 md:p-8 rounded-[28px] border border-zinc-200/60 dark:border-zinc-800/60 shadow-2xs mt-8">
          <h4 className="font-[850] text-zinc-900 dark:text-white mb-6 text-xl tracking-tight">Add a comment</h4>
          <form onSubmit={handleAddComment} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">Your Name</label>
              <input
                type="text"
                value={newCommentName}
                onChange={(e) => setNewCommentName(e.target.value)}
                placeholder="John Doe"
                required
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#FF4F18] focus:border-[#FF4F18] transition-all text-sm font-semibold"
              />
            </div>
            
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">Your Comment</label>
              <textarea
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Share your thoughts..."
                required
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#FF4F18] focus:border-[#FF4F18] transition-all resize-none text-sm font-semibold"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 self-start bg-[#FF4F18] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#E03F0D] transition-all shadow-[0_8px_20px_rgba(255,79,24,0.35)] hover:shadow-[0_10px_24px_rgba(255,79,24,0.45)] disabled:opacity-50 active:scale-[0.98] cursor-pointer text-sm"
            >
              {isSubmitting ? "Posting..." : "Post Comment"}
            </button>
          </form>
        </div>
      </div>

    </article>
  );
}

export default BlogDetails;
