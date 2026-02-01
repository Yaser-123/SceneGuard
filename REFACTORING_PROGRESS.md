# 🎯 SceneGuard Refactoring Progress

## ✅ COMPLETED

### 1. **Strict Fact Extraction Module** (`lib/fact-extractor.ts`)
- ✅ Gemini NOW extracts ONLY observable facts
- ✅ NO risk assessment, NO inference, NO assumptions
- ✅ Structured schema: people, movement, action, environment, technical
- ✅ Temperature = 0.1 for factual consistency
- ✅ Validation layer to downgrade false claims

**Key Features:**
- `extractSceneFacts()` - Strict Gemini extraction
- `validateFacts()` - Downgrades claims without text evidence
- Returns `SceneFacts` with booleans and enums only

### 2. **Deterministic Risk Engine** (`lib/risk-engine.ts`)
- ✅ 100% fact-based signal generation
- ✅ ABSOLUTE RULES enforced:
  - Vehicle risks → ONLY if `movement.vehicles === true`
  - Stunt risks → ONLY if `action.stunts === true`
  - Permit risks → ONLY if vehicles, stunts, OR large crowd
  - Weather risks → ONLY if outdoor + weatherEvent !== "none"
- ✅ NO keyword inference
- ✅ NO default assumptions

**Key Features:**
- `calculateRiskSignals()` - Pure algorithmic risk logic
- Returns `RiskAnalysis` with explainability
- Tracks `factsUsed` and `factsIgnored` for transparency
- Signal-based scoring: High=1.0, Medium=0.5, Low=0.25

### 3. **Fixed Feasibility Score** (`lib/feasibility-score.ts`)
- ✅ NO MORE 100% scores
- ✅ Formula: `100 - (riskScore * 20)`
- ✅ Clamped between 25-95
- ✅ Realistic scoring that judges can trust

---

## 🚧 NEXT STEPS (Required)

### 4. **Update Main API Route** (`app/api/scene/analyze/route.ts`)

**Current State:** Uses old evidence-grounded-constraints.ts with inference
**Required Changes:**

```typescript
// STEP 1: Import new modules
import { extractSceneFacts, validateFacts } from '@/lib/fact-extractor';
import { calculateRiskSignals } from '@/lib/risk-engine';

// STEP 2: Replace Gemini constraint analysis with fact extraction
const sceneFacts = await extractSceneFacts(sceneDescription);
const validatedFacts = validateFacts(sceneFacts, sceneDescription);

// STEP 3: Use deterministic risk engine
const riskAnalysis = calculateRiskSignals(validatedFacts, {
  sceneCategory,
  timeOfDay,
  budgetConstraint,
  scheduleFlexibility,
});

// STEP 4: Calculate feasibility from risk score
const feasibilityScore = calculateFeasibilityScore({
  budget: /* derive from riskAnalysis.signals */,
  logistics: /* derive from riskAnalysis.signals */,
  safety: /* derive from riskAnalysis.signals */,
  technical: /* derive from riskAnalysis.signals */,
});

// STEP 5: Add explainability to response
constraintIntelligence: {
  // ... existing fields
  feasibilityScore,
  explainability: riskAnalysis.explainability,
  triggeredSignals: riskAnalysis.signals,
}
```

### 5. **Update Database Schema** (`db/schema.ts`)

Add new fields to store fact extraction and explainability:

```typescript
sceneFacts: jsonb, // Stores extracted facts from Gemini
riskSignals: jsonb, // Stores triggered risk signals
explainability: jsonb, // Stores what facts were used/ignored
```

Run `npm run db:push` after schema update.

### 6. **Update ResultsView Component** (`components/results-view.tsx`)

Add "Why This Was Flagged" section:

```tsx
{/* Explainability Section (WOW FACTOR) */}
{analysis.constraintIntelligence?.explainability && (
  <Card>
    <CardHeader>
      <CardTitle>Why This Was Flagged</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <h4>Facts Used:</h4>
        {analysis.constraintIntelligence.explainability.factsUsed.map(fact => (
          <div key={fact}>✔ {fact}</div>
        ))}
        
        <h4>Facts Not Triggered:</h4>
        {analysis.constraintIntelligence.explainability.factsIgnored.map(fact => (
          <div key={fact}>✖ {fact}</div>
        ))}
      </div>
    </CardContent>
  </Card>
)}
```

### 7. **Remove Old Modules**

After API route is updated, DEPRECATE or DELETE:
- `lib/evidence-grounded-constraints.ts` (replaced by fact-extractor.ts)
- Any keyword-based risk inference code
- Any "if outdoor then permit" assumptions

---

## 🎯 TESTING CHECKLIST

After refactoring, test these scenarios:

### Test Case 1: Simple Indoor Scene
**Input:** "A woman sits at a desk in an office."
**Expected:**
- ✅ NO vehicle risks
- ✅ NO permit risks
- ✅ NO weather risks
- ✅ Feasibility score: 85-95 (Low Risk)

### Test Case 2: Outdoor Dust Storm (Current Bug)
**Input:** "A man walks through a desert dust storm."
**Expected:**
- ✅ High Safety risk: Environmental hazard (dust storm)
- ✅ NO vehicle risks
- ✅ NO permit risks (no vehicles/stunts)
- ✅ Feasibility score: 50-65 (Medium Risk)

### Test Case 3: Stunt Scene
**Input:** "A stunt driver jumps a car off a ramp."
**Expected:**
- ✅ High Safety risk: Stunts
- ✅ High Safety risk: Vehicles
- ✅ High Logistics risk: Vehicle coordination
- ✅ Budget risk: Vehicle costs
- ✅ Feasibility score: 25-40 (High Risk)

### Test Case 4: Large Crowd
**Input:** "Hundreds of people gather in Times Square."
**Expected:**
- ✅ High Budget risk: Large crowd
- ✅ High Logistics risk: Crowd management
- ✅ Permit requirements triggered
- ✅ Feasibility score: 35-50 (High Risk)

---

## 📊 EXPECTED OUTCOMES

### Before Refactoring (Current Issues):
- ❌ 100% feasibility scores
- ❌ Vehicle risks without vehicles
- ❌ Permit warnings on simple scenes
- ❌ Generic hallucinated risks
- ❌ No explainability

### After Refactoring (Target):
- ✅ Realistic feasibility (25-95 range)
- ✅ Risks ONLY from explicit facts
- ✅ No false positives
- ✅ Full explainability ("Why This Was Flagged")
- ✅ Judge-defensible outputs

---

## 🚀 DEPLOYMENT PRIORITY

1. **CRITICAL:** Update API route with fact extraction
2. **CRITICAL:** Test all 4 test cases
3. **HIGH:** Add explainability to UI
4. **MEDIUM:** Database schema update
5. **LOW:** Remove deprecated modules

---

## 💡 WOW FACTOR IMPLEMENTATION

**Option A: Explainability Toggle (Recommended - 15 min)**

Add to ResultsView:

```tsx
const [showExplainability, setShowExplainability] = useState(false);

<Button onClick={() => setShowExplainability(!showExplainability)}>
  {showExplainability ? 'Hide' : 'Show'} Why This Was Flagged
</Button>

{showExplainability && (
  <div className="mt-4 p-4 bg-neutral-800 rounded">
    <h3>Triggered Signals:</h3>
    {/* Show factsUsed with checkmarks */}
    
    <h3>Not Triggered:</h3>
    {/* Show factsIgnored with X marks */}
  </div>
)}
```

This gives judges transparency without cluttering the default view.

---

## 📝 NOTES

- Keep existing cost/weather analyzers for now (they're separate)
- Focus on constraint analysis pipeline first
- Gemini temperature is set to 0.1 for consistency
- All boolean flags default to FALSE unless explicitly extracted
- Risk multiplier caps at 1.8x (prevents unrealistic cost inflation)

---

**Status:** Foundation complete. Ready for API integration and testing.
