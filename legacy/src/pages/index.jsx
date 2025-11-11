import Layout from "./Layout.jsx";

import Home from "./Home";

import Events from "./Events";

import Profile from "./Profile";

import LiveScoring from "./LiveScoring";

import Donations from "./Donations";

import MADashboard from "./MADashboard";

import CurlerDataHub from "./CurlerDataHub";

import EventDetails from "./EventDetails";

import Sponsors from "./Sponsors";

import LoyaltyProgram from "./LoyaltyProgram";

import SocialThread from "./SocialThread";

import GeoChallenge from "./GeoChallenge";

import MysteryBox from "./MysteryBox";

import Leaderboards from "./Leaderboards";

import FanPass from "./FanPass";

import SponsorDashboard from "./SponsorDashboard";

import YouthPassport from "./YouthPassport";

import BusinessHub from "./BusinessHub";

import HitDrawTap from "./HitDrawTap";

import KnowledgeCentreHub from "./KnowledgeCentreHub";

import SmartClubPanel from "./SmartClubPanel";

import GovernanceGamification from "./GovernanceGamification";

import SmartBroomHub from "./SmartBroomHub";

import GetInvolvedHub from "./GetInvolvedHub";

import SocialHub from "./SocialHub";

import MAInsights from "./MAInsights";

import SafeSportHub from "./SafeSportHub";

import DEIHub from "./DEIHub";

import ShopHub from "./ShopHub";

import GraniteCircleExplainer from "./GraniteCircleExplainer";

import InsightsHub from "./InsightsHub";

import Clubs from "./Clubs";

import FTLOCHub from "./FTLOCHub";

import AboutCurling from "./AboutCurling";

import CommunityHub from "./CommunityHub";

import RewardStore from "./RewardStore";

import Streaming from "./Streaming";

import AdminComplianceDashboard from "./AdminComplianceDashboard";

import HPTeamworksDashboard from "./HPTeamworksDashboard";

import HelpCenter from "./HelpCenter";

import TermsOfUse from "./TermsOfUse";

import APIManager from "./APIManager";

import PlatformSettings from "./PlatformSettings";

import TrustCenter from "./TrustCenter";

import ClubSurvey from "./ClubSurvey";

import FanOS from "./FanOS";

import VolunteerContext from "./VolunteerContext";

import FederationContext from "./FederationContext";

import Dashboard from "./Dashboard";

import PatchScanner from "./PatchScanner";

import OnIceShotTracker from "./OnIceShotTracker";

import ShotTracker from "./ShotTracker";

import PledgeBoard from "./PledgeBoard";

import PledgeBoardEmbed from "./PledgeBoardEmbed";

import AthleteDashboard from "./AthleteDashboard";

import PerformanceCenter from "./PerformanceCenter";

import CoachDashboard from "./CoachDashboard";

import ExecutiveDashboard from "./ExecutiveDashboard";

import GovernanceComplianceHub from "./GovernanceComplianceHub";

import PeopleCultureHub from "./PeopleCultureHub";

import ClubServicesHub from "./ClubServicesHub";

import TriviaHub from "./TriviaHub";

import PurchaseHistory from "./PurchaseHistory";

import FinanceHub from "./FinanceHub";

import EventPlanDetail from "./EventPlanDetail";

import TeamsConfiguration from "./TeamsConfiguration";

import MyWorkspace from "./MyWorkspace";

import ReportsHub from "./ReportsHub";

import MarketingCenter from "./MarketingCenter";

import YouthCommunityHub from "./YouthCommunityHub";

import StaffHQ from "./StaffHQ";

import streaming from "./streaming";

import Form from "./Form";

import IncidentManagementHub from "./IncidentManagementHub";

import KnowledgeBase from "./KnowledgeBase";

import KnowledgeArticleDetail from "./KnowledgeArticleDetail";

import EventOpsToolkit from "./EventOpsToolkit";

import DeveloperPortal from "./DeveloperPortal";

import PartnerRegistration from "./PartnerRegistration";

import SponsorshipHQ from "./SponsorshipHQ";

import ContentManagementHub from "./ContentManagementHub";

import FormsHub from "./FormsHub";

import FormBuilder from "./FormBuilder";

import FormRenderer from "./FormRenderer";

import AnalyticsCenter from "./AnalyticsCenter";

import HighPerformanceHub from "./HighPerformanceHub";

import Constituent360 from "./Constituent360";

import SurveyAnalytics from "./SurveyAnalytics";

import ResearchHub from "./ResearchHub";

import CurlingDataHub from "./CurlingDataHub";

import FlowTesting from "./FlowTesting";

import StaffHQAssessment from "./StaffHQAssessment";

import ExecutiveHub from "./ExecutiveHub";

import CommunicationsCenter from "./CommunicationsCenter";

import PersonalCalendar from "./PersonalCalendar";

import SubscriptionManagement from "./SubscriptionManagement";

import PrivacyPolicy from "./PrivacyPolicy";

import TermsOfService from "./TermsOfService";

import SelfServeAnalytics from "./SelfServeAnalytics";

import SocialConnections from "./SocialConnections";

import StrategicPlanningHub from "./StrategicPlanningHub";

import LegalComplianceHub from "./LegalComplianceHub";

import SafeSportPublic from "./SafeSportPublic";

import SystemHealth from "./SystemHealth";

import Welcome from "./Welcome";

import CoachAthleteView from "./CoachAthleteView";

import NationalTeams from "./NationalTeams";

import NextGenProgram from "./NextGenProgram";

import HPCenters from "./HPCenters";

import TeamSelection from "./TeamSelection";

import HPAnalyticsDashboard from "./HPAnalyticsDashboard";

import CTRSRankings from "./CTRSRankings";

import UniversalDashboard from "./UniversalDashboard";

import UniversalHub from "./UniversalHub";

import DeploymentGuide from "./DeploymentGuide";

import HerokuTest from "./HerokuTest";

import MongoTest from "./MongoTest";

import DOMOCapabilities from "./DOMOCapabilities";

import DataStrategyAssessment from "./DataStrategyAssessment";

import BDOStrategyComparison from "./BDOStrategyComparison";

import BusinessGlossary from "./BusinessGlossary";

import DataQualityDashboard from "./DataQualityDashboard";

import SystemArchitecture from "./SystemArchitecture";

import DataNavigationHub from "./DataNavigationHub";

import MonetizationHub from "./MonetizationHub";

import MonetizationAudit from "./MonetizationAudit";

import RevenueOpportunities from "./RevenueOpportunities";

import SubscriptionStrategy from "./SubscriptionStrategy";

import LoyaltyArchitecture from "./LoyaltyArchitecture";

import VenueCommerce from "./VenueCommerce";

import PartnershipEcosystem from "./PartnershipEcosystem";

import DataMonetization from "./DataMonetization";

import TransformationRoadmap from "./TransformationRoadmap";

import SponsorIntelligence from "./SponsorIntelligence";

import JourneyMapping from "./JourneyMapping";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    Events: Events,
    
    Profile: Profile,
    
    LiveScoring: LiveScoring,
    
    Donations: Donations,
    
    MADashboard: MADashboard,
    
    CurlerDataHub: CurlerDataHub,
    
    EventDetails: EventDetails,
    
    Sponsors: Sponsors,
    
    LoyaltyProgram: LoyaltyProgram,
    
    SocialThread: SocialThread,
    
    GeoChallenge: GeoChallenge,
    
    MysteryBox: MysteryBox,
    
    Leaderboards: Leaderboards,
    
    FanPass: FanPass,
    
    SponsorDashboard: SponsorDashboard,
    
    YouthPassport: YouthPassport,
    
    BusinessHub: BusinessHub,
    
    HitDrawTap: HitDrawTap,
    
    KnowledgeCentreHub: KnowledgeCentreHub,
    
    SmartClubPanel: SmartClubPanel,
    
    GovernanceGamification: GovernanceGamification,
    
    SmartBroomHub: SmartBroomHub,
    
    GetInvolvedHub: GetInvolvedHub,
    
    SocialHub: SocialHub,
    
    MAInsights: MAInsights,
    
    SafeSportHub: SafeSportHub,
    
    DEIHub: DEIHub,
    
    ShopHub: ShopHub,
    
    GraniteCircleExplainer: GraniteCircleExplainer,
    
    InsightsHub: InsightsHub,
    
    Clubs: Clubs,
    
    FTLOCHub: FTLOCHub,
    
    AboutCurling: AboutCurling,
    
    CommunityHub: CommunityHub,
    
    RewardStore: RewardStore,
    
    Streaming: Streaming,
    
    AdminComplianceDashboard: AdminComplianceDashboard,
    
    HPTeamworksDashboard: HPTeamworksDashboard,
    
    HelpCenter: HelpCenter,
    
    TermsOfUse: TermsOfUse,
    
    APIManager: APIManager,
    
    PlatformSettings: PlatformSettings,
    
    TrustCenter: TrustCenter,
    
    ClubSurvey: ClubSurvey,
    
    FanOS: FanOS,
    
    VolunteerContext: VolunteerContext,
    
    FederationContext: FederationContext,
    
    Dashboard: Dashboard,
    
    PatchScanner: PatchScanner,
    
    OnIceShotTracker: OnIceShotTracker,
    
    ShotTracker: ShotTracker,
    
    PledgeBoard: PledgeBoard,
    
    PledgeBoardEmbed: PledgeBoardEmbed,
    
    AthleteDashboard: AthleteDashboard,
    
    PerformanceCenter: PerformanceCenter,
    
    CoachDashboard: CoachDashboard,
    
    ExecutiveDashboard: ExecutiveDashboard,
    
    GovernanceComplianceHub: GovernanceComplianceHub,
    
    PeopleCultureHub: PeopleCultureHub,
    
    ClubServicesHub: ClubServicesHub,
    
    TriviaHub: TriviaHub,
    
    PurchaseHistory: PurchaseHistory,
    
    FinanceHub: FinanceHub,
    
    EventPlanDetail: EventPlanDetail,
    
    TeamsConfiguration: TeamsConfiguration,
    
    MyWorkspace: MyWorkspace,
    
    ReportsHub: ReportsHub,
    
    MarketingCenter: MarketingCenter,
    
    YouthCommunityHub: YouthCommunityHub,
    
    StaffHQ: StaffHQ,
    
    streaming: streaming,
    
    Form: Form,
    
    IncidentManagementHub: IncidentManagementHub,
    
    KnowledgeBase: KnowledgeBase,
    
    KnowledgeArticleDetail: KnowledgeArticleDetail,
    
    EventOpsToolkit: EventOpsToolkit,
    
    DeveloperPortal: DeveloperPortal,
    
    PartnerRegistration: PartnerRegistration,
    
    SponsorshipHQ: SponsorshipHQ,
    
    ContentManagementHub: ContentManagementHub,
    
    FormsHub: FormsHub,
    
    FormBuilder: FormBuilder,
    
    FormRenderer: FormRenderer,
    
    AnalyticsCenter: AnalyticsCenter,
    
    HighPerformanceHub: HighPerformanceHub,
    
    Constituent360: Constituent360,
    
    SurveyAnalytics: SurveyAnalytics,
    
    ResearchHub: ResearchHub,
    
    CurlingDataHub: CurlingDataHub,
    
    FlowTesting: FlowTesting,
    
    StaffHQAssessment: StaffHQAssessment,
    
    ExecutiveHub: ExecutiveHub,
    
    CommunicationsCenter: CommunicationsCenter,
    
    PersonalCalendar: PersonalCalendar,
    
    SubscriptionManagement: SubscriptionManagement,
    
    PrivacyPolicy: PrivacyPolicy,
    
    TermsOfService: TermsOfService,
    
    SelfServeAnalytics: SelfServeAnalytics,
    
    SocialConnections: SocialConnections,
    
    StrategicPlanningHub: StrategicPlanningHub,
    
    LegalComplianceHub: LegalComplianceHub,
    
    SafeSportPublic: SafeSportPublic,
    
    SystemHealth: SystemHealth,
    
    Welcome: Welcome,
    
    CoachAthleteView: CoachAthleteView,
    
    NationalTeams: NationalTeams,
    
    NextGenProgram: NextGenProgram,
    
    HPCenters: HPCenters,
    
    TeamSelection: TeamSelection,
    
    HPAnalyticsDashboard: HPAnalyticsDashboard,
    
    CTRSRankings: CTRSRankings,
    
    UniversalDashboard: UniversalDashboard,
    
    UniversalHub: UniversalHub,
    
    DeploymentGuide: DeploymentGuide,
    
    HerokuTest: HerokuTest,
    
    MongoTest: MongoTest,
    
    DOMOCapabilities: DOMOCapabilities,
    
    DataStrategyAssessment: DataStrategyAssessment,
    
    BDOStrategyComparison: BDOStrategyComparison,
    
    BusinessGlossary: BusinessGlossary,
    
    DataQualityDashboard: DataQualityDashboard,
    
    SystemArchitecture: SystemArchitecture,
    
    DataNavigationHub: DataNavigationHub,
    
    MonetizationHub: MonetizationHub,
    
    MonetizationAudit: MonetizationAudit,
    
    RevenueOpportunities: RevenueOpportunities,
    
    SubscriptionStrategy: SubscriptionStrategy,
    
    LoyaltyArchitecture: LoyaltyArchitecture,
    
    VenueCommerce: VenueCommerce,
    
    PartnershipEcosystem: PartnershipEcosystem,
    
    DataMonetization: DataMonetization,
    
    TransformationRoadmap: TransformationRoadmap,
    
    SponsorIntelligence: SponsorIntelligence,
    
    JourneyMapping: JourneyMapping,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Events" element={<Events />} />
                
                <Route path="/Profile" element={<Profile />} />
                
                <Route path="/LiveScoring" element={<LiveScoring />} />
                
                <Route path="/Donations" element={<Donations />} />
                
                <Route path="/MADashboard" element={<MADashboard />} />
                
                <Route path="/CurlerDataHub" element={<CurlerDataHub />} />
                
                <Route path="/EventDetails" element={<EventDetails />} />
                
                <Route path="/Sponsors" element={<Sponsors />} />
                
                <Route path="/LoyaltyProgram" element={<LoyaltyProgram />} />
                
                <Route path="/SocialThread" element={<SocialThread />} />
                
                <Route path="/GeoChallenge" element={<GeoChallenge />} />
                
                <Route path="/MysteryBox" element={<MysteryBox />} />
                
                <Route path="/Leaderboards" element={<Leaderboards />} />
                
                <Route path="/FanPass" element={<FanPass />} />
                
                <Route path="/SponsorDashboard" element={<SponsorDashboard />} />
                
                <Route path="/YouthPassport" element={<YouthPassport />} />
                
                <Route path="/BusinessHub" element={<BusinessHub />} />
                
                <Route path="/HitDrawTap" element={<HitDrawTap />} />
                
                <Route path="/KnowledgeCentreHub" element={<KnowledgeCentreHub />} />
                
                <Route path="/SmartClubPanel" element={<SmartClubPanel />} />
                
                <Route path="/GovernanceGamification" element={<GovernanceGamification />} />
                
                <Route path="/SmartBroomHub" element={<SmartBroomHub />} />
                
                <Route path="/GetInvolvedHub" element={<GetInvolvedHub />} />
                
                <Route path="/SocialHub" element={<SocialHub />} />
                
                <Route path="/MAInsights" element={<MAInsights />} />
                
                <Route path="/SafeSportHub" element={<SafeSportHub />} />
                
                <Route path="/DEIHub" element={<DEIHub />} />
                
                <Route path="/ShopHub" element={<ShopHub />} />
                
                <Route path="/GraniteCircleExplainer" element={<GraniteCircleExplainer />} />
                
                <Route path="/InsightsHub" element={<InsightsHub />} />
                
                <Route path="/Clubs" element={<Clubs />} />
                
                <Route path="/FTLOCHub" element={<FTLOCHub />} />
                
                <Route path="/AboutCurling" element={<AboutCurling />} />
                
                <Route path="/CommunityHub" element={<CommunityHub />} />
                
                <Route path="/RewardStore" element={<RewardStore />} />
                
                <Route path="/Streaming" element={<Streaming />} />
                
                <Route path="/AdminComplianceDashboard" element={<AdminComplianceDashboard />} />
                
                <Route path="/HPTeamworksDashboard" element={<HPTeamworksDashboard />} />
                
                <Route path="/HelpCenter" element={<HelpCenter />} />
                
                <Route path="/TermsOfUse" element={<TermsOfUse />} />
                
                <Route path="/APIManager" element={<APIManager />} />
                
                <Route path="/PlatformSettings" element={<PlatformSettings />} />
                
                <Route path="/TrustCenter" element={<TrustCenter />} />
                
                <Route path="/ClubSurvey" element={<ClubSurvey />} />
                
                <Route path="/FanOS" element={<FanOS />} />
                
                <Route path="/VolunteerContext" element={<VolunteerContext />} />
                
                <Route path="/FederationContext" element={<FederationContext />} />
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/PatchScanner" element={<PatchScanner />} />
                
                <Route path="/OnIceShotTracker" element={<OnIceShotTracker />} />
                
                <Route path="/ShotTracker" element={<ShotTracker />} />
                
                <Route path="/PledgeBoard" element={<PledgeBoard />} />
                
                <Route path="/PledgeBoardEmbed" element={<PledgeBoardEmbed />} />
                
                <Route path="/AthleteDashboard" element={<AthleteDashboard />} />
                
                <Route path="/PerformanceCenter" element={<PerformanceCenter />} />
                
                <Route path="/CoachDashboard" element={<CoachDashboard />} />
                
                <Route path="/ExecutiveDashboard" element={<ExecutiveDashboard />} />
                
                <Route path="/GovernanceComplianceHub" element={<GovernanceComplianceHub />} />
                
                <Route path="/PeopleCultureHub" element={<PeopleCultureHub />} />
                
                <Route path="/ClubServicesHub" element={<ClubServicesHub />} />
                
                <Route path="/TriviaHub" element={<TriviaHub />} />
                
                <Route path="/PurchaseHistory" element={<PurchaseHistory />} />
                
                <Route path="/FinanceHub" element={<FinanceHub />} />
                
                <Route path="/EventPlanDetail" element={<EventPlanDetail />} />
                
                <Route path="/TeamsConfiguration" element={<TeamsConfiguration />} />
                
                <Route path="/MyWorkspace" element={<MyWorkspace />} />
                
                <Route path="/ReportsHub" element={<ReportsHub />} />
                
                <Route path="/MarketingCenter" element={<MarketingCenter />} />
                
                <Route path="/YouthCommunityHub" element={<YouthCommunityHub />} />
                
                <Route path="/StaffHQ" element={<StaffHQ />} />
                
                <Route path="/streaming" element={<streaming />} />
                
                <Route path="/Form" element={<Form />} />
                
                <Route path="/IncidentManagementHub" element={<IncidentManagementHub />} />
                
                <Route path="/KnowledgeBase" element={<KnowledgeBase />} />
                
                <Route path="/KnowledgeArticleDetail" element={<KnowledgeArticleDetail />} />
                
                <Route path="/EventOpsToolkit" element={<EventOpsToolkit />} />
                
                <Route path="/DeveloperPortal" element={<DeveloperPortal />} />
                
                <Route path="/PartnerRegistration" element={<PartnerRegistration />} />
                
                <Route path="/SponsorshipHQ" element={<SponsorshipHQ />} />
                
                <Route path="/ContentManagementHub" element={<ContentManagementHub />} />
                
                <Route path="/FormsHub" element={<FormsHub />} />
                
                <Route path="/FormBuilder" element={<FormBuilder />} />
                
                <Route path="/FormRenderer" element={<FormRenderer />} />
                
                <Route path="/AnalyticsCenter" element={<AnalyticsCenter />} />
                
                <Route path="/HighPerformanceHub" element={<HighPerformanceHub />} />
                
                <Route path="/Constituent360" element={<Constituent360 />} />
                
                <Route path="/SurveyAnalytics" element={<SurveyAnalytics />} />
                
                <Route path="/ResearchHub" element={<ResearchHub />} />
                
                <Route path="/CurlingDataHub" element={<CurlingDataHub />} />
                
                <Route path="/FlowTesting" element={<FlowTesting />} />
                
                <Route path="/StaffHQAssessment" element={<StaffHQAssessment />} />
                
                <Route path="/ExecutiveHub" element={<ExecutiveHub />} />
                
                <Route path="/CommunicationsCenter" element={<CommunicationsCenter />} />
                
                <Route path="/PersonalCalendar" element={<PersonalCalendar />} />
                
                <Route path="/SubscriptionManagement" element={<SubscriptionManagement />} />
                
                <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
                
                <Route path="/TermsOfService" element={<TermsOfService />} />
                
                <Route path="/SelfServeAnalytics" element={<SelfServeAnalytics />} />
                
                <Route path="/SocialConnections" element={<SocialConnections />} />
                
                <Route path="/StrategicPlanningHub" element={<StrategicPlanningHub />} />
                
                <Route path="/LegalComplianceHub" element={<LegalComplianceHub />} />
                
                <Route path="/SafeSportPublic" element={<SafeSportPublic />} />
                
                <Route path="/SystemHealth" element={<SystemHealth />} />
                
                <Route path="/Welcome" element={<Welcome />} />
                
                <Route path="/CoachAthleteView" element={<CoachAthleteView />} />
                
                <Route path="/NationalTeams" element={<NationalTeams />} />
                
                <Route path="/NextGenProgram" element={<NextGenProgram />} />
                
                <Route path="/HPCenters" element={<HPCenters />} />
                
                <Route path="/TeamSelection" element={<TeamSelection />} />
                
                <Route path="/HPAnalyticsDashboard" element={<HPAnalyticsDashboard />} />
                
                <Route path="/CTRSRankings" element={<CTRSRankings />} />
                
                <Route path="/UniversalDashboard" element={<UniversalDashboard />} />
                
                <Route path="/UniversalHub" element={<UniversalHub />} />
                
                <Route path="/DeploymentGuide" element={<DeploymentGuide />} />
                
                <Route path="/HerokuTest" element={<HerokuTest />} />
                
                <Route path="/MongoTest" element={<MongoTest />} />
                
                <Route path="/DOMOCapabilities" element={<DOMOCapabilities />} />
                
                <Route path="/DataStrategyAssessment" element={<DataStrategyAssessment />} />
                
                <Route path="/BDOStrategyComparison" element={<BDOStrategyComparison />} />
                
                <Route path="/BusinessGlossary" element={<BusinessGlossary />} />
                
                <Route path="/DataQualityDashboard" element={<DataQualityDashboard />} />
                
                <Route path="/SystemArchitecture" element={<SystemArchitecture />} />
                
                <Route path="/DataNavigationHub" element={<DataNavigationHub />} />
                
                <Route path="/MonetizationHub" element={<MonetizationHub />} />
                
                <Route path="/MonetizationAudit" element={<MonetizationAudit />} />
                
                <Route path="/RevenueOpportunities" element={<RevenueOpportunities />} />
                
                <Route path="/SubscriptionStrategy" element={<SubscriptionStrategy />} />
                
                <Route path="/LoyaltyArchitecture" element={<LoyaltyArchitecture />} />
                
                <Route path="/VenueCommerce" element={<VenueCommerce />} />
                
                <Route path="/PartnershipEcosystem" element={<PartnershipEcosystem />} />
                
                <Route path="/DataMonetization" element={<DataMonetization />} />
                
                <Route path="/TransformationRoadmap" element={<TransformationRoadmap />} />
                
                <Route path="/SponsorIntelligence" element={<SponsorIntelligence />} />
                
                <Route path="/JourneyMapping" element={<JourneyMapping />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}