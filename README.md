# Logi - Logistics Operations & Inventory Platform

[![Frontend](https://img.shields.io/badge/Frontend-Next.js%2016%20%2B%20TypeScript-black?logo=next.js)](#)
[![Backend](https://img.shields.io/badge/Backend-Next.js%20Route%20Handlers-000000?logo=next.js)](#)
[![Auth](https://img.shields.io/badge/Auth-Firebase-FFCA28?logo=firebase&logoColor=black)](#)
[![Database](https://img.shields.io/badge/Database-PostgreSQL-316192?logo=postgresql&logoColor=white)](#)
[![ORM](https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma)](#)
[![UI](https://img.shields.io/badge/UI-TailwindCSS%20%2B%20shadcn%2Fui-38B2AC?logo=tailwindcss&logoColor=white)](#)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel&logoColor=white)](#)

Full-stack logistics app for managing suppliers, contracts, inventory, customers, and transactions.  
Built with Next.js App Router, Firebase authentication, JWT cookie sessions, Neon PostgreSQL via Prisma, advanced data tables, and business-rule-driven workflows (including inventory transfer on confirmed transactions).

## Live Demo

https://logi-drab.vercel.app

## Key Features

- Secure auth: Firebase sign-in/sign-up + backend JWT session cookie (HTTP-only)
- Protected app routes (middleware/proxy) and protected API handlers (route guard)
- Supplier management
- Contract lifecycle
- Inventory management
- Customer management in two modes:
  - manual customer creation
  - linking existing app users as customers
- Transaction lifecycle:
- Inventory transfer logic on confirmation
- Dashboard quick actions + recent notification feed
- Supplier country analytics dashboard
- Advanced data tables with sorting, multi-criteria filtering, search, pagination, selection and bulk update
- Caching and invalidation

## Architecture Overview

- **Frontend:** Next.js + React + TypeScript
- **Backend:** Next.js Route Handlers
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** JWT, Auth (client + admin verification)





