import { apiFetch } from "./api";

export const register = (username, password) =>
  apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

export const login = (username, password) =>
  apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

export const me = () => apiFetch("/api/auth/me");
