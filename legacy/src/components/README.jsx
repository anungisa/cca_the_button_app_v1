# The Button - Curling Canada Digital Platform

## 🏒 Overview

The Button is Curling Canada's comprehensive digital platform that serves as the central hub for the Canadian curling community. It connects fans, athletes, clubs, volunteers, and staff through a unified experience that includes gamification, content management, event coordination, and administrative tools.

## 🏗️ Architecture

### **Frontend Stack**
- **React 18** - Modern React with hooks and concurrent features
- **Tailwind CSS** - Utility-first styling framework
- **shadcn/ui** - High-quality component library
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing
- **Date-fns & Moment** - Date manipulation libraries

### **Key Design Patterns**

#### **Entity-First Architecture**
All data is modeled through JSON Schema entities in `/entities/`. Each entity represents a core business concept (User, Club, Event, etc.) and serves as both documentation and validation.

#### **Context-Driven State Management**
- `XPContext` - Gamification and loyalty system
- `LanguageContext` - Internationalization
- Global contexts provide shared state without prop drilling

#### **Permission-Based UI**
- `usePermissions()` hook centralizes authorization logic
- Role-based component rendering throughout the app
- External access roles for sponsors, board members, etc.

#### **Lazy Loading & Performance**
- React.lazy() for code splitting
- Suspense boundaries with skeleton loaders
- Optimized bundle sizes with dynamic imports

## 📁 Project Structure

```
/
├── entities/                  # JSON Schema data models
│   ├── User.json             # User profiles and authentication
│   ├── Club.json             # Curling club information
│   ├── Event.json            # Events and competitions
│   └── ...                   # 100+ business entities
│
├── pages/                     # Top-level page components
│   ├── Home.js               # Landing page and dashboard
│   ├── Profile.js            # User profile management
│   ├── Clubs.js              # Club directory
│   ├── StaffHQ.js            # Staff hub with role-based access
│   └── ...                   # 50+ specialized pages
│
├── components/                # Reusable UI components
│   ├── ui/                   # Base UI components (buttons, forms, etc.)
│   ├── hooks/                # Custom React hooks
│   ├── utils/                # Utility functions and services
│   ├── loyalty/              # Gamification components
│   ├── clubs/                # Club-specific components
│   ├── staffhq/              # Staff tools and dashboards
│   └── ...                   # Domain-organized components
│
├── layout.js                 # Root layout with navigation
└── utils/                    # Shared utilities
```

## 🎮 Core Features

### **For Fans & Community**
- **Granite Circle Loyalty Program** - XP system with tiers and rewards
- **Live Event Streaming** - Curling+ subscription service
- **Club Directory** - Find and connect with local clubs
- **Community Hub** - Social features and engagement
- **Patch Scanning** - QR code rewards at events

### **For Athletes & Coaches**
- **Performance Center** - Training logs and analytics
- **SmartBroom Integration** - IoT device data tracking
- **Shot Tracker** - Game performance analysis
- **Team Management** - Coach-athlete collaboration tools

### **For Clubs**
- **Club Management** - Member tracking and engagement
- **Survey System** - Annual reporting and benchmarking
- **Event Coordination** - Local event planning tools
- **Analytics Dashboard** - Club performance metrics

### **For Staff & Administration**
- **Staff HQ** - Multi-hub staff workspace
- **Incident Management** - Case tracking and resolution
- **Workflow Automation** - Business process automation
- **Content Management** - Knowledge base and resources
- **Financial Management** - Budget and expense tracking

## 🔐 Permission System

The app uses a sophisticated role-based permission system:

### **Primary Roles**
- `fan` - General public users
- `curler` - Active participants  
- `athlete` - High-performance competitors
- `coach` - Certified instructors
- `volunteer` - Event and program helpers
- `staff` - Curling Canada employees
- `admin` - System administrators

### **External Access Roles**
- `board_member` - Board governance access
- `sponsor_contact` - Sponsor dashboard access
- `club_president` - Enhanced club management
- `volunteer_lead` - Volunteer coordination tools

### **Permission Calculation**
1. Base permissions from `user_type`
2. Staff permissions layered for staff roles
3. External role permissions added
4. Composite permissions calculated
5. Super-admin override for `admin` role

## 🎯 XP & Gamification System

The Granite Circle loyalty program is central to user engagement:

### **XP Sources**
- Event attendance and engagement
- Content consumption and sharing  
- Volunteer activities
- Club participation
- Community contributions
- Learning module completion

### **Tier System**
- **Granite Rookie** (0-499 XP)
- **Sheet Star** (500-1499 XP)  
- **House Hero** (1500-3999 XP)
- **Button Boss** (4000-9999 XP)
- **Hack Master** (10000-24999 XP)
- **Granite Legacy** (25000+ XP)

### **Badge System**
Achievement badges for milestones, special events, and contributions.

## 🔄 Workflow Automation

The platform includes a sophisticated workflow engine for business process automation:

### **Trigger Types**
- Entity CRUD operations
- Time-based schedules
- External API events

### **Condition Logic**  
- Field comparisons with multiple operators
- Multi-condition AND logic
- Dynamic value substitution

### **Action Types**
- Microsoft Teams notifications
- Outlook calendar events
- Email communications
- Entity updates
- External API calls

## 🛠️ Development Setup

### **Prerequisites**
- Node.js 18+
- Modern browser with ES6+ support
- Access to base44 platform for backend services

### **Installation**
```bash
# Clone the repository
git clone [repository-url]
cd the-button

# Install dependencies
npm install

# Start development server
npm start
```

### **Environment Variables**
The app connects to the base44 platform for backend services. Configuration is handled through the platform's entity system.

## 🧪 Testing Strategy

### **Component Testing**
- React Testing Library for component behavior
- Jest for unit test runner
- Custom test utilities in `/components/tests/`

### **Integration Testing**  
- User flow testing with dedicated test components
- Permission system validation
- XP calculation verification

### **Performance Monitoring**
- Built-in performance monitoring service
- Cache service optimization
- Lazy loading validation

## 📈 Data Flow

### **Entity Management**
All data flows through the entity system:
```javascript
import { User } from '@/api/entities';

// CRUD operations
const user = await User.me();
await User.updateMyUserData({ preferences: {...} });
const clubs = await Club.list('-membership_count', 50);
```

### **State Management**
- **Local State**: useState for component-specific data
- **Context State**: useXP, usePermissions for shared state
- **Cache Layer**: CacheService for performance optimization

### **Real-time Updates**
- WebSocket integration for live event data
- Optimistic UI updates for better UX
- Background sync for offline capability

## 🚀 Deployment

The application is deployed through the base44 platform with:
- Automatic builds and deployments
- Environment-specific configurations  
- Built-in CDN and performance optimization
- SSL/TLS and security hardening

## 🤝 Contributing

### **Code Standards**
- Use TypeScript-style JSDoc comments
- Follow established component patterns
- Maintain responsive design principles
- Write meaningful test coverage

### **Component Guidelines**
- Keep components focused and single-purpose
- Use custom hooks for complex logic
- Implement proper loading states
- Handle error boundaries gracefully

### **Entity Design**
- Use JSON Schema for data validation
- Include comprehensive property descriptions
- Define clear relationships between entities
- Consider future extensibility

## 📚 Documentation

This codebase follows documentation best practices:
- **File-level JSDoc** headers explain component purpose
- **Function-level JSDoc** with parameters and returns
- **Inline comments** for business logic
- **Entity schemas** as living documentation

## 🎯 Roadmap

### **Phase 1: Foundation** ✅
- Core platform and user management
- Basic gamification system
- Club directory and profiles

### **Phase 2: Engagement** ✅  
- Advanced XP system and rewards
- Live streaming integration
- Community features and social tools

### **Phase 3: Intelligence** 🚧
- AI-powered recommendations
- Predictive analytics
- Advanced workflow automation

### **Phase 4: Integration** 📋
- External platform APIs
- Mobile app development
- International expansion features

---

*The Button represents the digital transformation of curling in Canada, bringing the community together through technology while preserving the sport's rich traditions and values.*