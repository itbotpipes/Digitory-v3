import { generateSeoMetadata } from '@/lib/seo';
import { api } from '@/lib/api';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: LayoutProps) {
  const { slug } = await params;
  try {
    const res = await api.get(`/solutions?slug=${slug}`);
    const solution = Array.isArray(res.data?.docs) ? res.data.docs[0] : res.data;
    if (solution?._id) {
      return await generateSeoMetadata('Solution', solution._id, {
        title: `${solution.title} | Digitory`,
        description: solution.description || solution.subtitle || '',
      });
    }
  } catch (err) {}
  return { title: 'Solutions | Digitory' };
}

export default function SolutionSlugLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
