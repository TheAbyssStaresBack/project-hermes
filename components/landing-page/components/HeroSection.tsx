'use client';
import { Button } from '@/components/ui/button';
import { useTypewriter } from '@/hooks/use-typewriter';
import { ArrowRight, Play } from 'lucide-react';

const INCIDENT_TYPES = [
  'Fire',
  'Flood',
  'Earthquake',
  'Medical Emergency',
  'Typhoon',
  'Landslide',
  'Vehicular Accident',
  'Disaster',
];

const TYPING_SPEED = 80;
const DELETING_SPEED = 40;
const PAUSE_DURATION = 1500;

export function NewHeroSection() {
  const { displayText, isLocked } = useTypewriter(
    INCIDENT_TYPES,
    TYPING_SPEED,
    DELETING_SPEED,
    PAUSE_DURATION
  );

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 w-full min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-20 mt-[-81px]">
      <style>{`
        .hero-grid::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(to right, rgba(0,0,0,0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.08) 1px, transparent 1px);
          background-size: 40px 40px;
          background-position: top center;
        }
        .dark .hero-grid::before {
          background-image:
            linear-gradient(to right, rgba(255,255,255,0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.07) 1px, transparent 1px);
        }
        .hero-grid::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, hsl(var(--background)) 100%);
          pointer-events: none;
        }

        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        .typewriter-cursor {
          display: inline-block;
          width: 2px;
          height: 0.8em;
          background: currentColor;
          margin-left: 3px;
          vertical-align: middle;
          border-radius: 1px;
          animation: blink 0.9s step-end infinite;
          position: relative;
          top: -1px;
        }
        .typewriter-cursor.locked {
          opacity: 0;
          animation: none;
        }
      `}</style>

      <div className="hero-grid absolute inset-0" />

      <div className="relative z-10 w-full max-w-4xl text-center px-4">
        <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl leading-tight">
          One Platform.
          <br />
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent inline-flex items-center justify-center">
            {displayText}
            <span
              className={`typewriter-cursor${isLocked ? ' locked' : ''}`}
              style={{ background: 'hsl(var(--primary))' }}
            />
          </span>
          <br />
          Response.
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
          HERMES unifies disaster reporting, real-time coordination, and
          resource dispatching into a single AI-powered command center — so
          responders act faster when every second counts.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" className="group gap-2">
            Get Started
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button size="lg" variant="outline" className="group gap-2">
            <Play className="h-4 w-4" />
            Watch Demo
          </Button>
        </div>
      </div>
    </section>
  );
}
