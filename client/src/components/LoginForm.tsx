import { useState } from "react";
import { TOKEN_KEY, useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import { login } from "../api/auth";
import { ApiError } from "../types/error";
import { ErrorMessage } from "./ErrorMessage";
import { useForm } from "react-hook-form";
import { LoginFormData, loginSchema } from "../schemas/auth.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormField } from "./FormField";

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: "onBlur",
  });

  const [error, setError] = useState<string | ApiError>("");
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormData) => {
    setError("");

    try {
      const response = await login({
        user: {
          email: data.email,
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
        setError("Login failed");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Login
      </h2>

      {error && <ErrorMessage error={error} />}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
          {isSubmitting ? "Loading..." : "Login"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};
