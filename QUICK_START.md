# SceneGuard Backend - Quick Start Guide

## 🎬 Overview
Complete backend skeleton for SceneGuard - a film pre-production decision-support system.

**Architecture**: Clean, deterministic, explainable, and auditable.

---

## 📦 Installation

### 1. Install Dependencies
```bash
npm install
```

This will install:
- `drizzle-orm` - Database ORM
- `@neondatabase/serverless` - Neon PostgreSQL client
- `@google/generative-ai` - Gemini AI SDK
- `drizzle-kit` - Database migrations (dev dependency)

### 2. Environment Variables
Ensure your `.env.local` contains:
```env
# Clerk (already configured)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Gemini AI
GEMINI_API_KEY=AIza...

# Visual Crossing Weather API
WEATHER_API_KEY=MX6Q...

# Neon Database
DATABASE_URL=postgresql://...
```

---

## 🗄️ Database Setup

### 1. Generate Migration
```bash
npx drizzle-kit generate
```

This creates SQL migration files in the `drizzle/` folder based on [db/schema.ts](db/schema.ts).

### 2. Apply Migration to Neon
```bash
npx drizzle-kit push
```

This will create the following tables in your Neon database:
- `users` - User accounts (linked to Clerk)
- `scene_analyses` - Scene analysis records
- `analysis_artifacts` - Intermediate processing outputs
- `artifact_type` enum - Types of artifacts

### 3. Verify Database
Check your Neon dashboard to confirm tables were created successfully.

---

## 🏗️ Architecture Overview

### File Structure
```
sceneguard/
├── db/
│   ├── schema.ts          # Database schema definitions
│   └── index.ts           # Database client
├── lib/
│   ├── gemini-parser.ts   # AI fact extraction (Gemini)
│   ├── risk-analyzer.ts   # Deterministic risk engine
│   ├── cost-analyzer.ts   # Cost impact mapping
│   ├── weather-service.ts # Weather API integration
│   └── planning-insights.ts # Template-based recommendations
├── app/
│   └── api/
│       └── scene/
│           └── analyze/
│               └── route.ts # Main API endpoint
├── drizzle.config.ts      # Drizzle ORM config
└── BACKEND_DOCS.md        # API documentation
```

### Data Flow
```
1. POST /api/scene/analyze
   ↓
2. Auth Check (Clerk)
   ↓
3. Input Validation (Zod)
   ↓
4. Gemini Parsing (AI fact extraction)
   ↓
5. Risk Analysis (Rule-based)
   ↓
6. Cost Analysis (Qualitative mapping)
   ↓
7. Weather Check (API - outdoor only)
   ↓
8. Planning Insights (Templates)
   ↓
9. Database Persistence (Drizzle ORM)
   ↓
10. JSON Response
```

---

## 🚀 Testing the API

### Option 1: Using cURL (Terminal)
```bash
# Indoor scene example
curl -X POST http://localhost:3000/api/scene/analyze \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
  -d '{
    "sceneDescription": "Interior coffee shop, two actors having a quiet conversation",
    "sceneCategory": "Indoor",
    "timeOfDay": "Day"
  }'
```

### Option 2: Using Thunder Client / Postman
1. Create a POST request to `http://localhost:3000/api/scene/analyze`
2. Add header: `Content-Type: application/json`
3. Add Clerk auth token (get from browser dev tools)
4. Send this body:

```json
{
  "sceneDescription": "Outdoor park scene, children playing soccer during a sunny afternoon",
  "sceneCategory": "Outdoor",
  "timeOfDay": "Day",
  "location": "Austin, TX",
  "month": "March"
}
```

### Option 3: Using Browser Console
```javascript
fetch('/api/scene/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sceneDescription: 'VFX-heavy space battle inside a green screen studio',
    sceneCategory: 'VFX',
    timeOfDay: 'Day'
  })
})
.then(r => r.json())
.then(console.log);
```

---

## 📊 Database Queries (For Testing)

### View All Scene Analyses
```sql
SELECT 
  sa.id,
  sa.scene_description,
  sa.created_at,
  u.clerk_user_id
FROM scene_analyses sa
JOIN users u ON sa.user_id = u.id
ORDER BY sa.created_at DESC;
```

### View Analysis Artifacts
```sql
SELECT 
  aa.artifact_type,
  aa.artifact_payload,
  sa.scene_description
FROM analysis_artifacts aa
JOIN scene_analyses sa ON aa.scene_analysis_id = sa.id
WHERE sa.id = 'YOUR_ANALYSIS_ID';
```

---

## 🎯 Key Features for Demo

### 1. **Explainable AI**
- Gemini ONLY extracts facts (not decisions)
- All risk/cost assessments use deterministic rules
- Every decision has a human-readable explanation

### 2. **Auditability**
- All intermediate outputs stored as artifacts
- Complete processing trail in database
- Timestamps on every record

### 3. **Clean Architecture**
- Each processing step is modular
- Easy to understand and modify
- No over-engineering

### 4. **Production-Ready**
- Proper error handling
- Input validation with Zod
- Type-safe with TypeScript
- Database transactions

---

## 🔧 Customization Points

### Adding New Risk Signals
Edit [lib/risk-analyzer.ts](lib/risk-analyzer.ts):
```typescript
// Add new risk condition
if (parsed.hasAnimals) {
  signals.push({
    name: 'Animal Wrangling',
    level: 'Medium',
    reason: 'Professional animal handlers required'
  });
}
```

### Adding Cost Drivers
Edit [lib/cost-analyzer.ts](lib/cost-analyzer.ts):
```typescript
case 'Animal Wrangling':
  drivers.push({
    category: 'Animal Services',
    impact: 'Animal trainers and veterinary oversight'
  });
  break;
```

### Modifying Gemini Parsing
Edit [lib/gemini-parser.ts](lib/gemini-parser.ts):
```typescript
// Add new field to interface
export interface GeminiParsedScene {
  hasCrowd: boolean;
  hasStunts: boolean;
  hasVehicles: boolean;
  hasAnimals: boolean; // NEW
  actionIntensity: 'Low' | 'Medium' | 'High';
  environmentComplexity: 'Low' | 'Medium' | 'High';
}
```

---

## 🐛 Troubleshooting

### "DATABASE_URL is not set"
- Check `.env.local` exists
- Verify DATABASE_URL is properly formatted
- Restart dev server after changing env vars

### "Unauthorized" error
- Ensure Clerk is configured
- Check user is logged in
- Verify Clerk middleware is active

### Gemini API errors
- Check GEMINI_API_KEY is valid
- Verify API quota hasn't been exceeded
- Check network connectivity

### Weather API errors
- Verify WEATHER_API_KEY is correct
- Ensure location format is "City, State" or "City, Country"
- Check month spelling is exact (e.g., "January" not "Jan")

---

## 📝 Next Steps

### For Frontend Integration
1. Call `/api/scene/analyze` from your dashboard
2. Display results in UI components
3. Store `analysisId` for historical viewing

### For History View
Create endpoint: `GET /api/scene/history`
```typescript
// Return user's past analyses
const analyses = await db.query.sceneAnalyses.findMany({
  where: eq(sceneAnalyses.userId, dbUser.id),
  orderBy: desc(sceneAnalyses.createdAt),
  limit: 20
});
```

### For Single Analysis Retrieval
Create endpoint: `GET /api/scene/analyze/[id]`
```typescript
// Return specific analysis by ID
const analysis = await db.query.sceneAnalyses.findFirst({
  where: eq(sceneAnalyses.id, params.id),
  with: { artifacts: true }
});
```

---

## 🎓 Architecture Philosophy

**This backend prioritizes**:
- ✅ Explainability over complexity
- ✅ Deterministic rules over ML uncertainty
- ✅ Auditability over black-box processing
- ✅ Clean code over clever code
- ✅ Production-readiness over prototyping

**Perfect for**:
- Hackathon demos
- Non-technical judges
- Quick iteration
- Future extensibility

---

## 📞 Support

For questions or issues:
1. Check [BACKEND_DOCS.md](BACKEND_DOCS.md) for API details
2. Review error messages in console
3. Verify database schema matches code
4. Check all env variables are set

---

**Built for SceneGuard** - Film Production Decision Support System
