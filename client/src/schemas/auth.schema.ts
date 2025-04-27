import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup
    .string()
    .email("email is invalid")
    .max(255, "email max length is 255")
    .required("email is required"),
  password: yup
    .string()
    .min(6, "password min length is 6")
    .max(200, "password max length is 200")
    .required("password is required"),
});

export const signupSchema = yup.object({
  username: yup
    .string()
    .min(3, "username min length is 3")
    .max(50, "username max length is 50")
    .required("username is required"),
  email: yup
    .string()
    .email("email is invalid")
    .max(255, "email max length is 255")
    .required("email is required"),
  password: yup
    .string()
    .min(6, "password min length is 6")
    .max(200, "password max length is 200")
    .required("password is required"),
});

export type LoginFormData = yup.InferType<typeof loginSchema>
export type SignupFormData = yup.InferType<typeof signupSchema>