import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  cookieName: "token",
  cookieOptions: { httpOnly: true, sameSite: "lax", secure: false, maxAge: 1000 * 60 * 60 * 2 }
};
