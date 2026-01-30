# Mary Collection - Luxury Home Textiles

## Overview
Mary Collection is a production-ready AI-powered B2B & export sales platform for luxury home textiles. The site features a minimalist Hermes/Armani/Gucci-inspired design with a cream/beige/soft brown color palette.

## Tech Stack
- **Frontend**: React + TypeScript + Vite, TailwindCSS, Shadcn UI, Framer Motion
- **Backend**: Express.js with PostgreSQL database (Drizzle ORM)
- **Database**: PostgreSQL with Drizzle ORM, connect-pg-simple for sessions
- **Authentication**: bcrypt password hashing (12 salt rounds), session-based auth
- **File Uploads**: multer with disk storage for product images
- **State**: TanStack Query, Zustand for language state
- **Styling**: Luxury design system with Playfair Display font

## Features
- Full multilingual support (Uzbek, Russian, English)
- AI-powered chat assistant for product recommendations (OpenAI gpt-4o-mini)
- Secure admin panel with bcrypt authentication and PostgreSQL sessions
- Image upload support for products
- CRUD operations for categories, products, inquiries
- Admin credentials management (change username/password)

## Admin Access
- URL: `/admin/login`
- Initial Username: `marycollection.uzb`
- Initial Password: `Aa1234567890@0987654321@`
- **Important**: Change these credentials after first login via `/api/admin/credentials`

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
  db.ts              # PostgreSQL connection and Drizzle setup
  dbStorage.ts       # Database storage implementation
  routes.ts          # API endpoints
  storage.ts         # Storage interface and MemStorage (legacy)
  index.ts           # Express server setup with sessions
shared/
  schema.ts          # Drizzle schemas and types
uploads/             # Product image uploads directory
```

## Key APIs
### Public Routes
- `GET /api/products` - List all products
- `GET /api/categories` - List all categories
- `POST /api/inquiries` - Submit contact form
- `POST /api/chat` - AI assistant (streaming SSE)

### Admin Routes (Protected)
- `POST /api/admin/login` - Admin authentication
- `POST /api/admin/logout` - Logout
- `POST /api/admin/upload` - Upload product image
- `POST /api/admin/credentials` - Change admin credentials
- `GET/POST/PUT/DELETE /api/admin/products` - Product CRUD
- `GET/POST/PUT/DELETE /api/admin/categories` - Category CRUD
- `GET/PUT/DELETE /api/admin/inquiries` - Inquiry management
- `GET/PUT /api/admin/settings` - Site settings

## Database Schema
- **users**: id, username, password (bcrypt hashed), role
- **categories**: id, slug, name (uz/ru/en), description, image
- **products**: id, slug, categoryId, name, description, features, price, images, isNew, isFeatured
- **inquiries**: id, name, email, phone, message, status, createdAt
- **leads**: id, companyName, country, contactPerson, email, phone, productInterest, source, status, priority, score
- **settings**: key, value pairs for site configuration
- **session**: PostgreSQL session storage (auto-created)

## Security
- Passwords hashed with bcrypt (12 salt rounds)
- Sessions stored in PostgreSQL (24-hour expiration)
- HTTP-only cookies, secure flag in production
- Admin routes protected with middleware
- File upload validation (jpeg/jpg/png/gif/webp, 10MB limit)
- Login rate limiting (5 attempts per 15 minutes)
- AI chat input sanitization (1000 char limit)
- Google reCAPTCHA v3 integration for inquiry forms (optional, set RECAPTCHA_SECRET_KEY)
- Security headers: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy
- Cloudflare WAF compatible (trusts CF headers for real IP)
- Server-side request logging for monitoring

## Admin Panel Multilingual Support
- Full i18n support for admin panel (uz/ru/en)
- Language switcher on login page and admin layout
- All menus, labels, forms, buttons, and messages are localized
- Temperature badges (HOT/WARM/COLD), units (pcs), and placeholders translated
- Reuses existing i18n system from `client/src/lib/i18n.ts`

## Legal Pages
- Privacy Policy: `/privacy` (multilingual uz/ru/en)
- Terms of Use: `/terms` (multilingual uz/ru/en)

## Color Palette
- Background: Cream (40 33% 98%)
- Primary: Soft brown (30 35% 40%)
- Card: Off-white (40 40% 99%)
- Borders: Light beige (35 15% 88%)

## Default Data
- 6 Categories: Bathrobes, Towels, Pastel Linen, Spa/Hotel, Barber Shop, Accessories
- Multiple products with full multilingual content
- Auto-seeded on first database initialization
