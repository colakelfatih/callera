# Callera - AI Assistant Platform

An AI assistant that calls your customers for you. Social messages, calls, and CRM in one flow.

## 🚀 Features

### Core Modules
- **Unified Inbox** - All customer conversations in one place (Instagram, WhatsApp, Email, Phone)
- **AI Dialer** - AI-powered outbound calling with live transcripts
- **CRM** - Contact management with pipeline Kanban view
- **Automation Flows** - No-code workflow builder
- **Insights** - Analytics and reporting dashboard
- **Social Studio** - Content calendar and social media management

### Key Capabilities
- 🤖 AI-powered customer calling and conversation handling
- 📱 Multi-channel message management
- 🏷️ Automatic conversation labeling and sentiment analysis
- 📊 Comprehensive analytics and insights
- 🔄 No-code automation workflows
- 📅 Social media content scheduling
- 🌙 Dark/light mode support
- 📱 Fully responsive design

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: TailwindCSS with custom design system
- **Icons**: Lucide React
- **Charts**: Recharts
- **Language**: TypeScript
- **State Management**: React Context + useState

## 🎨 Design System

### Colors
- **Primary**: Navy (#0E1B3D) + Bright Blue (#2F80ED)
- **Background**: Light Gray (#F6F7F8) / Dark (#111721)
- **Accents**: Subtle teal/purple highlights

### Typography
- **Display**: Manrope (headings)
- **Body**: Inter (content)

### Components
- Consistent spacing and border radius (16-20px)
- Soft shadows and modern card designs
- Accessible color contrast
- Mobile-first responsive design

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd callera
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📱 Pages & Routes

### Landing Page
- `/` - Main landing page with hero, features, and footer

### Dashboard
- `/dashboard` - Redirects to inbox
- `/dashboard/inbox` - Unified message management
- `/dashboard/dialer` - AI calling interface
- `/dashboard/crm` - Contact and pipeline management
- `/dashboard/flows` - Automation workflow builder
- `/dashboard/insights` - Analytics and reporting
- `/dashboard/studio` - Social media management

## 🎯 Key Features Implemented

### Landing Page
- ✅ Hero section with 3D mockups
- ✅ Feature showcase
- ✅ Responsive design
- ✅ Dark mode support

### Dashboard Layout
- ✅ Sidebar navigation with collapsible menu
- ✅ Top bar with search and user controls
- ✅ Theme toggle (dark/light mode)
- ✅ Mobile-responsive design

### Inbox Module
- ✅ Multi-channel conversation list
- ✅ Channel filtering (Email, WhatsApp, Instagram, Phone)
- ✅ Conversation detail view
- ✅ Auto-labeling and sentiment analysis
- ✅ Real-time message status

### Dialer Module
- ✅ AI calling interface
- ✅ Live call simulation
- ✅ Call queue management
- ✅ Call history and transcripts
- ✅ Real-time audio visualization

### CRM Module
- ✅ Contact list and detail views
- ✅ Pipeline Kanban board
- ✅ Contact status management
- ✅ Tag and label system
- ✅ Search and filtering

### Automation Flows
- ✅ Flow list and management
- ✅ Visual flow builder preview
- ✅ Trigger, condition, and action nodes
- ✅ Flow activation/deactivation
- ✅ Flow performance tracking

### Insights Dashboard
- ✅ Key metrics cards
- ✅ Interactive charts (Bar, Pie, Line)
- ✅ Channel distribution analysis
- ✅ Sentiment analysis
- ✅ Response time trends
- ✅ Recent activity feed

### Social Studio
- ✅ Content calendar view
- ✅ Post list and detail management
- ✅ Multi-platform posting
- ✅ Engagement analytics
- ✅ Content scheduling

## 🎨 Design Assets

### Logo
- Full color logo with gradient
- Single color variants
- App icon versions
- SVG and PNG formats

### Brand Colors
- Primary: Navy (#0E1B3D) + Blue (#2F80ED)
- Semantic colors for success, warning, error states
- Dark mode color variants

## 📊 Mock Data

The application includes comprehensive mock data for:
- Customer contacts and companies
- Multi-channel conversations
- AI call records and transcripts
- Automation workflows
- Social media posts and engagement
- Analytics and metrics

## 🔧 Development

### Project Structure
```
src/
├── app/                 # Next.js app router pages
├── components/         # Reusable UI components
│   ├── ui/            # Design system components
│   ├── dashboard/     # Dashboard-specific components
│   └── landing/       # Landing page components
├── lib/               # Utilities and mock data
└── public/           # Static assets
```

### Component Architecture
- **UI Components**: Reusable design system components
- **Dashboard Components**: Feature-specific components
- **Layout Components**: Navigation and structure
- **Mock Data**: Realistic sample data for all modules

## 🚀 Deployment

The application is ready for deployment on:
- Vercel (recommended)
- Netlify
- AWS Amplify
- Any Node.js hosting platform

## 📱 Mobile Support

- Fully responsive design
- Touch-friendly interactions
- Mobile-optimized navigation
- Collapsible sidebar for mobile

## 🌙 Dark Mode

- System preference detection
- Manual toggle in dashboard
- Consistent theming across all components
- Accessible color contrast

## 📈 Performance

- Optimized bundle size
- Lazy loading for dashboard modules
- Efficient re-rendering with React
- Fast navigation with Next.js App Router

## 🔮 Future Enhancements

- Real-time WebSocket connections
- Advanced AI conversation handling
- Third-party integrations (CRM, email providers)
- Mobile app development
- Advanced analytics and reporting
- Team collaboration features

## 📄 License

This project is proprietary software. All rights reserved.

---

**Callera** - Turn your data into dialogue. 🚀
