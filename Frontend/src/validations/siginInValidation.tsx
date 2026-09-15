import z from "zod"

export const signInSchema = z.object({
  email: z.string().min(1, "Email không được để trống"),
  password: z.string().min(1, "Password không được để trống")
})

export type SignInInput = z.infer<typeof signInSchema>
