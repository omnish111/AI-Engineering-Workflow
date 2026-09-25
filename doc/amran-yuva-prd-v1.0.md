Table of Contents

<a id="X915fb50394059cea7421dae3b4567265cd53d75"></a># Amran Yuva Group ΓÇö Product Requirements Document \(PRD\)

__Document Version:__ 1\.0  
__Status:__ Engineering\-ready baseline  
__Product:__ Official digital community platform for Amran Yuva Group  
__Primary Region:__ Amran village, Gujarat, India  
__Primary Stack:__ Next\.js 16 App Router \+ TypeScript \+ modern CSS/UI, Node\.js 24 LTS \+ Express\.js \+ TypeScript, MongoDB \+ Mongoose  
__Development Database:__ Local MongoDB Server, inspected with MongoDB Compass  
__Production Database:__ MongoDB Atlas or equivalent managed MongoDB deployment  
__Project Folder:__ amran\-yuva\-group\-community\-platform

<a id="executive-summary-market-intelligence"></a>## 1\. Executive Summary & Market Intelligence

<a id="vision-problem-statement"></a>### 1\.1 Vision & Problem Statement

Amran Yuva Group is a volunteer\-based community/youth group serving Amran village\. Its work includes organizing and managing Hindu festivals and cultural celebrations such as Janmashtami, supporting village/community activities, encouraging youth and villager participation, and helping preserve Indian/Hindu culture and traditions\. Members provide their time voluntarily and the activity fund is supported through contributions/donations from Amran villagers and group members\.

The current problem is not simply a lack of a website\. The deeper problem is the absence of a durable, official digital layer for documenting community work, coordinating participation, presenting events, maintaining history, and communicating financial activity with appropriate transparency\.

The product will create an official digital home for the group with two connected surfaces:

1. __Public community website__ ΓÇö a trustworthy, mobile\-first experience for villagers, visitors, volunteers and supporters\.
2. __Secure administration platform__ ΓÇö a role\-controlled workspace for publishing events, activities, media, announcements, volunteer records, financial summaries and reports\.

The website must make the group feel authentic and local rather than like a generic NGO\. Its central product idea is:

__A village belongs to its people; the platform should document and strengthen the work those people do together\.__

<a id="product-goals"></a>### 1\.2 Product Goals

__Primary goals__

- Establish a credible official digital identity for Amran Yuva Group\.
- Make community activities and festivals easy to discover and understand\.
- Preserve a searchable year\-by\-year digital history\.
- Provide privacy\-conscious financial transparency based on verified records\.
- Make volunteering and community participation easier\.
- Give authorized members a manageable way to maintain content without developer involvement\.
- Create a technical foundation that can later support donations, notifications, attendance, multilingual content and other community workflows\.

__Non\-goals for MVP__

- Becoming a general social network for the village\.
- Publishing unverified member or donor information\.
- Implementing a full payment gateway before official payment details are approved\.
- Implementing every future community feature in version 1\.
- Making legal or tax claims about the organizationΓÇÖs status unless formally verified\.

<a id="target-audience"></a>### 1\.3 Target Audience

Persona

Primary needs

Key actions

Amran Villager

Know what the group is doing; see events; understand use of contributions

View events, transparency, gallery, announcements

Youth / Volunteer

Find opportunities and participate

View activities, join volunteer list, event details

Family / Community Participant

Discover cultural celebrations and memories

Events, gallery, history

Supporter / Donor

Understand why and how to support

Transparency, support page, published reports

Visitor / Former Resident

Learn about AmranΓÇÖs community life

About, history, activities, gallery

Group Admin

Manage website content and operations

Admin dashboard, events, media, announcements

Finance Manager

Maintain accurate public financial summaries

Donations, expenses, reports, audit trail

Content / Event Manager

Publish current activities and archives

Events, activities, gallery, announcements

<a id="core-value-proposition"></a>### 1\.4 Core Value Proposition

__For the community:__ one reliable place to see what is happening\.  
__For volunteers:__ one clear place to participate\.  
__For supporters:__ one transparent place to understand community funds\.  
__For the organization:__ one maintainable system for publishing and preserving its work\.  
__For future generations:__ one digital archive of the groupΓÇÖs journey\.

<a id="key-competitors-differentiators"></a>### 1\.5 Key Competitors & Differentiators

This product has no direct commercial competitor\. Instead, the competitive benchmark is the set of established nonprofit, volunteer, cultural and community websites that demonstrate strong patterns in trust, project reporting, volunteer participation, transparency and storytelling\.

__Reference categories__

- Rotary\-style service\-project documentation\.
- Indian grassroots organizations such as Goonj and SEWA\.
- Cultural/service organizations such as Ramakrishna Mission and ISKCON\.
- Transparent philanthropic organizations such as charity: water, Red Cross and MSF\.
- Volunteer and project systems such as Habitat for Humanity and GlobalGiving\.
- Long\-term reporting/archive models such as Pratham and Wikimedia Foundation\.

__Differentiators for Amran Yuva Group__

1. __Village\-first identity:__ the product centers Amran, its people and its community activities rather than a national or international cause\.
2. __Culture \+ seva in one experience:__ festivals and cultural preservation are presented alongside community service rather than as unrelated content\.
3. __Event\-as\-a\-record:__ each major festival/activity can have a durable page containing details, media, participation and, where appropriate, a financial summary\.
4. __Transparency as a product feature:__ public financial summaries are generated from structured, verified records instead of manually written claims\.
5. __Historical continuity:__ content is designed to accumulate into a year\-by\-year digital archive\.
6. __Volunteer coordination:__ participation is treated as a workflow, not merely a phone number at the bottom of a page\.

<a id="product-principles"></a>### 1\.6 Product Principles

1. __Truth before polish\.__ Never invent facts, numbers, people, money or achievements\.
2. __Community before marketing\.__ The website should inform and document rather than advertise\.
3. __Privacy by default\.__ Collect and display only what is necessary\.
4. __Transparency with context\.__ Financial information must be accurate, explainable and traceable to records\.
5. __Real media over generic stock\.__ Actual Amran photographs and videos should dominate the experience once available\.
6. __Mobile first\.__ A large percentage of the audience may access the website from phones\.
7. __Maintainability over novelty\.__ Prefer simple architecture and reusable components\.
8. __Progressive enhancement\.__ MVP must work without future integrations\.

<a id="technical-currency-market-intelligence"></a>### 1\.7 Technical Currency / Market Intelligence

As of September 2026, Next\.js 16 is the current major generation, and Next\.js 16\.3\.3 is listed by the official Next\.js release notes as an Active LTS security release\. Next\.js 16 also includes the App Router, Turbopack as the default bundler, React 19\.2 support and modern caching/navigation improvements\. The PRD therefore targets the __Next\.js 16 App Router__ rather than a legacy Pages Router architecture\.

For Node\.js, the official release schedule shows __Node\.js 24 as LTS__ and Node\.js 26 as Current in September 2026\. For a production service, the project should use an LTS release; therefore this PRD targets __Node\.js 24 LTS__\.

MongoDBΓÇÖs official documentation lists the 8\.x family as the current major production generation and the 8\.3 series as the current stable minor series\. For predictable operational lifecycle management, the application should support MongoDB 8\.x and pin the deployed server to an approved stable release rather than depending on an unbounded latest tag\.

<a id="success-metrics"></a>### 1\.8 Success Metrics

Metrics should be activated only after real analytics and operating data exist\.

__Product metrics__

- Percentage of indexed public pages returning successfully\.
- Event detail page views\.
- Volunteer form completion rate\.
- Support/transparency page visits\.
- Financial report downloads\.
- Returning visitors\.

__Operational metrics__

- Time required for an admin to publish a new event\.
- Percentage of published content with complete metadata\.
- Number of financial records reconciled per reporting period\.
- Number of content errors requiring correction\.

__Trust metrics__

- Percentage of public financial totals generated from verified records\.
- Percentage of event pages containing real media when available\.
- Audit coverage for finance actions\.

<a id="assumptions-and-constraints"></a>### 1\.9 Assumptions and Constraints

- The group will provide or approve its official logo, photographs, contact information and other organizational facts\.
- Legal/registration details are not assumed\.
- Local development may use MongoDB on the developerΓÇÖs computer, viewed through MongoDB Compass\.
- Production hosting will use a remotely accessible database; local MongoDB cannot serve a public production website\.
- Financial publication is subject to internal verification and approval\.
- English is the implementation baseline, with the architecture prepared for Gujarati and Hindi localization\.

<a id="X388071c497169a0de3909409df7d80f6e9dc328"></a>### 1\.10 Reference Sources for Technical Decisions

- Next\.js official release notes: https://nextjs\.org/blog  

- Node\.js official release schedule: https://nodejs\.org/en/about/previous\-releases  

- MongoDB official release notes: https://www\.mongodb\.com/docs/manual/release\-notes/  

- MongoDB versioning: https://www\.mongodb\.com/docs/manual/reference/versioning/

<a id="aesthetics-design-uiux-standards"></a>## 2\. Aesthetics, Design & UI/UX Standards

<a id="visual-direction"></a>### 2\.1 Visual Direction

__Design character:__ contemporary Indian community editorial \+ premium civic/service platform\.

The website should feel:

- warm
- trustworthy
- human
- modern
- culturally respectful
- premium without looking expensive
- accessible to older users
- energetic enough for younger users

Avoid:

- generic corporate NGO templates
- exaggerated spiritual/religious styling
- excessive gradients
- heavy glassmorphism
- over\-rounded interfaces
- animation everywhere
- fake counters
- stock imagery presented as local photography

<a id="color-system"></a>### 2\.2 Color System

Use design tokens so the system can be adjusted after the groupΓÇÖs actual brand/logo is provided\.

__Base tokens__

- bg\-primary: warm off\-white / ivory
- bg\-secondary: soft neutral
- surface: white
- text\-primary: deep charcoal
- text\-secondary: muted charcoal
- border\-subtle: warm neutral border
- accent\-primary: restrained saffron/terracotta family
- accent\-secondary: earthy green/olive family for selected service/support states
- success: semantic green
- warning: semantic amber
- danger: semantic red
- focus: high\-contrast accessible focus ring

Do not make the site visually dependent on color alone\.

<a id="typography"></a>### 2\.3 Typography

Use a highly legible modern sans\-serif for UI/body and optionally a complementary Indian\-language\-compatible display face for major headings\. The final font family should be chosen for Gujarati/Hindi coverage, readability and performance\.

Typography hierarchy:

- Display: bold, expressive, short
- H1: strong but compact
- H2: section\-level hierarchy
- H3: card/subsection hierarchy
- Body: 16px or above on mobile where practical
- Metadata: minimum 13\-14px with sufficient contrast

Do not use tiny text to fit content into cards\.

<a id="layout-system"></a>### 2\.4 Layout System

- 12\-column desktop grid\.
- Single\-column mobile flow with intentional grouping\.
- Maximum content width around 1200\-1280px\.
- Comfortable horizontal padding\.
- 8\-point or similarly consistent spacing scale\.
- Strong vertical rhythm\.
- Avoid dense walls of content\.

<a id="navigation"></a>### 2\.5 Navigation

__Desktop:__

Logo / Amran Yuva Group | Home | About | Activities | Events | Transparency | Gallery | History | Join Us

Primary action: __Support / Join Us__, depending on context\.

__Mobile:__

Use a simple drawer/menu with large touch targets\.

Do not hide essential functions behind nested menus\.

<a id="homepage-layout"></a>### 2\.6 Homepage Layout

<a id="hero"></a>#### Hero

Purpose: communicate identity in under 5 seconds\.

Content:

- short Gujarati/English headline
- one\-sentence explanation
- primary CTA: Explore Our Work
- secondary CTA: Join the Seva
- real community image/video when available

Potential tone:

__α¬Åα¬ò α¬ùα¬╛α¬«\. α¬Åα¬òα¬ñα¬╛\. α¬╕α½çα¬╡α¬╛\. α¬╕α¬éα¬╕α½ìα¬òα½âα¬ñα¬┐\.__

Together for Amran\. Serving the community, celebrating our traditions\.

This wording is subject to final organizational approval\.

<a id="mission-strip"></a>#### Mission strip

Short explanation of:

- volunteer\-based service
- community participation
- cultural celebrations
- village\-focused activities

<a id="activity-cards"></a>#### Activity cards

- Festivals & Cultural Celebrations
- Community Service
- Youth Activities
- Village\-focused Activities

<a id="featured-event"></a>#### Featured event

One high\-quality event card with:

- cover image
- title
- date
- location
- short description
- View Event CTA

<a id="impact-section"></a>#### Impact section

Use only verified numbers\. The component must gracefully omit metrics that have not been verified\.

<a id="transparency-preview"></a>#### Transparency preview

Show current year totals only when data is verified\.

CTA: View Transparency

<a id="story-section"></a>#### Story section

Human\-centered explanation of why the group exists\.

<a id="latest-activities"></a>#### Latest activities

Chronological list, not marketing claims\.

<a id="gallery-preview"></a>#### Gallery preview

Use real photos, grouped by event/year\.

<a id="volunteer-cta"></a>#### Volunteer CTA

Simple statement that participation is voluntary\.

<a id="public-page-standards"></a>### 2\.7 Public Page Standards

__About__ ΓÇö identity, mission, values, history, volunteer nature, contact\.  
__Activities__ ΓÇö category\-driven service and community work\.  
__Events__ ΓÇö searchable/listable festivals and activities\.  
__Event Details__ ΓÇö full event record\.  
__Transparency__ ΓÇö year\-wise contributions, expenses, balance, reports\.  
__Gallery__ ΓÇö filterable visual archive\.  
__History__ ΓÇö year\-by\-year timeline\.  
__Volunteers__ ΓÇö why/how to participate \+ form\.  
__Announcements__ ΓÇö official updates\.  
__Support__ ΓÇö future\-ready support/donation instructions\.  
__Contact__ ΓÇö official channels only\.

<a id="admin-ui-standards"></a>### 2\.8 Admin UI Standards

Admin UI is not the public marketing site\.

Use:

- left sidebar on desktop
- compact mobile navigation
- data tables for finance
- cards for overview metrics
- forms with inline validation
- confirmation dialogs for destructive actions
- explicit publish states
- clear audit status for finance data

Admin screens must prioritize clarity over decoration\.

<a id="micro-interactions"></a>### 2\.9 Micro\-interactions

Use restrained motion for:

- navigation transitions
- card hover elevation
- button press feedback
- image reveal
- section reveal on scroll
- success/error feedback

Respect prefers\-reduced\-motion\.

Avoid:

- infinite parallax
- autoplay audio
- attention\-demanding animated backgrounds
- long entrance animations

<a id="responsive-requirements"></a>### 2\.10 Responsive Requirements

The product must be tested at minimum at:

- 320px
- 375px
- 390px
- 430px
- 768px
- 1024px
- 1280px
- 1440px\+

No horizontal scrolling on normal viewport sizes\.

<a id="accessibility"></a>### 2\.11 Accessibility

Follow WCAG\-oriented practices:

- semantic HTML
- logical heading hierarchy
- keyboard access
- visible focus states
- sufficient color contrast
- alt text for meaningful images
- accessible form labels/errors
- large touch targets
- accessible dialogs
- reduced motion support
- no color\-only status indicators

<a id="content-ux-rules"></a>### 2\.12 Content UX Rules

Every page should answer, where relevant:

__What happened? When? Where? Who participated? Why does it matter? What can I do next?__

Avoid AI\-sounding filler language\.

<a id="core-feature-modules-user-stories"></a>## 3\. Core Feature Modules & User Stories

<a id="module-a-public-identity-home"></a>### Module A ΓÇö Public Identity & Home

__User Story:__ As a visitor, I want to understand Amran Yuva Group immediately so that I know what the group does and why it exists\.

__Functional Requirements__

- Responsive homepage\.
- Official group name and approved logo\.
- Mission summary\.
- Activity categories\.
- Featured event\.
- Transparency preview\.
- Latest activities\.
- Gallery preview\.
- Volunteer CTA\.
- Footer with approved contact/social details\.
- CMS\-configurable hero copy and featured content\.

<a id="module-b-about-mission"></a>### Module B ΓÇö About & Mission

__User Story:__ As an Amran villager, I want to understand the groupΓÇÖs purpose and volunteer model so that I know what the organization represents\.

__Functional Requirements__

- Mission, vision and values\.
- Volunteer\-based service explanation\.
- Cultural preservation explanation\.
- Community participation model\.
- Organizational story\.
- Verified history entries\.
- No unsupported legal claims\.

<a id="module-c-activities"></a>### Module C ΓÇö Activities

__User Story:__ As a visitor, I want to browse the kinds of activities the group performs so that I can understand its service scope\.

__Functional Requirements__

- Activity categories\.
- Activity cards\.
- Activity detail pages\.
- Filter by category/year\.
- Search\.
- Related events/media\.
- Published/unpublished control\.

<a id="module-d-events-festivals"></a>### Module D ΓÇö Events & Festivals

__User Story:__ As a villager, I want to see upcoming and past festivals so that I can participate or revisit community memories\.

__Functional Requirements__

- Upcoming events\.
- Past events\.
- Year filter\.
- Category filter\.
- Location field\.
- Event date/time\.
- Event details\.
- Gallery/video references\.
- Optional participation counts when verified\.
- Optional financial summary when verified\.
- Related activity records\.
- SEO\-friendly event URLs\.

<a id="module-e-event-detail-event-record"></a>### Module E ΓÇö Event Detail / Event Record

__User Story:__ As a supporter, I want one complete page for an event so that I can understand what happened and see evidence of the activity\.

__Functional Requirements__

- Cover image\.
- Overview\.
- Schedule or activity breakdown if available\.
- Community participation summary\.
- Volunteer summary\.
- Media gallery\.
- Financial summary if approved\.
- Downloadable report if published\.
- Related events\.

<a id="module-f-community-service-activities"></a>### Module F ΓÇö Community Service Activities

__User Story:__ As a villager, I want to understand non\-festival activities so that the groupΓÇÖs service work is visible beyond celebrations\.

__Functional Requirements__

- Categorized activity listing\.
- Detail pages\.
- Date and location\.
- Media\.
- Related event if any\.
- Optional outcome summary\.

<a id="module-g-gallery-media-archive"></a>### Module G ΓÇö Gallery & Media Archive

__User Story:__ As a community member, I want to see real photos and videos from activities so that the website reflects genuine community work\.

__Functional Requirements__

- Image upload\.
- Video link/upload architecture\.
- Year/event/category filters\.
- Captions\.
- Alt text\.
- Lightbox\.
- Responsive grid\.
- Optimized delivery\.
- Media\-event association\.
- Admin moderation and deletion\.

<a id="module-h-history-digital-archive"></a>### Module H ΓÇö History / Digital Archive

__User Story:__ As a former resident, I want to explore the groupΓÇÖs past so that I can reconnect with AmranΓÇÖs community history\.

__Functional Requirements__

- Year timeline\.
- Events by year\.
- Activities by year\.
- Highlight stories\.
- Media by year\.
- Future\-ready archival model\.

<a id="module-i-announcements"></a>### Module I ΓÇö Announcements

__User Story:__ As a villager, I want official updates in one place so that I do not have to depend on informal forwarding alone\.

__Functional Requirements__

- Draft/publish/archive\.
- Publication date\.
- Category\.
- Image\.
- Content body\.
- Slug\.
- Author/admin metadata\.
- Recent announcement feed\.

<a id="module-j-volunteer-participation"></a>### Module J ΓÇö Volunteer Participation

__User Story:__ As a resident, I want to tell the group how I can help so that I can participate in activities that match my skills and interests\.

__Functional Requirements__

- Public volunteer form\.
- Interest categories\.
- Optional skills and availability\.
- Consent checkbox\.
- Submission status\.
- Admin review\.
- Contacted/active workflow\.
- Spam/rate limiting\.

<a id="module-k-donations-support"></a>### Module K ΓÇö Donations & Support

__User Story:__ As a supporter, I want clear and official support instructions so that I know how to contribute safely\.

__Functional Requirements__

- Support page\.
- Future UPI support architecture\.
- Future bank transfer architecture\.
- Future payment gateway architecture\.
- Official instructions managed in admin\.
- No fake payment credentials\.
- Optional campaign/event association\.

<a id="module-l-financial-transparency"></a>### Module L ΓÇö Financial Transparency

__User Story:__ As a villager or supporter, I want to see verified financial summaries so that I can understand how community contributions are being used\.

__Functional Requirements__

- Year\-wise summary\.
- Contributions total\.
- Expenses total\.
- Closing balance\.
- Event\-wise summary\.
- Expense categories\.
- Published financial reports\.
- Verification status internally\.
- Audit log\.
- Privacy\-safe public presentation\.

<a id="module-m-admin-dashboard"></a>### Module M ΓÇö Admin Dashboard

__User Story:__ As an authorized administrator, I want a central dashboard so that I can manage the website without changing code\.

__Functional Requirements__

- Dashboard overview\.
- Events\.
- Activities\.
- Media\.
- Volunteers\.
- Announcements\.
- Donations\.
- Expenses\.
- Reports\.
- User/role management\.
- Audit logs\.
- Site settings\.

<a id="module-n-rbac-authentication"></a>### Module N ΓÇö RBAC & Authentication

__User Story:__ As a system owner, I want role\-based access so that financial and administrative actions are limited to authorized members\.

__Functional Requirements__

- Login/logout\.
- Secure session/token strategy\.
- Password hashing\.
- Role assignment\.
- Permission checks at API and UI levels\.
- Session expiration\.
- Basic brute\-force/rate limiting\.
- Admin route protection\.

<a id="module-o-audit-logging"></a>### Module O ΓÇö Audit Logging

__User Story:__ As a governance owner, I want important administrative changes recorded so that sensitive changes can be reviewed later\.

__Functional Requirements__

- Actor ID\.
- Action\.
- Entity type\.
- Entity ID\.
- Timestamp\.
- Before/after summary where safe\.
- IP/user\-agent handling according to privacy policy\.
- Finance actions mandatory\.
- Admin\-only access\.

<a id="module-p-seo-discoverability"></a>### Module P ΓÇö SEO / Discoverability

__User Story:__ As a visitor searching for Amran Yuva Group, I want official pages to appear in search engines so that I can find accurate information\.

__Functional Requirements__

- Metadata per page\.
- Canonical URLs\.
- Open Graph\.
- Sitemap\.
- Robots file\.
- JSON\-LD where accurate\.
- Event structured data where applicable\.
- Clean slugs\.
- Local search\-friendly content\.
- No spam pages\.

<a id="module-q-analytics-observability"></a>### Module Q ΓÇö Analytics / Observability

__User Story:__ As an administrator, I want privacy\-conscious analytics so that I can understand which parts of the website are useful\.

__Functional Requirements__

- Event page views\.
- Volunteer form starts/submits\.
- Support/transparency page views\.
- Report downloads\.
- Error monitoring\.
- Performance monitoring\.
- Avoid collection of unnecessary personal data\.

<a id="module-r-localization-foundation"></a>### Module R ΓÇö Localization Foundation

__User Story:__ As a Gujarati\-speaking villager, I want future website content to be available in my preferred language\.

__Functional Requirements__

- Translation\-ready content model\.
- Locale\-aware routes or middleware\.
- Language switcher architecture\.
- English baseline\.
- Gujarati/Hindi ready\.
- No duplicated hardcoded strings in components\.

<a id="data-models-database-schema"></a>## 4\. Data Models & Database Schema

<a id="global-schema-conventions"></a>### 4\.1 Global Schema Conventions

- MongoDB \_id uses ObjectId\.
- Public URLs use slug strings\.
- All timestamps stored in UTC\.
- Money stored as integer minor units \(paise\) or decimal\-safe numeric representation; do not use JavaScript floating point for accounting\.
- Every collection should include createdAt and updatedAt unless there is a specific reason not to\.
- Soft deletion should be preferred for content and records where auditability matters\.
- Publicly visible content must have an explicit status\.

<a id="user"></a>### 4\.2 User

__Fields__

- \_id: ObjectId, Required, Indexed\.
- name: String, Required, trimmed\.
- email: String, Required for login identities, Unique, Indexed, normalized lowercase\.
- phone: String, Optional, normalized, not public by default\.
- passwordHash: String, Required, never returned by API\.
- roleIds: Array, Required, references Role\.
- status: Enum\(active, inactive, locked\), Required, Indexed\.
- lastLoginAt: Date, Optional\.
- failedLoginCount: Number, Required, default 0\.
- lockedUntil: Date, Optional\.
- createdAt: Date, Required\.
- updatedAt: Date, Required\.

__Relationships__

- Many Users belong to many Roles\.
- One User can create many content and financial records\.

<a id="role"></a>### 4\.3 Role

- \_id: ObjectId, Required\.
- name: String, Required, Unique\.
- description: String, Optional\.
- permissionKeys: Array, Required\.
- isSystemRole: Boolean, Required\.
- createdAt, updatedAt: Date\.

<a id="activity"></a>### 4\.4 Activity

- \_id: ObjectId\.
- title: String, Required\.
- slug: String, Required, Unique, Indexed\.
- categoryId: ObjectId, Required, references ActivityCategory\.
- summary: String, Required, max length\.
- description: String, Required\.
- location: String, Optional\.
- startDate: Date, Required, Indexed\.
- endDate: Date, Optional\.
- coverMediaId: ObjectId, Optional\.
- galleryMediaIds: Array, Optional\.
- eventId: ObjectId, Optional\.
- impactSummary: String, Optional\.
- status: Enum\(draft, published, archived\), Required, Indexed\.
- publishedAt: Date, Optional, Indexed\.
- createdBy: ObjectId, Required, references User\.
- updatedBy: ObjectId, Required, references User\.
- timestamps\.

<a id="event"></a>### 4\.5 Event

- \_id: ObjectId\.
- title: String, Required\.
- slug: String, Required, Unique, Indexed\.
- category: Enum or reference, Required\.
- summary: String, Required\.
- description: String, Required\.
- location: String, Optional\.
- startDate: Date, Required, Indexed\.
- endDate: Date, Optional\.
- coverMediaId: ObjectId, Optional\.
- mediaIds: Array, Optional\.
- videoLinks: Array, Optional, URL\-validated\.
- volunteerCount: Number, Optional, min 0\.
- participantCount: Number, Optional, min 0\.
- financialSummaryEnabled: Boolean, Required, default false\.
- financialSummary: Embedded optional object containing verified totals only\.
- reportId: ObjectId, Optional, references FinancialReport or EventReport\.
- status: Enum\(draft, published, archived\), Required\.
- publishedAt: Date, Optional\.
- createdBy, updatedBy: ObjectId\.
- timestamps\.

<a id="activitycategory"></a>### 4\.6 ActivityCategory

- \_id: ObjectId\.
- name: String, Required, Unique\.
- slug: String, Required, Unique\.
- description: String, Optional\.
- sortOrder: Number, Required\.
- isActive: Boolean, Required\.

Suggested initial categories:

- Festivals & Cultural
- Community Service
- Village\-focused Activities
- Youth Activities
- Education
- Cleanliness / Environment
- Community Support
- Other

<a id="media"></a>### 4\.7 Media

- \_id: ObjectId\.
- storageProvider: Enum\(local, cloudinary, s3\-compatible, r2\), Required\.
- storageKey: String, Required, private\.
- publicUrl: String, Required when published\.
- type: Enum\(image, video, document\), Required\.
- mimeType: String, Required\.
- sizeBytes: Number, Required\.
- width: Number, Optional\.
- height: Number, Optional\.
- durationSeconds: Number, Optional\.
- altText: String, Required for images intended for public display\.
- caption: String, Optional\.
- credit: String, Optional\.
- year: Number, Optional, Indexed\.
- eventId: ObjectId, Optional\.
- activityId: ObjectId, Optional\.
- status: Enum\(draft, published, archived\), Required\.
- uploadedBy: ObjectId, Required\.
- timestamps\.

<a id="volunteer"></a>### 4\.8 Volunteer

- \_id: ObjectId\.
- name: String, Required\.
- phone: String, Required for contact workflow unless policy later removes it\.
- email: String, Optional\.
- location: String, Optional\.
- ageBracket: Enum or String, Optional\.
- skills: Array, Optional\.
- interests: Array, Required\.
- availability: String, Optional\.
- message: String, Optional\.
- consent: Boolean, Required, must be true for submission\.
- status: Enum\(new, contacted, approved, active, inactive, archived\), Required\.
- internalNotes: String, Optional, admin\-only\.
- timestamps\.

<a id="announcement"></a>### 4\.9 Announcement

- \_id: ObjectId\.
- title: String, Required\.
- slug: String, Required, Unique\.
- summary: String, Required\.
- content: String, Required\.
- coverMediaId: ObjectId, Optional\.
- category: String or Enum, Required\.
- status: Enum\(draft, published, archived\), Required\.
- publishedAt: Date, Optional, Indexed\.
- createdBy, updatedBy: ObjectId\.
- timestamps\.

<a id="donation"></a>### 4\.10 Donation

- \_id: ObjectId\.
- date: Date, Required, Indexed\.
- amountMinor: Number, Required, integer >= 1\.
- currency: String, Required, default INR\.
- sourceType: Enum\(villager, group\-member, community, other\), Required\.
- eventId: ObjectId, Optional\.
- year: Number, Required, Indexed\.
- reference: String, Optional, admin\-only or redacted\.
- notes: String, Optional, admin\-only or privacy\-reviewed\.
- verificationStatus: Enum\(pending, verified, rejected\), Required, Indexed\.
- verifiedBy: ObjectId, Optional\.
- verifiedAt: Date, Optional\.
- createdBy, updatedBy: ObjectId\.
- timestamps\.

__Public exposure rule:__ individual donor identity and individual donation amounts are private by default\. Public pages show verified aggregates unless explicitly approved otherwise\.

<a id="expense"></a>### 4\.11 Expense

- \_id: ObjectId\.
- date: Date, Required, Indexed\.
- amountMinor: Number, Required, integer >= 1\.
- currency: String, Required, default INR\.
- category: String, Required, Indexed\.
- eventId: ObjectId, Optional\.
- year: Number, Required, Indexed\.
- description: String, Required\.
- receiptMediaId: ObjectId, Optional, private\.
- verificationStatus: Enum\(pending, verified, rejected\), Required\.
- verifiedBy: ObjectId, Optional\.
- verifiedAt: Date, Optional\.
- createdBy, updatedBy: ObjectId\.
- timestamps\.

<a id="financialreport"></a>### 4\.12 FinancialReport

- \_id: ObjectId\.
- year: Number, Required, Unique\.
- title: String, Required\.
- summary: String, Optional\.
- totalContributionsMinor: Number, Required, computed from verified records or locked after verification\.
- totalExpensesMinor: Number, Required, computed from verified records\.
- closingBalanceMinor: Number, Required\.
- documentMediaId: ObjectId, Optional\.
- verificationStatus: Enum\(draft, verified, published\), Required\.
- verifiedBy: ObjectId, Optional\.
- verifiedAt: Date, Optional\.
- publishedAt: Date, Optional\.
- timestamps\.

<a id="auditlog"></a>### 4\.13 AuditLog

- \_id: ObjectId\.
- actorUserId: ObjectId, Required, Indexed\.
- action: Enum\(create, update, delete, publish, verify, login, logout, role\-change, settings\-change\), Required\.
- entityType: String, Required, Indexed\.
- entityId: ObjectId or String, Required, Indexed\.
- before: Object or null, sanitized\.
- after: Object or null, sanitized\.
- metadata: Object, Optional\.
- createdAt: Date, Required, Indexed\.

<a id="sitesettings"></a>### 4\.14 SiteSettings

- \_id: singleton ObjectId or fixed identifier\.
- siteName: String, Required\.
- tagline: String, Optional\.
- logoMediaId: ObjectId, Optional\.
- faviconMediaId: ObjectId, Optional\.
- officialEmail: String, Optional\.
- officialPhone: String, Optional\.
- officialAddress: String, Optional\.
- socialLinks: Object, optional\.
- defaultLocale: String, Required, default en\-IN\.
- enabledLocales: Array\.
- supportInstructions: Rich object, admin\-controlled\.
- maintenanceMode: Boolean, Required\.
- timestamps\.

<a id="indexing-strategy"></a>### 4\.15 Indexing Strategy

Minimum indexes:

- User\.email unique\.
- Event\.slug unique\.
- Event\.startDate descending\.
- Event\.status \+ startDate\.
- Activity\.slug unique\.
- Activity\.startDate descending\.
- Announcement\.slug unique\.
- Announcement\.publishedAt descending\.
- Media\.year \+ eventId\.
- Donation\.year \+ verificationStatus \+ date\.
- Expense\.year \+ verificationStatus \+ date\.
- FinancialReport\.year unique\.
- AuditLog\.entityType \+ entityId \+ createdAt\.

Review indexes with real query telemetry after launch\.

<a id="api-contracts-endpoints"></a>## 5\. API Contracts & Endpoints

<a id="api-standards"></a>### 5\.1 API Standards

Base path:

/api/v1

JSON response envelope:

\{  
  "success": true,  
  "data": \{\},  
  "meta": \{\}  
\}

Error envelope:

\{  
  "success": false,  
  "error": \{  
    "code": "VALIDATION\_ERROR",  
    "message": "One or more fields are invalid\.",  
    "details": \[\]  
  \},  
  "requestId": "req\_123"  
\}

All endpoints must return a request/correlation ID for supportability\.

<a id="public-event-apis"></a>### 5\.2 Public Event APIs

<a id="get-apiv1events"></a>#### GET /api/v1/events

Query:

- page
- limit
- year
- category
- status \(public API should normally force published\)
- q
- sort

Success: 200

\{  
  "success": true,  
  "data": \[  
    \{  
      "id": "66\.\.\.",  
      "title": "Janmashtami 2026",  
      "slug": "janmashtami\-2026",  
      "summary": "\.\.\.",  
      "startDate": "2026\-08\-XXT\.\.\.Z",  
      "location": "Amran",  
      "coverImage": \{  
        "url": "https://\.\.\."  
      \}  
    \}  
  \],  
  "meta": \{  
    "page": 1,  
    "limit": 12,  
    "total": 1,  
    "pages": 1  
  \}  
\}

Errors: 400 invalid query; 500 unexpected server error\.

<a id="get-apiv1eventsslug"></a>#### GET /api/v1/events/:slug

Success: 200\.  
Errors: 404 not found; 400 invalid slug\.

<a id="public-activities"></a>### 5\.3 Public Activities

<a id="get-apiv1activities"></a>#### GET /api/v1/activities

Supports pagination, year/category filters and search\.

<a id="get-apiv1activitiesslug"></a>#### GET /api/v1/activities/:slug

Returns published activity details and related media\.

<a id="public-announcements"></a>### 5\.4 Public Announcements

<a id="get-apiv1announcements"></a>#### GET /api/v1/announcements

Returns published announcements\.

<a id="get-apiv1announcementsslug"></a>#### GET /api/v1/announcements/:slug

Returns a published announcement\.

<a id="public-gallery"></a>### 5\.5 Public Gallery

<a id="get-apiv1gallery"></a>#### GET /api/v1/gallery

Query:

- page
- limit
- year
- eventId
- activityId
- type

Success: 200\.  
Errors: 400, 500\.

<a id="public-transparency"></a>### 5\.6 Public Transparency

<a id="get-apiv1transparencyyears"></a>#### GET /api/v1/transparency/years

Returns years with published financial summaries\.

<a id="get-apiv1transparencyyear"></a>#### GET /api/v1/transparency/:year

Success response:

\{  
  "success": true,  
  "data": \{  
    "year": 2026,  
    "contributions": \{  
      "amountMinor": 0,  
      "currency": "INR"  
    \},  
    "expenses": \{  
      "amountMinor": 0,  
      "currency": "INR"  
    \},  
    "closingBalance": \{  
      "amountMinor": 0,  
      "currency": "INR"  
    \},  
    "categories": \[\],  
    "events": \[\],  
    "report": null  
  \}  
\}

Public endpoint must only use verified/published records\.

<a id="volunteer-submission"></a>### 5\.7 Volunteer Submission

<a id="post-apiv1volunteers"></a>#### POST /api/v1/volunteers

Request:

\{  
  "name": "Example Person",  
  "phone": "\[OFFICIAL\_INPUT\]",  
  "email": "optional@example\.com",  
  "location": "Amran",  
  "skills": \["Photography"\],  
  "interests": \["Festival Management"\],  
  "availability": "Weekends",  
  "message": "I would like to help\.",  
  "consent": true  
\}

Success: 201

\{  
  "success": true,  
  "data": \{  
    "id": "66\.\.\.",  
    "status": "new"  
  \}  
\}

Errors:

- 400 validation\.
- 409 duplicate submission under defined anti\-spam rules\.
- 429 rate limit\.

<a id="authentication"></a>### 5\.8 Authentication

<a id="post-apiv1authlogin"></a>#### POST /api/v1/auth/login

Request:

\{  
  "email": "admin@example\.com",  
  "password": "\.\.\."  
\}

Success: 200 with secure cookie/session or appropriate auth response according to final implementation\.

Errors:

- 400 invalid payload\.
- 401 invalid credentials\.
- 423 account temporarily locked\.
- 429 rate limit\.

<a id="post-apiv1authlogout"></a>#### POST /api/v1/auth/logout

Success: 204\.

<a id="get-apiv1authme"></a>#### GET /api/v1/auth/me

Success: 200 with current non\-sensitive user profile and permissions\.

<a id="admin-events"></a>### 5\.9 Admin Events

<a id="post-apiv1adminevents"></a>#### POST /api/v1/admin/events

Protected by events\.create\.

Request includes required event fields\.

Success: 201\.

Errors: 400, 401, 403, 409, 422\.

<a id="patch-apiv1admineventsid"></a>#### PATCH /api/v1/admin/events/:id

Protected by events\.update\.

Success: 200\.

<a id="delete-apiv1admineventsid"></a>#### DELETE /api/v1/admin/events/:id

Protected by events\.delete\.

Prefer archive/soft delete for published content\.

Success: 204\.

<a id="admin-media"></a>### 5\.10 Admin Media

<a id="post-apiv1adminmediapresign"></a>#### POST /api/v1/admin/media/presign

Creates a safe upload target if the chosen storage provider supports presigned uploads\.

Request:

\{  
  "filename": "janmashtami\.jpg",  
  "mimeType": "image/jpeg",  
  "sizeBytes": 5242880  
\}

Validation checks must occur before upload authorization\.

<a id="admin-volunteers"></a>### 5\.11 Admin Volunteers

<a id="get-apiv1adminvolunteers"></a>#### GET /api/v1/admin/volunteers

Search/filter/paginate volunteer records\.

<a id="patch-apiv1adminvolunteersid"></a>#### PATCH /api/v1/admin/volunteers/:id

Update status/internal notes\.

<a id="admin-finance"></a>### 5\.12 Admin Finance

<a id="post-apiv1admindonations"></a>#### POST /api/v1/admin/donations

Protected by finance permission\.

Request example:

\{  
  "date": "2026\-09\-01T00:00:00\.000Z",  
  "amountMinor": 50000,  
  "currency": "INR",  
  "sourceType": "villager",  
  "eventId": null,  
  "year": 2026,  
  "verificationStatus": "pending",  
  "notes": ""  
\}

Success: 201\.

<a id="post-apiv1adminexpenses"></a>#### POST /api/v1/admin/expenses

Protected by finance permission\.

<a id="patch-apiv1adminfinancetypeidverify"></a>#### PATCH /api/v1/admin/finance/:type/:id/verify

Protected by finance\.verify\.

Success: 200\.

Must create an audit log\.

<a id="financial-reports"></a>### 5\.13 Financial Reports

<a id="post-apiv1adminreports"></a>#### POST /api/v1/admin/reports

Creates draft annual report\.

<a id="post-apiv1adminreportsidverify"></a>#### POST /api/v1/admin/reports/:id/verify

Marks report verified after authorized review\.

<a id="post-apiv1adminreportsidpublish"></a>#### POST /api/v1/admin/reports/:id/publish

Makes report publicly visible\.

<a id="admin-dashboard"></a>### 5\.14 Admin Dashboard

<a id="get-apiv1admindashboard"></a>#### GET /api/v1/admin/dashboard

Returns only authorized summary information:

- upcoming events
- draft counts
- volunteer queue count
- current reporting year summary
- unresolved finance verification count
- recent admin activity

<a id="api-security-requirements"></a>### 5\.15 API Security Requirements

- All protected routes require authentication\.
- Every protected operation enforces server\-side permission checks\.
- Never trust client\-provided role or permission values\.
- Use request size limits\.
- Validate IDs before database calls\.
- Use allow\-listed sortable fields\.
- Prevent unrestricted regex/database queries\.
- Sanitize rich content according to the chosen editor format\.
- Do not return passwords, hashes, private receipts or internal notes in public APIs\.

<a id="Xba8c34e8eee1fd04f176ce661bda494dbef3820"></a>## 6\. Acceptance Criteria \(Testable Quality Gates\)

<a id="global-quality-gates"></a>### 6\.1 Global Quality Gates

__Given__ a supported modern browser and a public route, __when__ a user loads the page, __then__ the page renders without uncaught runtime errors\.

__Given__ a 320px\-wide device viewport, __when__ the user navigates the public website, __then__ no horizontal scrolling is required for normal page content\.

__Given__ a keyboard\-only user, __when__ they navigate through interactive controls, __then__ every interactive control is reachable and focus\-visible\.

__Given__ a screen reader user, __when__ they inspect a form, __then__ labels and validation errors are programmatically associated with fields\.

<a id="homepage-happy-path"></a>### 6\.2 Homepage Happy Path

__Given__ verified site settings and at least one published event, __when__ a visitor opens /, __then__ the hero, mission, event preview and navigation are displayed with valid links\.

__Given__ no published events exist, __when__ a visitor opens the homepage, __then__ the featured\-event area shows a designed empty state rather than fake event data\.

<a id="event-happy-path"></a>### 6\.3 Event Happy Path

__Given__ a published event, __when__ a visitor opens its slug URL, __then__ event details and published media are displayed\.

__Given__ an archived event, __when__ a visitor requests its public URL, __then__ behavior follows the archive policy and the event is not listed as current content\.

__Given__ an unpublished event, __when__ a normal public visitor requests it, __then__ the API returns 404 or equivalent non\-public response\.

<a id="event-validation"></a>### 6\.4 Event Validation

__Given__ an admin creates an event without a required title, __when__ they submit, __then__ the API returns 400/422 with a field\-level validation message and does not write the invalid record\.

__Given__ an admin creates an event using an existing slug, __when__ they submit, __then__ the API returns 409 and suggests a unique slug\.

__Given__ participant count is supplied as \-1, __when__ the record is submitted, __then__ validation rejects the request\.

<a id="gallery-acceptance"></a>### 6\.5 Gallery Acceptance

__Given__ a valid JPEG under the configured size limit, __when__ an authorized content manager uploads it, __then__ the image is stored through the configured media layer and its metadata is persisted\.

__Given__ a file with an unsupported executable MIME type, __when__ upload is attempted, __then__ the server rejects it and creates no publicly accessible media record\.

__Given__ an image has no alt text, __when__ it is intended for public publication, __then__ publishing is blocked or the workflow marks the accessibility issue as unresolved\.

<a id="volunteer-acceptance"></a>### 6\.6 Volunteer Acceptance

__Given__ a valid volunteer form with consent checked, __when__ the user submits, __then__ the record is created with status new and the user receives a success message without seeing private admin data\.

__Given__ consent is false, __when__ a user submits, __then__ the request is rejected\.

__Given__ a high\-frequency burst of volunteer submissions from one client, __when__ rate limits are exceeded, __then__ the API returns 429\.

<a id="authentication-acceptance"></a>### 6\.7 Authentication Acceptance

__Given__ a valid active admin account, __when__ valid credentials are submitted, __then__ the user receives an authenticated session and can access permitted admin routes\.

__Given__ an invalid password, __when__ login is attempted, __then__ the API returns 401 without revealing whether the email or password was specifically incorrect\.

__Given__ repeated failed attempts beyond the configured threshold, __when__ login continues, __then__ the account or IP is temporarily rate\-limited/locked according to the security policy\.

__Given__ an unauthenticated visitor, __when__ /admin is requested, __then__ access is denied and the visitor is routed to the login experience\.

<a id="rbac-acceptance"></a>### 6\.8 RBAC Acceptance

__Given__ a user without expenses\.create, __when__ they call the expense creation endpoint, __then__ the API returns 403 even if the frontend is modified to expose the button\.

__Given__ a Finance Manager has finance permissions but lacks user\-management permission, __when__ they access user management APIs, __then__ access is denied\.

<a id="financial-integrity-acceptance"></a>### 6\.9 Financial Integrity Acceptance

__Given__ verified donations and verified expenses for a reporting year, __when__ the transparency summary is generated, __then__ public totals equal the sum of verified records for that year\.

__Given__ a donation is pending verification, __when__ public transparency data is generated, __then__ the pending amount is excluded from published totals\.

__Given__ an authorized user verifies a financial record, __when__ the verification is saved, __then__ an audit log entry records actor, action, entity and timestamp\.

__Given__ a user without finance verification permission, __when__ they attempt to verify a record, __then__ the server returns 403 and the record remains unchanged\.

<a id="privacy-acceptance"></a>### 6\.10 Privacy Acceptance

__Given__ a public request for volunteer listing, __when__ data is returned, __then__ private phone numbers, emails and internal notes are omitted\.

__Given__ a public transparency request, __when__ the response is generated, __then__ individual donor identity and private references are omitted unless a specific public\-disclosure policy exists\.

<a id="empty-and-failure-states"></a>### 6\.11 Empty and Failure States

__Given__ an API outage, __when__ a public listing page loads, __then__ the UI displays a clear recovery\-oriented error state and does not crash the entire app\.

__Given__ no gallery records exist, __when__ the gallery is opened, __then__ a purposeful empty state is shown\.

__Given__ a requested event slug does not exist, __when__ the page is opened, __then__ a designed 404 experience is shown\.

<a id="seo-acceptance"></a>### 6\.12 SEO Acceptance

__Given__ a published event, __when__ its page is rendered, __then__ title, description, canonical URL and appropriate structured data are present and valid\.

__Given__ an unpublished event, __when__ search\-engine directives are generated, __then__ the event is not exposed as public indexable content\.

<a id="performance-acceptance"></a>### 6\.13 Performance Acceptance

__Given__ a normal mobile connection, __when__ a public page loads, __then__ images use responsive sizes and lazy loading where appropriate\.

__Given__ a gallery with 500\+ media items, __when__ the user loads the gallery, __then__ the client receives a paginated/virtualized subset rather than all records and URLs at once\.

<a id="admin-content-workflow"></a>### 6\.14 Admin Content Workflow

__Given__ a draft event, __when__ an admin saves it, __then__ it remains inaccessible to the public\.

__Given__ a user with publish permission publishes an event, __when__ publishing succeeds, __then__ status=published and publishedAt are stored\.

__Given__ a user without publish permission attempts to publish an event, __when__ the endpoint is called, __then__ it returns 403\.

<a id="deployment-acceptance"></a>### 6\.15 Deployment Acceptance

__Given__ production secrets are absent, __when__ the backend boots, __then__ startup fails safely with a clear configuration error rather than starting in an insecure state\.

__Given__ MongoDB is unavailable, __when__ the application boots, __then__ the backend reports a controlled readiness failure and does not claim the service is healthy\.

<a id="security-business-logic-rules"></a>## 7\. Security & Business Logic Rules

<a id="authentication-1"></a>### 7\.1 Authentication

- Use secure password hashing such as Argon2id or an equivalent modern password hashing algorithm\.
- Never store plaintext passwords\.
- Prefer secure HTTP\-only, Secure, SameSite cookies for browser sessions when using cookie\-based authentication\.
- Do not store long\-lived privileged tokens in localStorage\.
- Session expiry must be configurable\.
- Rotate/revoke sessions when a privileged password is changed\.
- Login endpoint must be rate\-limited\.

<a id="authorization-rbac"></a>### 7\.2 Authorization / RBAC

Initial roles:

- __Super Admin__ ΓÇö full system control\.
- __Administrator__ ΓÇö operational management\.
- __Finance Manager__ ΓÇö finance records and reports\.
- __Content Manager__ ΓÇö events, activities, announcements, gallery\.
- __Event Manager__ ΓÇö event\-specific management\.
- __Volunteer Coordinator__ ΓÇö volunteer workflow\.
- __Viewer__ ΓÇö read\-only admin access\.

Rules:

- Authorization is enforced on the server\.
- Frontend visibility is only a convenience layer\.
- High\-risk actions require specific permissions\.
- Financial verification/publishing is more restricted than content publishing\.
- Role changes must create audit logs\.

<a id="data-validation-sanitization"></a>### 7\.3 Data Validation & Sanitization

- Validate all body, query, params and headers where relevant\.
- Use a schema validation library such as Zod\.
- Trim and normalize strings\.
- Enforce maximum lengths\.
- Validate date relationships\.
- Validate numeric integer boundaries\.
- Validate media MIME types and file sizes\.
- Sanitize rich text HTML or use Markdown with safe rendering\.
- Reject unexpected fields where practical for privileged endpoints\.

<a id="financial-business-rules"></a>### 7\.4 Financial Business Rules

1. Only verified donation records count toward published contribution totals\.
2. Only verified expense records count toward published expense totals\.
3. Public balance is derived from approved reporting rules, not arbitrary client values\.
4. Individual donor information is private by default\.
5. Financial corrections create an audit trail\.
6. Published reports are immutable or versioned; editing should create a new revision rather than silently overwriting history\.
7. Finance verification requires authorized role/permission\.
8. Receipts and internal references remain private unless intentionally published\.
9. Currency defaults to INR but the schema should not hardcode currency logic into UI calculations\.
10. Accounting uses integer minor units or decimal\-safe arithmetic\.

<a id="content-business-rules"></a>### 7\.5 Content Business Rules

- Draft content is not public\.
- Archived content is not included in current listings\.
- Published content must have required SEO/accessibility metadata\.
- Published media must pass upload and metadata validation\.
- Slugs are unique\.
- Deleted content should be soft\-deleted or archived when historical integrity matters\.

<a id="volunteer-privacy-rules"></a>### 7\.6 Volunteer Privacy Rules

- Collect only necessary fields\.
- Consent is mandatory\.
- Private contact fields are admin\-only\.
- No public member directory unless explicitly introduced and consented\.
- Internal notes are never exposed through public APIs\.
- Volunteer records should have a retention/deletion policy defined before production\.

<a id="media-security"></a>### 7\.7 Media Security

- Enforce allowed MIME types\.
- Enforce file\-size limits\.
- Generate server\-controlled object keys\.
- Do not trust client\-provided extensions\.
- Scan or process files through trusted provider mechanisms where available\.
- Private receipts must not be publicly cacheable\.
- Use signed/private URLs for sensitive documents where required\.

<a id="application-security"></a>### 7\.8 Application Security

- Helmet/security headers\.
- Strict CORS allowlist\.
- Rate limiting on authentication/forms\.
- Request size limits\.
- No secrets in frontend bundles\.
- \.env files excluded from version control\.
- Secret management through deployment environment\.
- Generic production error messages\.
- Structured server logs without sensitive payloads\.
- Dependency security monitoring\.
- Regular patching of Next\.js and backend dependencies\.

<a id="mongodb-rules"></a>### 7\.9 MongoDB Rules

- Validate connection string on startup\.
- Use least\-privilege database credentials in production\.
- Never expose MongoDB directly to browsers\.
- Use indexes based on actual access patterns\.
- Avoid unbounded collection scans for public pages\.
- Use projections to avoid returning private fields\.
- Use transactions only where data integrity genuinely requires them\.
- Back up production data\.

<a id="next.js-frontend-rules"></a>### 7\.10 Next\.js / Frontend Rules

- Use the App Router\.
- Prefer Server Components for read\-heavy public content where appropriate\.
- Use Client Components only when interactivity requires them\.
- Keep secrets server\-only\.
- Use next/image or the current image optimization approach\.
- Use route\-level loading and error states\.
- Use metadata APIs for SEO\.
- Avoid placing database credentials or privileged API tokens in public environment variables\.

<a id="architecture-rules"></a>### 7\.11 Architecture Rules

Recommended deployment shape:

                        INTERNET  
                            |  
             \+\-\-\-\-\-\-\-\-\-\-\-\-\-\-\+\-\-\-\-\-\-\-\-\-\-\-\-\-\-\+  
             |                             |  
        Public Web                    Admin Web  
             |                             |  
             \+\-\-\-\-\-\-\-\-\-\-\-\-\-\-\+\-\-\-\-\-\-\-\-\-\-\-\-\-\-\+  
                            |  
                     Next\.js 16 App  
                            |  
                    Server\-side API client  
                            |  
                     Node\.js 24 \+ Express  
                            |  
                 \+\-\-\-\-\-\-\-\-\-\-\+\-\-\-\-\-\-\-\-\-\-\+  
                 |                     |  
          MongoDB 8\.x             Media Storage  
          \(local dev /             Cloudinary or  
           Atlas prod\)             R2/S3\-compatible

The Next\.js frontend and Express API are logically separate applications even if deployed on the same domain or platform\.

<a id="local-development-rule"></a>### 7\.12 Local Development Rule

Development environment:

Next\.js local app  
        |  
        v  
Express local API  
        |  
        v  
mongodb://127\.0\.0\.1:27017/amran\-yuva  
        |  
        v  
MongoDB Compass for inspection

MongoDB Compass is a client/GUI, not the database server\. The actual local MongoDB service must be running\.

<a id="production-rule"></a>### 7\.13 Production Rule

Do not configure a public deployment to use 127\.0\.0\.1 or localhost for MongoDB\. Production requires a network\-accessible database such as MongoDB Atlas\.

<a id="environment-variables"></a>### 7\.14 Environment Variables

Frontend/server environment examples:

NEXT\_PUBLIC\_SITE\_URL=  
NEXT\_PUBLIC\_API\_BASE\_URL=  
  
MONGODB\_URI=  
JWT\_SECRET=  
SESSION\_SECRET=  
CORS\_ORIGIN=  
  
MEDIA\_PROVIDER=  
MEDIA\_API\_KEY=  
MEDIA\_API\_SECRET=  
  
SENTRY\_DSN=

Only environment variables explicitly required by the chosen implementation should exist\. Public variables must contain no secrets\.

<a id="suggested-folder-project-name"></a>## 8\. Suggested Folder & Project Name

<a id="project-name-repository-strategy"></a>### 8\.1 Project Name & Repository Strategy

__Project folder:__

amran\-yuva\-group\-community\-platform

__Suggested monorepo layout:__

amran\-yuva\-group\-community\-platform/  
Γö£ΓöÇΓöÇ apps/  
Γöé   Γö£ΓöÇΓöÇ web/  
Γöé   Γöé   Γö£ΓöÇΓöÇ app/  
Γöé   Γöé   Γö£ΓöÇΓöÇ components/  
Γöé   Γöé   Γö£ΓöÇΓöÇ features/  
Γöé   Γöé   Γö£ΓöÇΓöÇ lib/  
Γöé   Γöé   Γö£ΓöÇΓöÇ hooks/  
Γöé   Γöé   Γö£ΓöÇΓöÇ services/  
Γöé   Γöé   Γö£ΓöÇΓöÇ styles/  
Γöé   Γöé   ΓööΓöÇΓöÇ types/  
Γöé   ΓööΓöÇΓöÇ api/  
Γöé       ΓööΓöÇΓöÇ src/  
Γöé           Γö£ΓöÇΓöÇ config/  
Γöé           Γö£ΓöÇΓöÇ controllers/  
Γöé           Γö£ΓöÇΓöÇ middleware/  
Γöé           Γö£ΓöÇΓöÇ models/  
Γöé           Γö£ΓöÇΓöÇ routes/  
Γöé           Γö£ΓöÇΓöÇ services/  
Γöé           Γö£ΓöÇΓöÇ validators/  
Γöé           Γö£ΓöÇΓöÇ utils/  
Γöé           ΓööΓöÇΓöÇ app\.ts  
Γö£ΓöÇΓöÇ packages/  
Γöé   Γö£ΓöÇΓöÇ ui/  
Γöé   Γö£ΓöÇΓöÇ types/  
Γöé   Γö£ΓöÇΓöÇ config/  
Γöé   ΓööΓöÇΓöÇ validation/  
Γö£ΓöÇΓöÇ tests/  
Γöé   Γö£ΓöÇΓöÇ unit/  
Γöé   Γö£ΓöÇΓöÇ integration/  
Γöé   ΓööΓöÇΓöÇ e2e/  
Γö£ΓöÇΓöÇ docs/  
Γö£ΓöÇΓöÇ scripts/  
Γö£ΓöÇΓöÇ \.env\.example  
Γö£ΓöÇΓöÇ package\.json  
Γö£ΓöÇΓöÇ pnpm\-workspace\.yaml  
ΓööΓöÇΓöÇ README\.md

Use a monorepo only if it genuinely simplifies shared types/validation\. A two\-repository architecture is also acceptable if the engineering team prefers stronger deployment separation\.

<a id="testing-stack-test-repository-layout"></a>### 8\.2 Testing Stack & Test Repository Layout

The AI software engineering factory should generate tests from the acceptance criteria\.

Recommended categories:

- __Unit:__ Vitest\.
- __API integration:__ Vitest \+ Supertest\.
- __Database integration:__ isolated test database/fixtures\.
- __E2E:__ Playwright\.
- __Accessibility:__ automated checks with axe\-compatible tooling plus manual keyboard verification\.
- __Lint/type checks:__ ESLint \+ TypeScript\.

Every feature added after MVP must include tests for happy path, validation, authorization and relevant edge cases\.

<a id="observability"></a>### 8\.3 Observability

At minimum:

- structured application logs
- request IDs
- health endpoint
- readiness endpoint
- error monitoring in production
- basic performance telemetry

Suggested endpoints:

GET /health ΓÇö process health\.  
GET /ready ΓÇö dependency readiness, including MongoDB\.

<a id="backup-recovery"></a>### 8\.4 Backup & Recovery

Production should have:

- scheduled database backups
- tested restore procedure
- documented retention
- secure backup access
- disaster recovery owner

No production launch should depend on an untested backup assumption\.

<a id="seo-local-discovery-implementation-files"></a>### 8\.5 SEO / Local Discovery Implementation Files

- Only public/published pages are indexable\.
- Avoid near\-duplicate pages for every filter combination\.
- Use canonical URLs\.
- Add structured data only when facts are accurate\.
- Organization schema must reflect verified official information\.
- Event schema must use actual event dates/location\.
- Maintain sitemap automatically as published content changes\.

<a id="localization-implementation-structure"></a>### 8\.6 Localization Implementation Structure

Content should support:

- en\-IN
- gu\-IN
- hi\-IN

Do not copy entire pages into separate hardcoded versions\. Store translated content in a structured locale\-aware model or content layer\.

<a id="future-feature-gate"></a>### 8\.7 Future Feature Gate

Future features are intentionally deferred until the MVP is stable:

- online payment gateway
- automated receipts
- WhatsApp/SMS notifications
- event registration
- volunteer attendance/hours
- digital certificates
- community directory
- emergency information hub
- AI\-assisted report generation
- PWA/mobile app

Each future feature must extend the same permissions, audit, privacy and design\-system foundations instead of creating a parallel architecture\.

