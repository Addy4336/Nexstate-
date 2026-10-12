# NexState API Documentation

This document describes all the API endpoints available for the frontend to consume. All endpoints are prefixed with `/api`.

## Base URL

- **Development**: `http://localhost:3001/api`
- **Production**: `https://your-domain.com/api`

## API Architecture

The API is built using **Elysia.js** framework running inside Next.js API routes. The catch-all route at `/api/[[...slugs]]` forwards all requests to the Elysia router.

### ⚠️ CRITICAL: Database Access Architecture

**ONLY API routes should directly access Supabase. Everything else must call the API.**

```
❌ WRONG Architecture:
├── Frontend → Supabase (NO!)
├── Server Actions → Supabase (NO!)
└── Admin Pages → Supabase (NO!)

✅ CORRECT Architecture:
├── Frontend → API Routes → Supabase ✅
├── Server Actions → API Routes → Supabase ✅
├── Admin Pages → API Routes → Supabase ✅
└── ONLY src/api/routes/*.ts → db.ts (supabaseAdmin) → Supabase ✅
```

**File Access Rules:**

| File/Directory | Can Import `supabaseAdmin`? | Should Call API? |
|----------------|----------------------------|------------------|
| `src/api/routes/*.ts` | ✅ YES - Only these files | N/A |
| `src/actions/*.ts` | ❌ NO | ✅ YES - Call `/api/*` |
| `src/app/**/page.tsx` | ❌ NO | ✅ YES - Call `/api/*` |
| `src/components/**` | ❌ NO | ✅ YES - Call `/api/*` |
| `src/lib/db.ts` | N/A (exports it) | N/A |

**Why this architecture?**
1. ✅ **Single Source of Truth**: All database logic in one place
2. ✅ **Easy Maintenance**: Change DB queries in one location
3. ✅ **Security**: Server role keys only in API routes
4. ✅ **Logging/Monitoring**: Centralized tracking
5. ✅ **Rate Limiting**: Easy to add middleware
6. ✅ **Database Flexibility**: Swap DB without changing app code
7. ✅ **Consistent Error Handling**: Uniform responses

### ⚠️ CRITICAL: Frontend Architecture Rule

**The frontend should NEVER directly import or use Supabase clients.**

```typescript
// ❌ NEVER DO THIS IN FRONTEND
import { supabaseAdmin } from "@/lib/db";
import { createClient } from "@supabase/supabase-js";

// ✅ ALWAYS DO THIS IN FRONTEND
const res = await fetch('/api/properties');
const { data } = await res.json();
```

### ⚠️ CRITICAL: Server Actions & Admin Pages Rule

**Server actions and admin pages should ALSO call API routes, not use supabaseAdmin directly.**

```typescript
// ❌ WRONG - Server Action using Supabase directly
"use server";
import { supabaseAdmin } from "@/lib/db";

export async function getProperties() {
  const { data } = await supabaseAdmin.from("property").select("*");
  return data;
}

// ✅ CORRECT - Server Action calling API
"use server";

export async function getProperties() {
  const res = await fetch('http://localhost:3001/api/properties');
  const { data } = await res.json();
  return data;
}
```

```typescript
// ❌ WRONG - Admin Page using Supabase directly
import { supabaseAdmin } from "@/lib/db";

export default async function PropertiesPage() {
  const { data } = await supabaseAdmin.from("property").select("*");
  return <PropertyList properties={data} />;
}

// ✅ CORRECT - Admin Page calling API
export default async function PropertiesPage() {
  const res = await fetch('http://localhost:3001/api/properties');
  const { data } = await res.json();
  return <PropertyList properties={data} />;
}
```

**Why?**
- ✅ **Security**: Service role keys never exposed to client
- ✅ **Consistency**: Single source of truth for data operations
- ✅ **Maintainability**: Business logic centralized in API routes
- ✅ **Type Safety**: API contracts enforce correct usage
- ✅ **Flexibility**: Easy to swap database without changing frontend

**Architecture Layers:**
```
┌─────────────────────────────────────┐
│  Frontend (React/Next.js Client)   │
│  - Only makes HTTP API calls        │
│  - NO Supabase imports              │
└──────────────┬──────────────────────┘
               │ HTTP (fetch/axios)
               ▼
┌─────────────────────────────────────┐
│  API Routes (/api/*)                │
│  - Elysia.js endpoints              │
│  - Business logic                   │
│  - Validation                       │
└──────────────┬──────────────────────┘
               │ Import & Use
               ▼
┌─────────────────────────────────────┐
│  Supabase Service (src/lib/db.ts)  │
│  - supabaseAdmin (server only)      │
│  - Database operations              │
└─────────────────────────────────────┘
```

### Swagger Documentation

Interactive API documentation is available at:
- **Development**: `http://localhost:3001/api/docs`

---

## Properties API

### Get Available Properties

Fetches all available properties with optional filtering.

```http
GET /api/properties
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `limit` | string | Maximum number of results |
| `featured` | string | Filter by featured status ("true") |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Modern Studio in Downtown",
      "description": "...",
      "price": 5000,
      "location": "Downtown Dubai",
      "bedrooms": 1,
      "bathrooms": 1,
      "area_sqft": 800,
      "status": "available",
      "featured": true,
      "images": ["..."],
      "amenities": ["Pool", "Gym"]
    }
  ]
}
```

**Frontend Usage:**
```typescript
const res = await fetch('/api/properties?limit=10&featured=true');
const { data } = await res.json();
```

---

### Get Featured Properties

Fetches featured properties for homepage display.

```http
GET /api/properties/featured
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | string | 6 | Maximum number of results |

**Frontend Usage:**
```typescript
const res = await fetch('/api/properties/featured?limit=6');
const { data } = await res.json();
```

---

### Basic Search

Simple search with basic filters.

```http
GET /api/properties/search
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `q` | string | Search query (searches title, description, location) |
| `location` | string | Filter by location |
| `minPrice` | string | Minimum price |
| `maxPrice` | string | Maximum price |
| `bedrooms` | string | Minimum bedrooms |

**Frontend Usage:**
```typescript
const res = await fetch('/api/properties/search?location=Dubai&minPrice=3000&maxPrice=10000');
const { data } = await res.json();
```

---

### Advanced Search (with Pagination)

Full-featured search with advanced filters and pagination support.

```http
POST /api/properties/search/advanced
```

**Request Body:**
```json
{
  "filters": {
    "location": "Dubai Marina",
    "propertyType": "apartment",
    "budgetMin": 3000,
    "budgetMax": 15000,
    "sharingType": "family",
    "furnishing": "furnished",
    "genderPreference": "any",
    "bedrooms": [1, 2, 3],
    "bathrooms": [1, 2],
    "amenities": ["Pool", "Gym"],
    "availableFrom": "2026-02-01"
  },
  "page": 1,
  "pageSize": 12
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "properties": [...],
    "total": 45,
    "page": 1,
    "pageSize": 12
  }
}
```

**Frontend Usage:**
```typescript
const res = await fetch('/api/properties/search/advanced', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    filters: { location: 'Dubai', budgetMax: 10000 },
    page: 1,
    pageSize: 12
  })
});
const { data } = await res.json();
// data.properties, data.total, data.page, data.pageSize
```

---

### Get Property by ID

Fetches a single property by its ID.

```http
GET /api/properties/:id
```

**Frontend Usage:**
```typescript
const res = await fetch(`/api/properties/${propertyId}`);
const { data } = await res.json();
```

---

### Get Similar Properties

Get properties similar to a specified one (based on location and price).

```http
GET /api/properties/:id/similar
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | string | 4 | Maximum number of results |

**Frontend Usage:**
```typescript
const res = await fetch(`/api/properties/${propertyId}/similar?limit=4`);
const { data } = await res.json();
```

---

### Get Upgrade Options

Get higher-priced alternatives (10-40% more expensive).

```http
GET /api/properties/:id/upgrades
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | string | 4 | Maximum number of results |

**Frontend Usage:**
```typescript
const res = await fetch(`/api/properties/${propertyId}/upgrades?limit=4`);
const { data } = await res.json();
```

---

### Get Budget Alternatives

Get lower-priced alternatives (60-90% of current price).

```http
GET /api/properties/:id/budget
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | string | 4 | Maximum number of results |

**Frontend Usage:**
```typescript
const res = await fetch(`/api/properties/${propertyId}/budget?limit=4`);
const { data } = await res.json();
```

---

### Get Popular in Area

Get popular/featured properties in a specific location.

```http
GET /api/properties/area/:location/popular
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | string | 4 | Maximum number of results |
| `excludeId` | string | - | Property ID to exclude |

**Frontend Usage:**
```typescript
const res = await fetch(`/api/properties/area/Dubai%20Marina/popular?limit=4&excludeId=${currentPropertyId}`);
const { data } = await res.json();
```

---

### Meta Endpoints

#### Get Locations
```http
GET /api/properties/meta/locations
```
Returns unique property locations for filter dropdowns.

#### Get Property Types
```http
GET /api/properties/meta/types
```
Returns available property types (apartment, villa, etc.).

#### Get Amenities
```http
GET /api/properties/meta/amenities
```
Returns available amenities list for filtering.

#### Get Furnishing Options
```http
GET /api/properties/meta/furnishing
```
Returns furnishing options (furnished, unfurnished, semi-furnished).

---

## Blogs API

### Get Published Blogs

```http
GET /api/blogs
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `limit` | string | Maximum number of results |

**Frontend Usage:**
```typescript
const res = await fetch('/api/blogs?limit=6');
const { data } = await res.json();
```

---

### Get Blog by Slug

```http
GET /api/blogs/slug/:slug
```

**Frontend Usage:**
```typescript
const res = await fetch(`/api/blogs/slug/${blogSlug}`);
const { data } = await res.json();
```

---

### Get Blog by ID

```http
GET /api/blogs/:id
```

---

## FAQs API

### Get All FAQs

```http
GET /api/faqs
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `category` | string | Filter by category |

**Frontend Usage:**
```typescript
const res = await fetch('/api/faqs?category=renting');
const { data } = await res.json();
```

---

### Get FAQ Categories

```http
GET /api/faqs/categories
```

Returns unique FAQ categories for navigation/filtering.

---

## Favorites API

### Toggle Favorite

Add or remove a property from favorites.

```http
POST /api/favorites/toggle
```

**Request Body:**
```json
{
  "propertyId": "uuid",
  "userId": "user-id-or-guest-id"
}
```

**Response:**
```json
{
  "success": true,
  "isFavorited": true
}
```

**Frontend Usage:**
```typescript
const res = await fetch('/api/favorites/toggle', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ propertyId, userId })
});
const { isFavorited } = await res.json();
```

---

### Get User Favorites

```http
GET /api/favorites/user/:userId
```

Returns full property details for all favorites.

**Frontend Usage:**
```typescript
const res = await fetch(`/api/favorites/user/${userId}`);
const { data } = await res.json();
// data = [{ id, user_id, property_id, property: {...} }]
```

---

### Get Favorite IDs (Lightweight)

```http
GET /api/favorites/user/:userId/ids
```

Returns only property IDs (useful for checking favorite status).

**Frontend Usage:**
```typescript
const res = await fetch(`/api/favorites/user/${userId}/ids`);
const { data } = await res.json();
// data = ["property-id-1", "property-id-2"]
```

---

### Check Favorite Status

```http
GET /api/favorites/check/:propertyId/:userId
```

**Frontend Usage:**
```typescript
const res = await fetch(`/api/favorites/check/${propertyId}/${userId}`);
const { isFavorited } = await res.json();
```

---

## Enquiries API

### Submit Enquiry

```http
POST /api/enquiries
```

**Request Body:**
```json
{
  "type": "tenant_enquiry",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+971501234567",
  "message": "I'm interested in this property",
  "propertyId": "uuid",
  "propertyTitle": "Modern Studio in Downtown"
}
```

**Enquiry Types:**
- `tenant_enquiry` - Property Enquiry
- `owner_enquiry` - Owner Services
- `general_contact` - General Enquiry
- `schedule_viewing` - Schedule Viewing

**Frontend Usage:**
```typescript
const res = await fetch('/api/enquiries', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'tenant_enquiry',
    name: 'John Doe',
    email: 'john@example.com',
    message: 'I would like to schedule a viewing',
    propertyId: 'property-uuid',
    propertyTitle: 'Modern Studio'
  })
});
const { success, message } = await res.json();
```

---

### Get Enquiry Types

```http
GET /api/enquiries/types
```

Returns available enquiry types for form dropdowns.

---

## Health Check

```http
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-16T12:00:00.000Z",
  "service": "nexstate-api"
}
```

---

## Storage Endpoints

**NEW: Supabase Storage for Images**

Starting from this implementation, all property images are stored in **Supabase Storage** instead of Google Drive for better performance (instant loading vs 20+ seconds).

### Initialize Storage Bucket

Create the `property-images` bucket if it doesn't exist.

```http
POST /api/storage/init
```

**Response:**
```json
{
  "success": true,
  "message": "Storage bucket ready"
}
```

**Frontend Usage:**
```typescript
// Usually called once during setup, or automatically by ImageUpload component
const res = await fetch('/api/storage/init', { method: 'POST' });
```

---

### Upload Image

Upload a single image to Supabase Storage (base64 encoded).

```http
POST /api/storage/upload
```

**Request Body:**
```json
{
  "file": {
    "data": "data:image/jpeg;base64,/9j/4AAQ...",
    "name": "property-image.jpg",
    "type": "image/jpeg"
  },
  "folderName": "dubai-marina-apartment"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://xxx.supabase.co/storage/v1/object/public/property-images/dubai-marina-apartment/1705392000-abc123.jpg",
    "path": "dubai-marina-apartment/1705392000-abc123.jpg",
    "fileName": "1705392000-abc123.jpg"
  }
}
```

**Frontend Usage:**
```typescript
// Convert file to base64
const base64 = await new Promise<string>((resolve) => {
  const reader = new FileReader();
  reader.onloadend = () => resolve(reader.result as string);
  reader.readAsDataURL(file);
});

// Upload
const res = await fetch('/api/storage/upload', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    file: {
      data: base64,
      name: file.name,
      type: file.type
    },
    folderName: 'property-folder'
  })
});
const { data } = await res.json();
// data.url is ready to save to database
```

**Constraints:**
- Max file size: 10MB
- Allowed types: `image/jpeg`, `image/png`, `image/webp`, `image/gif`
- Folder names are sanitized (lowercase, alphanumeric + hyphens)
- File names are auto-generated with timestamp + random string

---

### Delete Image

Delete an image from Supabase Storage.

```http
DELETE /api/storage/delete
```

**Request Body:**
```json
{
  "path": "dubai-marina-apartment/1705392000-abc123.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Image deleted"
}
```

**Frontend Usage:**
```typescript
const res = await fetch('/api/storage/delete', {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ path: 'folder/filename.jpg' })
});
```

---

### Get Signed URL

Generate a temporary signed URL for private image access (optional, bucket is public by default).

```http
POST /api/storage/signed-url
```

**Request Body:**
```json
{
  "path": "dubai-marina-apartment/1705392000-abc123.jpg",
  "expiresIn": 3600
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://xxx.supabase.co/storage/v1/object/sign/property-images/..."
  }
}
```

---

### List Images in Folder

Get all images in a specific folder.

```http
GET /api/storage/list/:folder?limit=100&offset=0
```

**Parameters:**
- `folder` (path): Folder name
- `limit` (query): Max results (default: 100)
- `offset` (query): Skip results (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "1705392000-abc123.jpg",
      "id": "uuid",
      "created_at": "2026-01-16T12:00:00.000Z",
      "metadata": {},
      "url": "https://xxx.supabase.co/storage/v1/object/public/property-images/folder/1705392000-abc123.jpg"
    }
  ]
}
```

**Frontend Usage:**
```typescript
const res = await fetch('/api/storage/list/dubai-marina?limit=50');
const { data } = await res.json();
// data = array of files with public URLs
```

---

### Image URL Utility

Use the `getImageUrl()` utility to handle both legacy Google Drive URLs and new Supabase Storage URLs:

```typescript
import { getImageUrl } from '@/lib/utils';

// Handles both formats automatically:
const url1 = getImageUrl('https://xxx.supabase.co/storage/...');  // Supabase
const url2 = getImageUrl('property-images/folder/file.jpg');      // Path only
const url3 = getImageUrl('https://drive.google.com/...');         // Google Drive (legacy)
```

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message here",
  "data": null
}
```

---

## CORS Configuration

The API is configured to accept requests from:
- `http://localhost:3000` (frontend dev)
- `http://localhost:3001` (CMS dev)
- `FRONTEND_URL` environment variable
- `NEXT_PUBLIC_APP_URL` environment variable

---

## TypeScript Client

For type-safe API calls, you can use the Elysia Eden Treaty client:

```typescript
import { treaty } from '@elysiajs/eden';
import type { Api } from '@nexstate-cms/api';

const api = treaty<Api>('http://localhost:3001');

// Typed API calls
const { data } = await api.api.properties.featured.get({ query: { limit: '6' } });
const { data: property } = await api.api.properties({ id: 'uuid' }).get();
```

---

## Summary

| Category | Endpoint | Method | Purpose |
|----------|----------|--------|---------|
| Properties | `/properties` | GET | List available properties |
| Properties | `/properties/featured` | GET | Get featured properties |
| Properties | `/properties/search` | GET | Basic search |
| Properties | `/properties/search/advanced` | POST | Advanced search with pagination |
| Properties | `/properties/:id` | GET | Get single property |
| Properties | `/properties/:id/similar` | GET | Similar properties |
| Properties | `/properties/:id/upgrades` | GET | Higher-priced alternatives |
| Properties | `/properties/:id/budget` | GET | Budget-friendly alternatives |
| Properties | `/properties/area/:location/popular` | GET | Popular in area |
| Properties | `/properties/meta/locations` | GET | Unique locations list |
| Properties | `/properties/meta/types` | GET | Property types |
| Properties | `/properties/meta/amenities` | GET | Amenities list |
| Properties | `/properties/meta/furnishing` | GET | Furnishing options |
| Blogs | `/blogs` | GET | List published blogs |
| Blogs | `/blogs/slug/:slug` | GET | Get blog by slug |
| Blogs | `/blogs/:id` | GET | Get blog by ID |
| FAQs | `/faqs` | GET | List FAQs |
| FAQs | `/faqs/categories` | GET | FAQ categories |
| Favorites | `/favorites/toggle` | POST | Add/remove favorite |
| Favorites | `/favorites/user/:userId` | GET | Get user favorites |
| Favorites | `/favorites/user/:userId/ids` | GET | Get favorite IDs |
| Favorites | `/favorites/check/:propertyId/:userId` | GET | Check if favorited |
| Enquiries | `/enquiries` | POST | Submit enquiry |
| Enquiries | `/enquiries/types` | GET | Get enquiry types |
| Storage | `/storage/init` | POST | Initialize storage bucket |
| Storage | `/storage/upload` | POST | Upload image (base64) |
| Storage | `/storage/delete` | DELETE | Delete image |
| Storage | `/storage/signed-url` | POST | Get signed URL |
| Storage | `/storage/list/:folder` | GET | List images in folder |
| System | `/health` | GET | Health check |
| Docs | `/docs` | GET | Swagger UI |

---

## Frontend Integration Guide

### ✅ Correct Approach - Using API Routes

```typescript
// Example: Property Listing Page
export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  
  useEffect(() => {
    fetch('/api/properties/featured?limit=6')
      .then(res => res.json())
      .then(data => setProperties(data.data));
  }, []);
  
  return <PropertyGrid properties={properties} />;
}

// Example: Advanced Search
async function searchProperties(filters) {
  const res = await fetch('/api/properties/search/advanced', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filters, page: 1, pageSize: 12 })
  });
  return res.json();
}

// Example: Toggle Favorite
async function toggleFavorite(propertyId, userId) {
  const res = await fetch('/api/favorites/toggle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ propertyId, userId })
  });
  return res.json();
}

// Example: Submit Enquiry
async function submitEnquiry(formData) {
  const res = await fetch('/api/enquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  return res.json();
}
```

### ❌ Incorrect Approach - Direct Supabase Usage

```typescript
// ❌ NEVER DO THIS IN FRONTEND CODE
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// This exposes your database schema and bypasses API validation
const { data } = await supabase.from('property').select('*');
```

### React Query / SWR Integration

For better UX with caching and revalidation:

```typescript
// Using React Query
import { useQuery } from '@tanstack/react-query';

function useFeaturedProperties(limit = 6) {
  return useQuery({
    queryKey: ['properties', 'featured', limit],
    queryFn: async () => {
      const res = await fetch(`/api/properties/featured?limit=${limit}`);
      const { data } = await res.json();
      return data;
    }
  });
}

// Using SWR
import useSWR from 'swr';

function useFeaturedProperties(limit = 6) {
  const fetcher = (url) => fetch(url).then(r => r.json()).then(d => d.data);
  return useSWR(`/api/properties/featured?limit=${limit}`, fetcher);
}
```

---

## Database Access Control

**Who can access what:**

| Layer | Access Level | Security |
|-------|-------------|----------|
| **Frontend** | ❌ NO direct Supabase access | Uses public API only |
| **API Routes** | ✅ `supabaseAdmin` (service role) | Full access, server-side only |
| **Server Actions** | ✅ `supabaseAdmin` (service role) | Full access, server-side only |
| **Admin Pages (RSC)** | ✅ `supabaseAdmin` (service role) | Full access, server-side only |

**File Location:**
- Supabase service: `src/lib/db.ts`
- API routes: `src/api/routes/*.ts`
- Server actions: `src/actions/*.ts`

---

## Migration from Direct Supabase to API

If you have existing code using Supabase directly:

```typescript
// BEFORE (Direct Supabase)
const { data } = await supabase
  .from('property')
  .select('*')
  .eq('status', 'available')
  .limit(10);

// AFTER (API Route)
const res = await fetch('/api/properties?limit=10');
const { data } = await res.json();
```

```typescript
// BEFORE (Direct Supabase with filters)
const { data } = await supabase
  .from('property')
  .select('*')
  .ilike('location', '%Dubai%')
  .gte('price', 3000)
  .lte('price', 10000);

// AFTER (API Route)
const res = await fetch('/api/properties/search?location=Dubai&minPrice=3000&maxPrice=10000');
const { data } = await res.json();

// OR use advanced search for complex filters
const res = await fetch('/api/properties/search/advanced', {
  method: 'POST',
  body: JSON.stringify({
    filters: { location: 'Dubai', budgetMin: 3000, budgetMax: 10000 }
  })
});
```
