import ClientPage from "./ClientPage";
import { api } from "@/lib/api";
import { notFound } from "next/navigation";
import { generateSeoMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  try {
    const res = await api.get(`/posts/${slug}`);
    if (res.data) {
      return await generateSeoMetadata('Post', res.data._id, {
        title: `${res.data.title} | Digitory`,
        description: res.data.excerpt || '',
      });
    }
  } catch (err) {}
  
  return {
    title: 'Blog | Digitory',
  };
}

async function BlogDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  
  let blog = null;
  try {
    const res = await api.get(`/posts/${slug}`);
    if (res.data) {
      blog = res.data;
    }
  } catch (err) {
    console.error("Failed to fetch blog", err);
  }

  if (!blog) {
    return notFound();
  }

  return (
    <ClientPage article={blog} />
  );
}

export default BlogDetailsPage;
