import {
  decimal,
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const users = pgTable(
  "users",
  {
    // id: bigserial({ mode: "number" }).primaryKey(),
    id: varchar("id")
      .$defaultFn(() => nanoid(12))
      .primaryKey(),
    name: text("name"),
    email: varchar("email", { length: 256 }).notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [uniqueIndex("email").on(table.email)],
);

export const organizations = pgTable("organizations", {
  id: varchar("id")
    .$defaultFn(() => nanoid(12))
    .primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  createdBy: varchar("createdBy").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const role = pgEnum("role", ["admin", "editor", "viewer"]);

export const userOrganization = pgTable(
  "user_organization",
  {
    id: varchar("id")
      .$defaultFn(() => nanoid(12))
      .primaryKey(),

    userId: varchar("userId").references(() => users.id),
    organizationId: varchar("organizationId").references(
      () => organizations.id,
    ),
    role: role("role").notNull(),
    joined_at: timestamp("joined_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("index").on(table.userId, table.organizationId),
    index("user_organization_user_id_idx").on(table.userId),
    index("user_organization_organization_id_idx").on(table.organizationId),
  ],
);

export const catalogues = pgTable(
  "catalogues",
  {
    id: varchar("id")
      .$defaultFn(() => nanoid(12))
      .primaryKey(),
    name: varchar("name").notNull(),
    description: text("description"),
    organizationId: varchar("organizationId").references(
      () => organizations.id,
    ),
    createdBy: varchar("createdBy").references(() => users.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    index("catalogue_items_organization_id_idx").on(table.organizationId),
  ],
);

export const catalogueItems = pgTable(
  "catalogue_items",
  {
    id: varchar("id")
      .$defaultFn(() => nanoid(12))
      .primaryKey(),
    catalogueId: varchar("catalogueId").references(() => catalogues.id),
    name: text("name").notNull(),
    description: text("description"),
    price: decimal("price", { precision: 10, scale: 2 }),
    metadata: jsonb("metadata"),
    createdBy: varchar("createdBy").references(() => users.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [index("catalogue_items_catalogue_id_idx").on(table.catalogueId)],
);

export const catalogueItemImages = pgTable(
  "catalogue_item_images",
  {
    id: varchar("id")
      .$defaultFn(() => nanoid(12))
      .primaryKey(),
    itemId: varchar("itemId").references(() => catalogueItems.id),
    imageUrl: text("image_url").notNull(),
    blurhash: text("blurhash"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [index("catalogue_item_images_item_id_idx").on(table.itemId)],
);

export const orgInvitations = pgTable(
  "org_invitations",
  {
    id: varchar("id")
      .$defaultFn(() => nanoid(12))
      .primaryKey(),
    organizationId: varchar("organizationId").references(
      () => organizations.id,
    ),
    inviteCode: text("invite_code").unique().notNull(),
    createdBy: varchar("createdBy").references(() => users.id),
    expiresAt: timestamp("expires_at").notNull(),
    role: role("role").notNull(),
    status: text("status", {
      enum: ["active", "accepted", "rejected"],
    })
      .notNull()
      .default("active"),
  },
  (table) => [
    uniqueIndex("invite_code").on(table.inviteCode),
    index("org_invitations_organization_id_idx").on(table.organizationId),
  ],
);
