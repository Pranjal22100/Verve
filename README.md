# Verve

![Project: Verve](https://img.shields.io/badge/Verve-ready-blue)
![Status](https://img.shields.io/badge/status-beta-yellow)
![License](https://img.shields.io/badge/license-ISC-lightgrey)

## Table of Contents

- [What the project does](#what-the-project-does)
- [Why the project is useful](#why-the-project-is-useful)
- [Key features](#key-features)
- [Architecture](#architecture)
- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend setup](#backend-setup)
  - [Frontend setup](#frontend-setup)
  - [Run the full stack](#run-the-full-stack)
- [API endpoints (summary)](#api-endpoints-summary)
- [Usage examples](#usage-examples)
- [Environment variables](#environment-variables)
- [Screenshots](#screenshots)
- [Deployment links](#deployment-links)
- [Where users can get help](#where-users-can-get-help)
- [Who maintains this project](#who-maintains-this-project)

## What the project does

**Verve** is a full-stack real-time chat application (Express/TypeScript + Next.js) that allows users to create shareable room links with passcode protection. Friends can join these rooms using Google OAuth authentication and participate in real-time conversations.

The backend uses Redis (as the Socket.io adapter) for immediate cross-instance real-time broadcasting, and Kafka as an asynchronous, durable event pipeline for persistence. Socket.io powers real-time messaging, and Prisma ORM manages database schema with PostgreSQL.

## Why the project is useful

- **Easy room sharing** — Generate unique links and passcodes to share with friends
- **Google OAuth authentication** — Secure, frictionless login via Google
- **Passcode protection** — Rooms are protected by auto-generated passcodes
- **Real-time messaging** — Instant message delivery via Socket.io
- **Event streaming** — Kafka pipelines for scalable message processing
- **Caching layer** — Redis for performance optimization and reduced database load
- **TypeScript** — Type safety across backend and frontend
- **Modern UI** — Next.js with Tailwind CSS and Radix UI
- **Production-ready** — Docker support, admin Socket.io UI for debugging

## Key features

- Create and manage chat rooms with shareable links
- Generate secure room passcodes
- Google Sign-In/OAuth authentication
- Real-time messaging with instant delivery
- Message history persistence
- Multiple rooms per user
- Admin Socket.io dashboard for monitoring connections
- Event-driven architecture with Kafka

## Architecture

- Backend: `server/`
  - Express server (TypeScript) in `src/index.ts`
  - Socket.io setup in `src/socket.ts` with Redis adapter
  - Kafka producer/consumer in `src/config/kafka.config.ts`
  - Redis client for caching in `src/config/redis.ts`
  - Routes: `src/routes/` for room and auth endpoints
  - Controllers: `src/controllers/` for business logic
  - Prisma ORM in `prisma/` for database schema
  - Socket.io Admin UI enabled for development
- Frontend: `front/`
  - Next.js app with TypeScript
  - NextAuth for Google OAuth integration
  - Axios for API calls with interceptors
  - Real-time Socket.io client integration
  - Tailwind CSS + Radix UI components
  - Server-side rendering (SSR) support

## Getting started

## Architecture / Flow

The system uses two parallel mechanisms for handling messages sent by users to ensure both real-time delivery and durable persistence:

- Real-time delivery (immediate): The Express server receives the incoming Socket.io message event. A Redis adapter (used as the Socket.io adapter) immediately broadcasts the message to all connected users in the same room — this broadcast works across multiple Node.js instances and is responsible for real-time cross-instance synchronization.
- Durable persistence (eventual): In parallel, the backend publishes the same message to a Kafka topic. A Kafka consumer processes that topic asynchronously and persists the message to the `chats` table in PostgreSQL (via Prisma). This ensures messages are durably stored even if persistence is slower or temporarily unavailable.

In short: Redis (Socket.io adapter) = immediate real-time cross-instance broadcasting; Kafka = asynchronous, durable persistence. These are separate, parallel steps: Redis fires immediately, Kafka persists eventually.

![Sequence Diagram](Uml_Diagrams/verve_sequence.png)

![Activity Diagram](Uml_Diagrams/verve_activity.png)

## Database Schema

The database is PostgreSQL managed via Prisma. Key tables and constraints:

- `users`
  - Stores user records; authentication is Google OAuth only and stored as `provider` + `oauth_id`.
- `chat_groups`
  - Chat room metadata. Has `@@index([user_id, created_at])` for efficient lookups of groups by owner and creation time.
- `group_users`
  - Join table between users and chat_groups. Has `@@unique([group_id, user_id])` to prevent duplicate membership records.
- `chats`
  - Message history. Has `@@index([created_at])` to support fast time-ordered queries.

Additional details:
- All foreign key relationships use `onDelete: Cascade`.
- Messages flow: Socket.io + Redis adapter broadcasts in real-time; Kafka consumer persists to `chats` asynchronously.

![ER Diagram](Uml_Diagrams/verve_er.png)

### Prerequisites

- Node.js 18+ (or latest LTS)
- npm 10+ (or yarn)
- PostgreSQL instance (Atlas or local)
- Redis instance (for caching)
- Kafka cluster (or local Kafka setup)
- Google OAuth credentials (for authentication)
- For dev, use two shells (backend and frontend)

### Backend setup

```bash
cd D:\Verve\server
npm install
```

Create `.env` in `server/` with:

```env
PORT=7000
DATABASE_URL="postgresql://user:password@localhost:5432/verve"
JWT_SECRET="<strong-jwt-secret>"
NODE_ENV=development
CLIENT_APP_URL="http://localhost:3000"
REDIS_URL="redis://localhost:6379"
KAFKA_BROKERS="localhost:9092"
KAFKA_TOPIC="chat-events"
GOOGLE_CLIENT_ID="<your-google-client-id>"
GOOGLE_CLIENT_SECRET="<your-google-client-secret>"
```

Set up Prisma database:

```bash
npx prisma migrate dev
npx prisma generate
```

Start the backend:

```bash
npm run dev
```

### Frontend setup

```bash
cd D:\Verve\front
npm install
```

Create `.env.local` in `front/` with:

```env
NEXT_PUBLIC_API_URL=http://localhost:7000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET="<strong-nextauth-secret>"
GOOGLE_CLIENT_ID="<your-google-client-id>"
GOOGLE_CLIENT_SECRET="<your-google-client-secret>"
```

Start frontend:

```bash
npm run dev
```

### Run the full stack

1. Ensure PostgreSQL, Redis, and Kafka are running.
2. Start backend (`npm run dev` in `server/`).
3. Start frontend (`npm run dev` in `front/`).
4. Open the app at `http://localhost:3000`.
5. Access Socket.io Admin UI at `http://localhost:7000/admin` (development only).

## API endpoints (summary)

### Auth

- `POST /api/auth/login` - Login via Google OAuth (handled by NextAuth).
- `GET /api/auth/logout` - Logout user and clear session.
- `GET /api/auth/me` - Get current authenticated user (protected).

### Rooms

- `POST /api/rooms` - Create new chat room. Returns room link and passcode (protected).
- `GET /api/rooms` - Get all rooms for authenticated user (protected).
- `GET /api/rooms/:roomId` - Get room details by ID (protected).
- `POST /api/rooms/:roomId/join` - Join room with passcode (protected).
- `DELETE /api/rooms/:roomId` - Delete room (protected, owner only).

### Messages

- `POST /api/messages` - Send message to room (protected, Socket.io event).
- `GET /api/messages/:roomId` - Get message history for room (protected).

## Usage examples

### Create room (via frontend UI)

The frontend provides a "Create Room" button that generates a unique room link and passcode. Share both with friends.

### Join room (via link + passcode)

1. Friend receives room link and passcode
2. Friend clicks link or navigates to the app
3. Friend signs in with Google
4. Friend enters passcode to join the room
5. Real-time messaging begins via Socket.io

### Send message (real-time)

```javascript
// Frontend (emitted via Socket.io)
socket.emit("message", {
  roomId: "room-123",
  content: "Hello!",
  timestamp: new Date()
});
```

## Environment variables

- Backend (`server/.env`)
  - `PORT` (default `7000`)
  - `DATABASE_URL` (PostgreSQL connection)
  - `JWT_SECRET`
  - `NODE_ENV` (development/production)
  - `CLIENT_APP_URL` (frontend URL for CORS)
  - `REDIS_URL` (for caching)
  - `KAFKA_BROKERS` (Kafka broker addresses)
  - `KAFKA_TOPIC` (Kafka topic for events)
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`

- Frontend (`front/.env.local`)
  - `NEXT_PUBLIC_API_URL` (backend API URL)
  - `NEXTAUTH_URL` (frontend URL)
  - `NEXTAUTH_SECRET`
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`

## Screenshots

- ![Create room](docs/screenshots/create-room.png)
- ![Room link & passcode](docs/screenshots/room-link-passcode.png)
- ![Chat room](docs/screenshots/chat-room.png)
- ![Join room](docs/screenshots/join-room.png)

## Deployment links

Deployment is not currently available due to free-tier limitations, specifically the lack of support for Kafka-based services. However, the project is fully functional and can be run locally or using Docker without any issues.

<!-- - Frontend: [Add frontend URL here]
- Backend: [Add backend URL here]

> Note: Deployment may be on a sleep/idle plan. The first request can take ~60 seconds while the service wakes up. -->

## Where users can get help

- Project issues: open an issue in the repository.
- Check source code in `server/src/` and `front/src/`.
- Collect debug info: backend server logs, browser dev tools, network tab, Socket.io Admin UI.
- For library docs:
  - Express: https://expressjs.com/
  - Socket.io: https://socket.io/docs/
  - Next.js: https://nextjs.org/docs
  - Prisma: https://www.prisma.io/docs/
  - Kafka: https://kafka.apache.org/documentation
  - NextAuth: https://next-auth.js.org/

## Who maintains this project

Maintainer: [Pranjal Verma].

> Personal project for resume/portfolio purposes. Keep deployment concise and this README focused on onboarding/app demonstration.

---

> Note: This README intentionally focuses on quick developer onboarding. Detailed API docs and troubleshooting should live in separate docs/Wiki pages to keep the core README compact.
