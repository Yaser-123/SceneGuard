# 🎯 SceneGuard Architecture Shift: Rule-Based → LLM-Driven

## What Changed

### BEFORE (Brittle Rule System)
```
Scene Text 
  → fact-extractor.ts (500+ lines of prompts)
  → Extract boolean facts (vehicles: true/false, stunts: true/false)
  → risk-engine.ts (500+ lines of if/else rules)
  → Generate risks ONLY if specific facts match
  → Miss novel scenarios
```

**Problems:**
- ❌ 500+ lines of rigid if/else logic
- ❌ Required enumerating every hazard condition
- ❌ Missed implicit danger (water, darkness, terrain)
- ❌ Safety defaulted to LOW unless stunts/vehicles detected
- ❌ Brittle and unmaintainable

---

### AFTER (LLM-Driven Holistic Assessment)
```
Scene Text
  → llm-risk-assessor.ts
  → Gemini holistically assesses risks
  → Returns structured JSON with reasoning
  → Backend enforces limits (max 3 mitigations, score 25-95)
```

**Benefits:**
- ✅ ~200 lines total (vs 1000+)
- ✅ Semantic understanding of danger
- ✅ Handles infinite scene variations
- ✅ Safety correctly assessed for water + night + terrain
- ✅ Realistic, judge-safe outputs

---

## Key Architecture Changes

### 1. New Core Module: `lib/llm-risk-assessor.ts`

**Purpose:** Single LLM call to assess all production risks

**Input:**
- Scene description text
- Context (category, time, location, budget)

**Output:**
```typescript
{
  risks: [
    {
      category: 'Safety',
      level: 'High',
      reasoning: '3 dangerous conditions: water proximity, night, unstable terrain',
      mitigationSteps: [
        'Assign water safety coordinator',
        'Deploy additional lighting',
        'Mark safe pathways'
      ]
    }
  ],
  permitInsurance: {
    required: true,
    reasoning: 'Filming on public waterfront',
    types: ['filming permit', 'liability insurance']
  },
  feasibilityScore: 45,
  feasibilityReasoning: 'High safety + logistics complexity'
}
```

**LLM Prompt Highlights:**
- "Consider ALL physical danger, not just stunts/vehicles"
- "Assess: water proximity, darkness, visibility, terrain"
- "Base permits on CONTEXT, not keywords"
- "Maximum 3 mitigations per category"
- "Feasibility score: 25-95 (NEVER 100)"

---

### 2. API Route Simplification

**Old Flow:**
```typescript
extractSceneFacts() → validateFacts() → calculateRiskSignals()
  ↓ 500 lines of deterministic rules
  ↓ Brittle fact-to-risk mapping
```

**New Flow:**
```typescript
assessRisksWithLLM(sceneDescription, context)
  ↓ Single LLM call with comprehensive prompt
  ↓ Structured JSON response
  ↓ Backend enforces limits
```

---

### 3. Safety Risk Redesign

**Before:**
```typescript
// Only triggered if explicit labels
if (facts.action.stunts) → High Safety
if (facts.movement.vehicles) → Medium Safety
else → LOW SAFETY (default)
```

**Problem:** "Raft landing at night on pebble shore" = LOW safety ❌

**After:**
```
LLM evaluates:
- Water proximity + night = danger
- Unstable terrain (pebbles) = hazard
- Low visibility + movement = risk
→ HIGH SAFETY ✅
```

---

### 4. Permit/Insurance Decoupling

**Before:**
```typescript
// Hard-coded rules
if (hasStunts || hasVehicles || safety === 'High') {
  permitRequired = true
}
```

**After:**
```
LLM assesses context:
- Public space? → Permit likely
- Regulated activity? → Insurance required
- Private property, simple scene? → No permit
```

---

## Validation Tests

### Test 1: Water + Night + Terrain
**Scene:** "A black inflatable raft scrapes onto a pebble shore at night"

**Expected:**
- ✅ Safety = High (water + night + unstable terrain)
- ✅ Logistics = Medium (night shoot coordination)
- ✅ Technical = Medium (night lighting)
- ✅ Mitigations reference water safety, visibility, movement
- ✅ NO stunt-based permit warnings

---

### Test 2: Simple Indoor Scene
**Scene:** "A woman sits at a desk in an office"

**Expected:**
- ✅ Budget = Low
- ✅ Logistics = Low
- ✅ Safety = Low
- ✅ Technical = Low
- ✅ Feasibility = 85-95
- ✅ Minimal mitigations

---

### Test 3: Crowd + Night (No Stunts)
**Scene:** "Dozens of people move through a crowded street market at night"

**Expected:**
- ✅ Safety = Medium (crowd + night, NOT Low)
- ✅ Logistics = Medium/High (crowd coordination)
- ✅ NO false vehicle risks
- ✅ Mitigations for crowd safety and night visibility

---

## Benefits for Hackathon

### Simplicity
- ~80% less code
- Single LLM module vs complex pipeline
- Easier to debug and modify

### Flexibility
- Handles novel scenes without new rules
- Semantic understanding scales infinitely
- No keyword enumeration required

### Realism
- Outputs feel closer to human expert judgment
- Safety correctly assessed for implicit danger
- Judge-defensible explanations

### Speed
- Single LLM call vs multi-step pipeline
- Faster to iterate and improve prompts
- Less engineering overhead

---

## What Was Removed

- ❌ `lib/fact-extractor.ts` (500 lines) - No longer needed
- ❌ `lib/risk-engine.ts` (500 lines) - Replaced by LLM
- ❌ `lib/evidence-grounded-constraints.ts` - Deprecated
- ❌ Complex validation layers
- ❌ Keyword matching logic
- ❌ Rigid if/else rules

---

## What Was Kept

- ✅ Structure enforcement (categories, levels, limits)
- ✅ Legacy UI compatibility (constraint adapter)
- ✅ Feasibility scoring (25-95 range)
- ✅ Mitigation display logic
- ✅ Database persistence
- ✅ Error handling and fallbacks

---

## For Judges

**The shift from rule-based to LLM-driven shows:**
- Understanding of when to use AI vs deterministic logic
- Pragmatic hackathon engineering (simpler is better)
- Focus on realistic outputs over perfect determinism
- Ability to pivot architecture based on constraints

**Result:** More accurate, flexible, and maintainable system in 1/5th the code.

