import { apiFetch } from "./api";

export const createGame = (game) =>
  apiFetch("/api/games", {
    method: "POST",
    body: JSON.stringify(game),
  });

export const getAllGames = () => apiFetch("/api/games");

export const addGameToMyLibrary = (gameId) =>
  apiFetch(`/api/users/me/games/${gameId}`, {
    method: "POST",
  });

export const getMyGames = () => apiFetch("/api/users/me/games");
