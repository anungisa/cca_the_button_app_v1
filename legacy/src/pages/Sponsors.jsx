
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ExternalLink, Award, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const sponsorsData = {
  title: [
    { 
      name: 'PointsBet', 
      logo: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/da0748074_spons-1.png', 
      description: 'Official sports betting partner providing responsible gaming experiences for curling fans.',
      url: 'https://pointsbet.ca'
    },
    { 
      name: 'New Holland', 
      logo: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/b8777ebad_spons-2.png', 
      description: 'Agriculture equipment leader supporting Canadian communities and sports.',
      url: 'https://newholland.com'
    }
  ],
  presenting: [
    { 
      name: 'BKT Tires', 
      logo: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/9be3048da_spons-6.png', 
      description: 'Growing together with Canadian curling - premium tire solutions.',
      url: 'https://bkt-tires.com'
    },
    { 
      name: 'Kruger Products', 
      logo: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/ce4d0d16d_spons-4.png', 
      description: 'Trusted household paper products supporting Canadian families and sport.',
      url: 'https://krugerproducts.ca'
    }
  ],
  official: [
    { 
      name: 'Montana\'s BBQ & Bar', 
      logo: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/fa509eaa6_spons-5.png', 
      description: 'Here\'s how we fuel Canadian curling - great food, great atmosphere.',
      url: 'https://montanas.ca'
    },
    { 
      name: 'AMJ', 
      logo: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/61b6df0b3_amj.jpg', 
      description: 'Leading automotive and logistics solutions across Canada.',
      url: 'https://amj.ca'
    },
    { 
      name: 'Pharmasave', 
      logo: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6d6610602_pharmasave.jpg', 
      description: 'Your neighborhood pharmacy supporting healthy communities and active lifestyles.',
      url: 'https://pharmasave.com'
    }
  ],
  equipment: [
    {
      name: 'Goldline Curling',
      logo: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/7247cc8e1_goldline.jpg',
      description: 'Official equipment supplier - premium curling stones, brooms, and accessories.',
      url: 'https://goldlinecurling.com'
    }
  ],
  media: [
    {
      name: 'TSN',
      logo: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/812fcc4a4_tsn.jpg',
      description: 'Canada\'s Sports Leader - broadcasting curling to millions of fans.',
      url: 'https://tsn.ca'
    },
    {
      name: 'Sportsnet',
      logo: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/584a67375_images1.png',
      description: 'Comprehensive curling coverage and championship broadcasts.',
      url: 'https://sportsnet.ca'
    }
  ],
  supporting: [
    {
      name: 'Sport Canada',
      logo: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/4182891cf_gouv-can.jpg',
      description: 'Federal government support for high performance sport development.',
      url: 'https://canada.ca/sport'
    },
    {
      name: 'Canadian Olympic Committee',
      logo: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/20dcbc515_olympique.jpg',
      description: 'Supporting Canadian athletes on their journey to the Olympics.',
      url: 'https://olympic.ca'
    }
  ]
};

const SponsorCard = ({ sponsor, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <Card className="bg-brand-card-bg border-brand-border overflow-hidden h-full flex flex-col hover:shadow-lg hover:border-brand-red transition-all duration-300">
      <div className="bg-white p-6 flex items-center justify-center h-32 min-h-[128px]">
        <img 
          src={sponsor.logo} 
          alt={`${sponsor.name} logo`} 
          className="max-h-16 max-w-full object-contain"
        />
      </div>
      <CardContent className="p-6 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-brand-text-primary mb-2">{sponsor.name}</h3>
        <p className="text-brand-text-secondary text-sm flex-grow leading-relaxed">{sponsor.description}</p>
        <Button 
          asChild 
          variant="outline" 
          size="sm"
          className="mt-4 border-brand-red text-brand-red hover:bg-brand-red hover:text-white"
        >
          <a href={sponsor.url} target="_blank" rel="noopener noreferrer">
            Visit Site <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </Button>
      </CardContent>
    </Card>
  </motion.div>
);

const SponsorSection = ({ title, sponsors, tier, icon: Icon }) => {
  const getTierBadge = () => {
    switch(tier) {
      case 'title':
        return <span className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-1 rounded-full text-sm font-bold ml-3">Title Sponsors</span>;
      case 'presenting':
        return <span className="inline-block bg-gradient-to-r from-blue-500 to-blue-700 text-white px-3 py-1 rounded-full text-sm font-bold ml-3">Presenting Partners</span>;
      case 'official':
        return <span className="inline-block bg-gradient-to-r from-green-500 to-green-700 text-white px-3 py-1 rounded-full text-sm font-bold ml-3">Official Partners</span>;
      case 'equipment':
        return <span className="inline-block bg-gradient-to-r from-purple-500 to-purple-700 text-white px-3 py-1 rounded-full text-sm font-bold ml-3">Equipment Partners</span>;
      case 'media':
        return <span className="inline-block bg-gradient-to-r from-red-500 to-red-700 text-white px-3 py-1 rounded-full text-sm font-bold ml-3">Media Partners</span>;
      case 'supporting':
        return <span className="inline-block bg-gradient-to-r from-gray-500 to-gray-700 text-white px-3 py-1 rounded-full text-sm font-bold ml-3">Supporting Partners</span>;
      default:
        return null;
    }
  };

  return (
    <section className="mb-12">
      <div className="flex items-center mb-6">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-8 h-8 text-brand-red" />}
          <h2 className="text-3xl font-bold text-brand-text-primary">{title}</h2>
        </div>
        {getTierBadge()}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sponsors.map((sponsor, index) => (
          <SponsorCard key={sponsor.name} sponsor={sponsor} delay={index * 0.1} />
        ))}
      </div>
    </section>
  );
};

export default function Sponsors() {
  return (
    <div className="min-h-screen bg-brand-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Heart className="w-12 h-12 text-brand-red mx-auto mb-4" />
          <h1 className="text-4xl font-extrabold text-brand-text-primary mb-4">Our Corporate Partners</h1>
          <p className="text-lg text-brand-text-secondary max-w-4xl mx-auto">
            Curling Canada is proud to work with outstanding corporate partners who share our vision of growing the sport of curling across the country. Together, we're building a stronger curling community from coast to coast to coast.
          </p>
        </motion.div>

        <SponsorSection 
          title="Title Sponsors" 
          sponsors={sponsorsData.title} 
          tier="title"
          icon={Award}
        />
        
        <SponsorSection 
          title="Presenting Partners" 
          sponsors={sponsorsData.presenting} 
          tier="presenting"
          icon={Star}
        />
        
        <SponsorSection 
          title="Official Partners" 
          sponsors={sponsorsData.official} 
          tier="official"
          icon={Heart}
        />

        <SponsorSection 
          title="Equipment Partners" 
          sponsors={sponsorsData.equipment} 
          tier="equipment"
        />

        <SponsorSection 
          title="Media Partners" 
          sponsors={sponsorsData.media} 
          tier="media"
        />

        <SponsorSection 
          title="Supporting Partners" 
          sponsors={sponsorsData.supporting} 
          tier="supporting"
        />

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-12"
        >
          <Card className="bg-brand-card-bg border-brand-border">
            <CardHeader>
              <CardTitle className="text-center text-2xl text-brand-text-primary">Partnership Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-brand-red rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-brand-text-primary mb-2">Brand Visibility</h3>
                  <p className="text-brand-text-secondary text-sm">Reach millions of curling fans across Canada through our events, broadcasts, and digital platforms.</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-brand-red rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-brand-text-primary mb-2">Community Impact</h3>
                  <p className="text-brand-text-secondary text-sm">Support grassroots curling development and help grow the sport from coast to coast.</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-brand-red rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-brand-text-primary mb-2">Exclusive Access</h3>
                  <p className="text-brand-text-secondary text-sm">VIP experiences, championship access, and unique marketing opportunities.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Partnership CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <Card className="bg-gradient-to-r from-brand-red to-red-700 text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Partner with Curling Canada?</h2>
              <p className="text-red-100 mb-6 max-w-2xl mx-auto">
                Join these incredible brands in supporting the growth and development of curling across Canada. 
                Let's explore how we can work together to strengthen Canadian curling.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="bg-white/90 text-red-700 hover:bg-white"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Partnership Information
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white/50 text-white hover:bg-white/10"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  View Official Partners Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
