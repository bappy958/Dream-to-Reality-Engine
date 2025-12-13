# Premium Animated Web App

A modern, fully responsive web application built with Next.js 14, featuring smooth animations powered by Framer Motion.

## Tech Stack

- **Next.js 14** (App Router)
- **Node.js 18 LTS**
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion**
- **Prisma** with PostgreSQL (Supabase)
- **Supabase** (Auth + Database)
- **npm**

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env.local` file with:
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@[PROJECT].supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

3. Set up the database:
```bash
npm run prisma:generate
npm run prisma:migrate
```

**Note:** Run the SQL schema in your Supabase SQL Editor first (see `prisma/schema.sql` or use Prisma migrations).

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Pages

- `/` - Landing page
- `/login` - Login page
- `/compose` - Compose page
- `/feed` - Feed page
- `/dream/[id]` - Dynamic dream detail page
- `/profile` - User profile page

## Project Structure

```
├── app/
│   ├── components/
│   │   └── Footer.tsx
│   ├── dream/
│   │   └── [id]/
│   │       └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── compose/
│   │   └── page.tsx
│   ├── feed/
│   │   └── page.tsx
│   ├── profile/
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── lib/
│   └── prisma.ts
├── prisma/
│   └── schema.prisma
└── package.json
```

## Features

- ✅ Responsive design (mobile + desktop)
- ✅ Smooth Framer Motion animations
- ✅ Clean, modern UI with Tailwind CSS
- ✅ SQLite database with Prisma ORM
- ✅ TypeScript for type safety
- ✅ App Router architecture

## Developer

- **Name:** Bappy Ahmmed
- **Email:** itznobita958@gmail.com

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio


