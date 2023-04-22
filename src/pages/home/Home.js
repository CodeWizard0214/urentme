import React from 'react';

import { HeroSection } from './HeroSection';
import { SearchSection } from './SearchSection';
import { DestinationSection } from './DestinationSection';
import NearbySection from './NearbySection';
import FeatureSection from './FeatureSection';
import ProcessSection from './ProcessSection';
import { NewsSection } from './NewsSection';
import { RegisterSection } from './RegisterSection';
import { TestimonialSection } from './TestimonialSection';

const Home = () => {
  return (
    <>
      <HeroSection title="Search For Your Perfect Outdoor Adventure" />
      <SearchSection />
      <DestinationSection />
      <NearbySection />
      <FeatureSection />
      <ProcessSection />
      <NewsSection />
      <RegisterSection />
      <TestimonialSection />
    </>
  );
};

export default Home;