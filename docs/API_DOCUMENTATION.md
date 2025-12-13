# Dream to Reality Engine - API Documentation

## Overview

Backend API routes for the Dream to Reality Engine, built with Next.js 15 App Router, Supabase, and TypeScript.

**Developer:** Bappy Ahmmed (itznobita958@gmail.com)

---

## Environment Variables Required

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6dHBodm9ld2pseGNnc3pkeWRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2MDE0MzAsImV4cCI6MjA4MTE3NzQzMH0.h7Pkz1LUXFGORRfADTaBaVgit6ahzQc3_U4cYKH5E-U"

# Optional: For admin operations
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6dHBodm9ld2pseGNnc3pkeWRxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTYwMTQzMCwiZXhwIjoyMDgxMTc3NDMwfQ.zq7eTYzfQuCDGoTAMZqwDAiLy8fZ_SLv2EsY6mk1fNU"
```

---

## API Routes

### 1. Save Dream

**Endpoint:** `POST /api/dreams`

**Description:** Saves a new dream with automatic AI analysis.

**Request Body:**
```json
{
  "dream_text": "I was flying over a beautiful ocean...",
  "emotion": "hopeful",  // optional
  "style": "cinematic"   // optional
}
```

**Response (201):**
```json
{
  "success": true,
  "dream": {
    "id": "uuid",
    "user_id": "uuid",
    "dream_text": "...",
    "emotion": "hopeful",
    "style": "cinematic",
    "analysis": {
      "primary_emotion": "hopeful",
      "emotion_intensity": 0.75,
      "symbols": ["flying", "water"],
      "overall_tone": "transformative"
    },
    "created_at": "2024-01-15T10:30:00Z"
  },
  "analysis": { ... }
}
```

**Errors:**
- `400`: Invalid input (missing or empty dream_text)
- `401`: Unauthorized (not logged in)
- `500`: Server error

---

### 2. Get User's Dreams

**Endpoint:** `GET /api/dreams`

**Description:** Fetches user's dreams with pagination.

**Query Parameters:**
- `limit` (optional): Number of dreams to return (default: 50)
- `offset` (optional): Pagination offset (default: 0)

**Example:** `GET /api/dreams?limit=20&offset=0`

**Response (200):**
```json
{
  "success": true,
  "dreams": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "dream_text": "...",
      "emotion": "hopeful",
      "style": "cinematic",
      "analysis": { ... },
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 20
}
```

**Errors:**
- `401`: Unauthorized
- `500`: Server error

---

### 3. Get Monthly Report

**Endpoint:** `GET /api/monthly-reports`

**Description:** Fetches monthly wellness report. Automatically generates if it doesn't exist.

**Query Parameters:**
- `month` (optional): Month in YYYY-MM format (default: current month)

**Example:** `GET /api/monthly-reports?month=2024-01`

**Response (200):**
```json
{
  "success": true,
  "report": {
    "id": "uuid",
    "user_id": "uuid",
    "month_year": "2024-01",
    "mental_state": "Healing",
    "summary": "Over the past month, your dreams have shown...",
    "patterns": [
      "Hopeful emotions appear in 60% of your dreams",
      "Recurring symbols: flying, water"
    ],
    "recommendation": "You're on a meaningful journey of growth...",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "dreamCount": 12
}
```

**Errors:**
- `400`: Invalid month format
- `401`: Unauthorized
- `500`: Server error

---

### 4. Generate Monthly Report

**Endpoint:** `POST /api/monthly-reports`

**Description:** Manually trigger monthly report generation.

**Request Body:**
```json
{
  "month": "2024-01"  // optional, defaults to current month
}
```

**Response (200):**
```json
{
  "success": true,
  "report": { ... },
  "dreamCount": 12
}
```

**Errors:**
- `400`: Invalid month format
- `401`: Unauthorized
- `500`: Server error

---

## Authentication

All endpoints require authentication via Supabase Auth. The API checks for:
1. Authorization header: `Bearer <token>`
2. Supabase session cookies (if using cookie-based auth)

---

## Database Schema

### Dreams Table
- `id` (UUID, primary key)
- `user_id` (UUID, references auth.users)
- `dream_text` (TEXT, required)
- `emotion` (TEXT, nullable)
- `style` (TEXT, nullable)
- `analysis` (JSONB, stores AI analysis)
- `created_at` (TIMESTAMP)

### Monthly Reports Table
- `id` (UUID, primary key)
- `user_id` (UUID, references auth.users)
- `month_year` (TEXT, format: YYYY-MM)
- `mental_state` (TEXT: Calm/Mixed/Healing/Stressed)
- `summary` (TEXT)
- `patterns` (TEXT, JSON array as string)
- `recommendation` (TEXT)
- `created_at` (TIMESTAMP)

---

## Implementation Notes

1. **AI Analysis**: Currently uses local pattern-matching analysis. Can be replaced with OpenAI API if needed.

2. **Row Level Security**: Supabase RLS policies ensure users can only access their own data.

3. **Error Handling**: All endpoints include comprehensive error handling and validation.

4. **Type Safety**: Full TypeScript support with proper types.

---

## Next Steps

1. Set up Supabase project and run SQL schema
2. Configure environment variables
3. Test API endpoints with authenticated requests
4. (Optional) Integrate OpenAI API for enhanced analysis

