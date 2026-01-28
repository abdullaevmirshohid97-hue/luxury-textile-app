# Mary Collection - Luxury Home Textiles

## Overview
Mary Collection is a premium luxury home textile website for bathrobes and towels. The site features a minimalist Hermes/Armani/Gucci-inspired design with a cream/beige/soft brown color palette.

## Tech Stack
- **Frontend**: React + TypeScript + Vite, TailwindCSS, Shadcn UI, Framer Motion
- **Backend**: Express.js with in-memory storage
- **State**: TanStack Query, Zustand for language state
- **Styling**: Luxury design system with Playfair Display font

## Features
- Full multilingual support (Uzbek, Russian, English)
- AI-powered chat assistant for product recommendations (OpenAI gpt-4o-mini)
- Secure admin panel for managing products, categories, and inquiries
- Session-based authentication

## Admin Access
- URL: `/admin/login`
- Username: `admin`
- Password: `marycollection2024`

## Project Structure
```
client/
  src/
    pages/           # Main pages (Home, Catalog, Product, Contact)
    pages/admin/     # Admin panel pages
    components/      # Shared components (layout, chat widget)
    lib/             # Utilities (i18n, queryClient)
    assets/images/   # Stock images for hero and products
server/
  routes.ts          # API endpoints
  storage.ts         # In-memory storage with default data
shared/
  schema.ts          # Drizzle schemas and types
```

## Key APIs
- `GET /api/products` - List all products
- `GET /api/categories` - List all categories
- `POST /api/inquiries` - Submit contact form
- `POST /api/chat` - AI assistant (streaming SSE)
- `POST /api/admin/login` - Admin authentication
- Admin CRUD endpoints for products, categories, inquiries, settings

## Color Palette
- Background: Cream (40 33% 98%)
- Primary: Soft brown (30 35% 40%)
- Card: Off-white (40 40% 99%)
- Borders: Light beige (35 15% 88%)

## Default Data
- 2 Categories: Bathrobes, Towels
- 6 Products: 3 bathrobes, 3 towels with full multilingual content
