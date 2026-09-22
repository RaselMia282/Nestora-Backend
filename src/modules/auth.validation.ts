import { z } from "zod";

export const registerUserSchema = z.object({
  name: z.string().min(3, "Name must be atleast 3 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "password atleast must be 6 characters or long"),
  phone:z.string().optional(),
});
