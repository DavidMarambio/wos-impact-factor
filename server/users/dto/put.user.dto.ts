import { object, string, TypeOf } from "zod";
import { Roles } from "../../models/User.model"

export interface PutUserDto {
  id: string
  email: string
  password: string
  firstname: string
  lastname: string
  role: Roles
}

export const updateUserSchema = object({
  body: object({
    firstName: string(),
    lastName: string(),
    password: string().min(6, "Password is too short - should be min 6 chars"),
    passwordConfirmation: string(),
    email: string().email("Not a valid email")
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  }),
});

export type UpdateUserInput = TypeOf<typeof updateUserSchema>["body"];
