import React from 'react';
import Header from '../../components/Header';
import FooterPage from '../../components/Footer';
import ScrollFocusWrapper from '../../components/ScrollFocusWrapper';
import { generateSeoMetadata } from "@/lib/seo";

import AboutHero from '../../components/about/AboutHero';
import ProblemsSection from '../../components/about/ProblemsSection';
import StorySection from '../../components/about/StorySection';
import BeliefsSection from '../../components/about/BeliefsSection';
import TeamSection from '../../components/about/TeamSection';
import MissionCta from '../../components/about/MissionCta';
import VisionSection from '../../components/about/VisionSection';

export async function generateMetadata() {
  return await generateSeoMetadata('Page', 'about', {
    title: 'About Us | Digitory',
    description: 'Learn about our journey, beliefs, and our mission.',
  });
}

export default function AboutPage() {

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d0d0e] transition-colors duration-300 flex flex-col font-sans">
      {/* Navigation Header */}
      <Header />

      {/* Page Content */}
      <main className="flex flex-col flex-1">
        <ScrollFocusWrapper>
          <AboutHero />
        </ScrollFocusWrapper>

        

        <ScrollFocusWrapper>
          <StorySection />
        </ScrollFocusWrapper>

        <ScrollFocusWrapper>
          <BeliefsSection showBeliefs={false} showStats={true} />
        </ScrollFocusWrapper>

        <ScrollFocusWrapper>
          <VisionSection />
        </ScrollFocusWrapper>

        <ScrollFocusWrapper>
          <TeamSection />
        </ScrollFocusWrapper>

        <ScrollFocusWrapper>
          <BeliefsSection showBeliefs={true} showStats={false} />
        </ScrollFocusWrapper>


        {/* <ScrollFocusWrapper>
          <ProblemsSection />
        </ScrollFocusWrapper> */}

        <ScrollFocusWrapper>
          <MissionCta />
        </ScrollFocusWrapper>
      </main>

      {/* Page Footer */}
      <FooterPage />
    </div>
  );
}
