import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en', 'fr');
  CREATE TYPE "public"."enum_projects_status_color" AS ENUM('var(--add)', 'var(--accent2)', 'var(--warn)', 'var(--del)', 'var(--dim)');
  CREATE TYPE "public"."enum_site_content_now_rows_sign" AS ENUM(' ', '+', '-');
  CREATE TYPE "public"."enum_site_content_soft_skills_tint" AS ENUM('var(--accent)', 'var(--accent2)', 'var(--warn)', 'var(--add)');
  CREATE TYPE "public"."enum_site_content_stack_tint" AS ENUM('var(--accent)', 'var(--accent2)', 'var(--warn)', 'var(--add)');
  CREATE TYPE "public"."enum_ui_text_intro_hints_key" AS ENUM('try', 'note');
  CREATE TABLE "projects_detail" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "projects_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "projects_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"path" varchar
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"stack" varchar NOT NULL,
  	"year" varchar DEFAULT '—',
  	"status_color" "enum_projects_status_color" DEFAULT 'var(--add)' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "projects_locales" (
  	"name" varchar NOT NULL,
  	"what" varchar NOT NULL,
  	"status" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "roles_detail" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "roles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "roles_locales" (
  	"when" varchar NOT NULL,
  	"what" varchar NOT NULL,
  	"where" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "education" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"when" varchar NOT NULL,
  	"where" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "education_locales" (
  	"what" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumb_url" varchar,
  	"sizes_thumb_width" numeric,
  	"sizes_thumb_height" numeric,
  	"sizes_thumb_mime_type" varchar,
  	"sizes_thumb_filesize" numeric,
  	"sizes_thumb_filename" varchar,
  	"sizes_full_url" varchar,
  	"sizes_full_width" numeric,
  	"sizes_full_height" numeric,
  	"sizes_full_mime_type" varchar,
  	"sizes_full_filesize" numeric,
  	"sizes_full_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"totp_secret" varchar,
  	"totp_enabled" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_mcp_api_keys" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"label" varchar,
  	"description" varchar,
  	"projects_find" boolean DEFAULT false,
  	"projects_create" boolean DEFAULT false,
  	"projects_update" boolean DEFAULT false,
  	"projects_delete" boolean DEFAULT false,
  	"roles_find" boolean DEFAULT false,
  	"roles_create" boolean DEFAULT false,
  	"roles_update" boolean DEFAULT false,
  	"roles_delete" boolean DEFAULT false,
  	"education_find" boolean DEFAULT false,
  	"education_create" boolean DEFAULT false,
  	"education_update" boolean DEFAULT false,
  	"education_delete" boolean DEFAULT false,
  	"media_find" boolean DEFAULT false,
  	"media_create" boolean DEFAULT false,
  	"media_update" boolean DEFAULT false,
  	"site_content_find" boolean DEFAULT false,
  	"site_content_update" boolean DEFAULT false,
  	"ui_text_find" boolean DEFAULT false,
  	"ui_text_update" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"enable_a_p_i_key" boolean,
  	"api_key" varchar,
  	"api_key_index" varchar
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"projects_id" integer,
  	"roles_id" integer,
  	"education_id" integer,
  	"media_id" integer,
  	"users_id" integer,
  	"payload_mcp_api_keys_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"payload_mcp_api_keys_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_content_now_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"num" numeric NOT NULL,
  	"sign" "enum_site_content_now_rows_sign" DEFAULT ' ' NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "site_content_soft_skills_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "site_content_soft_skills" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"group" varchar NOT NULL,
  	"tint" "enum_site_content_soft_skills_tint" DEFAULT 'var(--accent)'
  );
  
  CREATE TABLE "site_content_stack_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "site_content_stack" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"group" varchar NOT NULL,
  	"tint" "enum_site_content_stack_tint" DEFAULT 'var(--accent)'
  );
  
  CREATE TABLE "site_content_rates" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "site_content_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "site_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar DEFAULT 'Kévin Riou' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_content_locales" (
  	"tagline" varchar NOT NULL,
  	"location" varchar,
  	"about" varchar NOT NULL,
  	"headline" varchar NOT NULL,
  	"contact_footer" varchar,
  	"resume" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "ui_text_intro_hints" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" "enum_ui_text_intro_hints_key" DEFAULT 'try' NOT NULL,
  	"label" varchar,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "ui_text_commands" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"command" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"hidden" boolean DEFAULT false
  );
  
  CREATE TABLE "ui_text_wizard_steps_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"hint" varchar,
  	"icon" varchar
  );
  
  CREATE TABLE "ui_text_wizard_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"group" varchar NOT NULL,
  	"question" varchar NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "ui_text_themes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"hint" varchar
  );
  
  CREATE TABLE "ui_text_voices" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"hint" varchar
  );
  
  CREATE TABLE "ui_text_strings" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "ui_text" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "ui_text_locales" (
  	"prompt_placeholder" varchar NOT NULL,
  	"banner" varchar,
  	"mode_hint" varchar,
  	"intro_warm" varchar,
  	"intro_brief" varchar,
  	"intro_terse" varchar,
  	"help_warm" varchar,
  	"help_brief" varchar,
  	"help_terse" varchar,
  	"projects_warm" varchar,
  	"projects_brief" varchar,
  	"projects_terse" varchar,
  	"about_warm" varchar,
  	"about_brief" varchar,
  	"about_terse" varchar,
  	"skills_warm" varchar,
  	"skills_brief" varchar,
  	"skills_terse" varchar,
  	"stack_warm" varchar,
  	"stack_brief" varchar,
  	"stack_terse" varchar,
  	"rates_warm" varchar,
  	"rates_brief" varchar,
  	"rates_terse" varchar,
  	"contact_warm" varchar,
  	"contact_brief" varchar,
  	"contact_terse" varchar,
  	"now_warm" varchar,
  	"now_brief" varchar,
  	"now_terse" varchar,
  	"photos_warm" varchar,
  	"photos_brief" varchar,
  	"photos_terse" varchar,
  	"no_match_warm" varchar,
  	"no_match_brief" varchar,
  	"no_match_terse" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "projects_detail" ADD CONSTRAINT "projects_detail_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_links" ADD CONSTRAINT "projects_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_images" ADD CONSTRAINT "projects_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_images" ADD CONSTRAINT "projects_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_locales" ADD CONSTRAINT "projects_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "roles_detail" ADD CONSTRAINT "roles_detail_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "roles_locales" ADD CONSTRAINT "roles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "education_locales" ADD CONSTRAINT "education_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."education"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_mcp_api_keys" ADD CONSTRAINT "payload_mcp_api_keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_roles_fk" FOREIGN KEY ("roles_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_education_fk" FOREIGN KEY ("education_id") REFERENCES "public"."education"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_mcp_api_keys_fk" FOREIGN KEY ("payload_mcp_api_keys_id") REFERENCES "public"."payload_mcp_api_keys"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_payload_mcp_api_keys_fk" FOREIGN KEY ("payload_mcp_api_keys_id") REFERENCES "public"."payload_mcp_api_keys"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_content_now_rows" ADD CONSTRAINT "site_content_now_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_content_soft_skills_items" ADD CONSTRAINT "site_content_soft_skills_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_content_soft_skills"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_content_soft_skills" ADD CONSTRAINT "site_content_soft_skills_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_content_stack_items" ADD CONSTRAINT "site_content_stack_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_content_stack"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_content_stack" ADD CONSTRAINT "site_content_stack_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_content_rates" ADD CONSTRAINT "site_content_rates_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_content_contact" ADD CONSTRAINT "site_content_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_content_locales" ADD CONSTRAINT "site_content_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ui_text_intro_hints" ADD CONSTRAINT "ui_text_intro_hints_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ui_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ui_text_commands" ADD CONSTRAINT "ui_text_commands_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ui_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ui_text_wizard_steps_options" ADD CONSTRAINT "ui_text_wizard_steps_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ui_text_wizard_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ui_text_wizard_steps" ADD CONSTRAINT "ui_text_wizard_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ui_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ui_text_themes" ADD CONSTRAINT "ui_text_themes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ui_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ui_text_voices" ADD CONSTRAINT "ui_text_voices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ui_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ui_text_strings" ADD CONSTRAINT "ui_text_strings_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ui_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ui_text_locales" ADD CONSTRAINT "ui_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ui_text"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects_detail_order_idx" ON "projects_detail" USING btree ("_order");
  CREATE INDEX "projects_detail_parent_id_idx" ON "projects_detail" USING btree ("_parent_id");
  CREATE INDEX "projects_detail_locale_idx" ON "projects_detail" USING btree ("_locale");
  CREATE INDEX "projects_links_order_idx" ON "projects_links" USING btree ("_order");
  CREATE INDEX "projects_links_parent_id_idx" ON "projects_links" USING btree ("_parent_id");
  CREATE INDEX "projects_links_locale_idx" ON "projects_links" USING btree ("_locale");
  CREATE INDEX "projects_images_order_idx" ON "projects_images" USING btree ("_order");
  CREATE INDEX "projects_images_parent_id_idx" ON "projects_images" USING btree ("_parent_id");
  CREATE INDEX "projects_images_image_idx" ON "projects_images" USING btree ("image_id");
  CREATE UNIQUE INDEX "projects_key_idx" ON "projects" USING btree ("key");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE UNIQUE INDEX "projects_locales_locale_parent_id_unique" ON "projects_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "roles_detail_order_idx" ON "roles_detail" USING btree ("_order");
  CREATE INDEX "roles_detail_parent_id_idx" ON "roles_detail" USING btree ("_parent_id");
  CREATE INDEX "roles_detail_locale_idx" ON "roles_detail" USING btree ("_locale");
  CREATE UNIQUE INDEX "roles_key_idx" ON "roles" USING btree ("key");
  CREATE INDEX "roles_updated_at_idx" ON "roles" USING btree ("updated_at");
  CREATE INDEX "roles_created_at_idx" ON "roles" USING btree ("created_at");
  CREATE UNIQUE INDEX "roles_locales_locale_parent_id_unique" ON "roles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "education_updated_at_idx" ON "education" USING btree ("updated_at");
  CREATE INDEX "education_created_at_idx" ON "education" USING btree ("created_at");
  CREATE UNIQUE INDEX "education_locales_locale_parent_id_unique" ON "education_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumb_sizes_thumb_filename_idx" ON "media" USING btree ("sizes_thumb_filename");
  CREATE INDEX "media_sizes_full_sizes_full_filename_idx" ON "media" USING btree ("sizes_full_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "payload_mcp_api_keys_user_idx" ON "payload_mcp_api_keys" USING btree ("user_id");
  CREATE INDEX "payload_mcp_api_keys_updated_at_idx" ON "payload_mcp_api_keys" USING btree ("updated_at");
  CREATE INDEX "payload_mcp_api_keys_created_at_idx" ON "payload_mcp_api_keys" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_roles_id_idx" ON "payload_locked_documents_rels" USING btree ("roles_id");
  CREATE INDEX "payload_locked_documents_rels_education_id_idx" ON "payload_locked_documents_rels" USING btree ("education_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_payload_mcp_api_keys_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_mcp_api_keys_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_rels_payload_mcp_api_keys_id_idx" ON "payload_preferences_rels" USING btree ("payload_mcp_api_keys_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_content_now_rows_order_idx" ON "site_content_now_rows" USING btree ("_order");
  CREATE INDEX "site_content_now_rows_parent_id_idx" ON "site_content_now_rows" USING btree ("_parent_id");
  CREATE INDEX "site_content_now_rows_locale_idx" ON "site_content_now_rows" USING btree ("_locale");
  CREATE INDEX "site_content_soft_skills_items_order_idx" ON "site_content_soft_skills_items" USING btree ("_order");
  CREATE INDEX "site_content_soft_skills_items_parent_id_idx" ON "site_content_soft_skills_items" USING btree ("_parent_id");
  CREATE INDEX "site_content_soft_skills_items_locale_idx" ON "site_content_soft_skills_items" USING btree ("_locale");
  CREATE INDEX "site_content_soft_skills_order_idx" ON "site_content_soft_skills" USING btree ("_order");
  CREATE INDEX "site_content_soft_skills_parent_id_idx" ON "site_content_soft_skills" USING btree ("_parent_id");
  CREATE INDEX "site_content_soft_skills_locale_idx" ON "site_content_soft_skills" USING btree ("_locale");
  CREATE INDEX "site_content_stack_items_order_idx" ON "site_content_stack_items" USING btree ("_order");
  CREATE INDEX "site_content_stack_items_parent_id_idx" ON "site_content_stack_items" USING btree ("_parent_id");
  CREATE INDEX "site_content_stack_items_locale_idx" ON "site_content_stack_items" USING btree ("_locale");
  CREATE INDEX "site_content_stack_order_idx" ON "site_content_stack" USING btree ("_order");
  CREATE INDEX "site_content_stack_parent_id_idx" ON "site_content_stack" USING btree ("_parent_id");
  CREATE INDEX "site_content_stack_locale_idx" ON "site_content_stack" USING btree ("_locale");
  CREATE INDEX "site_content_rates_order_idx" ON "site_content_rates" USING btree ("_order");
  CREATE INDEX "site_content_rates_parent_id_idx" ON "site_content_rates" USING btree ("_parent_id");
  CREATE INDEX "site_content_rates_locale_idx" ON "site_content_rates" USING btree ("_locale");
  CREATE INDEX "site_content_contact_order_idx" ON "site_content_contact" USING btree ("_order");
  CREATE INDEX "site_content_contact_parent_id_idx" ON "site_content_contact" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_content_locales_locale_parent_id_unique" ON "site_content_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "ui_text_intro_hints_order_idx" ON "ui_text_intro_hints" USING btree ("_order");
  CREATE INDEX "ui_text_intro_hints_parent_id_idx" ON "ui_text_intro_hints" USING btree ("_parent_id");
  CREATE INDEX "ui_text_intro_hints_locale_idx" ON "ui_text_intro_hints" USING btree ("_locale");
  CREATE INDEX "ui_text_commands_order_idx" ON "ui_text_commands" USING btree ("_order");
  CREATE INDEX "ui_text_commands_parent_id_idx" ON "ui_text_commands" USING btree ("_parent_id");
  CREATE INDEX "ui_text_commands_locale_idx" ON "ui_text_commands" USING btree ("_locale");
  CREATE INDEX "ui_text_wizard_steps_options_order_idx" ON "ui_text_wizard_steps_options" USING btree ("_order");
  CREATE INDEX "ui_text_wizard_steps_options_parent_id_idx" ON "ui_text_wizard_steps_options" USING btree ("_parent_id");
  CREATE INDEX "ui_text_wizard_steps_options_locale_idx" ON "ui_text_wizard_steps_options" USING btree ("_locale");
  CREATE INDEX "ui_text_wizard_steps_order_idx" ON "ui_text_wizard_steps" USING btree ("_order");
  CREATE INDEX "ui_text_wizard_steps_parent_id_idx" ON "ui_text_wizard_steps" USING btree ("_parent_id");
  CREATE INDEX "ui_text_wizard_steps_locale_idx" ON "ui_text_wizard_steps" USING btree ("_locale");
  CREATE INDEX "ui_text_themes_order_idx" ON "ui_text_themes" USING btree ("_order");
  CREATE INDEX "ui_text_themes_parent_id_idx" ON "ui_text_themes" USING btree ("_parent_id");
  CREATE INDEX "ui_text_themes_locale_idx" ON "ui_text_themes" USING btree ("_locale");
  CREATE INDEX "ui_text_voices_order_idx" ON "ui_text_voices" USING btree ("_order");
  CREATE INDEX "ui_text_voices_parent_id_idx" ON "ui_text_voices" USING btree ("_parent_id");
  CREATE INDEX "ui_text_voices_locale_idx" ON "ui_text_voices" USING btree ("_locale");
  CREATE INDEX "ui_text_strings_order_idx" ON "ui_text_strings" USING btree ("_order");
  CREATE INDEX "ui_text_strings_parent_id_idx" ON "ui_text_strings" USING btree ("_parent_id");
  CREATE INDEX "ui_text_strings_locale_idx" ON "ui_text_strings" USING btree ("_locale");
  CREATE UNIQUE INDEX "ui_text_locales_locale_parent_id_unique" ON "ui_text_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "projects_detail" CASCADE;
  DROP TABLE "projects_links" CASCADE;
  DROP TABLE "projects_images" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "projects_locales" CASCADE;
  DROP TABLE "roles_detail" CASCADE;
  DROP TABLE "roles" CASCADE;
  DROP TABLE "roles_locales" CASCADE;
  DROP TABLE "education" CASCADE;
  DROP TABLE "education_locales" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_mcp_api_keys" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_content_now_rows" CASCADE;
  DROP TABLE "site_content_soft_skills_items" CASCADE;
  DROP TABLE "site_content_soft_skills" CASCADE;
  DROP TABLE "site_content_stack_items" CASCADE;
  DROP TABLE "site_content_stack" CASCADE;
  DROP TABLE "site_content_rates" CASCADE;
  DROP TABLE "site_content_contact" CASCADE;
  DROP TABLE "site_content" CASCADE;
  DROP TABLE "site_content_locales" CASCADE;
  DROP TABLE "ui_text_intro_hints" CASCADE;
  DROP TABLE "ui_text_commands" CASCADE;
  DROP TABLE "ui_text_wizard_steps_options" CASCADE;
  DROP TABLE "ui_text_wizard_steps" CASCADE;
  DROP TABLE "ui_text_themes" CASCADE;
  DROP TABLE "ui_text_voices" CASCADE;
  DROP TABLE "ui_text_strings" CASCADE;
  DROP TABLE "ui_text" CASCADE;
  DROP TABLE "ui_text_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_projects_status_color";
  DROP TYPE "public"."enum_site_content_now_rows_sign";
  DROP TYPE "public"."enum_site_content_soft_skills_tint";
  DROP TYPE "public"."enum_site_content_stack_tint";
  DROP TYPE "public"."enum_ui_text_intro_hints_key";`)
}
