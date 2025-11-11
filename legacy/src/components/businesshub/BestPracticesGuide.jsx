import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Lightbulb, Users, DollarSign, Megaphone } from 'lucide-react';

const bestPractices = [
  {
    icon: Users,
    title: "Boosting Member Retention",
    content: "Engage new members early with welcome events. Conduct regular member surveys to gather feedback. Create a mentorship program to pair new and experienced curlers."
  },
  {
    icon: DollarSign,
    title: "Diversifying Revenue Streams",
    content: "Explore corporate event packages, 'Learn to Curl' clinics for businesses, and themed social nights. Partner with local businesses for sponsorships."
  },
  {
    icon: Megaphone,
    title: "Effective Social Media Marketing",
    content: "Showcase member stories and testimonials. Post high-quality photos and videos of club life. Run contests and giveaways to increase engagement."
  }
];

export default function BestPracticesGuide() {
  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader>
        <CardTitle>Best Practices Guide</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {bestPractices.map(item => (
            <AccordionItem key={item.title} value={item.title}>
              <AccordionTrigger>
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-brand-red" />
                  <span className="font-semibold">{item.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-brand-text-secondary pl-8">
                {item.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}