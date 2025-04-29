import { LoginRequest, SignupRequest, UsersResponse } from "../types/user";
import apiClient from "./axiosConfig";

export const login = async (
  credentials: LoginRequest
): Promise<UsersResponse> => {
  const response = await apiClient.post<UsersResponse>(
    "/users/login",
    credentials
  );
  return response.data;
};

export const signup = async (
  userData: SignupRequest
): Promise<UsersResponse> => {
  const response = await apiClient.post<UsersResponse>("/users", userData);
  return response.data;
};

export const getUser = async (): Promise<UsersResponse> => {
  const response = await apiClient.get<UsersResponse>("/user");
  return response.data;
};
