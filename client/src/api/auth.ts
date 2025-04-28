import { ApiError } from "../types/error";
import { LoginRequest, SignupRequest, UsersResponse } from "../types/user";

const API_URL = import.meta.env.VITE_API_URL;

export const login = async (
  credentials: LoginRequest
): Promise<UsersResponse> => {
  const response = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    // RFC 7807
    const errorData = data as ApiError;
    throw errorData;
  }

  return data;
};

export const signup = async (
  userData: SignupRequest
): Promise<UsersResponse> => {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorData = data as ApiError;
    throw errorData
  }

  return data;
};

export const getUser = async (token: string): Promise<UsersResponse> => {
  const response = await fetch(`${API_URL}/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const errorData = data as ApiError;
    throw errorData;
  }

  return data;
};
