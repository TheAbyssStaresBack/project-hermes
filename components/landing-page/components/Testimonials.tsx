'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

type Testimonial = {
  name: string;
  role: string;
  image: string;
  quote: string;
};

const testimonials: Testimonial[] = [
  {
    name: 'Conrado Santos',
    role: 'Resident',
    image:
      'https://api.dicebear.com/7.x/lorelei/svg?seed=ConradoSantos&backgroundColor=d1d5db',
    quote:
      'I just sent a message about an incident, and it was instantly understood and logged. I received updates quickly, which made me feel safe.',
  },
  {
    name: 'Engr. Carlo Reyes',
    role: 'M/CDRRMO Officer',
    image:
      'https://api.dicebear.com/7.x/lorelei/svg?seed=CarloReyes&backgroundColor=d1d5db',
    quote:
      'The system organizes reports automatically, saving us valuable time. We can focus more on responding rather than sorting data.',
  },
  {
    name: 'John Dela Cruz',
    role: 'Resident',
    image:
      'https://api.dicebear.com/7.x/lorelei/svg?seed=JohnDelaCruz&backgroundColor=d1d5db',
    quote:
      'I like how I can just chat naturally without filling out long forms. The system still captures everything accurately.',
  },
  {
    name: 'Lt. Mark Villanueva',
    role: 'Responder',
    image:
      'https://api.dicebear.com/7.x/lorelei/svg?seed=MarkVillanueva&backgroundColor=d1d5db',
    quote:
      'The real-time dashboard and map help us respond faster on the ground. Coordination has never been this smooth.',
  },
  {
    name: 'John Lucio',
    role: 'Barangay Official',
    image:
      'https://api.dicebear.com/7.x/lorelei/svg?seed=AnaLopez&backgroundColor=d1d5db',
    quote:
      'Residents can easily report incidents using familiar apps. It keeps our community informed and connected during emergencies.',
  },
  {
    name: 'Dr. Ramon Flores',
    role: 'Community Health Worker',
    image:
      'https://api.dicebear.com/7.x/lorelei/svg?seed=RamonFlores&backgroundColor=d1d5db',
    quote:
      'During medical emergencies, every second counts. This system lets us coordinate with responders instantly.',
  },
];

export function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="-mt-20 py-24 sm:py-32 relative w-full"
    >
      <div className="container mx-auto px-8 sm:px-6">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Testimonials
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Voices from the Community
          </h2>
          <p className="text-lg text-muted-foreground">
            Real experiences from residents, officers, and responders on the
            ground.
          </p>
        </div>

        {/* Testimonials Masonry Grid */}
        <div className="columns-1 gap-4 md:columns-2 md:gap-6 lg:columns-3 lg:gap-4">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="mb-6 break-inside-avoid shadow-none lg:mb-4"
            >
              <CardContent>
                <div className="flex items-start gap-4">
                  <Avatar className="bg-muted size-12 shrink-0 grayscale">
                    <AvatarImage
                      alt={testimonial.name}
                      src={testimonial.image}
                      loading="lazy"
                      width="120"
                      height="120"
                    />
                    <AvatarFallback>
                      {testimonial.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="cursor-pointer"
                    >
                      <h3 className="font-medium hover:text-primary transition-colors">
                        {testimonial.name}
                      </h3>
                    </a>
                    <span className="text-muted-foreground block text-sm tracking-wide">
                      {testimonial.role}
                    </span>
                  </div>
                </div>

                <blockquote className="mt-4">
                  <p className="text-sm leading-relaxed text-balance">
                    {testimonial.quote}
                  </p>
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
