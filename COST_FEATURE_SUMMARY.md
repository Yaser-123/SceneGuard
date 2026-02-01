# Cost Brainstorming & Structured Inputs - Implementation Summary

## Overview
Added cost brainstorming chatbot and optional structured cost inputs to SceneGuard project.

---

## PART 1: /bot PAGE (Brainstorming Only) ✅

### File: `/app/bot/page.tsx`
- Chat-style UI for cost brainstorming
- Stateless interaction (no DB writes)
- Authenticated users only
- Shows disclaimer that conversations don't affect backend

### File: `/app/api/bot/brainstorm/route.ts`
- Uses Gemini 2.0 Flash for brainstorming
- System prompt restricts to:
  - Cost optimization suggestions
  - Trade-off discussions
  - Qualitative advice only (NO budgets, NO currency)
- NO database access
- NO backend API calls

**Key Design:**
- Bot is ONLY for exploration and ideation
- Cannot affect scene analysis or cost calculations
- Conversations are not persisted

---

## PART 2: Dashboard Form Extension ✅

### File: `/app/dashboard/page.tsx`
Added 5 optional cost input fields:

1. **extrasRange**: "none" | "small" | "medium" | "large"
2. **controlledSet**: boolean (is location controlled?)
3. **scheduleFlexibility**: boolean (flexible schedule?)
4. **locationComplexity**: "city" | "remote"
5. **unionCrew**: boolean (union labor?)

**Key Rules:**
- All inputs are OPTIONAL
- Scene analysis works fine without them
- These are the ONLY cost data sent to backend
- Clearly separated from required scene inputs

---

## PART 3: Database Schema ✅

### File: `/db/schema.ts`
New table: `cost_inputs`

```typescript
export const costInputs = pgTable('cost_inputs', {
  id: uuid('id').defaultRandom().primaryKey(),
  sceneAnalysisId: uuid('scene_analysis_id')
    .notNull()
    .references(() => sceneAnalyses.id, { onDelete: 'cascade' })
    .unique(),
  extrasRange: text('extras_range'),
  controlledSet: boolean('controlled_set'),
  scheduleFlexibility: boolean('schedule_flexibility'),
  locationComplexity: text('location_complexity'),
  unionCrew: boolean('union_crew'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

**Relationship:**
- One-to-one with `sceneAnalyses`
- Cascade delete when analysis is deleted
- All fields nullable (optional inputs)

---

## PART 4: Backend Cost Logic ✅

### File: `/lib/cost-analyzer.ts`
Enhanced with deterministic cost input logic:

**Cost Input Processing:**
```typescript
// Large extras = +1 pressure modifier
if (costInputs.extrasRange === 'large') pressureModifier += 1;

// Medium extras = +0.5 pressure modifier
if (costInputs.extrasRange === 'medium') pressureModifier += 0.5;

// Non-controlled location = +0.5 pressure modifier
if (costInputs.controlledSet === false) pressureModifier += 0.5;

// Inflexible schedule = +0.5 pressure modifier
if (costInputs.scheduleFlexibility === false) pressureModifier += 0.5;

// Remote location = +1 pressure modifier
if (costInputs.locationComplexity === 'remote') pressureModifier += 1;

// Union crew = +0.5 pressure modifier
if (costInputs.unionCrew === true) pressureModifier += 0.5;
```

**Cost Pressure Determination (Deterministic):**
```typescript
if (highRiskCount >= 2 || (highRiskCount >= 1 && multiplier > 1.0) || pressureModifier >= 2) {
  costPressure = 'High';
} else if (highRiskCount === 1 || mediumRiskCount >= 2 || pressureModifier >= 1) {
  costPressure = 'Medium';
} else {
  costPressure = 'Low';
}
```

**Cost Drivers:**
Additional drivers added based on cost inputs:
- Large Cast (50+ extras)
- Moderate Cast (10-50 extras)
- Location Permits (non-controlled)
- Fixed Schedule (inflexible)
- Remote Location (travel/accommodation)
- Union Labor (union rates)

**Gemini Usage (Future Enhancement):**
- Interface includes `suggestions?: string` field
- Can be used to generate cost optimization tips
- MUST be based strictly on identified drivers
- MUST be labeled as "Suggestions", not decisions
- Does NOT affect costPressure or costDrivers

### File: `/app/api/scene/analyze/route.ts`
- Added `CostInputsSchema` validation
- Passes `costInputs` to `analyzeCostImpact()`
- Saves cost inputs to database when provided
- Maintains backward compatibility (inputs optional)

---

## PART 5: Example API Response

### Input (Dashboard Form):
```json
{
  "sceneDescription": "Outdoor market scene with 60 extras",
  "sceneCategory": "Outdoor",
  "location": "Rome, Italy",
  "month": "August",
  "timeOfDay": "Day",
  "costInputs": {
    "extrasRange": "large",
    "controlledSet": false,
    "scheduleFlexibility": true,
    "locationComplexity": "city",
    "unionCrew": false
  }
}
```

### Output (Cost Impact Section):
```json
{
  "costImpact": {
    "costPressure": "High",
    "drivers": [
      {
        "category": "Extras & Casting",
        "impact": "Significant cost increase for background actors and crowd coordinators"
      },
      {
        "category": "Crew Expansion",
        "impact": "Additional assistant directors and production assistants required"
      },
      {
        "category": "Large Cast",
        "impact": "50+ extras significantly increase casting, wardrobe, and catering costs"
      },
      {
        "category": "Location Permits",
        "impact": "Non-controlled locations require permits, security, and public coordination"
      }
    ],
    "explanation": "Cost pressure is high based on 4 identified cost drivers. Multiple high-impact factors will significantly increase production budget. Consider prioritizing essential elements and exploring cost-effective alternatives."
  }
}
```

---

## Database Migration

Run to create the `cost_inputs` table:

```bash
npm run db:push
```

---

## Key Design Principles

✅ **Separation of Concerns:**
- Bot = brainstorming only (no persistence)
- Dashboard inputs = backend cost calculations
- Clear boundaries, no confusion

✅ **Deterministic Logic:**
- Cost pressure calculated by rules
- Gemini suggestions are additive only
- Explainable to judges

✅ **Backward Compatibility:**
- Cost inputs are optional
- Existing scenes work without them
- Graceful degradation

✅ **No Numeric Costs:**
- Qualitative only (Low/Medium/High)
- No budgets, no currency
- Focused on decision support

---

## User Flow

1. **Brainstorm (Optional):** Visit `/bot` to explore ideas
2. **Analyze Scene:** Fill dashboard form with optional cost inputs
3. **View Results:** Cost Impact page shows enhanced analysis
4. **Review History:** Past analyses saved with cost inputs

---

## Testing Checklist

- [ ] Bot page loads and authenticates
- [ ] Bot responds to cost questions
- [ ] Dashboard accepts optional cost inputs
- [ ] Scene analysis works WITHOUT cost inputs (backward compat)
- [ ] Scene analysis works WITH cost inputs
- [ ] Cost pressure increases with more inputs
- [ ] Database stores cost inputs
- [ ] Cost Impact page renders correctly
- [ ] Migration runs successfully

---

This implementation is simple, safe, and explainable for hackathon judges.
