# SceneGuard Backend - API Documentation

## Endpoint: POST /api/scene/analyze

### Description
Analyzes film production scenes using a combination of AI parsing, rule-based risk assessment, cost analysis, weather data, and production planning insights.

---

## Request Format

### Headers
- `Authorization`: Clerk authentication token (automatically handled by Clerk middleware)

### Body (JSON)
```json
{
  "sceneDescription": "A high-speed car chase through downtown streets at night, with multiple stunt drivers and background extras",
  "sceneCategory": "Outdoor",
  "timeOfDay": "Night",
  "location": "Los Angeles, CA",
  "month": "June"
}
```

### Field Descriptions
- **sceneDescription** (string, required): Detailed description of the scene (minimum 10 characters)
- **sceneCategory** (enum, required): `"Indoor"` | `"Outdoor"` | `"VFX"`
- **timeOfDay** (enum, optional): `"Day"` | `"Night"`
- **location** (string, conditional): Required for `Outdoor` scenes
- **month** (string, conditional): Required for `Outdoor` scenes (e.g., "January", "June")

### Validation Rules
- Indoor scenes: Ignore weather and location
- Outdoor scenes: MUST include `location` and `month`
- VFX scenes: Studio-controlled, no weather required
- timeOfDay applies to both Outdoor and VFX scenes

---

## Response Format

### Success Response (200 OK)
```json
{
  "sceneMetadata": {
    "category": "Outdoor",
    "timeOfDay": "Night",
    "location": "Los Angeles, CA",
    "month": "June",
    "description": "A high-speed car chase through downtown streets at night, with multiple stunt drivers and background extras"
  },
  "geminiParsing": {
    "hasCrowd": true,
    "hasStunts": true,
    "hasVehicles": true,
    "actionIntensity": "High",
    "environmentComplexity": "High"
  },
  "riskAnalysis": {
    "signals": [
      {
        "name": "Crowd Management",
        "level": "High",
        "reason": "Requires extra coordination, safety protocols, and additional crew"
      },
      {
        "name": "Stunt Coordination",
        "level": "High",
        "reason": "Requires specialized stunt coordinators, safety equipment, and insurance"
      },
      {
        "name": "Vehicle Operations",
        "level": "High",
        "reason": "High-speed vehicle action requires precision drivers and road closures"
      },
      {
        "name": "Action Intensity",
        "level": "High",
        "reason": "Complex choreography increases filming time and coordination needs"
      },
      {
        "name": "Environment Complexity",
        "level": "High",
        "reason": "Complex set design increases setup time and budget"
      },
      {
        "name": "Weather Dependency",
        "level": "High",
        "reason": "Outdoor shoots are vulnerable to weather delays and require contingency planning"
      },
      {
        "name": "Night Shooting",
        "level": "Medium",
        "reason": "Night shoots require additional lighting equipment and crew overtime"
      }
    ],
    "hasMultipleHighRisks": true,
    "multiplier": 1.3,
    "explanation": "Identified 7 risk signals. Multiple high-risk factors detected (6), applying 1.3x complexity multiplier for cumulative risk."
  },
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
        "category": "Specialized Personnel",
        "impact": "Professional stunt coordinators and performers command premium rates"
      },
      {
        "category": "Safety & Insurance",
        "impact": "Higher insurance premiums and safety equipment costs"
      },
      {
        "category": "Equipment & Permits",
        "impact": "Vehicle rentals, insurance, and location permits increase budget"
      },
      {
        "category": "Precision Drivers",
        "impact": "Specialized stunt drivers required for high-speed sequences"
      },
      {
        "category": "Extended Filming Time",
        "impact": "Complex choreography requires additional shooting days"
      },
      {
        "category": "Rehearsal Costs",
        "impact": "Pre-production rehearsal time increases labor costs"
      },
      {
        "category": "Art Department",
        "impact": "Complex set design and construction increases production design budget"
      },
      {
        "category": "Setup Time",
        "impact": "Additional prep days required for detailed environments"
      },
      {
        "category": "Schedule Contingency",
        "impact": "Weather delays may require buffer days and crew overtime"
      },
      {
        "category": "Backup Plans",
        "impact": "Alternative indoor locations may need to be secured"
      },
      {
        "category": "Lighting Equipment",
        "impact": "Additional lighting gear and generators required for night shoots"
      },
      {
        "category": "Crew Overtime",
        "impact": "Night differential pay increases labor costs"
      }
    ],
    "explanation": "Cost pressure is high based on 14 identified cost drivers. Multiple high-impact factors will significantly increase production budget. Consider prioritizing essential elements and exploring cost-effective alternatives."
  },
  "weatherFeasibility": {
    "applicable": true,
    "location": "Los Angeles, CA",
    "month": "June",
    "averageRainDays": 0,
    "averageWindSpeed": 7.2,
    "recommendation": "Favorable weather conditions. Standard outdoor production protocols apply."
  },
  "planningInsights": {
    "locationGuidance": "Filming in Los Angeles, CA requires scouting locations with reliable access to power, parking, and crew facilities. Ensure permits are secured well in advance and local regulations are reviewed.",
    "weatherPattern": "Historical data for June in Los Angeles, CA shows approximately 0 rainy days in the first half of the month, with average wind speeds of 7.2 mph. Generally favorable conditions for outdoor filming.",
    "productionRecommendation": "Night outdoor shoot: Schedule crew call times to maximize golden hour and night filming windows. Budget for substantial lighting equipment. Plan for crew fatigue with adequate breaks. Have backup indoor options ready in case of weather."
  },
  "analysisId": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2026-01-31T10:30:00.000Z"
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 400 Bad Request
```json
{
  "error": "Invalid input",
  "details": [
    {
      "path": ["location"],
      "message": "Outdoor scenes require both location and month"
    }
  ]
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Failed to parse scene description with Gemini"
}
```

---

## Database Persistence

### Tables Created
1. **users**: Stores Clerk user references
2. **scene_analyses**: Stores complete analysis results
3. **analysis_artifacts**: Stores intermediate processing outputs

### Artifacts Stored
- `gemini_parse`: Gemini AI parsing output
- `risk_engine`: Risk analysis intermediate data
- `cost_engine`: Cost analysis intermediate data
- `weather_snapshot`: Raw weather API response (if applicable)

---

## Processing Flow

1. **Auth Check**: Validates Clerk authentication, creates user if needed
2. **Input Validation**: Validates and sanitizes input using Zod
3. **Gemini Parsing**: Extracts structured facts from scene description
4. **Risk Analysis**: Applies deterministic rules to identify risk signals
5. **Cost Analysis**: Maps risk signals to cost drivers
6. **Weather Check**: Fetches weather data for outdoor scenes
7. **Planning Insights**: Generates templated production recommendations
8. **Persistence**: Saves analysis and artifacts to database
9. **Response**: Returns comprehensive JSON analysis

---

## Usage Example

### cURL Request
```bash
curl -X POST https://your-domain.com/api/scene/analyze \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
  -d '{
    "sceneDescription": "Interior coffee shop, daytime. Two actors having a conversation at a table.",
    "sceneCategory": "Indoor",
    "timeOfDay": "Day"
  }'
```

### TypeScript/Fetch Request
```typescript
const response = await fetch('/api/scene/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sceneDescription: 'Exterior park, children playing on swings during sunset',
    sceneCategory: 'Outdoor',
    timeOfDay: 'Day',
    location: 'New York, NY',
    month: 'September'
  })
});

const analysis = await response.json();
```

---

## Notes for Hackathon Judges

### Architecture Highlights
- **Clean separation of concerns**: Each processing step is in its own module
- **Explainable AI**: Gemini only parses facts; all decisions are rule-based
- **Auditability**: All intermediate outputs stored as artifacts
- **No over-engineering**: Simple, deterministic logic without ML training
- **Production-ready persistence**: Full database schema with proper relationships

### Demo-Ready Features
- Comprehensive error handling
- Detailed explanations for all risk and cost assessments
- Production-friendly recommendations (not technical jargon)
- Complete audit trail of processing steps
