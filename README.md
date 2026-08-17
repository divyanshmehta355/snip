# Snip

**A blazingly fast, modern URL shortener with advanced analytics and ephemeral links.**


Snip is an enterprise-grade URL shortening platform built on a decoupled, high-performance monorepo architecture. It features lightning-fast redirects, advanced click tracking, high-resolution QR code generation, and strict TTL expiration policies—all wrapped in a premium, dark-mode first UI.

## ✨ Features

- **⚡ Blazing Fast Redirects**: Powered by **Fastify** and heavily cached via **Redis**, ensuring minimal latency.
- **📊 Advanced Analytics**: Track your traffic with interactive dashboards built using **Recharts**. Monitor 7-day timelines, top referrers, and detailed device/OS breakdowns.
- **⏱️ Ephemeral Links**: Set your links to self-destruct (e.g., 1 hour, 7 days). Snip rigorously enforces expirations via Redis TTLs and database timestamps.
- **📱 QR Code Generation**: Instantly generate and download high-resolution (1024x1024) PNG QR codes for any shortened link, perfect for printing or presentations.
- **🔐 Secure Authentication**: Custom JWT-based authentication system storing session tokens securely in HTTP-only cookies.
- **💅 Premium UI**: A highly polished, responsive interface utilizing **Next.js 15**, **TailwindCSS**, **Shadcn UI**, and **Framer Motion** for smooth glassmorphism effects and micro-animations.

---

## 🏗️ Architecture

Snip is built inside a **Turborepo** workspace to seamlessly share types, schemas, and configurations between the decoupled frontend and backend.

```text
                              +-----------------------+
                              |                       |
                              |    User / Browser     |
                              |                       |
                              +------+---------+------+
                                     |         |
                  Views UI (Next.js) |         | Direct Redirects
                                     |         |
                                     v         v
+-----------------------+        +-----------------------+
|                       |        |                       |
|   Next.js 15 App      +------->|   Fastify API         |
|   (apps/web)          |  REST  |   (apps/api)          |
|                       |        |                       |
+-----------+-----------+        +-----+-----------+-----+
            |                          |           |
            | Imports                  |           |
            v                          |           |
+-----------------------+              |           |
|                       |<-------------+           |
|   Zod Schemas/Types   |  Imports                 |
|   (packages/shared)   |                          |
+-----------------------+                          |
                                                   |
                                                   |
                     +--------------------------+  |
                     |       Upstash Redis      |<-+
                     |    (Cache & Rate Limit)  |
                     +--------------------------+  |
                                                   |
                     +--------------------------+  |
                     |      Neon PostgreSQL     |<-+
                     |      (Serverless DB)     |
                     +--------------------------+
```

### Technology Stack
- **Frontend**: Next.js 15 (App Router), React, TailwindCSS, Shadcn UI, Framer Motion, Recharts.
- **Backend**: Fastify (Node.js), TypeScript, Zod, JWT.
- **Database**: PostgreSQL (Neon Serverless), Drizzle ORM.
- **Caching**: Redis (Upstash).
- **Package Manager**: pnpm.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+)
- pnpm (v9+)
- A PostgreSQL Database URL (e.g., [Neon](https://neon.tech))
- A Redis URL (e.g., [Upstash](https://upstash.com))

### 1. Clone the repository
```bash
git clone https://github.com/divyanshmehta355/snip.git
cd snip
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Set up environment variables
Create a `.env` file in `apps/api`:
```env
PORT=4000
DATABASE_URL="postgresql://user:password@host/dbname"
UPSTASH_REDIS_REST_URL="https://your-upstash-url"
UPSTASH_REDIS_REST_TOKEN="your-upstash-token"
JWT_SECRET="your-super-secret-jwt-key"
```

Create a `.env.local` file in `apps/web`:
```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

### 4. Run Database Migrations
Generate and push the Drizzle schema to your Postgres database:
```bash
pnpm --filter api run db:generate
pnpm --filter api run db:migrate
```

### 5. Start the Development Server
Launch both the Fastify API and the Next.js frontend concurrently using Turborepo:
```bash
pnpm dev
```
- Frontend will be running at [http://localhost:3000](http://localhost:3000)
- Backend API will be running at [http://localhost:4000](http://localhost:4000)

---

## 📂 Project Structure

```text
snip/
├── apps/
│   ├── api/                # Fastify backend, Drizzle ORM, Route Handlers
│   │   ├── src/db/         # Schema definitions and migrations
│   │   ├── src/routes/     # Analytics, Auth, and URL REST endpoints
│   │   └── src/server.ts   # Entry point
│   └── web/                # Next.js 15 Frontend
│       ├── app/            # App Router (Dashboard, Analytics, Auth)
│       └── components/     # Reusable UI components (Shadcn, Framer Motion)
├── packages/
│   ├── eslint-config/      # Shared ESLint configuration
│   ├── shared/             # Shared Zod Schemas and Types (built via tsup)
│   └── typescript-config/  # Shared tsconfig bases
├── turbo.json              # Turborepo orchestration config
└── pnpm-workspace.yaml     # Workspace configuration
```

---

## 📜 License

This project is licensed under the MIT License.
