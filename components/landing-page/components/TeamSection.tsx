'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CardDecorator } from '@/components/ui/card-decorator';
import { Github } from 'lucide-react';

const team = [
  {
    id: 1,
    name: 'Andrian Lloyd Maagma',
    role: 'Lead Developer',
    description:
      '2nd year Computer Science student at the University of the Philippines Visayas',
    fallback: 'AM',
    social: { github: 'https://github.com/andrianllmm' },
  },
  {
    id: 2,
    name: 'Dejel Cyrus De Asis',
    role: 'Developer',
    description:
      '2nd year Computer Science student at the University of the Philippines Visayas',
    fallback: 'DC',
    social: { github: 'https://github.com/dejely' },
  },
  {
    id: 3,
    name: 'Justin Lauricio',
    role: 'Developer',
    description:
      '2nd year Computer Science student at the University of the Philippines Visayas',
    fallback: 'JL',
    social: { github: 'https://github.com/llaollao902' },
  },
  {
    id: 4,
    name: 'John Romyr Lopez',
    role: 'Developer',
    description:
      '2nd year Computer Science student at the University of the Philippines Visayas',
    fallback: 'JR',
    social: { github: 'https://github.com/Romyr05' },
  },
  {
    id: 5,
    name: 'Julian Medalla',
    role: 'Developer',
    description:
      '2nd year Computer Science student at the University of the Philippines Visayas',
    fallback: 'JM',
    social: { github: 'https://github.com/TheAbyssStaresBack' },
  },
];

export function TeamSection() {
  return (
    <section
      id="team"
      className="-mt-30 py-24 bg-muted/30 sm:py-32 flex justify-center relative w-full"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Our Team
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
            Meet Popcorn Prophets
          </h2>
          <p className="text-lg text-muted-foreground">
            We’ve been taught that innovation is most meaningful when it serves
            the people. We are dedicated to using our technical skills to bridge
            the gap between technology and the community, creating solutions
            that empower and uplift those around us.
          </p>
        </div>

        {/* Centered Team Container */}
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap justify-center gap-8">
            {team.map((member) => (
              <Card
                key={member.id}
                className="shadow-sm py-2 w-full max-w-[280px] shrink-0 border-muted/50"
              >
                <CardContent className="p-6">
                  <div className="text-center">
                    {/* Avatar */}
                    <div className="flex justify-center mb-4">
                      <CardDecorator>
                        <Avatar className="h-24 w-24 border-2 border-background shadow-md">
                          <AvatarImage
                            alt={member.name}
                            className="object-cover"
                          />
                          <AvatarFallback className="text-lg font-semibold">
                            {member.fallback}
                          </AvatarFallback>
                        </Avatar>
                      </CardDecorator>
                    </div>

                    {/* Name and Role */}
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {member.name}
                    </h3>
                    <p className="text-sm font-medium text-primary mb-3">
                      {member.role}
                    </p>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed line-clamp-3">
                      {member.description}
                    </p>

                    {/* Social Links */}
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                        asChild
                      >
                        <a
                          href={member.social.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="GitHub"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
