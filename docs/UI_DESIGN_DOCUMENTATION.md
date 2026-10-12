# NexState AI Platform - UI & Design System Documentation

## 1. Design Philosophy & Visual Aesthetic

The **NexState AI** platform features a modern, high-end real estate user interface designed to inspire trust, elegance, and effortless usability. The design system emphasizes:
- **Clean Glassmorphism & Micro-elevations**: Soft drop-shadows, subtle backdrop blurs, crisp border accents (`border-border/50`).
- **Rich Typography Hierarchy**: Built on **Plus Jakarta Sans** (Google Fonts) with precise scale ratios for high readability on desktop and mobile viewports.
- **Harmonious Palette**: Deep slate neutrals paired with vibrant primary brand accents, status badges, and AI glow effects.

---

## 2. Component Architecture & UI Hierarchy

### 2.1 CMS Admin Dashboard Components (`nexstate-cms`)
Located in `src/components/admin/`:

1. **`AdminDashboardShell.tsx`**: Top-level layout container organizing navigation, sidebar state, and main content area.
2. **`AdminSidebar.tsx`**: Responsive navigation menu featuring active state indicators and role-based route filtering.
3. **`AdminTopNav.tsx`**: Global admin navbar housing quick search, user profile menu, notification bell, and dark mode toggle.
4. **`DashboardStatsDisplay.tsx`**: Metric cards rendering total listings, active inquiries, converted leads, and performance counters.
5. **`PropertyForm.tsx`**:
   - Multi-step form tabs for listing details, amenities, pricing structure, and location mapping.
   - Includes **Magic AI Copilot** button for auto-generating property descriptions and SEO tags.
   - Drag-and-drop media uploader with upload progress and Google Drive cloud integration.
6. **`RichTextEditor.tsx`**:
   - Tiptap-powered editor for blogs and property content.

### 2.2 Customer-Facing Portal Components (`nexstate-frontend`)
Located in `src/components/`:

1. **`AIAssistant.tsx`**: Floating interactive AI Assistant drawer supporting voice-like natural language property searches and live recommendation cards.
2. **`CalculatorsSection.tsx`**: Interactive real estate tools providing instant calculations for rental yield, tenant affordability, and landlord ROI.
3. **`enquiry-dialog.tsx`**: Modal drawer allowing prospective tenants or owners to request property visits or submit inquiries.
4. **`PropertyCard.tsx` / `PropertiesGrid`**: Responsive card grid with price badges, location tags, and favorite toggle animation.

---

## 3. Animations & Micro-Interactions

- **Framer Motion (`framer-motion` & `motion`)**:
  - Page entry fade-ins and stagger-list animations.
  - Smooth expansion for accordions, FAQ panels, and dropdown menus.
  - Hover zoom transitions on property image cards (`scale: 1.03` with spring physics).
- **Sonner Toasts**:
  - Floating notification toasts for async operations (e.g., "AI description generated", "Enquiry submitted").
