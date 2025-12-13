# Recent Changes

## Email Report System Removed ✅

**Removed:**
- `lib/email-service.ts` - Email service using Resend
- `app/api/email/send-report/route.ts` - Email sending endpoint
- `resend` package from `package.json`
- Email sending from cron job

**Updated:**
- `app/api/cron/monthly-report/route.ts` - Now only generates and saves reports (no emails)
- Monthly reports still available via `/api/reports/monthly` endpoint
- Reports still appear in user dashboard

**Environment Variables Removed:**
- `RESEND_API_KEY` (no longer needed)
- `RESEND_FROM_EMAIL` (no longer needed)

---

## Email OTP Login Added ✅

**New Features:**
- Passwordless login using email OTP codes
- Secure, production-ready authentication
- Uses Supabase Auth built-in OTP system

**New Files:**
- `app/api/auth/send-otp/route.ts` - Send OTP code to email
- `app/api/auth/verify-otp/route.ts` - Verify OTP and create session

**Updated Files:**
- `app/login/page.tsx` - New OTP flow UI:
  1. User enters email
  2. Clicks "Send Login Code"
  3. Enters 6-digit code from email
  4. Clicks "Verify & Sign In"
  5. Redirects to dashboard

**Security:**
- OTP codes expire automatically (Supabase default)
- No OTP codes stored or logged
- Server-safe implementation
- Session stored in secure HTTP-only cookies

**How It Works:**
1. User enters email → API calls Supabase `signInWithOtp()`
2. Supabase sends email with 6-digit code
3. User enters code → API calls Supabase `verifyOtp()`
4. Session created and stored in cookies
5. User redirected to dashboard

---

## Environment Variables

**Required:**
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL="..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."  # Required for cron

# OpenAI
OPENAI_API_KEY="..."

# Optional
NEXT_PUBLIC_SITE_URL="http://localhost:3000"  # For OTP redirects
CRON_SECRET="your-secret-key"  # Optional but recommended
```

**Removed:**
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`

---

## API Endpoints

**New:**
- `POST /api/auth/send-otp` - Send OTP code
- `POST /api/auth/verify-otp` - Verify OTP code

**Existing:**
- `POST /api/dreams/create` - Save dream with OpenAI analysis
- `GET /api/dreams` - Fetch user's dreams
- `GET /api/reports/monthly` - Get monthly wellness report
- `POST /api/cron/monthly-report` - Monthly cron job (no emails)

**Removed:**
- `POST /api/email/send-report` - No longer available

---

**Developer:** Bappy Ahmmed (itznobita958@gmail.com)

