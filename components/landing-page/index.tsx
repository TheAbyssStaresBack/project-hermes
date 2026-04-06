import { AuthButton } from '@/components/auth-button';
import { Suspense } from 'react';
import { ChallengesSection } from './components/ChallengeSection';
import { FeatureSection } from './components/FeatureSection';
import { NewHeroSection as HeroSection } from './components/HeroSection';
import { HowItWorks } from './components/HowItWorks';
import { AboutSection } from './components/IntroducingHermes';
import { Navbar } from './components/NavBar';
import { StatSection } from './components/StatSection';
import { TeamSection } from './components/TeamSection';

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <Navbar
          authButton={
            <Suspense>
              <AuthButton />
            </Suspense>
          }
        />
        <HeroSection />
        <StatSection />
        <ChallengesSection />
        <AboutSection />
        <FeatureSection />
        <HowItWorks />
        <TeamSection />
      </div>
    </main>
  );
}
