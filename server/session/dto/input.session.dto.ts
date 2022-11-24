import { object, string, TypeOf } from "zod";

export interface InputSessionDto {
    email: string
    password: string
}

export const inputSessionSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Invalid email or password"),
    password: string({
      required_error: "Password is required",
    }).min(6, "Invalid email or password"),
  }),
});

export type CreateSessionInput = TypeOf<typeof inputSessionSchema>["body"];