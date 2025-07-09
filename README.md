# Boilerplate set up for expo mobile apps with express server

Kickstart your expo mobile app with express server app

## Prerequisites

- Node.js >= 18.18
- PostgreSQL
- npm or yarn

## Project Structure

```
src/
├── client/     # React Native Expo application
└── server/     # Express + Prisma server
```

## Server

- This is an express server with Prisma ORM.
- The private routes will go in server/src/routes/private.ts
- The public routes will go in server/src/routes/public.ts
- The API routes will will RESTful convention.
- Each controller will be go a particual model


## Client
- This is a React native expo application.
- The styling uses tailwindcss.
- The authentication uses supabase.
- We prefere to create reusable components.
- We use react query and create hoosk in services/hooks/*
- The actual axios request will go in requests/index.ts
