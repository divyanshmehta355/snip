<div align="center">
  <img src="https://lucide.dev/icons/scissors.svg" width="80" alt="Snip Logo" />
  <h1>Snip</h1>
  <p><strong>A blazingly fast, modern URL shortener with advanced analytics and ephemeral links.</strong></p>
</div>

<br/>

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

```mermaid
graph TD
    classDef client fill:#3b82f6,stroke:#2563eb,stroke-width:2px,color:white;
    classDef frontend fill:#0ea5e9,stroke:#0284c7,stroke-width:2px,color:white;
    classDef backend fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px,color:white;
    classDef data fill:#10b981,stroke:#059669,stroke-width:2px,color:white;

    User([User / Browser]):::client
    
    subgraph "Monorepo (Turborepo)"
        Next[Next.js 15 App<br/>(apps/web)]:::frontend
        Fastify[Fastify API<br/>(apps/api)]:::backend
        Shared[(packages/shared)<br/>Zod Schemas & Types]
    end

    Redis[(Upstash Redis<br/>Cache & Rate Limiting)]:::data
    DB[(Neon PostgreSQL<br/>Serverless DB)]:::data
    
    User -->|Views Dashboards & Forms| Next
    User -->|Clicks Short Link| Fastify
    Next -->|REST API Requests + JWT| Fastify
    
    Fastify <-->|Read/Write TTL Cache| Redis
    Fastify <-->|Drizzle ORM| DB
    
    Next -.->|Consumes| Shared
    Fastify -.->|Consumes| Shared
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
git clone https://github.com/your-username/snip.git
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
