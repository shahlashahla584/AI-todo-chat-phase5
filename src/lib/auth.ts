import { create } from "zustand";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ==================== Types ====================

export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

// ==================== Auth State Store ====================

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  verifyToken: () => Promise<void>;
  clearError: () => void;
}

// Initialize state from localStorage (client-side only)
const getInitialState = () => {
  if (typeof window === "undefined") {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    };
  }

  try {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    return {
      user,
      token,
      isAuthenticated: !!token && !!user,
      isLoading: false,
      error: null,
    };
  } catch (error) {
    console.error("Error initializing auth state:", error);
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    };
  }
};

// ==================== Auth Store ====================

export const useAuth = create<AuthState>((set, get) => ({
  ...getInitialState(),

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post<AuthResponse>(
        `${API_URL}/auth/login`,
        credentials
      );

      const { access_token, user } = response.data;

      // Persist in localStorage
      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));

      set({
        user,
        token: access_token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: any) {
      const error =
        axios.isAxiosError(err) && err.response?.data?.detail
          ? err.response.data.detail
          : "Login failed";
      set({ error, isLoading: false });
      throw new Error(error);
    }
  },

  register: async (credentials: RegisterCredentials) => {
    set({ isLoading: true, error: null });
    try {
      // Register endpoint returns the user object
      await axios.post<User>(`${API_URL}/auth/register`, credentials);
      // Do not return anything to satisfy Promise<void>
      set({ isLoading: false });
    } catch (err: any) {
      const error =
        axios.isAxiosError(err) && err.response?.data?.detail
          ? err.response.data.detail
          : "Registration failed";
      set({ error, isLoading: false });
      throw new Error(error);
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  verifyToken: async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    set({ isLoading: true });
    try {
      const response = await axios.post(`${API_URL}/auth/verify-token`, { token });

      const user: User = {
        id: response.data.user_id,
        email: response.data.email,
      };

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      get().logout();
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));

// ==================== Task Types ====================

export interface Task {
  id: string;
  title: string;
  description: string | null;
  is_completed: boolean;
  user_id: string;
  created_at: string;
}

export interface TaskCreate {
  title: string;
  description?: string;
  is_completed?: boolean;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  is_completed?: boolean;
}

// ==================== API Client ====================

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token automatically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto logout on 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuth.getState().logout();
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

// ==================== Task API ====================

export const taskApi = {
  getAll: async (): Promise<Task[]> => {
    const response = await apiClient.get<Task[]>("/tasks");
    return response.data;
  },

  create: async (task: TaskCreate): Promise<Task> => {
    const response = await apiClient.post<Task>("/tasks", task);
    return response.data;
  },

  update: async (id: string, task: TaskUpdate): Promise<Task> => {
    const response = await apiClient.patch<Task>(`/tasks/${id}`, task);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
  },

  toggleComplete: async (id: string, isCompleted: boolean): Promise<Task> => {
    return taskApi.update(id, { is_completed: isCompleted });
  },
};
