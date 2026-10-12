# NexState AI Platform - Overall Features Implementation Documentation

## 1. Executive Summary & Feature Matrix

The **NexState AI** platform is an intelligent real estate ecosystem designed to streamline property operations, customer onboarding, lead pipeline synchronization, adaptive AI property search, and content management.

| Feature Area | Module | Primary Tech / Integration | Status |
| :--- | :--- | :--- | :--- |
| **Property Management** | `nexstate-cms` & `nexstate-frontend` | Next.js API, Google Drive, Supabase Free Tier | ✅ Operational |
| **AI Property Intelligence** | `nexstate-cms/src/api/routes/ai.ts` | NLP Query Parser, Similarity Engine & Copilot | ✅ Active |
| **Lead Sync & CRM** | `nexstate-cms/src/lib/zoho-crm.ts` | Zoho CRM REST API v2 | ✅ Active |
| **Financial Calculators** | `nexstate-frontend/src/components` | TypeScript financial formulas & ROI models | ✅ Built-in |
| **Blog & FAQ Publishing** | `nexstate-cms/src/components/admin` | Tiptap Rich Text Editor, Supabase | ✅ Operational |
| **Authentication & RBAC** | `nexstate-cms/src/lib/rbac.ts` | Better Auth, bcryptjs, Proxy Guards | ✅ Production Ready |
| **Cron Automation** | `nexstate-cms/src/lib/cron-jobs.ts` | `node-cron` background scheduler | ✅ Configured |

---

## 2. Feature Workflows & Technical Implementation Details

### 2.1 AI Intelligence Engine
- **Natural Language Query Parser (`/api/ai/parse-search`)**: Parses conversational user text (e.g. *"Find a 2 bedroom apartment in Dubai Marina under 15000 AED"*) into structured parameters (location, max budget, bedrooms).
- **Adaptive Recommendation Engine (`/api/ai/recommend`)**: Vector-style weighted similarity scoring matching properties by location, price proximity, and amenity sets.
- **Admin CMS AI Copilot (`/api/ai/generate-description`)**: Automated AI generation of property descriptions, feature highlights, and SEO tags inside the CMS admin listing form.

### 2.2 Property Management Engine
- **Search & Advanced Filtering**: Filter properties by location, pricing range, bedroom configuration, property type, and available amenities.
- **Media Attachment Management**:
  - Image and video uploads handled through `ImageUpload.tsx` and `VideoUpload.tsx`.
  - Direct connection to Google Drive API (`src/lib/google-drive.ts`) for secure, cloud-stored asset management.
- **Status Lifecycle**:
  - Properties transition between `AVAILABLE`, `RENTED`, `MAINTENANCE`, and `ARCHIVED` states.

### 2.3 Lead Pipeline & Zoho CRM Sync
- **Automated Enquiry Capture**: Every enquiry submitted via the customer portal (`enquiry-dialog.tsx` or contact forms) triggers a background sync to Zoho CRM.
- **Lead Assignment & Status**:
  - `LeadAssignSelect.tsx` allows admins to assign leads to specific sales representatives.
  - `LeadStatusSelect.tsx` updates lead progress (`New`, `Contacted`, `Site Visit Scheduled`, `Closed`).
- **Sync Status & Token Manager**: `zoho-setup-form.tsx` displays real-time OAuth token status, refresh history, and manual trigger buttons.

### 2.4 Real Estate Financial Calculators Suite
- **Rental Yield Calculator**: Calculates annual gross and net rental yield based on purchase price, monthly rent, HOA fees, and property tax estimates.
- **Tenant Affordability Estimator**: Analyzes monthly income vs target rent to evaluate safe budget thresholds.
- **Landlord ROI & Cash Flow Model**: Provides projection curves for long-term capital appreciation and monthly cash flow.

### 2.5 Content Publishing System (Blogs & FAQs)
- **WYSIWYG Publishing**: `RichTextEditor.tsx` provides rich inline editing, custom heading tags, code blocks, bulleted lists, and media embeds.
- **SEO & Metadata Fields**: Form inputs for custom meta titles, descriptions, canonical links, and URL slug generation.
- **FAQ Management**: Categorized accordion lists maintained through `FaqForm.tsx`, `ToggleFaqButton.tsx`, and `DeleteFaqButton.tsx`.

### 2.6 User Roles & Administration (RBAC)
- **Role Hierarchy**:
  1. `ADMIN`: Full system access, Zoho configuration, user setup, database maintenance.
  2. `MANAGER`: Property publishing, lead assignment, blog management.
  3. `AGENT`: Lead updating, property viewing, site visit recording.
  4. `USER`: Portal view for lease documents and property listings.
- **Setup Flow**: Initial admin activation available at `/admin/setup` for setting up root credentials securely.
