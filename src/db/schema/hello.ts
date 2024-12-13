import {
  decimal,
  jsonb,
  pgEnum,
  pgTable,
  bigserial,
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
  (table) => [uniqueIndex("email").on(table.email)]
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
      () => organizations.id
    ),
    role: role("role").notNull(),
    joined_at: timestamp("joined_at").notNull().notNull(),
  },
  (table) => [uniqueIndex("index").on(table.userId, table.organizationId)]
);

export const catalogues = pgTable("catalogues", {
  id: bigserial({ mode: "number" }).primaryKey(),
  name: varchar("name"),
  description: text("description"),
  organizationId: bigserial({ mode: "number" }).references(
    () => organizations.id
  ),
  createdBy: bigserial({ mode: "number" }).references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export const catalogueItems = pgTable("catalogue_items", {
  id: bigserial({ mode: "number" }).primaryKey(),
  catalogueId: bigserial({ mode: "number" }).references(() => catalogues.id),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export const catalogueItemImages = pgTable("catalogue_item_images", {
  id: bigserial({ mode: "number" }).primaryKey(),
  itemId: bigserial({ mode: "number" }).references(() => catalogueItems.id),
  imageUrl: text("image_url").notNull(),
  blurhash: text("blurhash"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
});
