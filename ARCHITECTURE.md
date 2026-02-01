# SceneGuard Backend Architecture

## 📁 Project Structure

```
sceneguard/
│
├── app/
│   └── api/
│       └── scene/
│           └── analyze/
│               └── route.ts          # Main API endpoint
│
├── db/
│   ├── schema.ts                     # Drizzle ORM schema definitions
│   └── index.ts                      # Database client instance
│
├── lib/
│   ├── types.ts                      # Centralized TypeScript types
│   ├── gemini-parser.ts              # AI fact extraction (Gemini)
│   ├── risk-analyzer.ts              # Deterministic risk engine
│   ├── cost-analyzer.ts              # Qualitative cost analysis
│   ├── weather-service.ts            # Visual Crossing API client
│   └── planning-insights.ts          # Template-based recommendations
│
├── drizzle/                          # Auto-generated migrations (after npm run db:generate)
│
├── drizzle.config.ts                 # Drizzle ORM configuration
├── package.json                      # Dependencies + custom scripts
├── .env.local                        # Environment variables (not in git)
│
└── Documentation/
    ├── BACKEND_DOCS.md               # API reference
    ├── QUICK_START.md                # Setup guide
    ├── IMPLEMENTATION_SUMMARY.md     # Architecture overview
    └── DEPLOYMENT_CHECKLIST.md       # Deployment steps
```

---

## 🔄 Data Flow

### Request → Response Journey

```
Client Request
    ↓
┌─────────────────────────────────────────┐
│ app/api/scene/analyze/route.ts         │
│ ┌─────────────────────────────────────┐ │
│ │ 1. Auth Check (Clerk)               │ │
│ │    ├─ Get clerkUserId               │ │
│ │    └─ Find/Create DB user           │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ 2. Input Validation (Zod)           │ │
│ │    ├─ Validate sceneDescription     │ │
│ │    ├─ Check sceneCategory rules     │ │
│ │    └─ Ensure required fields        │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ lib/gemini-parser.ts                    │
│ ┌─────────────────────────────────────┐ │
│ │ parseSceneDescription()             │ │
│ │    ├─ Call Gemini API               │ │
│ │    ├─ Extract structured facts      │ │
│ │    └─ Return JSON (NO decisions)    │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ lib/risk-analyzer.ts                    │
│ ┌─────────────────────────────────────┐ │
│ │ analyzeRisks()                      │ │
│ │    ├─ Apply deterministic rules     │ │
│ │    ├─ Identify risk signals         │ │
│ │    ├─ Assign Low/Medium/High        │ │
│ │    ├─ Calculate multiplier          │ │
│ │    └─ Generate explanation          │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ lib/cost-analyzer.ts                    │
│ ┌─────────────────────────────────────┐ │
│ │ analyzeCostImpact()                 │ │
│ │    ├─ Map risks → cost drivers      │ │
│ │    ├─ Determine cost pressure       │ │
│ │    └─ Generate explanation          │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ lib/weather-service.ts                  │
│ ┌─────────────────────────────────────┐ │
│ │ getWeatherFeasibility() OR skip     │ │
│ │    ├─ Query Visual Crossing API     │ │
│ │    ├─ Calculate averages            │ │
│ │    └─ Generate recommendation       │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ lib/planning-insights.ts                │
│ ┌─────────────────────────────────────┐ │
│ │ generatePlanningInsights()          │ │
│ │    ├─ Location guidance             │ │
│ │    ├─ Weather pattern text          │ │
│ │    └─ Production recommendations    │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ db/ (Persistence Layer)                 │
│ ┌─────────────────────────────────────┐ │
│ │ 1. Insert scene_analyses            │ │
│ │    ├─ userId                        │ │
│ │    ├─ sceneDescription              │ │
│ │    └─ finalAnalysisJson (complete)  │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ 2. Insert analysis_artifacts        │ │
│ │    ├─ gemini_parse                  │ │
│ │    ├─ risk_engine                   │ │
│ │    ├─ cost_engine                   │ │
│ │    └─ weather_snapshot (if outdoor) │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
    ↓
JSON Response to Client
```

---

## 🔌 Module Responsibilities

### `app/api/scene/analyze/route.ts`
**Role**: Orchestration layer
- Auth validation
- Input validation
- Calling all processing modules in sequence
- Database persistence
- Response formatting

### `lib/gemini-parser.ts`
**Role**: AI fact extraction
- Calls Gemini API
- Strict JSON output
- NO decision-making
- Extracts: crowds, stunts, vehicles, intensity, complexity

### `lib/risk-analyzer.ts`
**Role**: Deterministic risk assessment
- Rule-based logic only
- Identifies risk signals
- Assigns Low/Medium/High levels
- Calculates cumulative multiplier
- Generates human-readable explanations

### `lib/cost-analyzer.ts`
**Role**: Qualitative cost mapping
- Maps risk signals → cost drivers
- Determines cost pressure (L/M/H)
- No numeric budgets
- Explains cost factors

### `lib/weather-service.ts`
**Role**: Weather data integration
- Visual Crossing API client
- Fetches historical weather patterns
- Calculates averages (rain, wind)
- Converts to production-friendly language

### `lib/planning-insights.ts`
**Role**: Template-based recommendations
- Location guidance
- Weather pattern analysis
- Production recommendations
- No AI - purely template logic

### `db/schema.ts`
**Role**: Database structure
- Table definitions
- Relationships
- Enums
- Type exports

### `db/index.ts`
**Role**: Database client
- Drizzle ORM instance
- Connection management
- Exports `db` for use across app

---

## 🎯 Design Principles

### 1. Single Responsibility
Each module does ONE thing well.

### 2. Explainability First
Every decision has a human-readable explanation.

### 3. No Black Boxes
All logic is deterministic and auditable.

### 4. Type Safety
TypeScript throughout for compile-time error checking.

### 5. Clean Dependencies
```
route.ts → libs → db
         ↓
    No circular deps
```

---

## 🧪 Testing Strategy

### Unit Tests (Recommended)
```typescript
// lib/risk-analyzer.test.ts
describe('analyzeRisks', () => {
  it('identifies crowd management risk', () => {
    const parsed = {
      hasCrowd: true,
      hasStunts: false,
      hasVehicles: false,
      actionIntensity: 'Low',
      environmentComplexity: 'Low'
    };
    
    const result = analyzeRisks(parsed, 'Indoor');
    expect(result.signals).toContainEqual({
      name: 'Crowd Management',
      level: 'High',
      reason: expect.any(String)
    });
  });
});
```

### Integration Tests
```typescript
// app/api/scene/analyze/route.test.ts
describe('POST /api/scene/analyze', () => {
  it('returns complete analysis for outdoor scene', async () => {
    const response = await POST(mockRequest);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('riskAnalysis');
    expect(response.body).toHaveProperty('costImpact');
    expect(response.body).toHaveProperty('weatherFeasibility');
  });
});
```

---

## 📊 Database Schema Visualization

```
┌──────────────────┐
│     users        │
├──────────────────┤
│ id (PK)          │
│ clerk_user_id    │◄─────┐
│ created_at       │      │
└──────────────────┘      │
                          │
                          │ (FK: user_id)
                          │
┌──────────────────────────┐
│   scene_analyses         │
├──────────────────────────┤
│ id (PK)                  │◄─────┐
│ user_id (FK)             │      │
│ scene_description        │      │
│ final_analysis_json      │      │
│ created_at               │      │
└──────────────────────────┘      │
                                  │ (FK: scene_analysis_id)
                                  │
┌──────────────────────────────────┐
│     analysis_artifacts           │
├──────────────────────────────────┤
│ id (PK)                          │
│ scene_analysis_id (FK)           │
│ artifact_type (ENUM)             │
│ artifact_payload (JSONB)         │
│ created_at                       │
└──────────────────────────────────┘

artifact_type ENUM:
- gemini_parse
- weather_snapshot
- risk_engine
- cost_engine
```

---

## 🔐 Security Considerations

### Authentication
- ✅ Clerk handles user auth
- ✅ No auth tokens stored in DB
- ✅ User records linked via clerk_user_id

### API Keys
- ✅ Stored in .env.local (not committed)
- ✅ Validated on server startup
- ✅ Never sent to client

### Input Validation
- ✅ Zod schema validation
- ✅ SQL injection protection (Drizzle ORM)
- ✅ XSS protection (Next.js default)

### Data Privacy
- ✅ User data isolated by user_id
- ✅ Cascade deletes configured
- ✅ No PII in analysis artifacts

---

## 📈 Performance Considerations

### Optimization Points
1. **Database Queries**: Single transaction for persistence
2. **API Calls**: Weather API only for outdoor scenes
3. **Gemini**: Flash model for speed
4. **Caching**: Consider Redis for weather data (future)

### Scalability
- Stateless API design
- Neon serverless DB auto-scales
- Each request is independent

---

## 🚀 Deployment Options

### Vercel (Recommended)
```bash
vercel deploy
```
Auto-detects Next.js, handles env vars

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

### Environment Variables (Production)
Ensure these are set in your deployment platform:
- `CLERK_SECRET_KEY`
- `GEMINI_API_KEY`
- `WEATHER_API_KEY`
- `DATABASE_URL`

---

## 📚 Further Reading

- [BACKEND_DOCS.md](BACKEND_DOCS.md) - API reference
- [QUICK_START.md](QUICK_START.md) - Setup guide
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Go-live steps
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Neon Serverless Docs](https://neon.tech/docs)

---

**Built with clarity and purpose for SceneGuard** 🎬
