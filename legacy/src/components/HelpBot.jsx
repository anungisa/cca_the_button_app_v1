
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  X, 
  Send, 
  Compass, 
  HelpCircle,
  Lightbulb,
  Play,
  ChevronRight,
  Star,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SLIDER_RESPONSES = { // Renamed from SKIP_RESPONSES
  greeting: [
    "Hey there! I'm Slider, your digital curling guide! 🥌",
    "Welcome to The Button! I'm Slider - here to guide your game and your journey.",
    "Hi! I'm Slider, and I know this place like the back of my curling glove!"
  ],
  
  guidance: {
    "home": "Your dashboard is command central - see your XP journey, recent activity, and quick access to everything curling!",
    "clubs": "Finding your curling home! Set a home club to unlock personalized content and connect with your community.",
    "ftloc": "For The Love of Curling - where we celebrate our scholarship athletes and support youth development!",
    "get involved": "Ready to give back? Discover ways to volunteer, coach, officiate, or contribute to Canadian curling!",
    "high performance": "Elite training tools and Smart Broom analytics for competitive athletes pushing their limits.",
    "granite circle": "Your loyalty journey! Earn XP, unlock badges, and redeem rewards for being part of the community!",
    "safe sport": "Keeping our sport safe and inclusive - essential training and policies for everyone."
  },

  tips: [
    "💡 Slider's Tip: Complete your profile to earn 25 Journey XP and unlock personalized recommendations!",
    "💡 Slider's Wisdom: Set a home club to see local events and connect with your curling family!",
    "💡 From Slider: Check Get Involved to find volunteer opportunities and earn big XP rewards!",
    "💡 Slider Says: Smart Broom users can sync sessions for detailed performance analytics!",
    "💡 Slider's Secret: Daily social threads are an easy way to earn XP and connect with fellow curlers!"
  ],

  faqs: [
    {
      q: "How do I earn XP?",
      a: "Great question! You earn XP by completing your profile, volunteering, donating to FTLOC, watching livestreams, participating in social threads, and many other activities. Check your Granite Circle page to see all the ways!"
    },
    {
      q: "What's the difference between user types?",
      a: "User types determine what content you see: Athletes get performance tools, Coaches see team management, Volunteers get event opportunities, and Fans get community content. You can update this in your profile!"
    },
    {
      q: "How do I set my home club?",
      a: "Go to the 'Find Your Club' page, search for your club, and click 'Set as My Club'. This unlocks personalized content and earns you the 'Rooted Curler' badge!"
    }
  ],

  personality: [
    "I'm here to guide your game — and your journey.",
    "Think of me as your curling GPS - I'll help you navigate to exactly where you want to go!",
    "Every champion needs a good guide. Consider me yours, digitally speaking!",
    "Questions about curling? About The Button? I've got the rock on this one."
  ]
};

const GUIDED_TOURS = [
  {
    id: 'first_time',
    title: 'First Time User Tour',
    description: 'Perfect for new members! Learn the basics.',
    steps: [
      { page: 'Home', highlight: '.user-profile', text: "This is your profile area - click to complete your info and earn XP!" },
      { page: 'Clubs', highlight: '.club-search', text: "Find your local club here to unlock personalized content." },
      { page: 'LoyaltyProgram', highlight: '.xp-bar', text: "Track your XP and badges in the Granite Circle!" }
    ]
  },
  {
    id: 'athlete_tour',
    title: 'High Performance Tour',
    description: 'For competitive athletes and coaches.',
    steps: [
      { page: 'HighPerformanceHub', highlight: '.performance-tracker', text: "Log your training and track progress here." },
      { page: 'SmartBroomHub', highlight: '.broom-connect', text: "Connect your Smart Broom for detailed analytics." }
    ]
  }
];

export default function HelpBot({ currentPage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    // Show intro for first-time visitors
    const hasSeenIntro = localStorage.getItem('slider_intro_seen'); // Changed from skip_intro_seen
    if (!hasSeenIntro) {
      setTimeout(() => setShowIntro(true), 2000);
    }
  }, []);

  useEffect(() => {
    // Context-aware greeting when bot opens
    if (isOpen && messages.length === 0) {
      const greeting = SLIDER_RESPONSES.greeting[Math.floor(Math.random() * SLIDER_RESPONSES.greeting.length)];
      const contextTip = getContextualTip(currentPage);
      
      setMessages([
        { type: 'bot', text: greeting },
        { type: 'bot', text: contextTip }
      ]);
    }
  }, [isOpen, currentPage]);

  const getContextualTip = (page) => {
    const tips = {
      'Home': "You're at home base! Try clicking your XP progress to see how to continue your curling journey.",
      'Clubs': "Looking for your curling home? Use the filters to find clubs by province or programs offered.",
      'GetInvolvedHub': "So many paths to explore! Each pathway shows the Journey XP you can earn for giving back.",
      'LoyaltyProgram': "Welcome to your Granite Circle! Complete challenges to earn badges and grow your curling story.",
      'HighPerformanceHub': "Elite training awaits! Make sure to sync your Smart Broom for the complete experience.",
      'SafeSportHub': "Safety first, champions! Complete your training to unlock volunteer opportunities."
    };
    return tips[page] || "Need help navigating your curling journey? Just ask me anything!";
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setInputValue('');

    // Simple AI-like response logic
    setTimeout(() => {
      const response = generateResponse(userMessage);
      setMessages(prev => [...prev, { type: 'bot', text: response }]);
    }, 500);
  };

  const generateResponse = (input) => {
    const lowerInput = input.toLowerCase();
    
    // Navigation help with Slider personality
    for (const [key, response] of Object.entries(SLIDER_RESPONSES.guidance)) {
      if (lowerInput.includes(key)) {
        return response;
      }
    }

    // FAQ matching
    for (const faq of SLIDER_RESPONSES.faqs) {
      if (lowerInput.includes(faq.q.toLowerCase().split(' ')[0])) {
        return faq.a;
      }
    }

    // XP and Journey related
    if (lowerInput.includes('xp') || lowerInput.includes('points') || lowerInput.includes('journey')) {
      return "Journey XP represents your growing connection to curling! Complete your profile, volunteer, donate, participate in the community, and more. Check your Granite Circle to see all the ways to grow your curling story!";
    }

    // Personality responses
    const sliderResponses = [ // Renamed from skipResponses
      "As your digital guide, I'm here to help guide your curling journey! Try asking about XP, finding clubs, or navigating any part of The Button.",
      "Great question! I may be digital, but my curling knowledge is real. Ask me about features, earning Journey XP, or getting started.",
      "Let me call this one for you! Try asking about specific pages, features, or how to make the most of your time in The Button."
    ];
    
    return sliderResponses[Math.floor(Math.random() * sliderResponses.length)];
  };

  const startTour = (tourId) => {
    // In a real implementation, this would trigger a guided tour
    alert(`Starting ${GUIDED_TOURS.find(t => t.id === tourId)?.title}! (Feature coming soon)`);
  };

  const handleClose = () => {
    setIsOpen(false);
    setMessages([]);
    setActiveTab('chat');
  };

  const IntroPopup = () => (
    <AnimatePresence>
      {showIntro && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-20 right-6 z-50"
        >
          <Card className="w-80 bg-white shadow-2xl border-2 border-brand-red">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/835784f34_ImageJul9.png"
                  alt="Slider, the curling mascot" // Changed alt text
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">Hey! I'm Slider!</h4> {/* Changed name */}
                  <p className="text-sm text-gray-600 mb-3">
                    I'm here to guide your game and your journey through The Button. Think of me as your digital curling mascot! {/* Changed description */}
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => { 
                        setIsOpen(true); 
                        setShowIntro(false); 
                        localStorage.setItem('slider_intro_seen', 'true'); // Changed local storage key
                      }}
                      className="bg-brand-red hover:bg-red-700"
                    >
                      Let's Go!
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => { 
                        setShowIntro(false); 
                        localStorage.setItem('slider_intro_seen', 'true'); // Changed local storage key
                      }}
                      className="border-gray-300 text-gray-600"
                    >
                      Maybe Later
                    </Button>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setShowIntro(false);
                    localStorage.setItem('slider_intro_seen', 'true'); // Changed local storage key
                  }}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Close intro popup"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <IntroPopup />
      
      {/* Bot Toggle Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-40"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => isOpen ? handleClose() : setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-brand-red hover:bg-red-700 shadow-lg"
          aria-label={isOpen ? "Close Slider" : "Open Slider"} // Changed aria-label
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </Button>
      </motion.div>

      {/* Bot Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] z-40"
          >
            <Card className="h-full bg-white shadow-2xl border-2 border-brand-red">
              <CardHeader className="pb-2 bg-brand-red text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/835784f34_ImageJul9.png"
                      alt="Slider mascot" // Changed alt text
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <CardTitle className="text-lg text-white">Slider</CardTitle> {/* Changed name */}
                      <p className="text-xs text-white/80">Your Digital Curling Guide</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleClose}
                    className="text-white/70 hover:text-white hover:bg-white/20"
                    aria-label="Close Slider panel" // Changed aria-label
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                
                {/* Tabs */}
                <div className="flex gap-1 mt-3">
                  <Button
                    size="sm"
                    variant={activeTab === 'chat' ? 'secondary' : 'ghost'}
                    onClick={() => setActiveTab('chat')}
                    className="flex-1 text-white hover:bg-white/20"
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Chat
                  </Button>
                  <Button
                    size="sm"
                    variant={activeTab === 'tours' ? 'secondary' : 'ghost'}
                    onClick={() => setActiveTab('tours')}
                    className="flex-1 text-white hover:bg-white/20"
                  >
                    <Compass className="w-4 h-4 mr-1" />
                    Tours
                  </Button>
                  <Button
                    size="sm"
                    variant={activeTab === 'faqs' ? 'secondary' : 'ghost'}
                    onClick={() => setActiveTab('faqs')}
                    className="flex-1 text-white hover:bg-white/20"
                  >
                    <HelpCircle className="w-4 h-4 mr-1" />
                    FAQs
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="flex flex-col h-full p-4 bg-white">
                {activeTab === 'chat' && (
                  <>
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg text-sm ${
                              message.type === 'user'
                                ? 'bg-brand-red text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            {message.text}
                          </div>
                        </div>
                      ))}
                      
                      {/* Quick Action Buttons */}
                      {messages.length <= 2 && (
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setMessages(prev => [...prev, 
                              { type: 'user', text: 'How do I earn XP?' },
                              { type: 'bot', text: generateResponse('How do I earn XP?') }
                            ])}
                            className="text-xs border-gray-300 text-gray-700"
                          >
                            How do I earn XP?
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setMessages(prev => [...prev,
                              { type: 'user', text: 'Find my club' },
                              { type: 'bot', text: generateResponse('clubs') }
                            ])}
                            className="text-xs border-gray-300 text-gray-700"
                          >
                            Find my club
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    {/* Input */}
                    <div className="flex gap-2">
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Ask me anything..."
                        className="bg-white border-gray-300 text-gray-900"
                      />
                      <Button onClick={handleSendMessage} size="icon" className="bg-brand-red hover:bg-red-700">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                )}
                
                {activeTab === 'tours' && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 mb-4">
                      Let me show you around! Choose a guided tour:
                    </p>
                    {GUIDED_TOURS.map((tour) => (
                      <Card key={tour.id} className="bg-gray-50 border-gray-200">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900 text-sm">{tour.title}</h4>
                              <p className="text-xs text-gray-600">{tour.description}</p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => startTour(tour.id)}
                              className="bg-brand-red hover:bg-red-700"
                            >
                              <Play className="w-3 h-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                
                {activeTab === 'faqs' && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 mb-4">
                      Common questions I get asked:
                    </p>
                    {SLIDER_RESPONSES.faqs.map((faq, index) => (
                      <Card key={index} className="bg-gray-50 border-gray-200">
                        <CardContent className="p-3">
                          <h4 className="font-medium text-gray-900 text-sm mb-2">{faq.q}</h4>
                          <p className="text-xs text-gray-600 leading-relaxed">{faq.a}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
