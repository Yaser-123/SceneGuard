import { pgTable, text, timestamp, uuid, jsonb, pgEnum, boolean } from 'drizzle-orm/pg-core';

// === USERS TABLE ===
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  clerkUserId: text('clerk_user_id').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// === SCENE ANALYSES TABLE ===
export const sceneAnalyses = pgTable('scene_analyses', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  sceneDescription: text('scene_description').notNull(),
  finalAnalysisJson: jsonb('final_analysis_json').notNull(),
  constraintAnalysis: jsonb('constraint_analysis'), // Evidence-grounded constraint levels and reasoning
  evidenceMap: jsonb('evidence_map'), // Verbatim quotes from scene text
  interactionMatrix: jsonb('interaction_matrix'), // Deterministic constraint interaction analysis
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// === COST INPUTS TABLE ===
export const costInputs = pgTable('cost_inputs', {
  id: uuid('id').defaultRandom().primaryKey(),
  sceneAnalysisId: uuid('scene_analysis_id')
    .notNull()
    .references(() => sceneAnalyses.id, { onDelete: 'cascade' })
    .unique(),
  extrasRange: text('extras_range'), // "none" | "small" | "medium" | "large"
  controlledSet: boolean('controlled_set'),
  scheduleFlexibility: boolean('schedule_flexibility'),
  locationComplexity: text('location_complexity'), // "city" | "remote" | "studio"
  unionCrew: boolean('union_crew'),
  budgetConstraint: text('budget_constraint'), // "highly_constrained" | "moderately_constrained" | "flexible" | "not_specified"
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// === ARTIFACT TYPE ENUM ===
export const artifactTypeEnum = pgEnum('artifact_type', [
  'gemini_parse',
  'weather_snapshot',
  'risk_engine',
  'cost_engine',
]);

// === ANALYSIS ARTIFACTS TABLE ===
export const analysisArtifacts = pgTable('analysis_artifacts', {
  id: uuid('id').defaultRandom().primaryKey(),
  sceneAnalysisId: uuid('scene_analysis_id')
    .notNull()
    .references(() => sceneAnalyses.id, { onDelete: 'cascade' }),
  artifactType: artifactTypeEnum('artifact_type').notNull(),
  artifactPayload: jsonb('artifact_payload').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// === CHAT MESSAGES TABLE ===
export const chatMessages = pgTable('chat_messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  role: text('role').notNull(), // 'user' | 'assistant'
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// === TYPE EXPORTS FOR TYPESCRIPT ===
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type SceneAnalysis = typeof sceneAnalyses.$inferSelect;
export type NewSceneAnalysis = typeof sceneAnalyses.$inferInsert;

export type AnalysisArtifact = typeof analysisArtifacts.$inferSelect;
export type NewAnalysisArtifact = typeof analysisArtifacts.$inferInsert;

export type CostInput = typeof costInputs.$inferSelect;
export type NewCostInput = typeof costInputs.$inferInsert;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type NewChatMessage = typeof chatMessages.$inferInsert;
