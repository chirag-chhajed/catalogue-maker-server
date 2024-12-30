import * as z from "zod";

export const createInvitationValidation = z.object({
  role: z.enum(["editor", "viewer"], { message: "invalid role" }),
});

export type createInvitationType = z.infer<typeof createInvitationValidation>;

export const joinInvitationValidation = z.object({
  inviteCode: z.string().length(10),
});

export type joinInvitationType = z.infer<typeof joinInvitationValidation>;

export const validateJoiningRequest = joinInvitationValidation.merge(
  z.object({
    joining: z.boolean(),
  }),
);

export type validateJoiningRequestType = z.infer<typeof validateJoiningRequest>;
