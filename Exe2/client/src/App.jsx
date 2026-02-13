import { useEffect, useMemo, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import bg from "./assets/bg.jpg";

import ThreeBackground from "./components/ThreeBackground.jsx";

import { register, login, me } from "./api/auth";
import {
  createGame,
  getAllGames,
  addGameToMyLibrary,
  getMyGames,
  removeGameFromMyLibrary,
  deleteGame,
} from "./api/games";

export default function App() {
  const [status, setStatus] = useState({ loggedIn: false, text: "Checking..." });
  const [user, setUser] = useState(null);

  const [username, setUsername] = useState("test1");
  const [password, setPassword] = useState("123456");

  const [allGames, setAllGames] = useState([]);
  const [myGames, setMyGames] = useState([]);

  const [selectedGame, setSelectedGame] = useState(null);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const [search, setSearch] = useState("");

  const isLoggedIn = useMemo(() => !!status.loggedIn, [status.loggedIn]);

  useEffect(() => {
    checkMe();
  }, []);

  const showMsg = (type, text) => setMsg({ type, text });

  const checkMe = async () => {
    try {
      const data = await me();
      setUser(data?.user || null);
      setStatus({
        loggedIn: !!data?.loggedIn,
        text: data?.loggedIn ? "Logged in" : "Not logged in",
      });
    } catch {
      setUser(null);
      setStatus({ loggedIn: false, text: "Not logged in" });
    }
  };

  const doRegister = async () => {
    try {
      const data = await register(username, password);
      showMsg("success", data?.message || "Registered");
    } catch (e) {
      showMsg("danger", e.message || "Register failed");
    }
  };

  const doLogin = async () => {
    try {
      const data = await login(username, password);
      showMsg("success", data?.message || "Login successful");
      await checkMe();
    } catch (e) {
      showMsg("danger", e.message || "Login failed");
    }
  };

  const refreshAllGames = async () => {
    try {
      const data = await getAllGames();
      setAllGames(Array.isArray(data) ? data : data?.games || []);
      showMsg("info", "Loaded all games");
    } catch (e) {
      showMsg("danger", e.message || "Failed to load games");
    }
  };

  const refreshMyGames = async () => {
    try {
      const data = await getMyGames();
      setMyGames(Array.isArray(data) ? data : data?.games || []);
      showMsg("info", "Loaded my games");
    } catch (e) {
      showMsg("danger", e.message || "Failed to load your games");
    }
  };

  const filteredGames = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allGames;
    return allGames.filter((g) =>
      `${g.title} ${g.genre} ${g.platform}`.toLowerCase().includes(q)
    );
  }, [search, allGames]);

  const doCreateDemoGame = async () => {
    try {
      const games = await getAllGames();
      const list = Array.isArray(games) ? games : games?.games || [];
      const exists = list.some((g) => g.title?.toLowerCase() === "god of war");
      if (exists) return showMsg("warning", "God of War already exists.");

      const newGame = {
        title: "God of War",
        genre: "Action",
        platform: "PlayStation",
        releaseYear: 2018,
        developer: "Santa Monica Studio",
        rating: 9,
        description: "Action adventure game",
      };

      const created = await createGame(newGame);
      showMsg("success", `Created: ${created?.title || "game"}`);
      await refreshAllGames();
    } catch (e) {
      showMsg("danger", e.message || "Create failed");
    }
  };

  const addToLibrary = async (gameId) => {
    try {
      if (!isLoggedIn) return showMsg("warning", "Login first.");
      await addGameToMyLibrary(gameId);
      showMsg("success", "Added to your library");
      await refreshMyGames();
    } catch (e) {
      showMsg("danger", e.message || "Add failed");
    }
  };

  const removeFromLibrary = async (gameId) => {
    try {
      if (!isLoggedIn) return showMsg("warning", "Login first.");
      await removeGameFromMyLibrary(gameId);
      showMsg("success", "Removed from your library");
      await refreshMyGames();
    } catch (e) {
      showMsg("danger", e.message || "Remove failed");
    }
  };
const isAdmin = user?.role === "admin";

  // ✅ FIX: put delete logic in an async function (no “await” error)
  const handleDeleteGame = async (e, gameId) => {
    e.stopPropagation();
    try {
      await deleteGame(gameId);
      showMsg("success", "Game deleted");
      if (selectedGame?._id === gameId) setSelectedGame(null);
      await refreshAllGames();
    } catch (err) {
      showMsg("danger", err.message || "Delete failed");
    }
  };

 return (
  <div
    style={{
      minHeight: "100vh",
      position: "relative",
      backgroundImage: `linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)), url(${bg})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
  >
    {/* 3D background layer */}
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <ThreeBackground />
    </div>

      {/* ✅ Foreground UI */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <Container className="py-4">
          <Row className="justify-content-center">
            <Col lg={10} xl={9}>
              <Card
                className="shadow-lg border-0"
                style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "#fff" }}
              >
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <div>
                      <h2 className="mb-1">Exercise 2 Game Library</h2>
                      <div className="text-white-50"></div>
                    </div>

                    <div className="text-end">
                      <div>
                        Status{" "}
                        <Badge bg={status.loggedIn ? "success" : "danger"}>
                          {status.text}
                        </Badge>
                      </div>
                      <div className="text-white-50">
                        User: <b>{user?.username || "None"}</b>
                      </div>
                    </div>
                  </div>

                  {msg.text && (
                    <Alert
                      className="mt-3"
                      variant={msg.type || "info"}
                      dismissible
                      onClose={() => setMsg({ type: "", text: "" })}
                    >
                      {msg.text}
                    </Alert>
                  )}

                  <Row className="mt-3 g-3">
                    {/* AUTH */}
                    <Col md={6}>
                      <Card
                        className="h-100 border-0"
                        style={{ backgroundColor: "rgba(0,0,0,0.25)", color: "#fff" }}
                      >
                        <Card.Body>
                          <h4 className="mb-3">Auth</h4>
                          <Form>
                            <Row className="g-2">
                              <Col>
                                <Form.Control
                                  value={username}
                                  onChange={(e) => setUsername(e.target.value)}
                                  placeholder="username"
                                />
                              </Col>
                              <Col>
                                <Form.Control
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  placeholder="password"
                                  type="password"
                                />
                              </Col>
                            </Row>

                            <div className="d-flex gap-2 mt-3">
                              <Button variant="primary" onClick={doRegister}>
                                Register
                              </Button>
                              <Button variant="success" onClick={doLogin}>
                                Login
                              </Button>
                              <Button variant="outline-light" onClick={checkMe}>
                                Check /me
                              </Button>
                            </div>
                          </Form>
                        </Card.Body>
                      </Card>
                    </Col>

                    {/* ACTIONS */}
                    <Col md={6}>
                      <Card
                        className="h-100 border-0"
                        style={{ backgroundColor: "rgba(0,0,0,0.25)", color: "#fff" }}
                      >
                        <Card.Body>
                          <h4 className="mb-3">Games</h4>

                          <div className="d-flex flex-wrap gap-2">
                            <Button variant="warning" onClick={doCreateDemoGame}>
                              Create Demo Game
                            </Button>
                            <Button variant="info" onClick={refreshAllGames}>
                              Load All Games
                            </Button>
                            <Button variant="outline-light" onClick={refreshMyGames}>
                              Load My Games
                            </Button>
                          </div>

                          <div className="text-white-50 mt-3" style={{ fontSize: 13 }}>
                            Tip: Click a game to view details. Use “Add” / “Remove” to manage your library.
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>

                    {/* ALL GAMES */}
                    <Col md={6}>
                      <Card
                        className="border-0"
                        style={{ backgroundColor: "rgba(0,0,0,0.25)", color: "#fff" }}
                      >
                        <Card.Body>
                          <h5 className="mb-3">All Games</h5>

                          <Form.Control
                            className="mb-3"
                            placeholder="Search by title, genre, platform..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                          />

                          {allGames.length === 0 ? (
                            <div className="text-white-50">No games loaded yet. Click “Load All Games”.</div>
                          ) : filteredGames.length === 0 ? (
                            <div className="text-white-50">No results for “{search}”.</div>
                          ) : (
                            <ListGroup variant="flush">
                              {filteredGames.map((g) => (
                                <ListGroup.Item
                                  key={g._id}
                                  action
                                  onClick={() => setSelectedGame(g)}
                                  style={{
                                    background: "transparent",
                                    color: "#fff",
                                    borderColor: "rgba(255,255,255,0.1)",
                                  }}
                                >
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                      <b>{g.title}</b>{" "}
                                      <span className="text-white-50">({g.platform})</span>
                                      <div className="text-white-50" style={{ fontSize: 13 }}>
                                        {g.genre} • {g.releaseYear} • Rating {g.rating}
                                      </div>
                                    </div>

                                    <div className="d-flex gap-2">
                                      <Button
                                        size="sm"
                                        variant="primary"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          addToLibrary(g._id);
                                        }}
                                      >
                                        Add
                                      </Button>
{isAdmin && (
    <Button
      size="sm"
      variant="danger"
      onClick={(e) => handleDeleteGame(e, g._id)}
    >
                                        Delete
                                      </Button>
)}
                                    </div>
                                  </div>
                                </ListGroup.Item>
                              ))}
                            </ListGroup>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>

                    {/* MY GAMES */}
                    <Col md={6}>
                      <Card
                        className="border-0"
                        style={{ backgroundColor: "rgba(0,0,0,0.25)", color: "#fff" }}
                      >
                        <Card.Body>
                          <h5 className="mb-3">My Library</h5>

                          {myGames.length === 0 ? (
                            <div className="text-white-50">No games in your library yet.</div>
                          ) : (
                            <ListGroup variant="flush">
                              {myGames.map((g) => (
                                <ListGroup.Item
                                  key={g._id}
                                  action
                                  onClick={() => setSelectedGame(g)}
                                  style={{
                                    background: "transparent",
                                    color: "#fff",
                                    borderColor: "rgba(255,255,255,0.1)",
                                  }}
                                >
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                      <b>{g.title}</b>{" "}
                                      <span className="text-white-50">({g.platform})</span>
                                    </div>

                                    <Button
                                      size="sm"
                                      variant="outline-danger"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeFromLibrary(g._id);
                                      }}
                                    >
                                      Remove
                                    </Button>
                                  </div>
                                </ListGroup.Item>
                              ))}
                            </ListGroup>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>

                    {/* DETAILS */}
                    <Col>
                      <Card
                        className="border-0"
                        style={{ backgroundColor: "rgba(0,0,0,0.25)", color: "#fff" }}
                      >
                        <Card.Body>
                          <h5 className="mb-3">Game Details</h5>
                          {!selectedGame ? (
                            <div className="text-white-50">Click a game from either list to see details here.</div>
                          ) : (
                            <>
                              <h4 className="mb-1">{selectedGame.title}</h4>
                              <div className="text-white-50">
                                {selectedGame.genre} • {selectedGame.platform} • {selectedGame.releaseYear}
                              </div>
                              <div className="mt-2">
                                <b>Developer:</b> {selectedGame.developer}
                              </div>
                              <div>
                                <b>Rating:</b> {selectedGame.rating}
                              </div>
                              <div className="mt-2">
                                <b>Description:</b> {selectedGame.description}
                              </div>
                            </>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <div className="text-center text-white-50 mt-3" style={{ fontSize: 12 }}>
                Keep Gaming!!! bros!
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}