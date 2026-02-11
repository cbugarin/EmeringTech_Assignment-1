import { useEffect, useState } from "react";
import { api } from "./api";
import "./App.css";

export default function App() {
  const [tab, setTab] = useState("auth"); // auth | games | library
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [me, setMe] = useState(null);
  const [games, setGames] = useState([]);
  const [myGames, setMyGames] = useState([]);

  const loadMe = async () => {
    try {
      const res = await api.get("/api/auth/me");
      setMe(res.data?.user);
    } catch {
      setMe(null);
    }
  };

  const loadGames = async () => {
    const res = await api.get("/api/games");
    setGames(res.data);
  };

  const loadMyGames = async () => {
    const res = await api.get("/api/users/me/games");
    setMyGames(res.data);
  };

  useEffect(() => {
    loadMe();
  }, []);

  const register = async () => {
    await api.post("/api/auth/register", { username, password });
    alert("Registered. Now login.");
  };

  const login = async () => {
    await api.post("/api/auth/login", { username, password });
    await loadMe();
    setTab("games");
    await loadGames();
  };

  const logout = async () => {
    await api.post("/api/auth/logout");
    setMe(null);
    setMyGames([]);
    setTab("auth");
  };

  const addToLibrary = async (gameId) => {
    await api.post(`/api/users/me/games/${gameId}`);
    await loadMyGames();
    alert("Added to library");
  };

  const removeFromLibrary = async (gameId) => {
    await api.delete(`/api/users/me/games/${gameId}`);
    await loadMyGames();
    alert("Removed from library");
  };

  const createSampleGame = async () => {
    // same fields you used in Postman
    await api.post("/api/games", {
      title: "Spider-Man 2",
      genre: "Action",
      platform: "PlayStation",
      releaseYear: 2023,
      developer: "Insomniac Games",
      rating: 9,
      description: "Open world action adventure",
    });
    await loadGames();
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <h2>Exe2 - Games Library</h2>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <button onClick={() => setTab("auth")}>Auth</button>
        <button
          onClick={async () => {
            setTab("games");
            await loadGames();
          }}
          disabled={!me}
        >
          Games
        </button>
        <button
          onClick={async () => {
            setTab("library");
            await loadMyGames();
          }}
          disabled={!me}
        >
          My Library
        </button>

        <div style={{ marginLeft: "auto" }}>
          {me ? (
            <>
              <span style={{ marginRight: 10 }}>Logged in as: {me.username}</span>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <span>Not logged in</span>
          )}
        </div>
      </div>

      {tab === "auth" && (
        <div>
          <h3>Register / Login</h3>
          <input
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ marginRight: 10 }}
          />
          <input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginRight: 10 }}
          />
          <button onClick={register} style={{ marginRight: 10 }}>
            Register
          </button>
          <button onClick={login}>Login</button>

          <div style={{ marginTop: 15 }}>
            <button onClick={loadMe}>Refresh /api/auth/me</button>
          </div>
        </div>
      )}

      {tab === "games" && (
        <div>
          <h3>All Games</h3>
          <button onClick={createSampleGame} style={{ marginBottom: 10 }}>
            + Create Sample Game
          </button>

          <ul>
            {games.map((g) => (
              <li key={g._id} style={{ marginBottom: 10 }}>
                <b>{g.title}</b> ({g.platform}) — {g.genre} — Rating: {g.rating}
                <div>
                  <button onClick={() => addToLibrary(g._id)}>Add to My Library</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === "library" && (
        <div>
          <h3>My Library</h3>
          <button onClick={loadMyGames} style={{ marginBottom: 10 }}>
            Refresh
          </button>

          {myGames.length === 0 ? (
            <p>No games in your library yet.</p>
          ) : (
            <ul>
              {myGames.map((g) => (
                <li key={g._id} style={{ marginBottom: 10 }}>
                  <b>{g.title}</b> ({g.platform}) — {g.genre}
                  <div>
                    <button onClick={() => removeFromLibrary(g._id)}>Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
