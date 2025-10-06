# ECR Beach Resorts - Complete MVP Documentation

## 🏖️ Project Overview

ECR Beach Resorts is a comprehensive booking platform for luxury accommodations and event venues. The platform serves multiple user types with role-based dashboards and features.

## 🎯 Key Features

### **Multi-Role System**
- **Admin**: Platform management, user oversight, settings configuration
- **Owner**: Property management, booking oversight, earnings tracking
- **Broker**: Commission-based booking services, customer management
- **Customer**: Property discovery, booking management, favorites

### **Core Functionality**
- Property listing and management
- Real-time booking system
- Payment processing integration
- Commission tracking
- Calendar management
- Social media marketing automation
- Email marketing integration
- Comprehensive reporting

## 🏗️ Technical Architecture

### **Frontend Stack**
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for development and building

### **Backend & Database**
- **Supabase** for backend services
- **PostgreSQL** database with Row Level Security (RLS)
- **Real-time subscriptions** for live updates
- **File storage** for property images

### **Authentication**
- **Supabase Auth** with email/password
- **Role-based access control**
- **Secure session management**

## 📊 Database Schema

### **Core Tables**

#### **user_profiles**
```sql
- id (UUID, PK) - References auth.users
- name (TEXT)
- phone (TEXT)
- role (ENUM: admin, owner, broker, customer)
- kyc_status (ENUM: pending, verified, rejected)
- subscription_status (ENUM: active, inactive, trial)
- business_name (TEXT) - For owners
- agency_name (TEXT) - For brokers
- bank_details (JSONB)
- contact_info (JSONB)
```

#### **properties**
```sql
- id (UUID, PK)
- owner_id (UUID, FK → user_profiles)
- title (TEXT)
- description (TEXT)
- address, city, state (TEXT)
- geo (JSONB) - Coordinates
- amenities (TEXT[])
- images (TEXT[]) - URLs
- booking_mode (ENUM: full_villa, rooms_only, both)
- booking_types (ENUM: daily, hourly, both)
- full_villa_rates (JSONB)
- status (ENUM: active, inactive, under_review)
```

#### **room_types**
```sql
- id (UUID, PK)
- property_id (UUID, FK → properties)
- title (TEXT)
- capacity (INTEGER)
- price_per_night (NUMERIC)
- price_per_hour (NUMERIC)
- extra_person_charge (NUMERIC)
- amenities (TEXT[])
```

#### **bookings**
```sql
- id (UUID, PK)
- property_id (UUID, FK → properties)
- customer_id (UUID, FK → user_profiles)
- broker_id (UUID, FK → user_profiles) - Optional
- owner_id (UUID, FK → user_profiles)
- room_type_ids (UUID[])
- start_date, end_date (TIMESTAMPTZ)
- duration_type (ENUM: day, hour)
- guests (INTEGER)
- total_amount (NUMERIC)
- platform_commission (NUMERIC)
- broker_commission (NUMERIC)
- net_to_owner (NUMERIC)
- status (ENUM: pending, confirmed, cancelled, completed)
- payment_status (ENUM: pending, success, failed, refunded)
```

### **Supporting Tables**
- **transactions** - Payment records
- **commissions** - Commission tracking
- **coupons** - Discount codes
- **calendar_slots** - Availability management
- **user_favorites** - Saved properties
- **marketing_campaigns** - Social media automation
- **social_media_posts** - Posted content tracking
- **user_integrations** - User-specific integrations
- **admin_integrations** - Platform-wide integrations
- **subscription_plans** - Pricing plans
- **admin_settings** - Platform configuration

## 🔐 Security Features

### **Row Level Security (RLS)**
- **Enabled on all tables**
- **Role-based data access**
- **User can only access own data**
- **Admins have full access**

### **Authentication Policies**
```sql
-- Example: Users can only read own bookings
CREATE POLICY "Users can read own bookings as customer"
ON bookings FOR SELECT TO authenticated
USING (customer_id = auth.uid());
```

## 🚀 User Roles & Permissions

### **Admin**
- **Full platform access**
- **User management**
- **Settings configuration**
- **Reports and analytics**
- **Integration management**

### **Owner**
- **Property CRUD operations**
- **Booking management**
- **Earnings tracking**
- **Calendar management**
- **Social media marketing**
- **Can act as broker** for other properties

### **Broker**
- **Browse all properties**
- **Create bookings for customers**
- **Commission tracking**
- **Customer management**
- **Email marketing tools**

### **Customer**
- **Browse properties**
- **Create bookings**
- **Manage favorites**
- **Booking history**
- **Profile management**

## 💰 Business Model

### **Commission Structure**
- **Platform Commission**: 10% of booking amount
- **Broker Commission**: 20% of platform commission (2% of booking)
- **Net to Owner**: 88% of booking amount (when broker involved)

### **Subscription Plans**
- **Owner Plans**: Free, Pro (₹1,999/month), Enterprise (₹4,999/month)
- **Broker Plans**: Free, Plus (₹999/month), Pro (₹1,999/month)

## 🔌 Integrations

### **Payment Gateway**
- **Razorpay** integration for payments
- **Admin and user-level** configurations
- **Webhook handling** for payment status

### **Email Marketing**
- **Mailchimp** integration
- **Automated campaigns**
- **User segmentation**

### **Social Media**
- **Instagram Business API**
- **Facebook Graph API**
- **Automated property posting**
- **Engagement tracking**

## 📱 Key Components

### **Landing Page**
- **Hero section** with search
- **Featured properties**
- **Event venue categories**
- **Responsive design**

### **Authentication**
- **Login/Signup pages**
- **Role selection**
- **Form validation**
- **Error handling**

### **Dashboards**
- **Role-specific interfaces**
- **Statistics cards**
- **Quick actions**
- **Data visualization**

### **Property Management**
- **Property form** with image upload
- **Room type configuration**
- **Pricing management**
- **Calendar integration**

### **Booking System**
- **Multi-step booking flow**
- **Date/time selection**
- **Guest information**
- **Payment processing**
- **Confirmation system**

## 🛠️ Development Setup

### **Prerequisites**
- Node.js 18+
- Supabase account
- Git

### **Installation**
```bash
npm install
```

### **Environment Variables**
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### **Development**
```bash
npm run dev
```

### **Build**
```bash
npm run build
```

## 🗃️ File Structure

```
src/
├── components/
│   ├── admin/           # Admin-specific components
│   ├── auth/            # Authentication pages
│   ├── booking/         # Booking flow components
│   ├── broker/          # Broker-specific components
│   ├── calendar/        # Calendar management
│   ├── common/          # Shared components
│   ├── dashboard/       # Role-based dashboards
│   ├── landing/         # Landing page
│   ├── owner/           # Owner-specific components
│   ├── pricing/         # Pricing pages
│   ├── property/        # Property management
│   ├── reports/         # Analytics and reports
│   └── search/          # Search functionality
├── contexts/            # React contexts
├── data/               # Mock data
├── hooks/              # Custom hooks
├── lib/                # Utilities and configs
├── services/           # API services
└── types/              # TypeScript definitions
```

## 🔄 Data Flow

### **Booking Process**
1. **Customer/Broker** searches properties
2. **Selects property** and room types
3. **Chooses dates** and guest count
4. **Enters guest information**
5. **Applies coupons** if available
6. **Processes payment** via Razorpay
7. **Creates booking** record
8. **Calculates commissions** automatically
9. **Sends confirmations** via email

### **Property Management**
1. **Owner creates** property listing
2. **Admin reviews** and approves
3. **Property becomes** searchable
4. **Calendar slots** generated automatically
5. **Bookings update** availability
6. **Earnings tracked** in real-time

## 📈 Analytics & Reporting

### **Dashboard Metrics**
- **Revenue tracking**
- **Booking statistics**
- **Occupancy rates**
- **Commission analytics**
- **Growth metrics**

### **Export Options**
- **CSV reports**
- **PDF summaries**
- **Date range filtering**
- **Role-specific data**

## 🔧 Configuration

### **Admin Settings**
- **Commission rates**
- **Subscription pricing**
- **Integration credentials**
- **Platform branding**

### **User Settings**
- **Profile management**
- **Payment gateways**
- **Email marketing**
- **Social media accounts**

## 🚀 Deployment

### **Production Checklist**
- [ ] Environment variables configured
- [ ] Supabase project setup
- [ ] RLS policies tested
- [ ] Payment gateway configured
- [ ] Email service setup
- [ ] Social media apps created
- [ ] Domain configured
- [ ] SSL certificate installed

## 🔒 Security Considerations

### **Data Protection**
- **Row Level Security** on all tables
- **API key encryption**
- **Secure payment processing**
- **Input validation**
- **XSS prevention**

### **Access Control**
- **Role-based permissions**
- **JWT token validation**
- **Session management**
- **Audit logging**

## 📞 Support & Maintenance

### **Monitoring**
- **Error tracking**
- **Performance monitoring**
- **Database health**
- **API response times**

### **Backup Strategy**
- **Daily database backups**
- **File storage replication**
- **Configuration backups**
- **Disaster recovery plan**

## 🎨 Design System

### **Color Palette**
- **Primary**: Orange (#F97316) to Red (#EF4444) gradient
- **Secondary**: Blue (#3B82F6), Green (#10B981), Purple (#8B5CF6)
- **Neutral**: Gray scale for text and backgrounds

### **Typography**
- **Headings**: Bold, clear hierarchy
- **Body**: Readable, accessible contrast
- **Interactive**: Hover states and transitions

### **Components**
- **Consistent spacing** (8px grid system)
- **Rounded corners** (8px, 12px, 16px)
- **Shadow system** for depth
- **Responsive breakpoints**

---

## 📋 Demo Accounts

### **Login Credentials**
- **Admin**: admin@ecrbeachresorts.com / password123
- **Owner**: owner@ecrbeachresorts.com / password123
- **Broker**: broker@ecrbeachresorts.com / password123
- **Customer**: customer@ecrbeachresorts.com / password123

---

*This documentation provides a complete overview of the ECR Beach Resorts platform. For technical implementation details, refer to the source code and database schema.*