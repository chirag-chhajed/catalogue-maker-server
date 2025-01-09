ALTER TABLE "catalogue_item_images" RENAME TO "catalog_maker_catalogue_item_images";--> statement-breakpoint
ALTER TABLE "catalogue_items" RENAME TO "catalog_maker_catalogue_items";--> statement-breakpoint
ALTER TABLE "catalogues" RENAME TO "catalog_maker_catalogues";--> statement-breakpoint
ALTER TABLE "org_invitations" RENAME TO "catalog_maker_org_invitations";--> statement-breakpoint
ALTER TABLE "organizations" RENAME TO "catalog_maker_organizations";--> statement-breakpoint
ALTER TABLE "user_organization" RENAME TO "catalog_maker_user_organization";--> statement-breakpoint
ALTER TABLE "users" RENAME TO "catalog_maker_users";--> statement-breakpoint
ALTER TABLE "catalog_maker_org_invitations" DROP CONSTRAINT "org_invitations_invite_code_unique";--> statement-breakpoint
ALTER TABLE "catalog_maker_users" DROP CONSTRAINT "users_email_unique";--> statement-breakpoint
ALTER TABLE "catalog_maker_catalogue_item_images" DROP CONSTRAINT "catalogue_item_images_itemId_catalogue_items_id_fk";
--> statement-breakpoint
ALTER TABLE "catalog_maker_catalogue_items" DROP CONSTRAINT "catalogue_items_catalogueId_catalogues_id_fk";
--> statement-breakpoint
ALTER TABLE "catalog_maker_catalogue_items" DROP CONSTRAINT "catalogue_items_createdBy_users_id_fk";
--> statement-breakpoint
ALTER TABLE "catalog_maker_catalogues" DROP CONSTRAINT "catalogues_organizationId_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "catalog_maker_catalogues" DROP CONSTRAINT "catalogues_createdBy_users_id_fk";
--> statement-breakpoint
ALTER TABLE "catalog_maker_org_invitations" DROP CONSTRAINT "org_invitations_organizationId_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "catalog_maker_org_invitations" DROP CONSTRAINT "org_invitations_createdBy_users_id_fk";
--> statement-breakpoint
ALTER TABLE "catalog_maker_organizations" DROP CONSTRAINT "organizations_createdBy_users_id_fk";
--> statement-breakpoint
ALTER TABLE "catalog_maker_user_organization" DROP CONSTRAINT "user_organization_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "catalog_maker_user_organization" DROP CONSTRAINT "user_organization_organizationId_organizations_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "catalog_maker_catalogue_item_images" ADD CONSTRAINT "catalog_maker_catalogue_item_images_itemId_catalog_maker_catalogue_items_id_fk" FOREIGN KEY ("itemId") REFERENCES "public"."catalog_maker_catalogue_items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "catalog_maker_catalogue_items" ADD CONSTRAINT "catalog_maker_catalogue_items_catalogueId_catalog_maker_catalogues_id_fk" FOREIGN KEY ("catalogueId") REFERENCES "public"."catalog_maker_catalogues"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "catalog_maker_catalogue_items" ADD CONSTRAINT "catalog_maker_catalogue_items_createdBy_catalog_maker_users_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."catalog_maker_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "catalog_maker_catalogues" ADD CONSTRAINT "catalog_maker_catalogues_organizationId_catalog_maker_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."catalog_maker_organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "catalog_maker_catalogues" ADD CONSTRAINT "catalog_maker_catalogues_createdBy_catalog_maker_users_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."catalog_maker_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "catalog_maker_org_invitations" ADD CONSTRAINT "catalog_maker_org_invitations_organizationId_catalog_maker_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."catalog_maker_organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "catalog_maker_org_invitations" ADD CONSTRAINT "catalog_maker_org_invitations_createdBy_catalog_maker_users_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."catalog_maker_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "catalog_maker_organizations" ADD CONSTRAINT "catalog_maker_organizations_createdBy_catalog_maker_users_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."catalog_maker_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "catalog_maker_user_organization" ADD CONSTRAINT "catalog_maker_user_organization_userId_catalog_maker_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."catalog_maker_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "catalog_maker_user_organization" ADD CONSTRAINT "catalog_maker_user_organization_organizationId_catalog_maker_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."catalog_maker_organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "catalog_maker_org_invitations" ADD CONSTRAINT "catalog_maker_org_invitations_invite_code_unique" UNIQUE("invite_code");--> statement-breakpoint
ALTER TABLE "catalog_maker_users" ADD CONSTRAINT "catalog_maker_users_email_unique" UNIQUE("email");