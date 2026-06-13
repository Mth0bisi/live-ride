# LiveRide Show Platform

A working MVP demo for a live horse showriding/showjumping update platform.

## Overview
This platform allows organisers to manage arenas, riding orders, and capture live timing/results, which are instantly published to a public live feed for spectators.

## Tech Stack
- **Frontend**: Next.js (App Router) + React + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite
- **ORM**: Prisma
- **Real-time**: Simple client-side polling for the MVP

## User Roles
1. **Admin**: Oversee the entire event, pause/start arenas, and change riding orders.
2. **Gate Marshal**: Mark riders as Checked In, At Gate, Held, or Scratched.
3. **Timer / Judge**: Start rounds, capture times/faults, and confirm results.
4. **Public Viewer**: View the live feed of arenas and current riders.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Database & Seed Data**
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

## Demo Flow
1. **Admin Dashboard** (`/admin`): View all arenas and their status.
2. **Gate Marshal** (`/gate`): Select an arena (e.g., Peter Minnie Arena). Check in the next rider (e.g. Trinity Swart), then mark them "At Gate".
3. **Timer/Judge** (`/timer`): Select the same arena. You will see the rider ready. Click "START ROUND".
4. **Public Site** (`/` or `/arena/[id]`): In a separate window, see the rider automatically appear as the "In Arena Now" rider.
5. **Timer**: Enter time and faults, click "FINISH ROUND". Then click "Judge Confirm".
6. **Public Site**: The rider moves to the completed table with their score.

## Known Limitations (MVP)
- **Polling**: Real-time updates currently use polling (`setInterval`). In production, this should use WebSockets or Server-Sent Events (SSE).
- **Authentication**: No authentication or role-based access control is implemented yet. All routes are open.
- **Data Completeness**: Only basic result capture (time, faults) is supported. No complex penalty calculations or placing algorithms yet.

## Future Production Improvements
- **PDF/Excel Import Parser**: Automatically create classes and running orders from show schedules.
- **Real timing hardware integration**: Connect to physical timer beams via serial/network protocols.
- **WebSocket/SSE live updates**: Replace polling for lower latency updates.
- **Offline Mode**: Add PWA offline support with background sync for poor arena connectivity.
- **User Authentication**: Secure routes using NextAuth or Clerk.
- **Judge Approval Workflow**: Require dual-confirmation or a dedicated judge iPad app.
- **Full Audit Logs**: Display `StatusHistory` and `TimerEvents` in the Admin view.
- **Multi-day Events**: Scale schema to handle complex shows spanning multiple days.
- **SMS/WhatsApp Notifications**: Alert riders when they are "Up Next".
- **Export**: Generate final results in PDF or CSV.
