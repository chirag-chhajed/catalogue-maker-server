ALTER TABLE "catalogue_item_images" ALTER COLUMN "itemId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "catalogue_items" ALTER COLUMN "catalogueId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "catalogues" ALTER COLUMN "organizationId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "catalogues" ALTER COLUMN "createdBy" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "createdBy" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_organization" ALTER COLUMN "userId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_organization" ALTER COLUMN "organizationId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "catalogues" ADD COLUMN "description" text;