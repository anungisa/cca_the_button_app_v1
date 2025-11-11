
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, LifeBuoy, Zap, User, Building, Ticket } from 'lucide-react';

const faqData = {
  general: [
    { q: 'What is The Button?', a: 'The Button is the official digital hub for the Canadian curling community, connecting fans, players, and clubs.' },
    { q: 'How do I create an account?', a: 'You can create an account by clicking the "Sign Up" button on the homepage and following the prompts.' }
  ],
  xp_loyalty: [
    { q: 'How do I earn XP?', a: 'You earn XP (Experience Points) by engaging with the platform: watching live games, volunteering, donating, participating in trivia, and more.' },
    { q: 'What are Tiers?', a: 'Tiers are levels in our Granite Circle loyalty program. You advance through tiers by earning XP, unlocking new benefits and rewards.' }
  ],
  profile: [
    { q: 'How do I update my profile?', a: 'Navigate to your Profile page and click the "Edit Profile" button to update your information.' },
    { q: 'How do I affiliate with a club?', a: 'Go to the Clubs page, find your club, and click "Set as Home Club".' }
  ],
  clubs: [
    { q: 'How do I find a curling club?', a: 'Use the "Clubs" page to search and filter for clubs across Canada by location and other criteria.' }
  ],
  events: [
    { q: 'Where can I find event schedules?', a: 'The "Events" page lists all upcoming competitions and events, with links to schedules and live scoring.' }
  ]
};

export default function HelpCenter() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFaqs = Object.entries(faqData).reduce((acc, [category, questions]) => {
    const filteredQuestions = questions.filter(
      faq => faq.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
             faq.a.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filteredQuestions.length > 0) {
      acc[category] = filteredQuestions;
    }
    return acc;
  }, {});

  const categoryInfo = {
    general: { title: 'General', icon: LifeBuoy },
    xp_loyalty: { title: 'XP & Loyalty', icon: Zap },
    profile: { title: 'Profile & Account', icon: User },
    clubs: { title: 'Clubs', icon: Building },
    events: { title: 'Events', icon: Ticket }
  };

  return (
    <div className="min-h-screen bg-brand-charcoal">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="text-center mb-8">
          <LifeBuoy className="w-16 h-16 text-brand-red mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-brand-text-primary">Help Center</h1>
          <p className="text-xl text-brand-text-secondary mt-2">How can we help you?</p>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-text-secondary w-5 h-5" />
          <Input
            placeholder="Search for answers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 text-lg h-12"
          />
        </div>

        {Object.entries(filteredFaqs).map(([category, questions]) => {
          const CategoryIcon = categoryInfo[category].icon;
          return (
            <Card key={category} className="bg-brand-card-bg border-brand-border mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CategoryIcon className="w-5 h-5 text-brand-red" />
                  {categoryInfo[category].title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {questions.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger>{faq.q}</AccordionTrigger>
                      <AccordionContent>{faq.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          );
        })}
        
        {Object.keys(filteredFaqs).length === 0 && (
          <p className="text-center text-brand-text-secondary">No results found for "{searchTerm}". Try another search.</p>
        )}

        <Card className="mt-8 bg-brand-red/10 border-brand-red/20 text-center">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-brand-text-primary mb-2">Can't find an answer?</h3>
            <p className="text-brand-text-secondary mb-4">Our support team is ready to assist you.</p>
            <Button>Contact Support</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
