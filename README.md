# Global Bridges Network — Sanity CMS Studio

Headless CMS backend for the Global Bridges Network website, built with **Sanity v3**.

---

## Quick Start

### 1 — Create a Sanity Project

If you don't have a Sanity account yet:

1. Go to **[sanity.io/manage](https://www.sanity.io/manage)** and sign in / create a free account.
2. Click **"Create new project"** → give it a name (e.g. `global-bridges-network`).
3. Copy your **Project ID** from the project settings page.

---

### 2 — Set Up Environment Variables

```bash
# In the backend/ folder:
cp .env.example .env
```

Open `.env` and fill in your **Project ID**:

```env
SANITY_PROJECT_ID=your_actual_project_id
SANITY_DATASET=production
```

Do the same for the frontend:

```bash
# In the frontend/ folder:
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_actual_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=        # optional — needed only for draft previews
```

---

### 3 — Install Dependencies

```bash
cd backend
npm install
```

---

### 4 — Run the Studio Locally

```bash
npm run dev
```

Studio opens at **http://localhost:3333**

Log in with your Sanity account. You'll see five sections in the sidebar:

| Section | Content type | Used on |
|---|---|---|
| Contact Information | Singleton | Contact page footer |
| Testimonials | Collection | Homepage |
| Current Needs | Collection | Donate Goods page |
| Events | Collection | Events page |
| FAQs | Collection | FAQ / Donate page |

---

### 5 — Create an API Token (for the frontend)

1. Go to **[sanity.io/manage](https://www.sanity.io/manage)** → your project → **API** → **Tokens**
2. Click **"Add API Token"**
3. Name it `frontend-read`, set role to **Viewer**
4. Copy the token and paste it into `frontend/.env.local` as `SANITY_API_TOKEN`

> **Note:** The `SANITY_API_TOKEN` is only needed for draft/preview mode. The public CDN API doesn't require it for published content.

---

### 6 — Deploy the Studio (optional)

Host the studio on Sanity's free CDN so founders can edit content from any browser without running the dev server:

```bash
npm run deploy
```

You'll be prompted for a hostname (e.g. `global-bridges-network`). The studio will be available at:
**`https://global-bridges-network.sanity.studio`**

---

## Project Structure

```
backend/
├── sanity.config.ts        # Studio config (workspace, plugins, structure)
├── sanity.cli.ts           # CLI config (used by `sanity deploy`, `sanity manage`)
├── tsconfig.json
├── package.json
├── .env.example            # Environment variable template
└── schemaTypes/
    ├── index.ts            # Schema registry (imports all types)
    ├── testimonial.ts      # Testimonials schema
    ├── currentNeed.ts      # Current Needs schema
    ├── event.ts            # Events schema
    ├── faq.ts              # FAQ schema
    └── contactInfo.ts      # Contact Info singleton schema
```

## Frontend Integration

The frontend GROQ client library lives at:

```
frontend/src/lib/sanity/
├── client.ts    # Sanity createClient (CDN + preview)
├── queries.ts   # All named GROQ queries
├── types.ts     # TypeScript interfaces for all content types
└── image.ts     # urlFor() image URL builder
```

### Example — Fetch Testimonials in a Next.js Server Component

```tsx
import { client } from "@/lib/sanity/client";
import { TESTIMONIALS_QUERY } from "@/lib/sanity/queries";
import type { Testimonial } from "@/lib/sanity/types";

export default async function TestimonialsSection() {
  const testimonials: Testimonial[] = await client.fetch(TESTIMONIALS_QUERY);

  return (
    <ul>
      {testimonials.map((t) => (
        <li key={t._id}>{t.quote}</li>
      ))}
    </ul>
  );
}
```

---

## Content Schema Overview

### Testimonial
| Field | Type | Required |
|---|---|---|
| quote | text | ✅ |
| authorName | string | ✅ |
| authorRole | string | ✅ |
| category | radio (4 options) | ✅ |
| date | string | ✅ |
| image | image | — |
| published | boolean | ✅ |

### Current Need
| Field | Type | Required |
|---|---|---|
| itemName | string | ✅ |
| description | text | ✅ |
| category | string | ✅ |
| quantity | string | — |
| priority | radio (urgent/high/medium) | — |
| image | image | — |
| lastUpdated | string | — |
| active | boolean | ✅ |

### Event
| Field | Type | Required |
|---|---|---|
| title | string | ✅ |
| description | text | ✅ |
| category | radio (4 options) | ✅ |
| date | string | ✅ |
| time | string | — |
| location | string | ✅ |
| status | radio (upcoming/past) | ✅ |
| image | image | — |
| registrationUrl | string | — |
| published | boolean | ✅ |

### FAQ
| Field | Type | Required |
|---|---|---|
| category | dropdown (5 options) | ✅ |
| question | string | ✅ |
| answer | text | ✅ |
| order | number | — |

### Contact Information *(Singleton)*
| Field | Type | Required |
|---|---|---|
| email | string | ✅ |
| phone | string | — |
| address | text | — |
| mapEmbedUrl | url | — |
| officeHours | string | — |
| socialLinks | array of {platform, url} | — |
