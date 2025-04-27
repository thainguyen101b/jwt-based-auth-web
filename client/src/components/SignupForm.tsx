import { useState } from "react";
import { TOKEN_KEY, useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import { signup } from "../api/auth";
import { ApiError } from "../types/error";
import { ErrorMessage } from "./ErrorMessage";
import { useForm } from "react-hook-form";
import { SignupFormData, signupSchema } from "../schemas/auth.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormField } from "./FormField";

export const SignupForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: yupResolver(signupSchema),
    mode: "onBlur",
  });

  const [error, setError] = useState<string | ApiError>("");
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: SignupFormData) => {
    setError("");

    try {
      const response = await signup({
        user: {
          email: data.email,
          username: data.username,
          password: data.password,
        },
      });
      localStorage.setItem(TOKEN_KEY, response.user.token);
      setUser(response.user);
      navigate("/profile");
    } catch (err) {
      if (err && typeof err === "object" && "status" in err) {
        setError(err as ApiError);
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Sign up
      </h2>

      {error && <ErrorMessage error={error} />}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField
          label="Username"
          inputName="username"
          error={errors.username}
          {...register("username")}
        />

        <FormField
          label="Email"
          type="email"
          inputName="email"
          error={errors.email}
          {...register("email")}
        />

        <FormField
          label="Password"
          type="password"
          inputName="password"
          error={errors.password}
          {...register("password")}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-75"
        >
          {isSubmitting ? "Loading..." : "Register"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};
