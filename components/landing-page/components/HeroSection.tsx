'use client';
import demoThumbnail from '@/components/brand/image.png';
import { Button } from '@/components/ui/button';
import { useTypewriter } from '@/hooks/use-typewriter';
import { ArrowRight, Pause, Play } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';

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

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play();
      setIsPlaying(true);
      setHasStarted(true);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 w-full min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 py-20 mt-[-81px]">
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

      {/* Hero Text + CTA */}
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

      {/* Hero Video */}
      <div className="relative z-10 mx-auto mt-7 w-full max-w-2xl px-4">
        <div className="relative group">
          {/* Glow effect */}
          {/* Changed w-[90%] to w-[50%] and lowered opacity */}
          <div className="absolute top-2 lg:-top-8 left-1/2 -translate-x-1/2 w-[80%] h-20 lg:h-60 bg-primary/30 rounded-full blur-3xl" />

          <div className="relative rounded-xl border bg-card shadow-2xl overflow-hidden">
            {/* Thumbnail — visible only before first play */}
            {!hasStarted && (
              <Image
                src={demoThumbnail}
                alt="Demo video thumbnail"
                width={1200}
                height={700}
                className="w-full rounded-xl object-cover"
                priority
              />
            )}

            {/* Video — rendered always but hidden until started to avoid layout shift */}
            <video
              ref={videoRef}
              src="/demo.mp4"
              width={1200}
              height={700}
              playsInline
              className={`w-full rounded-xl object-cover ${hasStarted ? 'block' : 'hidden'}`}
              onEnded={() => setIsPlaying(false)}
            />

            {/* Play / Pause button overlay */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                isPlaying
                  ? 'bg-transparent opacity-0 group-hover:opacity-100'
                  : 'bg-black/20 opacity-100'
              }`}
            >
              <Button
                size="lg"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause demo video' : 'Play demo video'}
                className="rounded-full h-16 w-16 p-0 hover:scale-105 transition-transform"
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6 fill-current" />
                ) : (
                  <Play className="h-6 w-6 fill-current" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
