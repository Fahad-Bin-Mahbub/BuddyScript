import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, "First name is required")
      .max(50, "First name must be 50 characters or less")
      .regex(/^[a-zA-Z\s'-]+$/, "First name contains invalid characters"),
    lastName: z
      .string()
      .trim()
      .min(1, "Last name is required")
      .max(50, "Last name must be 50 characters or less")
      .regex(/^[a-zA-Z\s'-]+$/, "Last name contains invalid characters"),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Invalid email address")
      .max(255, "Email must be 255 characters or less"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be 128 characters or less")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const createPostSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Post content is required")
    .max(5000, "Post content must be 5000 characters or less"),
  visibility: z.enum(["public", "private"]).default("public"),
});

export const createCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Comment is required")
    .max(2000, "Comment must be 2000 characters or less"),
  parentComment: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
