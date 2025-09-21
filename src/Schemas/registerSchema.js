import * as zod from "zod";
export const scheme = zod
  .object({
    name: zod
      .string()
      .min(1, "Name is required")
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name must be at most 50 characters"),
    email: zod
      .string()
      .min(1, "Email is required")
      .regex(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email address"
      ),
    password: zod
      .string()
      .min(1, "Password is required")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    rePassword: zod.string().min(1, "Confirm Password is required"),
    dateOfBirth: zod.coerce.date().refine(
      (date) => {
        const birthDate = new Date(date);
        const currentDate = new Date();
        const age = currentDate.getFullYear() - birthDate.getFullYear();

        return age >= 18;
      },
      {
        message: "You must be at least 18 years old",
      }
    ),
    gender: zod.string().min(1, "Gender is required"),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
  });
