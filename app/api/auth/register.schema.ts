import { z } from "zod";

export const registerUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 char long")
    .max(255, "Name must not exceed 255 characters"),

  userName: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters long")
    .max(255, "Username must not exceed 255 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, underscores, and hyphens"
    ),
  phoneNumber: z
    .string()
    .trim()
    .min(11, "Username must be at least 3 characters long")
   ,
  email: z
    .email("Please enter a valid email address ")
    .trim()
    .max(255, "Email must not exceed 255 characters")
    .toLowerCase(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    ),

 
});

// z.infer automatically creates a TypeScript type from your Zod schema.
export type RegisterUserData = z.infer<typeof registerUserSchema>;

// Optional: Create a schema with password confirmation - in server we don't need confPass.
export const registerUserWithConfirmSchema = registerUserSchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterUserWithConfirmData = z.infer<
  typeof registerUserWithConfirmSchema
>;
export const loginUserSchema = z.object({
 
  email: z
    .email("Please enter a valid email address ")
    .trim()
    .max(255, "Email must not exceed 255 characters")
    .toLowerCase(),

  password: z
    .string()
    // .min(8, "Password must be at least 8 characters long")
    // .regex(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    //   "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    // )
});

// z.infer automatically creates a TypeScript type from your Zod schema.
export type loginUserData = z.infer<typeof loginUserSchema>;
export const ForgotPasswordSchema = z.object({
 
  email: z
    .email("Please enter a valid email address ")
    .trim()
    .max(255, "Email must not exceed 255 characters")
    .toLowerCase(),


});

// z.infer automatically creates a TypeScript type from your Zod schema.
export type ForgotPasswordSchemaData = z.infer<typeof ForgotPasswordSchema>;
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one lowercase letter, one uppercase letter, and one number"
      ),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;