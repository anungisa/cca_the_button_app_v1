import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Activity, Database, Server, TrendingUp, Globe, Video, Mail,
  Heart, Trophy, BarChart3, Users, CreditCard, MessageSquare,
  Image, DollarSign, PieChart, GraduationCap, Shield, CheckSquare,
  Cloud, Github, FileSignature, Target, Tv, MapPin, Share2,
  Ticket, Zap, FileText, Grid3x3, Headphones, ShoppingBag,
  Sparkles, CheckCircle, ArrowDown, ArrowRight
} from 'lucide-react';

const SystemArchitecturePage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Activity className="w-8 h-8 text-brand-red" />
          The Button System Architecture
        </h1>
        <p className="text-brand-text-secondary mt-2">
          Comprehensive view of all integrated systems and data flows
        </p>
      </div>

      {/* Data Sources Layer */}
      <Card className="bg-gradient-to-br from-blue-950/20 to-purple-950/20 border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-6 h-6 text-blue-400" />
            External Data Sources (50+ Systems)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            
            {/* Curling Operations & Competition */}
            <div>
              <h4 className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Curling Operations & Competition Data
              </h4>
              <div className="grid md:grid-cols-3 gap-3">
                <div className="p-3 bg-blue-500/10 rounded border border-blue-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <BarChart3 className="w-4 h-4 text-blue-400" />
                    <span className="font-medium text-brand-text-primary">Curling.io</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">Live scoring, standings, draw schedules</p>
                </div>
                <div className="p-3 bg-green-500/10 rounded border border-green-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="w-4 h-4 text-green-400" />
                    <span className="font-medium text-brand-text-primary">CurlingZone</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">Event management, team rosters</p>
                </div>
                <div className="p-3 bg-amber-500/10 rounded border border-amber-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span className="font-medium text-brand-text-primary">CTRS</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">National rankings, team standings</p>
                </div>
              </div>
            </div>

            {/* Member Management & Registration */}
            <div>
              <h4 className="text-sm font-semibold text-indigo-400 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Member Management & Registration
              </h4>
              <div className="grid md:grid-cols-3 gap-3">
                <div className="p-3 bg-indigo-500/10 rounded border border-indigo-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-indigo-400" />
                    <span className="font-medium text-brand-text-primary">CurlingReg</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">Member database, registration</p>
                </div>
                <div className="p-3 bg-indigo-500/10 rounded border border-indigo-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Database className="w-4 h-4 text-indigo-400" />
                    <span className="font-medium text-brand-text-primary">Interpodia</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">Legacy member data</p>
                </div>
                <div className="p-3 bg-indigo-500/10 rounded border border-indigo-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-indigo-400" />
                    <span className="font-medium text-brand-text-primary">Uplifter</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">Mobile pass integration</p>
                </div>
              </div>
            </div>

            {/* Operations & Events */}
            <div>
              <h4 className="text-sm font-semibold text-orange-400 mb-3 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Operations & Event Management
              </h4>
              <div className="grid md:grid-cols-4 gap-3">
                <div className="p-3 bg-orange-500/10 rounded border border-orange-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-orange-400" />
                    <span className="font-medium text-brand-text-primary">TrustEvent</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">Volunteer & crew management</p>
                </div>
                <div className="p-3 bg-teal-500/10 rounded border border-teal-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <CreditCard className="w-4 h-4 text-teal-400" />
                    <span className="font-medium text-brand-text-primary">Accredit</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">Credential & access control</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded border border-blue-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Ticket className="w-4 h-4 text-blue-400" />
                    <span className="font-medium text-brand-text-primary">Ticketmaster</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">Ticket sales & analytics</p>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded border border-emerald-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span className="font-medium text-brand-text-primary">KIT</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">Legacy event system</p>
                </div>
              </div>
            </div>

            {/* Fundraising & Donations */}
            <div>
              <h4 className="text-sm font-semibold text-pink-400 mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Fundraising & Donations
              </h4>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="p-3 bg-pink-500/10 rounded border border-pink-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="w-4 h-4 text-pink-400" />
                    <span className="font-medium text-brand-text-primary">GiveCloud</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">Online donation platform</p>
                </div>
                <div className="p-3 bg-rose-500/10 rounded border border-rose-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="w-4 h-4 text-rose-400" />
                    <span className="font-medium text-brand-text-primary">DonorPerfect</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">Donor management CRM</p>
                </div>
              </div>
            </div>

            {/* Finance & Payments */}
            <div>
              <h4 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Finance & Payments
              </h4>
              <div className="grid md:grid-cols-5 gap-3">
                <div className="p-3 bg-purple-500/10 rounded border border-purple-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <CreditCard className="w-4 h-4 text-purple-400" />
                    <span className="font-medium text-brand-text-primary">Stripe</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">Payment processing</p>
                </div>
                <div className="p-3 bg-red-500/10 rounded border border-red-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <CreditCard className="w-4 h-4 text-red-400" />
                    <span className="font-medium text-brand-text-primary">Moneris</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">Canadian payments</p>
                </div>
                <div className="p-3 bg-green-500/10 rounded border border-green-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <span className="font-medium text-brand-text-primary">QuickBooks</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">Accounting software</p>
                </div>
                <div className="p-3 bg-cyan-500/10 rounded border border-cyan-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <PieChart className="w-4 h-4 text-cyan-400" />
                    <span className="font-medium text-brand-text-primary">Budgyt</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">Budget management</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded border border-blue-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckSquare className="w-4 h-4 text-blue-400" />
                    <span className="font-medium text-brand-text-primary">ApprovalMax</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">Approval workflows</p>
                </div>
              </div>
            </div>

            {/* HR & Payroll */}
            <div>
              <h4 className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                HR & Payroll
              </h4>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="p-3 bg-blue-500/10 rounded border border-blue-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span className="font-medium text-brand-text-primary">ADP</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">Payroll & HR management</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded border border-blue-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <FileSignature className="w-4 h-4 text-blue-400" />
                    <span className="font-medium text-brand-text-primary">DocuSign</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">Digital signatures & contracts</p>
                </div>
              </div>
            </div>

            {/* High Performance */}
            <div>
              <h4 className="text-sm font-semibold text-purple-400 mb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                High Performance & Analytics
              </h4>
              <div className="grid md:grid-cols-4 gap-3">
                <div className="p-3 bg-indigo-500/10 rounded border border-indigo-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-indigo-400" />
                    <span className="font-medium text-brand-text-primary">Teamworks AMS</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">Athlete management</p>
                </div>
                <div className="p-3 bg-red-500/10 rounded border border-red-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Video className="w-4 h-4 text-red-400" />
                    <span className="font-medium text-brand-text-primary">Dartfish</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">Video analysis</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded border border-blue-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-4 h-4 text-blue-400" />
                    <span className="font-medium text-brand-text-primary">Polar/Garmin</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">Fitness tracking</p>
                </div>
                <div className="p-3 bg-orange-500/10 rounded border border-orange-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <BarChart3 className="w-4 h-4 text-orange-400" />
                    <span className="font-medium text-brand-text-primary">CTFS Analytics</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">Advanced Tableau dashboards</p>
                </div>
              </div>
            </div>

            {/* Learning & Development */}
            <div>
              <h4 className="text-sm font-semibold text-teal-400 mb-3 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Learning & Development
              </h4>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="p-3 bg-teal-500/10 rounded border border-teal-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <GraduationCap className="w-4 h-4 text-teal-400" />
                    <span className="font-medium text-brand-text-primary">Moodle</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">Learning management system</p>
                </div>
                <div className="p-3 bg-green-500/10 rounded border border-green-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="font-medium text-brand-text-primary">Sideline Learning</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">Safe Sport training</p>
                </div>
              </div>
            </div>

            {/* Marketing, Communications & Content */}
            <div>
              <h4 className="text-sm font-semibold text-pink-400 mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Marketing, Communications & Content
              </h4>
              <div className="grid md:grid-cols-4 gap-3">
                <div className="p-3 bg-red-500/10 rounded border border-red-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="w-4 h-4 text-red-400" />
                    <span className="font-medium text-brand-text-primary">Curling.ca</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">Main WordPress site</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded border border-blue-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="w-4 h-4 text-blue-400" />
                    <span className="font-medium text-brand-text-primary">Business of Curling</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">Industry news & resources</p>
                </div>
                <div className="p-3 bg-red-500/10 rounded border border-red-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Video className="w-4 h-4 text-red-400" />
                    <span className="font-medium text-brand-text-primary">YouTube</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">Video content library</p>
                </div>
                <div className="p-3 bg-orange-500/10 rounded border border-orange-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Mail className="w-4 h-4 text-orange-400" />
                    <span className="font-medium text-brand-text-primary">Mailchimp</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">Email campaigns</p>
                </div>
                <div className="p-3 bg-purple-500/10 rounded border border-purple-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="w-4 h-4 text-purple-400" />
                    <span className="font-medium text-brand-text-primary">Brandwatch</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">Social listening</p>
                </div>
                <div className="p-3 bg-pink-500/10 rounded border border-pink-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Image className="w-4 h-4 text-pink-400" />
                    <span className="font-medium text-brand-text-primary">Canto</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">Digital asset management</p>
                </div>
                <div className="p-3 bg-pink-500/10 rounded border border-pink-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Share2 className="w-4 h-4 text-pink-400" />
                    <span className="font-medium text-brand-text-primary">Social Media APIs</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">Twitter, Facebook, Instagram</p>
                </div>
                <div className="p-3 bg-purple-500/10 rounded border border-purple-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Share2 className="w-4 h-4 text-purple-400" />
                    <span className="font-medium text-brand-text-primary">Falcon.io</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">Social media management</p>
                </div>
                <div className="p-3 bg-orange-500/10 rounded border border-orange-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-orange-400" />
                    <span className="font-medium text-brand-text-primary">HubSpot</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">Marketing automation & CRM</p>
                </div>
              </div>
            </div>

            {/* Sponsorship & Measurement */}
            <div>
              <h4 className="text-sm font-semibold text-purple-400 mb-3 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Sponsorship & Audience Measurement
              </h4>
              <div className="grid md:grid-cols-5 gap-3">
                <div className="p-3 bg-purple-500/10 rounded border border-purple-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-purple-400" />
                    <span className="font-medium text-brand-text-primary">Vividata</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">Audience insights</p>
                </div>
                <div className="p-3 bg-red-500/10 rounded border border-red-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Tv className="w-4 h-4 text-red-400" />
                    <span className="font-medium text-brand-text-primary">TSN</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">Broadcast data</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded border border-blue-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Tv className="w-4 h-4 text-blue-400" />
                    <span className="font-medium text-brand-text-primary">Numeris</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">TV ratings</p>
                </div>
                <div className="p-3 bg-purple-500/10 rounded border border-purple-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-purple-400" />
                    <span className="font-medium text-brand-text-primary">PointsBet</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">Betting integration</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded border border-blue-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <BarChart3 className="w-4 h-4 text-blue-400" />
                    <span className="font-medium text-brand-text-primary">Google Analytics</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">Web analytics</p>
                </div>
              </div>
            </div>

            {/* Demographics & Analytics */}
            <div>
              <h4 className="text-sm font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Demographics & Location Data
              </h4>
              <div className="grid md:grid-cols-1 gap-3">
                <div className="p-3 bg-cyan-500/10 rounded border border-cyan-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span className="font-medium text-brand-text-primary">ActiveXchange</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">Canadian sports participation data</p>
                </div>
              </div>
            </div>

            {/* E-Commerce */}
            <div>
              <h4 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                E-Commerce
              </h4>
              <div className="grid md:grid-cols-1 gap-3">
                <div className="p-3 bg-green-500/10 rounded border border-green-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <ShoppingBag className="w-4 h-4 text-green-400" />
                    <span className="font-medium text-brand-text-primary">Shop.Curling.ca (Shopify)</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">Official merchandise store</p>
                </div>
              </div>
            </div>

            {/* AI & Machine Learning */}
            <div>
              <h4 className="text-sm font-semibold text-purple-400 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                AI & Machine Learning
              </h4>
              <div className="grid md:grid-cols-1 gap-3">
                <div className="p-3 bg-purple-500/10 rounded border border-purple-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="font-medium text-brand-text-primary">OpenAI (GPT-4)</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary">AI-powered insights, content generation, predictions</p>
                </div>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Data Flow */}
      <div className="flex justify-center">
        <ArrowDown className="w-8 h-8 text-brand-text-secondary animate-bounce" />
      </div>

      {/* Primary Database */}
      <Card className="bg-brand-card-bg border-2 border-green-500/50">
        <CardContent className="p-6">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="p-4 bg-green-500/20 rounded-full">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-brand-text-primary">Primary Database Layer</h3>
            <div className="flex items-center justify-center gap-2">
              <Database className="w-5 h-5 text-blue-400" />
              <span className="text-lg text-brand-text-primary">Supabase (PostgreSQL)</span>
            </div>
            <p className="text-sm text-brand-text-secondary max-w-2xl mx-auto">
              Auto-managed via base44 entities. Single source of truth for all application data.
              All external data flows through here for validation, transformation, and storage.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-4 max-w-4xl mx-auto">
              <div className="p-3 bg-brand-charcoal/30 rounded-lg">
                <p className="text-xs text-brand-text-secondary mb-1">Data Integrity</p>
                <p className="font-bold text-green-400">99.99%</p>
              </div>
              <div className="p-3 bg-brand-charcoal/30 rounded-lg">
                <p className="text-xs text-brand-text-secondary mb-1">Sync Frequency</p>
                <p className="font-bold text-blue-400">Real-time</p>
              </div>
              <div className="p-3 bg-brand-charcoal/30 rounded-lg">
                <p className="text-xs text-brand-text-secondary mb-1">Records</p>
                <p className="font-bold text-purple-400">1M+</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Flow */}
      <div className="flex justify-center">
        <ArrowDown className="w-8 h-8 text-brand-text-secondary animate-bounce" />
      </div>

      {/* Analytics & Secondary Storage */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-purple-400" />
            Analytics & Secondary Storage Layer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <span className="font-medium text-brand-text-primary">DOMO</span>
              </div>
              <p className="text-xs text-brand-text-secondary mb-3">
                Business intelligence dashboards, executive reporting, KPI tracking
              </p>
              <Badge className="bg-green-500/20 text-green-400 text-xs">
                <CheckCircle className="w-3 h-3 mr-1" />
                Active Sync
              </Badge>
            </div>

            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-5 h-5 text-green-400" />
                <span className="font-medium text-brand-text-primary">MongoDB</span>
              </div>
              <p className="text-xs text-brand-text-secondary mb-3">
                Document storage, backups, unstructured data, archival
              </p>
              <Badge className="bg-green-500/20 text-green-400 text-xs">
                <CheckCircle className="w-3 h-3 mr-1" />
                Active Sync
              </Badge>
            </div>

            <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Server className="w-5 h-5 text-purple-400" />
                <span className="font-medium text-brand-text-primary">Heroku</span>
              </div>
              <p className="text-xs text-brand-text-secondary mb-3">
                Scheduled jobs, background workers, monitoring services
              </p>
              <Badge className="bg-green-500/20 text-green-400 text-xs">
                <CheckCircle className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </div>

            <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Cloud className="w-5 h-5 text-orange-400" />
                <span className="font-medium text-brand-text-primary">AWS</span>
              </div>
              <p className="text-xs text-brand-text-secondary mb-3">
                Cloud infrastructure, S3 storage, Lambda functions
              </p>
              <Badge className="bg-green-500/20 text-green-400 text-xs">
                <CheckCircle className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Infrastructure Tools */}
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-6 h-6 text-blue-400" />
            Infrastructure & Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-3">
            <div className="p-3 bg-blue-500/10 rounded border border-blue-500/30">
              <div className="flex items-center gap-2 mb-1">
                <Cloud className="w-4 h-4 text-blue-400" />
                <span className="font-medium text-brand-text-primary">Microsoft 365</span>
              </div>
              <p className="text-xs text-brand-text-secondary">Email, Teams, SharePoint</p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded border border-blue-500/30">
              <div className="flex items-center gap-2 mb-1">
                <Video className="w-4 h-4 text-blue-400" />
                <span className="font-medium text-brand-text-primary">Zoom</span>
              </div>
              <p className="text-xs text-brand-text-secondary">Video conferencing</p>
            </div>
            <div className="p-3 bg-orange-500/10 rounded border border-orange-500/30">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-orange-400" />
                <span className="font-medium text-brand-text-primary">Zapier</span>
              </div>
              <p className="text-xs text-brand-text-secondary">Workflow automation</p>
            </div>
            <div className="p-3 bg-green-500/10 rounded border border-green-500/30">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-green-400" />
                <span className="font-medium text-brand-text-primary">Formstack</span>
              </div>
              <p className="text-xs text-brand-text-secondary">Form builder</p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded border border-blue-500/30">
              <div className="flex items-center gap-2 mb-1">
                <Grid3x3 className="w-4 h-4 text-blue-400" />
                <span className="font-medium text-brand-text-primary">Smartsheet</span>
              </div>
              <p className="text-xs text-brand-text-secondary">Project management</p>
            </div>
            <div className="p-3 bg-gray-500/10 rounded border border-gray-500/30">
              <div className="flex items-center gap-2 mb-1">
                <Github className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-brand-text-primary">GitHub</span>
              </div>
              <p className="text-xs text-brand-text-secondary">Code repository</p>
            </div>
            <div className="p-3 bg-green-500/10 rounded border border-green-500/30">
              <div className="flex items-center gap-2 mb-1">
                <Headphones className="w-4 h-4 text-green-400" />
                <span className="font-medium text-brand-text-primary">Zendesk</span>
              </div>
              <p className="text-xs text-brand-text-secondary">Customer support</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <Card className="bg-gradient-to-r from-brand-red/10 to-purple-500/10 border-brand-red/30">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-4xl font-bold text-brand-red mb-2">50+</p>
              <p className="text-sm text-brand-text-secondary">External Systems</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-purple-400 mb-2">1M+</p>
              <p className="text-sm text-brand-text-secondary">Records Managed</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-green-400 mb-2">Real-time</p>
              <p className="text-sm text-brand-text-secondary">Data Synchronization</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-400 mb-2">99.9%</p>
              <p className="text-sm text-brand-text-secondary">System Uptime</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemArchitecturePage;