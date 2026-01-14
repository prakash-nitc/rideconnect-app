import type { Driver } from "@/types/driver";
import type { Ride } from "@/types/ride";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

type AuthResponse = {
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
  };
  token: string;
};

async function request<T>(endpoint: string, options: RequestInit = {}, token?: string): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  const data = text ? (JSON.parse(text) as any) : null;

  if (!response.ok) {
    const message = data?.message || "Request failed";
    throw new Error(message);
  }

  return data as T;
}

export const api = {
  async signup(payload: { name: string; email: string; password: string; securityQuestion: string; securityAnswer: string }) {
    return request<AuthResponse>("/auth/signup", { method: "POST", body: JSON.stringify(payload) });
  },
  async login(payload: { email: string; password: string }) {
    return request<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(payload) });
  },
  async getCurrentUser(token: string) {
    return request<{ user: AuthResponse["user"] }>("/auth/me", { method: "GET" }, token);
  },
  async fetchRides() {
    return request<Ride[]>("/rides");
  },
  async createRide(payload: {
    from: string;
    to: string;
    date: string;
    time: string;
    seats: number;
    totalFare: number;
    note?: string;
  }, token: string) {
    return request<Ride>("/rides", { method: "POST", body: JSON.stringify(payload) }, token);
  },
  async joinRide(rideId: string, token: string) {
    return request<Ride>(`/rides/${rideId}/join`, { method: "POST" }, token);
  },
  async fetchDrivers() {
    return request<Driver[]>("/drivers");
  },
  async getSecurityQuestion(email: string) {
    return request<{ question: string }>(`/auth/security-question/${email}`);
  },
  async resetPassword(payload: { email: string; securityAnswer: string; newPassword: string }) {
    return request<{ message: string }>("/auth/reset-password", { method: "POST", body: JSON.stringify(payload) });
  },
};

export type AuthUser = AuthResponse["user"];
