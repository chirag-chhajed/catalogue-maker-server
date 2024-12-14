import { z } from "zod";

export const loginValidation = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name must be minimum of 1 character")
    .max(100, "Name must be maximum of 100 characters"),
  email: z.string().trim().email("Invalid email address"),
});

export type LoginInput = z.infer<typeof loginValidation>;

export const createOrganizationValidation = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name must be minimum of 1 character")
    .max(100, "Name must be maximum of 100 characters"),
  description: z
    .string()
    .trim()
    .max(500, "Description must be maximum of 500 characters")
    .optional(),
});

export type CreateOrganizationInput = z.infer<
  typeof createOrganizationValidation
>;

export const createCatalogueValidation = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name must be minimum of 1 character")
    .max(100, "Name must be maximum of 100 characters"),
  description: z
    .string()
    .trim()
    .max(500, "Description must be maximum of 500 characters")
    .optional(),
});

export type CreateCatalogueInput = z.infer<typeof createCatalogueValidation>;
