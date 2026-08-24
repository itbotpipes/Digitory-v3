"use client";

import Navbar from "@/features/Admin/Navbar";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminMainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-[#0d0d0e] text-zinc-900 dark:text-white font-sans transition-colors duration-300">
      <Navbar />
      <div className="flex-1 overflow-y-auto">
        <main className="min-h-screen p-6 md:p-8 lg:p-10 max-w-[1600px] mx-auto">{children}</main>
      </div>
    </div>
  );
}
