# Guardian Guide - Your Pocket Rights Advisor

A mobile-first web application providing real-time, location-aware guidance and scripts for navigating police interactions, and documenting incidents.

## 🚀 Features Implemented

### ✅ Core Features (PRD Complete)

#### 1. **On-Demand Scripts & Rights**
- ✅ Pre-written scripts for common scenarios (traffic stops, consent searches, etc.)
- ✅ AI-generated custom scripts (Premium feature)
- ✅ Multi-language support (English/Spanish)
- ✅ Location-aware script customization
- ✅ Audio playback with proper language pronunciation

#### 2. **Location-Aware Legal Info**
- ✅ Real-time geolocation detection
- ✅ Reverse geocoding with multiple fallback services
- ✅ State-specific legal information and rights
- ✅ Jurisdiction-specific advice and procedures
- ✅ Automatic updates when location changes

#### 3. **Quick Record Functionality**
- ✅ Real audio and video recording using MediaRecorder API
- ✅ Secure file upload to Supabase storage
- ✅ Local storage fallback for offline use
- ✅ Recording progress tracking and metadata
- ✅ Permission handling and error management

#### 4. **Shareable Incident Summary**
- ✅ Comprehensive incident reports with metadata
- ✅ AI-generated professional summaries
- ✅ Secure cloud storage and local backup
- ✅ Export and sharing capabilities
- ✅ Legal documentation format

### 🔧 Technical Implementation

#### **API Integrations**
- ✅ **OpenAI API** - AI script generation and incident summaries
- ✅ **Supabase** - Database, authentication, and file storage
- ✅ **Location Services** - Google Maps API + free fallback services
- ✅ **Stripe** - Subscription payment processing (mock implementation)

#### **Data Model**
- ✅ **User** - Authentication, preferences, subscription status
- ✅ **IncidentReport** - Complete incident documentation
- ✅ **JurisdictionData** - State-specific legal information

#### **User Flows**
- ✅ **On-Demand Interaction Guidance** - Location detection → scenario selection → script display
- ✅ **Post-Encounter Documentation** - Recording → incident creation → summary generation
- ✅ **User Onboarding & Subscription** - Anonymous access → premium upgrade flow

#### **Design System**
- ✅ Tailwind CSS with custom design tokens
- ✅ Responsive mobile-first design
- ✅ Consistent color scheme and typography
- ✅ Accessible UI components

## 🛠 Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend Services**: Supabase (PostgreSQL, Auth, Storage)
- **AI**: OpenAI GPT-4 for script generation
- **Location**: Browser Geolocation API + reverse geocoding
- **Payments**: Stripe (mock implementation)
- **Icons**: Lucide React
- **State Management**: React Context + useReducer

## 📱 Business Model

### Subscription Tiers
- **Free**: Basic scripts, audio recording, basic incident reports
- **Basic ($0.99/month)**: Enhanced features, email support
- **Premium ($2.99/month)**: AI-generated scripts, video recording, advanced analytics

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- Supabase account and project
- OpenAI API key
- (Optional) Google Maps API key for enhanced location services

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/this-is-a-6697.git
   cd this-is-a-6697
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your API keys:
   ```env
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

4. **Database Setup**
   
   Create the following tables in your Supabase project:
   
   ```sql
   -- Users table
   CREATE TABLE users (
     userId TEXT PRIMARY KEY,
     createdAt TIMESTAMP DEFAULT NOW(),
     subscriptionStatus TEXT DEFAULT 'free',
     preferredLanguage TEXT DEFAULT 'en',
     email TEXT,
     stripeCustomerId TEXT,
     stripeSubscriptionId TEXT
   );

   -- Incident reports table
   CREATE TABLE incident_reports (
     reportId TEXT PRIMARY KEY,
     userId TEXT REFERENCES users(userId),
     timestamp TIMESTAMP DEFAULT NOW(),
     location JSONB,
     interactionType TEXT,
     scriptUsed TEXT,
     recordingUrl TEXT,
     summary TEXT,
     createdAt TIMESTAMP DEFAULT NOW(),
     duration INTEGER,
     type TEXT,
     fileSize INTEGER,
     mimeType TEXT,
     notes TEXT
   );

   -- Jurisdiction data table
   CREATE TABLE jurisdiction_data (
     state TEXT PRIMARY KEY,
     jurisdictionName TEXT,
     stateLaws JSONB,
     rightsInformation JSONB,
     scripts JSONB,
     lastUpdated TIMESTAMP DEFAULT NOW()
   );
   ```

5. **Storage Setup**
   
   Create a storage bucket named `recordings` in your Supabase project for audio/video files.

6. **Start the development server**
   ```bash
   npm run dev
   ```

## 🔒 Security & Privacy

- **Data Encryption**: All sensitive data encrypted in transit and at rest
- **Anonymous Mode**: Full functionality without account creation
- **Local Storage**: Offline-first architecture with local backup
- **Permission Management**: Granular camera/microphone permissions
- **GDPR Compliant**: User data control and deletion capabilities

## 📊 Features by Subscription Tier

| Feature | Free | Basic | Premium |
|---------|------|-------|---------|
| Basic Scripts | ✅ | ✅ | ✅ |
| Audio Recording | ✅ | ✅ | ✅ |
| Location Detection | ✅ | ✅ | ✅ |
| Basic Incident Reports | ✅ | ✅ | ✅ |
| AI-Generated Scripts | ❌ | ❌ | ✅ |
| Video Recording | ❌ | ✅ | ✅ |
| Advanced Analytics | ❌ | ❌ | ✅ |
| Professional Reports | ❌ | ❌ | ✅ |
| Priority Support | ❌ | ❌ | ✅ |

## 🌍 Multi-Language Support

- **English**: Full feature support
- **Spanish**: Complete translation of scripts and UI
- **Extensible**: Easy to add additional languages

## 📱 Mobile Optimization

- **Progressive Web App** (PWA) ready
- **Responsive Design** for all screen sizes
- **Touch-Optimized** interface
- **Offline Functionality** with service workers
- **Native App Feel** with proper meta tags

## 🔧 Development

### Project Structure
```
src/
├── components/          # React components
├── contexts/           # React Context providers
├── hooks/              # Custom React hooks
├── services/           # API and external service integrations
├── data/               # Static data and configurations
├── utils/              # Utility functions
└── styles/             # CSS and styling files
```

### Key Components
- **Dashboard**: Main app interface
- **ScriptCard**: Interactive script display with AI generation
- **RecordButton**: Real media recording functionality
- **IncidentList**: Incident management and display
- **SubscriptionModal**: Payment and upgrade flow

### Custom Hooks
- **useLocation**: Geolocation and jurisdiction detection
- **useRecording**: Media recording management
- **useApp**: Global state management

## 🚀 Deployment

The app is configured for deployment on:
- **Vercel** (recommended)
- **Netlify**
- **Any static hosting service**

Build command: `npm run build`
Output directory: `dist`

## 📄 Legal Disclaimer

This application provides general legal information and should not be considered as legal advice. Users should consult with qualified legal professionals for specific legal matters. The app's content is for educational purposes only.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For technical support or feature requests, please create an issue in the GitHub repository.

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Guardian Guide** - Empowering citizens with knowledge and tools to safely exercise their constitutional rights during police interactions.
