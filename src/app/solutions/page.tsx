import React from 'react';
import Header from '../../components/Header';
import FooterPage from '../../components/Footer';
import ScrollFocusWrapper from '../../components/ScrollFocusWrapper';
import { generateSeoMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return await generateSeoMetadata('Page', 'solutions', {
    title: 'Solutions | Digitory',
    description: 'Explore our restaurant operating system solutions.',
  });
}

import RestaurantOSHero from '../../components/solutions/RestaurantOSHero';
import RadialCommandCenter from '../../components/solutions/RadialCommandCenter';
import SolutionsStats from '../../components/solutions/SolutionsStats';
import Capabilities from '../../components/solutions/Capabilities';
import ChainControlDeck from '../../components/solutions/ChainControlDeck';
import RestaurantTypes from '../../components/solutions/RestaurantTypes';
import RoiCalculator from '../../components/solutions/RoiCalculator';
import ToolIntegrations from '../../components/solutions/ToolIntegrations';
import SolutionsCta from '../../components/solutions/SolutionsCta';
import InsightsPage from '../../components/home/Insights';

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0d0d0e] transition-colors duration-300 flex flex-col font-sans">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex flex-col">
        {/* 1. Hero */}
        <ScrollFocusWrapper>
          <RestaurantOSHero />
        </ScrollFocusWrapper>

        {/* 2. Everything your restro needs in one place */}
        <ScrollFocusWrapper>
          <RadialCommandCenter />
        </ScrollFocusWrapper>

        {/* 3. Counter */}
        <ScrollFocusWrapper>
          <SolutionsStats />
        </ScrollFocusWrapper>

        {/* 4. Service list (solution detail link section) */}
        <ScrollFocusWrapper>
          <Capabilities />
        </ScrollFocusWrapper>

        {/* 5. One dashboard, every location in sync */}
        <ScrollFocusWrapper>
          <ChainControlDeck />
        </ScrollFocusWrapper>

        {/* 6. Connects with your fav app */}
        <ScrollFocusWrapper>
          <ToolIntegrations />
        </ScrollFocusWrapper>

        {/* 7. See how much you can save */}
        <ScrollFocusWrapper>
          <RoiCalculator />
        </ScrollFocusWrapper>

        {/* 8. Latest insights */}
        <ScrollFocusWrapper>
          <InsightsPage />
        </ScrollFocusWrapper>

        {/* Hidden / Commented Sections */}
        {/* <ScrollFocusWrapper>
          <RestaurantTypes />
        </ScrollFocusWrapper> */}
        {/* <ScrollFocusWrapper>
          <SolutionsCta />
        </ScrollFocusWrapper> */}
      </main>

      {/* Footer */}
      <FooterPage />
    </div>
  );
}
