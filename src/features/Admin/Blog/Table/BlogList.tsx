"use client";

import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { DataTable } from "@/components/ui/DataTable";
import ActionsCell from "./ActionCell";
import clsx from "clsx";
import { api } from "@/lib/api";

interface BlogListProps {
  className?: string;
}

export type PostRecord = {
  _id: string;
  title: string;
  slug: string;
  status: string;
  author?: { name?: string };
  category?: { name?: string };
  createdAt: string;
  updatedAt: string;
};

const BlogList: React.FC<BlogListProps> = ({ className }) => {
  const [blogs, setBlogs] = useState<PostRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    const fetchPosts = async () => {
      try {
        const res = await api.get('/posts?limit=100', token);
        setBlogs(res.data?.docs || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const columns: ColumnDef<PostRecord>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "author",
      header: "Author",
      cell: ({ row }) => row.original.author?.name || "Admin",
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => row.original.category?.name || "Uncategorized",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span className={clsx("px-2.5 py-1 rounded-full text-xs font-bold", row.original.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700')}>
          {row.original.status}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        const d = new Date(row.original.createdAt);
        return <span>{format(d, "MMM d, yyyy")}</span>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const item = row.original;
        return <ActionsCell item={item} />;
      },
    },
  ];

  if (loading) return <div>Loading blogs...</div>;

  return (
    <div className={clsx("max-w-[80rem]", className)}>
      <DataTable columns={columns} data={blogs} />
    </div>
  );
};

export default BlogList;