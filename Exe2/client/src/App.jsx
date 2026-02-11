import { useEffect, useState } from "react";
import { register, login, me } from "./api/auth";
import { createGame, getAllGames, addGameToMyLibrary, getMyGames } from "./api/games";

export default function App() {
  const [status, setStatus] = useState("Not checked yet");
  const [user, setUser] = useState(null);

  const [username, setUsername] = useState("test1");
  const [password, setPassword] = useState("123456");

  const [gameId, setGameId] = useState("");

  useEffect(() => {
    checkMe();
  }, []);

  const checkMe = async () => {
    try {
      const data = await me();
      setUser(data?.user || null);
      setStatus(data?.loggedIn ? "Logged in ✅" : "Not logged in ❌");
    } catch (e) {
      setStatus("Not logged in ❌");
    }
  };

  const doRegister = async () => {
    const data = await register(username, password);
    alert(JSON.stringify(data, null, 2));
  };

  const doLogin = async () => {
    const data = await login(username, password);
    alert(JSON.stringify(data, null, 2));
    await checkMe();
  };

  const doCreateGame = async () => {
    const newGame = {
      title: "God of War",
      genre: "Action",
      platform: "PlayStation",
      releaseYear: 2018,
      developer: "Santa Monica Studio",
      rating: 9,
      description: "Action adventure game",
    };

    const data = await createGame(newGame);
    alert("Created Game:\n" + JSON.stringify(data, null, 2));
    setGameId(data?._id || "");
  };

  const doGetAllGames = async () => {
    const data = await getAllGames();
    alert("All Games:\n" + JSON.stringify(data, null, 2));
  };

  const doAddToLibrary = async () => {
    if (!gameId) return alert("Paste a gameId first.");
    const data = await addGameToMyLibrary(gameId);
    alert(JSON.stringify(data, null, 2));
  };

  const doMyGames = async () => {
    const data = await getMyGames();
    alert("My Games:\n" + JSON.stringify(data, null, 2));
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>Exercise 2 Client Test</h2>
      <p>Status: <b>{status}</b></p>
      <p>User: <b>{user?.username || "None"}</b></p>

      <hr />

      <h3>Auth</h3>
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" type="password" />
      <div style={{ marginTop: 10 }}>
        <button onClick={doRegister}>Register</button>{" "}
        <button onClick={doLogin}>Login</button>{" "}
        <button onClick={checkMe}>Check /me</button>
      </div>

      <hr />

      <h3>Games</h3>
      <button onClick={doCreateGame}>Create Game</button>{" "}
      <button onClick={doGetAllGames}>Get All Games</button>

      <div style={{ marginTop: 10 }}>
        <input value={gameId} onChange={(e) => setGameId(e.target.value)} placeholder="gameId to add" style={{ width: 320 }} />
        <div style={{ marginTop: 10 }}>
          <button onClick={doAddToLibrary}>Add Game to My Library</button>{" "}
          <button onClick={doMyGames}>Get My Games</button>
        </div>
      </div>
    </div>
  );
}
