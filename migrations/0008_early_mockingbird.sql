ALTER TABLE "catalogue_item_images" ALTER COLUMN "id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "catalogue_item_images" ALTER COLUMN "itemId" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "catalogue_item_images" ALTER COLUMN "itemId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "catalogue_items" ALTER COLUMN "id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "catalogue_items" ALTER COLUMN "catalogueId" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "catalogue_items" ALTER COLUMN "catalogueId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "catalogues" ALTER COLUMN "id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "catalogues" ALTER COLUMN "organizationId" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "catalogues" ALTER COLUMN "organizationId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "catalogues" ALTER COLUMN "createdBy" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "catalogues" ALTER COLUMN "createdBy" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "org_invitations" ALTER COLUMN "id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "org_invitations" ALTER COLUMN "organizationId" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "org_invitations" ALTER COLUMN "organizationId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "org_invitations" ALTER COLUMN "createdBy" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "org_invitations" ALTER COLUMN "createdBy" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "createdBy" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "createdBy" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_organization" ALTER COLUMN "id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "user_organization" ALTER COLUMN "userId" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "user_organization" ALTER COLUMN "userId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_organization" ALTER COLUMN "organizationId" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "user_organization" ALTER COLUMN "organizationId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "catalogue_items" ADD COLUMN "createdBy" varchar;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "catalogue_items" ADD CONSTRAINT "catalogue_items_createdBy_users_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
