import Header from "../components/Header";
import Hero from "../components/home/Hero";
import Stats from "../components/home/Stats";
import TestSection from "../components/home/TestSection";
import Features from "../components/home/Features";
import Updates from "../components/home/Updates";
import ScrollFocusWrapper from "../components/ScrollFocusWrapper";
import OrdersPage from "../components/home/Orders";
import RestaurantOSPage from "../components/home/RestaurantOS";
import FAQPage from "../components/home/FAQ";
import InsightsPage from "../components/home/Insights";
import FooterPage from "../components/Footer";
import { generateSeoMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return await generateSeoMetadata('Page', 'home', {
    title: 'Digitory | Restaurant Operating System',
    description: 'Transform your restaurant operations and grow margins.',
  });
}
export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="flex flex-col">
        <ScrollFocusWrapper>
          <Hero />
        </ScrollFocusWrapper>
        <ScrollFocusWrapper>
          <Stats />
        </ScrollFocusWrapper>
        <ScrollFocusWrapper>
          <TestSection />
        </ScrollFocusWrapper>
        <ScrollFocusWrapper>
          <Features />
        </ScrollFocusWrapper>
        <ScrollFocusWrapper>
          <Updates />
        </ScrollFocusWrapper>
        <ScrollFocusWrapper>
          <OrdersPage />
        </ScrollFocusWrapper>
        <ScrollFocusWrapper>
          <RestaurantOSPage />
        </ScrollFocusWrapper>
        <ScrollFocusWrapper>
          <FAQPage />
        </ScrollFocusWrapper>
        <ScrollFocusWrapper>
          <InsightsPage />
        </ScrollFocusWrapper>
        <ScrollFocusWrapper>
          <FooterPage />
        </ScrollFocusWrapper>
      </main>
    </div>
  );
}
