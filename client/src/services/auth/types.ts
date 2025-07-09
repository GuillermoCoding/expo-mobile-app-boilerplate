export interface User {
  id: string;
  email: string;
  name: string | null;
  photoUrl: string | null;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
} 