"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NotionBlogEditor from "@/features/Admin/Blog/Form/NotionBlogEditor";
import { api } from "@/lib/api";
import { PostRecord } from "@/features/Admin/Blog/Form/useBlogForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

function EditBlogPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = React.use(params);
  
  const [blog, setBlog] = useState<PostRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`/posts/${id}`, token);
        if (res.data) setBlog(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  // Autosave: saves silently without navigating away
  const autoSaveHandler = async (data: any) => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;
    try {
      await api.put(`/posts/${id}`, data, token);
    } catch (err) {
      console.error('Autosave failed:', err);
    }
  };

  // Manual save: saves then navigates back to blog list
  const submitHandler = async (data: any) => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    try {
      await api.put(`/posts/${id}`, data, token);
      router.push("/admin/dashboard?tab=blogs");
    } catch (err) {
      console.error(err);
      alert("Failed to update blog");
    }
  };

  const deleteHandler = async () => {
    if (confirm(`Are you sure you want to delete "${blog?.title}"?`)) {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      try {
        await api.delete(`/posts/${id}`, token);
        router.push("/admin/dashboard?tab=blogs");
      } catch (err) {
        console.error(err);
        alert("Failed to delete blog");
      }
    }
  };

  if (loading) {
    return (
      <div className="absolute inset-0 z-50 bg-[#191919] flex items-center justify-center text-[#8c8c8c]">
        Loading blog editor...
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="absolute inset-0 z-50 bg-[#191919] flex flex-col items-center justify-center gap-4 text-[#8c8c8c]">
        <span>Blog not found.</span>
        <button
          onClick={() => router.push("/admin/dashboard?tab=blogs")}
          className="bg-[#2eaadc] hover:bg-[#1a93c4] text-white px-4 py-1.5 text-xs font-semibold rounded cursor-pointer transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-50 bg-[#191919]">
      <NotionBlogEditor
        defaultValues={blog}
        submitHandler={submitHandler}
        autoSaveHandler={autoSaveHandler}
        onDelete={deleteHandler}
      />
    </div>
  );
}

export default EditBlogPage;
