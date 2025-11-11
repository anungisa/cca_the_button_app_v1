import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Database, Server, TrendingUp, Globe, Video, Mail,
  CheckCircle, Activity, Heart, Trophy, BarChart3, Users,
  CreditCard, MessageSquare, Image, DollarSign, PieChart, GraduationCap, Shield,
  CheckSquare, Cloud, Github,
  FileSignature, Target, Tv, MapPin,
  Share2, Ticket, Zap, FileText, Grid3x3, Headphones,
  ShoppingBag, Sparkles
} from 'lucide-react';
import DOMOIntegration from './DOMOIntegration';
import MongoDBIntegration from './MongoDBIntegration';
import HerokuIntegration from './HerokuIntegration';
import GiveCloudIntegration from './GiveCloudIntegration';
import CurlingIOIntegration from './CurlingIOIntegration';
import CurlingZoneIntegration from './CurlingZoneIntegration';
import CTRSIntegration from './CTRSIntegration';
import YouTubeIntegration from './YouTubeIntegration';
import MailchimpIntegration from './MailchimpIntegration';
import RegistrationEcosystem from './RegistrationEcosystem';
import ADPIntegration from './ADPIntegration';
import TrustEventIntegration from './TrustEventIntegration';
import AccreditIntegration from './AccreditIntegration';
import BrandwatchIntegration from './BrandwatchIntegration';
import CantoIntegration from './CantoIntegration';
import QuickBooksIntegration from './QuickBooksIntegration';
import BudgytIntegration from './BudgytIntegration';
import MonerisIntegration from './MonerisIntegration';
import TeamworksAMSIntegration from './TeamworksAMSIntegration';
import PolarGarminIntegration from './PolarGarminIntegration';
import MoodleIntegration from './MoodleIntegration';
import SidelineLearningIntegration from './SidelineLearningIntegration';
import ApprovalMaxIntegration from './ApprovalMaxIntegration';
import WordPressIntegration from './WordPressIntegration';
import M365Integration from './M365Integration';
import DocuSignIntegration from './DocuSignIntegration';
import VividataIntegration from './VividataIntegration';
import TSNIntegration from './TSNIntegration';
import AWSIntegration from './AWSIntegration';
import StripeIntegration from './StripeIntegration';
import ZoomIntegration from './ZoomIntegration';
import SocialMediaIntegration from './SocialMediaIntegration';
import TicketmasterIntegration from './TicketmasterIntegration';
import ZapierIntegration from './ZapierIntegration';
import FormstackIntegration from './FormstackIntegration';
import PointsBetIntegration from './PointsBetIntegration';
import SmartsheetIntegration from './SmartsheetIntegration';
import GoogleAnalyticsIntegration from './GoogleAnalyticsIntegration';
import GitHubIntegration from './GitHubIntegration';
import ZendeskIntegration from './ZendeskIntegration';
import HubSpotIntegration from './HubSpotIntegration';
import ShopifyIntegration from './ShopifyIntegration';
import DonorPerfectIntegration from './DonorPerfectIntegration';
import DartfishIntegration from './DartfishIntegration';
import FalconIOIntegration from './FalconIOIntegration';
import NumerisIntegration from './NumerisIntegration';
import ActiveXchangeIntegration from './ActiveXchangeIntegration';
import KITIntegration from './KITIntegration';
import CanadianTireFinancialIntegration from './CanadianTireFinancialIntegration';
import OpenAIIntegration from './OpenAIIntegration';
import CurlingCAIntegration from './CurlingCAIntegration';

const integrationCategories = [
  {
    name: 'Curling Data',
    integrations: [
      { id: 'curlingio', name: 'Curling.io', icon: BarChart3, color: 'blue' },
      { id: 'curlingzone', name: 'CurlingZone', icon: Globe, color: 'green' },
      { id: 'ctrs', name: 'CTRS', icon: Trophy, color: 'amber' },
    ]
  },
  {
    name: 'Member & Registration',
    integrations: [
      { id: 'registration', name: 'CurlingReg Ecosystem', icon: Users, color: 'indigo' },
    ]
  },
  {
    name: 'Operations & Events',
    integrations: [
      { id: 'trustevent', name: 'TrustEvent', icon: Users, color: 'orange' },
      { id: 'accredit', name: 'Accredit', icon: CreditCard, color: 'teal' },
      { id: 'ticketmaster', name: 'Ticketmaster', icon: Ticket, color: 'blue' },
      { id: 'kit', name: 'KIT', icon: FileText, color: 'emerald' },
    ]
  },
  {
    name: 'Fundraising & Donations',
    integrations: [
      { id: 'givecloud', name: 'GiveCloud', icon: Heart, color: 'pink' },
      { id: 'donorperfect', name: 'DonorPerfect', icon: Heart, color: 'rose' },
    ]
  },
  {
    name: 'Finance & Payments',
    integrations: [
      { id: 'stripe', name: 'Stripe', icon: CreditCard, color: 'purple' },
      { id: 'moneris', name: 'Moneris', icon: CreditCard, color: 'red' },
      { id: 'quickbooks', name: 'QuickBooks', icon: DollarSign, color: 'green' },
      { id: 'budgyt', name: 'Budgyt', icon: PieChart, color: 'cyan' },
      { id: 'approvalmax', name: 'ApprovalMax', icon: CheckSquare, color: 'blue' },
    ]
  },
  {
    name: 'HR & Payroll',
    integrations: [
      { id: 'adp', name: 'ADP', icon: Users, color: 'blue' },
      { id: 'docusign', name: 'DocuSign', icon: FileSignature, color: 'blue' },
    ]
  },
  {
    name: 'High Performance',
    integrations: [
      { id: 'teamworksams', name: 'Teamworks AMS', icon: Users, color: 'indigo' },
      { id: 'dartfish', name: 'Dartfish', icon: Video, color: 'red' },
      { id: 'polargarmin', name: 'Polar/Garmin', icon: Activity, color: 'blue' },
      { id: 'ctfs', name: 'CTFS Analytics', icon: BarChart3, color: 'orange' },
    ]
  },
  {
    name: 'Learning & Development',
    integrations: [
      { id: 'moodle', name: 'Moodle', icon: GraduationCap, color: 'teal' },
      { id: 'sideline', name: 'Sideline Learning', icon: Shield, color: 'green' },
    ]
  },
  {
    name: 'Marketing & Content',
    integrations: [
      { id: 'curlingca', name: 'Curling.ca', icon: Globe, color: 'red' },
      { id: 'wordpress', name: 'Business of Curling', icon: Globe, color: 'blue' },
      { id: 'youtube', name: 'YouTube', icon: Video, color: 'red' },
      { id: 'mailchimp', name: 'Mailchimp', icon: Mail, color: 'orange' },
      { id: 'brandwatch', name: 'Brandwatch', icon: MessageSquare, color: 'purple' },
      { id: 'canto', name: 'Canto', icon: Image, color: 'pink' },
      { id: 'social', name: 'Social Media APIs', icon: Share2, color: 'pink' },
      { id: 'falconio', name: 'Falcon.io', icon: Share2, color: 'purple' },
      { id: 'hubspot', name: 'HubSpot', icon: Users, color: 'orange' },
    ]
  },
  {
    name: 'Sponsorship & Measurement',
    integrations: [
      { id: 'vividata', name: 'Vividata', icon: Target, color: 'purple' },
      { id: 'tsn', name: 'TSN', icon: Tv, color: 'red' },
      { id: 'numeris', name: 'Numeris', icon: Tv, color: 'blue' },
      { id: 'pointsbet', name: 'PointsBet', icon: Target, color: 'purple' },
      { id: 'google_analytics', name: 'Google Analytics', icon: BarChart3, color: 'blue' },
    ]
  },
  {
    name: 'Demographics & Analytics',
    integrations: [
      { id: 'activexchange', name: 'ActiveXchange', icon: MapPin, color: 'cyan' },
    ]
  },
  {
    name: 'E-Commerce',
    integrations: [
      { id: 'shopify', name: 'Shop.Curling.ca', icon: ShoppingBag, color: 'green' },
    ]
  },
  {
    name: 'AI & Machine Learning',
    integrations: [
      { id: 'openai', name: 'OpenAI', icon: Sparkles, color: 'purple' },
    ]
  },
  {
    name: 'Infrastructure & Tools',
    integrations: [
      { id: 'domo', name: 'DOMO', icon: TrendingUp, color: 'purple' },
      { id: 'mongodb', name: 'MongoDB', icon: Database, color: 'green' },
      { id: 'heroku', name: 'Heroku', icon: Server, color: 'purple' },
      { id: 'm365', name: 'Microsoft 365', icon: Cloud, color: 'blue' },
      { id: 'aws', name: 'Amazon Web Services', icon: Cloud, color: 'orange' },
      { id: 'zoom', name: 'Zoom', icon: Video, color: 'blue' },
      { id: 'zapier', name: 'Zapier', icon: Zap, color: 'orange' },
      { id: 'formstack', name: 'Formstack', icon: FileText, color: 'green' },
      { id: 'smartsheet', name: 'Smartsheet', icon: Grid3x3, color: 'blue' },
      { id: 'github', name: 'GitHub', icon: Github, color: 'gray' },
      { id: 'zendesk', name: 'Zendesk', icon: Headphones, color: 'green' },
    ]
  },
];

export default function IntegrationHub() {
  const [activeIntegration, setActiveIntegration] = useState('curlingio');

  const renderIntegrationContent = () => {
    switch (activeIntegration) {
      case 'curlingio': return <CurlingIOIntegration />;
      case 'curlingzone': return <CurlingZoneIntegration />;
      case 'ctrs': return <CTRSIntegration />;
      case 'givecloud': return <GiveCloudIntegration />;
      case 'donorperfect': return <DonorPerfectIntegration />;
      case 'registration': return <RegistrationEcosystem />;
      case 'trustevent': return <TrustEventIntegration />;
      case 'accredit': return <AccreditIntegration />;
      case 'kit': return <KITIntegration />;
      case 'adp': return <ADPIntegration />;
      case 'docusign': return <DocuSignIntegration />;
      case 'stripe': return <StripeIntegration />;
      case 'ctfs': return <CanadianTireFinancialIntegration />;
      case 'quickbooks': return <QuickBooksIntegration />;
      case 'budgyt': return <BudgytIntegration />;
      case 'moneris': return <MonerisIntegration />;
      case 'approvalmax': return <ApprovalMaxIntegration />;
      case 'teamworksams': return <TeamworksAMSIntegration />;
      case 'dartfish': return <DartfishIntegration />;
      case 'polargarmin': return <PolarGarminIntegration />;
      case 'moodle': return <MoodleIntegration />;
      case 'sideline': return <SidelineLearningIntegration />;
      case 'curlingca': return <CurlingCAIntegration />;
      case 'wordpress': return <WordPressIntegration />;
      case 'youtube': return <YouTubeIntegration />;
      case 'mailchimp': return <MailchimpIntegration />;
      case 'brandwatch': return <BrandwatchIntegration />;
      case 'canto': return <CantoIntegration />;
      case 'social': return <SocialMediaIntegration />;
      case 'falconio': return <FalconIOIntegration />;
      case 'vividata': return <VividataIntegration />;
      case 'tsn': return <TSNIntegration />;
      case 'numeris': return <NumerisIntegration />;
      case 'pointsbet': return <PointsBetIntegration />;
      case 'ticketmaster': return <TicketmasterIntegration />;
      case 'activexchange': return <ActiveXchangeIntegration />;
      case 'domo': return <DOMOIntegration />;
      case 'mongodb': return <MongoDBIntegration />;
      case 'heroku': return <HerokuIntegration />;
      case 'm365': return <M365Integration />;
      case 'aws': return <AWSIntegration />;
      case 'zoom': return <ZoomIntegration />;
      case 'zapier': return <ZapierIntegration />;
      case 'formstack': return <FormstackIntegration />;
      case 'smartsheet': return <SmartsheetIntegration />;
      case 'google_analytics': return <GoogleAnalyticsIntegration />;
      case 'github': return <GitHubIntegration />;
      case 'zendesk': return <ZendeskIntegration />;
      case 'hubspot': return <HubSpotIntegration />;
      case 'shopify': return <ShopifyIntegration />;
      case 'openai': return <OpenAIIntegration />;
      default: return <CurlingIOIntegration />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64 flex-shrink-0">
          <div className="sticky top-4">
            <Card className="bg-brand-card-bg border-brand-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Integrations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                {integrationCategories.map((category) => (
                  <div key={category.name}>
                    <h4 className="text-xs font-semibold text-brand-text-secondary uppercase mb-2 px-2">
                      {category.name}
                    </h4>
                    <div className="space-y-1">
                      {category.integrations.map((integration) => {
                        const Icon = integration.icon;
                        const isActive = activeIntegration === integration.id;
                        return (
                          <Button
                            key={integration.id}
                            variant={isActive ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setActiveIntegration(integration.id)}
                            className={`w-full justify-start text-left ${
                              isActive
                                ? 'bg-brand-red text-white hover:bg-brand-red/90'
                                : 'hover:bg-brand-card-hover'
                            }`}
                          >
                            <Icon className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="truncate">{integration.name}</span>
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {renderIntegrationContent()}
        </div>
      </div>
    </div>
  );
}