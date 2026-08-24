import { generateSeoMetadata } from '@/lib/seo';
import { api } from '@/lib/api';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: LayoutProps) {
  const { slug } = await params;
  try {
    const res = await api.get(`/industries?slug=${slug}`);
    const industry = Array.isArray(res.data?.docs) ? res.data.docs[0] : res.data;
    if (industry?._id) {
      return await generateSeoMetadata('Solution', industry._id, {
        title: `${industry.title} | Digitory`,
        description: industry.description || industry.subtitle || '',
      });
    }
  } catch (err) {}
  return { title: 'Industries | Digitory' };
}

export default function RestaurantTypeSlugLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
