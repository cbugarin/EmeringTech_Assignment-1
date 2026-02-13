const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function setTokenCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, 
  });
}

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ message: "Username and password required" });

    const existing = await User.findOne({ username });
    if (existing) return res.status(409).json({ message: "Username taken" });

    const hashed = await bcrypt.hash(password, 10);

   const user = await User.create({
  username,
  password: hashed,
  role: username === "admin" ? "admin" : "user", 
  games: [],
});


    return res.status(201).json({ message: "Registered successfully", userId: user._id });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ message: "Username and password required" });

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    setTokenCookie(res, token);

    return res.json({ message: "Login successful" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.logout = async (req, res) => {
  res.clearCookie("token");
  return res.json({ message: "Logged out" });
};

exports.me = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.json({ loggedIn: false });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
   const user = await User.findById(decoded.id).select("username role games");


    if (!user) return res.json({ loggedIn: false });

    return res.json({ loggedIn: true, user });
  } catch {
    return res.json({ loggedIn: false });
  }
};
