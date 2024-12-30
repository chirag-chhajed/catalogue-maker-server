CREATE TABLE IF NOT EXISTS "org_invitations" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"organizationId" bigserial NOT NULL,
	"invite_code" text NOT NULL,
	"createdBy" bigserial NOT NULL,
	"expires_at" timestamp NOT NULL,
	"role" "role" NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	CONSTRAINT "org_invitations_invite_code_unique" UNIQUE("invite_code")
);
--> statement-breakpoint
ALTER TABLE "catalogue_items" ALTER COLUMN "price" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "org_invitations" ADD CONSTRAINT "org_invitations_organizationId_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "org_invitations" ADD CONSTRAINT "org_invitations_createdBy_users_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "invite_code" ON "org_invitations" USING btree ("invite_code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "org_invitations_organization_id_idx" ON "org_invitations" USING btree ("organizationId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "catalogue_item_images_item_id_idx" ON "catalogue_item_images" USING btree ("itemId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "catalogue_items_catalogue_id_idx" ON "catalogue_items" USING btree ("catalogueId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "catalogue_items_organization_id_idx" ON "catalogues" USING btree ("organizationId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_organization_user_id_idx" ON "user_organization" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_organization_organization_id_idx" ON "user_organization" USING btree ("organizationId");