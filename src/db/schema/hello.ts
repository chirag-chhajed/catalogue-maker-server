import {
  bigserial,
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

export const users = pgTable(
  "users",
  {
    id: bigserial({ mode: "number" }).primaryKey(),
    name: text("name"),
    email: varchar("email", { length: 256 }).notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [uniqueIndex("email").on(table.email)],
);

export const organizations = pgTable("organizations", {
  id: bigserial({ mode: "number" }).primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  createdBy: bigserial({ mode: "number" }).references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const role = pgEnum("role", ["admin", "editor", "viewer"]);

export const userOrganization = pgTable(
  "user_organization",
  {
    id: bigserial({ mode: "number" }).primaryKey(),

    userId: bigserial({ mode: "number" }).references(() => users.id),
    organizationId: bigserial({ mode: "number" }).references(
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
    id: bigserial({ mode: "number" }).primaryKey(),
    name: varchar("name").notNull(),
    description: text("description"),
    organizationId: bigserial({ mode: "number" }).references(
      () => organizations.id,
    ),
    createdBy: bigserial({ mode: "number" }).references(() => users.id),
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
    id: bigserial({ mode: "number" }).primaryKey(),
    catalogueId: bigserial({ mode: "number" }).references(() => catalogues.id),
    name: text("name").notNull(),
    description: text("description"),
    price: decimal("price", { precision: 10, scale: 2 }),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [index("catalogue_items_catalogue_id_idx").on(table.catalogueId)],
);

export const catalogueItemImages = pgTable(
  "catalogue_item_images",
  {
    id: bigserial({ mode: "number" }).primaryKey(),
    itemId: bigserial({ mode: "number" }).references(() => catalogueItems.id),
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
    id: bigserial({ mode: "number" }).primaryKey(),
    organizationId: bigserial({ mode: "number" }).references(
      () => organizations.id,
    ),
    inviteCode: text("invite_code").unique().notNull(),
    createdBy: bigserial({ mode: "number" }).references(() => users.id),
    expiresAt: timestamp("expires_at").notNull(),
    role: role("role").notNull(),
    status: text("status", {
      enum: ["active", "expired", "accepted", "rejected"],
    })
      .notNull()
      .default("active"),
  },
  (table) => [
    uniqueIndex("invite_code").on(table.inviteCode),
    index("org_invitations_organization_id_idx").on(table.organizationId),
  ],
);
