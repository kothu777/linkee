import * as zod from "zod";
export const schema = zod.object({
  email: zod.string().min(1, "Email is required"),
  password: zod.string().min(1, "Password is required"),
});
