export interface User {
  email: string;
  username: string;
  token: string;
  image: string | null;
}

export interface LoginRequest {
    user: {
        email: string;
        password: string;
    }
}

export interface SignupRequest {
    user: {
        email: string;
        username: string;
        password: string;
    }
}

export interface UsersResponse {
    user: User
}