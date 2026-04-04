'use client';

import Wordmark from '@/components/brand/wordmark';
import { Card, CardContent } from '@/components/ui/card';
import { CardDecorator } from '@/components/ui/card-decorator';
import { Code, Crown, Layout, Palette } from 'lucide-react';

const values = [
  {
    icon: Code,
    title: 'Developer First',
    description:
      'Every component is built with the developer experience in mind, ensuring clean code and easy integration.',
  },
  {
    icon: Palette,
    title: 'Design Excellence',
    description:
      'We maintain the highest design standards, following shadcn/ui principles and modern UI patterns.',
  },
  {
    icon: Layout,
    title: 'Production Ready',
    description:
      'Battle-tested components used in real applications with proven performance and reliability across different environments.',
  },
  {
    icon: Crown,
    title: 'Premium Quality',
    description:
      'Hand-crafted with attention to detail and performance optimization, ensuring exceptional user experience and accessibility.',
  },
];

export function AboutSection() {
  return (
    <section id="about" className="py-20 sm:py-32 -mt-20 relative w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-4xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
            Introducing
          </h2>
          <div className="flex h-28 justify-center mb-4">
            <Wordmark />
          </div>
          <p className="text-lg text-muted-foreground mb-8">
            We&apos;re passionate about creating the best marketplace for
            shadcn/ui components and templates. Our mission is to accelerate
            development and help developers build beautiful admin interfaces
            faster.
          </p>
        </div>

        {/* Modern Values Grid with Enhanced Design */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-4 mb-12">
          {values.map((value, index) => (
            <Card key={index} className="group shadow-xs py-2">
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center">
                  <CardDecorator>
                    <value.icon className="h-6 w-6" aria-hidden />
                  </CardDecorator>
                  <h3 className="mt-6 font-medium text-balance">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground mt-3 text-sm">
                    {value.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
