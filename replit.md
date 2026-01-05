# Candles & Crafts E-commerce Platform

## Overview

This is a full-stack e-commerce application for a handcrafted candles and home goods business. The platform enables customers to browse products, manage shopping carts, and place orders. Built with a React frontend and Express backend, it uses PostgreSQL for data persistence and Replit Auth for user authentication.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state caching and synchronization
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens (earthy/premium color palette)
- **Build Tool**: Vite with hot module replacement

The frontend follows a pages-based architecture with shared components. Custom hooks (`use-auth`, `use-cart`, `use-products`, `use-orders`) abstract API interactions and provide clean data access patterns.

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints defined in `shared/routes.ts` for type-safe route definitions
- **Authentication**: Replit Auth integration using OpenID Connect (OIDC) with Passport.js
- **Session Management**: PostgreSQL-backed sessions via connect-pg-simple

The server uses a storage abstraction layer (`server/storage.ts`) implementing the `IStorage` interface, enabling clean separation between business logic and data access.

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` defines all tables (users, products, cart_items, orders, order_items)
- **Migrations**: Managed via `drizzle-kit push` command
- **Validation**: Zod schemas generated from Drizzle tables via drizzle-zod

### Shared Code Pattern
The `shared/` directory contains code used by both frontend and backend:
- `schema.ts`: Database models and Zod validation schemas
- `routes.ts`: Type-safe API route definitions with input/output schemas
- `models/auth.ts`: Replit Auth user and session table definitions

### Build System
- Development: Vite dev server with Express API proxy
- Production: Client built to `dist/public`, server bundled with esbuild to `dist/index.cjs`
- Key dependencies are bundled to reduce cold start times

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, connected via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and schema management

### Authentication
- **Replit Auth**: OAuth/OIDC authentication provider
- Required environment variables: `ISSUER_URL`, `REPL_ID`, `SESSION_SECRET`
- Sessions stored in PostgreSQL `sessions` table

### UI Libraries
- **Radix UI**: Accessible component primitives (dialogs, dropdowns, forms, etc.)
- **Lucide React**: Icon library
- **Embla Carousel**: Product image carousels
- **class-variance-authority**: Component variant management

### Fonts
- Google Fonts: DM Sans (body), Libre Baskerville (headings), Architects Daughter (accent)

### Static Assets
- Product images expected at `/images/` path
- Logo stored in `attached_assets/` directory