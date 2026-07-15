import { z } from "zod";

export const registerUserSchema = z.object({
  body: z.object({
    full_name: z
      .string("full_name must be string")
      .min(2, "full_name must be at least 3 characters long")
      .max(50, "full_name must not exceed 50 characters"),
    email: z.email({
      error: (issue) =>
        issue.input === undefined
          ? "email is required"
          : "invalid email format",
    }),
    password: z
      .string("password must be string")
      .min(6, "password must be at least 6 characters long"),
  }),

  params:z.object({}).default({}),
  query:z.object({}).default({})
});
