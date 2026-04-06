'use client';

import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="-mt-20 py-16 lg:py-24 bg-muted/80 relative w-full">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <div className="space-y-8">
              {/* Main Content */}
              <div className="space-y-6">
                <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                  Faster response starts with
                  <span className="flex sm:inline-flex justify-center">
                    <span className="relative mx-2">
                      <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        better communication
                      </span>
                      <div className="absolute start-0 -bottom-2 h-1 w-full bg-gradient-to-r from-primary/30 to-secondary/30" />
                    </span>
                  </span>
                </h1>

                <p className="text-muted-foreground mx-auto max-w-2xl text-balance lg:text-xl">
                  HERMES connects your community and your DRRMO office in real
                  time — turning unstructured citizen reports into actionable
                  incident data, instantly.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col justify-center gap-4 sm:flex-row sm:gap-6">
                <Button
                  size="lg"
                  className="cursor-pointer px-8 py-4 text-lg font-medium"
                  asChild
                >
                  <a href="#get-started">Get Started</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
