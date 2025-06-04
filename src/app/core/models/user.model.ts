export interface User {
  id: string;
  email: string;
  username: string;
  isAdmin: boolean;
  imageUrl?: string;
  gender?: 'male' | 'female' | 'other';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  gender?: 'male' | 'female' | 'other';
  imageUrl?: string;
}