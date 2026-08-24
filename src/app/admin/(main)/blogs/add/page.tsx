"use client";

import NotionBlogEditor from "@/features/Admin/Blog/Form/NotionBlogEditor";
import { useRouter } from "next/navigation";
import React from "react";
import { api } from "@/lib/api";

function AddBlog() {
  const router = useRouter();

  const submitHandler = async (data: any) => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    try {
      await api.post("/posts", data, token);
      router.push("/admin/dashboard?tab=blogs");
    } catch (err) {
      console.error(err);
      alert("Failed to create blog");
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#191919]">
      <NotionBlogEditor submitHandler={submitHandler} />
    </div>
  );
}

export default AddBlog;
