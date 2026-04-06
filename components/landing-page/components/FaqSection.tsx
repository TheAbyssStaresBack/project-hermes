'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CircleHelp } from 'lucide-react';

type FaqItem = {
  value: string;
  question: string;
  answer: string;
};

const faqItems: FaqItem[] = [
  {
    value: 'item-1',
    question: 'What is Project HERMES?',
    answer:
      'HERMES (Hazard & Emergency Reporting, Monitoring, and Evaluation System) is a centralized DRRM communication platform for M/CDRRMOs. Residents submit incident reports via Telegram or Messenger, while officers monitor and respond through a web-based dashboard.',
  },
  {
    value: 'item-2',
    question: 'Why is this system named after the Greek god Hermes?',
    answer:
      'Hermes is the Greek messenger god — patron of communication and swift action. Like the god, our system bridges residents and disaster responders, ensuring critical information reaches the right people at the right moment.',
  },
  {
    value: 'item-3',
    question:
      'How does HERMES convert citizen messages into structured incident reports?',
    answer:
      'HERMES uses a built-in NLP engine to extract key fields — incident type, location, time, severity, and description — from free-form text. It supports both English and Filipino, so residents can report naturally without a specific format.',
  },
  {
    value: 'item-4',
    question: 'Which messaging platforms can residents use to submit reports?',
    answer:
      'Residents can report via Telegram or Facebook Messenger. A chatbot guides them through either a freeform or step-by-step form, with a quick onboarding flow for first-time users covering language selection and basic instructions.',
  },
  {
    value: 'item-5',
    question: 'Can HERMES send alerts or advisories back to residents?',
    answer:
      'Yes. Officers can broadcast advisories to residents through the same chatbot channels — either as mass broadcasts or targeted to specific areas. Predefined templates for common situations are available, or officers can compose custom messages.',
  },
  {
    value: 'item-6',
    question: 'What happens if the AI parses an incident report incorrectly?',
    answer:
      'HERMES includes a human validation layer. Users can manually review and correct any parsed data before submission, and officers can edit existing dashboard entries to ensure accuracy.',
  },
  {
    value: 'item-7',
    question: 'How does HERMES help M/CDRRMO officers manage incoming reports?',
    answer:
      'Officers access a secure web dashboard showing real-time reports via a live feed and map view. They can filter reports, edit parsed data, update statuses, add notes, and dispatch or escalate responses — all from one interface.',
  },
];

const FaqSection = () => {
  return (
    <section id="faq" className="-mt-30 py-24 sm:py-32 relative w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <Badge variant="outline" className="mb-4">
            FAQ
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about Project HERMES — how it works, who
            uses it, and how it helps your community respond faster.
          </p>
        </div>

        {/* FAQ Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-transparent">
            <div className="p-0">
              <Accordion type="single" collapsible className="space-y-5">
                {faqItems.map((item) => (
                  <AccordionItem
                    key={item.value}
                    value={item.value}
                    className="rounded-md !border bg-transparent"
                  >
                    <AccordionTrigger className="cursor-pointer items-center gap-4 rounded-none bg-transparent py-2 ps-3 pe-4 hover:no-underline data-[state=open]:border-b">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-full">
                          <CircleHelp className="size-5" />
                        </div>
                        <span className="text-start font-semibold">
                          {item.question}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-transparent">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          {/* Contact Support CTA */}
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Still have questions? We&apos;re here to help.
            </p>
            <Button className="cursor-pointer" asChild>
              <a href="#contact">Contact Support</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export { FaqSection };
