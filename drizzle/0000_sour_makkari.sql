CREATE TYPE "public"."artifact_type" AS ENUM('gemini_parse', 'weather_snapshot', 'risk_engine', 'cost_engine');--> statement-breakpoint
CREATE TABLE "analysis_artifacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scene_analysis_id" uuid NOT NULL,
	"artifact_type" "artifact_type" NOT NULL,
	"artifact_payload" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scene_analyses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"scene_description" text NOT NULL,
	"final_analysis_json" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_clerk_user_id_unique" UNIQUE("clerk_user_id")
);
--> statement-breakpoint
ALTER TABLE "analysis_artifacts" ADD CONSTRAINT "analysis_artifacts_scene_analysis_id_scene_analyses_id_fk" FOREIGN KEY ("scene_analysis_id") REFERENCES "public"."scene_analyses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scene_analyses" ADD CONSTRAINT "scene_analyses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;