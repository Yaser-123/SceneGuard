# Quick Reference Guide - SceneGuard Dynamic Dashboard

## What Changed Today

### 1. Fixed Gemini Quota Issue ✅
**Problem:** 429 errors after 20 requests/day
**Solution:** Changed all 6 files to use `gemini-2.5-flash-lite` (unlimited quota)

### 2. Created Database Server Actions ✅
**File:** `lib/db-actions.ts`
**Functions:**
- `getAnalysisHistory()` - Fetch all user analyses
- `getAnalysisById(id)` - Get specific analysis
- `getLatestAnalysis()` - Get most recent
- `deleteAnalysis(id)` - Remove analysis

### 3. Updated All Dashboard Pages ✅

#### History Page
- Now uses real DB data via `getAnalysisHistory()`
- Shows newest first, clickable for details
- Dynamic stats: total analyzed, avg feasibility, high risk count

#### Risk Signals Page
- Added Recharts bar chart showing risk distribution
- Color-coded: Red (High), Yellow (Medium), Green (Low)
- All data from `analysis.riskAnalysis.signals`

#### Cost Impact Page
- Added horizontal bar chart for cost drivers
- Shows all drivers from `analysis.costImpact.drivers`
- No mock data - 100% backend-driven

#### Weather Page
- Already conditional (hides for Indoor/VFX)
- Shows only when `weatherFeasibility.applicable === true`

---

## How to Test

### 1. Start the App
```bash
npm run dev
# Running on http://localhost:3000
```

### 2. Sign In
- Use Clerk authentication
- Your user data is isolated in DB

### 3. Analyze a Scene
Go to home page and analyze:
```
"Car chase through downtown Los Angeles at night in December"
```

### 4. View Dashboard
- **Risk Signals:** See bar chart of High/Medium/Low risks
- **Cost Impact:** See horizontal bar chart of cost drivers
- **Weather:** See seasonal data for LA in December
- **History:** See your past analyses, click to view details

---

## Key Files

### Server Actions
```typescript
// lib/db-actions.ts
import { getAnalysisHistory } from '@/lib/db-actions'

const analyses = await getAnalysisHistory() // Returns all user analyses
```

### Dashboard Pages
```typescript
// All pages use useAnalysis() context
import { useAnalysis } from '@/lib/analysis-context'

const { analysis } = useAnalysis()
```

### Charts
```typescript
import { BarChart, Bar, XAxis, YAxis, Cell } from 'recharts'

// Risk Signals - Vertical bars
<BarChart data={riskDistribution}>
  <Bar dataKey="count">
    {data.map((entry, i) => <Cell fill={getColor(entry.level)} />)}
  </Bar>
</BarChart>

// Cost Impact - Horizontal bars
<BarChart data={driverChartData} layout="vertical">
  <Bar dataKey="value">
    {data.map((entry, i) => <Cell fill="#3b82f6" />)}
  </Bar>
</BarChart>
```

---

## Data Structure

### From Database
```typescript
interface AnalysisHistory {
  id: string
  sceneDescription: string
  category: string | null
  feasibilityScore: number | null
  createdAt: Date
  finalAnalysisJson: {
    riskAnalysis: {
      multiplier: number
      signals: RiskSignal[]
      explanation: string
    }
    costImpact: {
      costPressure: 'Low' | 'Medium' | 'High'
      drivers: CostDriver[]
      explanation: string
    }
    weatherFeasibility: {
      applicable: boolean
      location?: string
      month?: string
      recommendation?: string
    }
  }
}
```

---

## Troubleshooting

### Issue: Charts not showing
**Check:** Recharts installed?
```bash
npm list recharts
# Should show: recharts@2.15.4
```

### Issue: No data in history
**Cause:** Need to analyze a scene first
**Solution:** Go to home page → analyze scene → check history

### Issue: Weather always hidden
**Cause:** Scene is Indoor/VFX
**Solution:** Analyze Outdoor scene (e.g., "Beach sunset scene in July")

### Issue: 429 Gemini errors
**Check:** All 6 files using `gemini-2.5-flash-lite`?
```bash
# Search for old model
grep -r "gemini-2.5-flash" lib/ app/
# Should return nothing
```

---

## Color Scheme (Dark Theme)

### Risk Levels
- **High:** `#ef4444` (red-500)
- **Medium:** `#eab308` (yellow-500)
- **Low:** `#22c55e` (green-500)

### Backgrounds
- **Card:** `bg-neutral-900` `border-neutral-700`
- **Nested:** `bg-neutral-800`
- **Grid:** `stroke="#404040"`

### Text
- **Primary:** `text-white`
- **Secondary:** `text-neutral-400`
- **Accent:** `text-blue-400`

---

## Demo Script

### For Judges (2 minutes)

1. **Login (5 sec)**
   - Show Clerk authentication

2. **Analyze Scene (30 sec)**
   - Input: "Underwater diving scene in Maldives during monsoon season"
   - Show AI processing
   - Display feasibility score (e.g., 62%)

3. **Risk Signals (30 sec)**
   - Show bar chart: 3 High, 2 Medium, 1 Low
   - Highlight: Underwater breathing, weather conditions, equipment

4. **Cost Impact (30 sec)**
   - Show horizontal bar chart of 5 cost drivers
   - Highlight: Specialized equipment, location travel, weather contingency

5. **Weather (15 sec)**
   - Show monsoon data for Maldives
   - Recommendation: "Avoid June-September"

6. **History (15 sec)**
   - Show 3 past analyses
   - Click one → modal with full details

**Key Points to Emphasize:**
- "Every number is AI-generated, no mock data"
- "Charts update in real-time from database"
- "Weather conditionally renders based on scene type"
- "Ready for production use"

---

## Deployment Checklist

### Before Production
- [ ] Set environment variables (GEMINI_API_KEY, DATABASE_URL, CLERK_*)
- [ ] Run `npm run build` (zero errors)
- [ ] Test all dashboard pages
- [ ] Verify authentication works
- [ ] Check mobile responsiveness
- [ ] Test error states (no data, API failures)

### Environment Variables Required
```env
GEMINI_API_KEY=your_google_ai_key
DATABASE_URL=your_neon_db_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```

---

*Quick Reference Created: January 31, 2026*
*Status: ✅ Ready for demo*
