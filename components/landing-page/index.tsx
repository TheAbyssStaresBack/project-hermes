import { AuthButton } from '@/components/auth-button';
import { Suspense } from 'react';
import { StepOneIllustration } from '../StepOne';
import { StepThreeIllustration } from '../StepThree';
import { StepTwoIllustration } from '../StepTwo';
import { ChallengesSection } from './components/ChallengeSection';
import { FeatureSection } from './components/FeatureSection';
import { NewHeroSection as HeroSection } from './components/HeroSection';
import { AboutSection } from './components/IntroducingHermes';
import { Navbar } from './components/NavBar';
import { StatSection } from './components/StatSection';

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
        <StepOneIllustration />
        <StepTwoIllustration />
        <StepThreeIllustration />
      </div>
    </main>
  );
}
