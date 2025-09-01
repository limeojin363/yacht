import mysql from "mysql2/promise";
import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import { login } from "./routes/user/login";
import { refresh } from "./routes/user/refresh";
import { generateGame } from "./routes/admin/generateGame";
import { createHashedPassword, createSalt, signup } from "./routes/user/signup";
import { enterTheGame } from "./routes/game/enter";
import { exitTheGame } from "./routes/game/exit";

dotenv.config();

const app = express();
export const server = http.createServer(app);

// export const wss = new WebSocketServer({ server });

app.use(cors());

const PORT = 3000;

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  database: process.env.DB_NAME,
});

// DB에 admin이 존재하지 않는다면 env에 입력된 DEFAULT 정보를 통해 자동 생성
(async () => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM users WHERE authority_level = 0`
    );
    if (!(rows instanceof Array)) throw new Error("DB Connection Error");
    if (rows.length > 0) {
      console.log("Admin user exists");
      return;
    }

    const username = process.env.DEFAULT_ADMIN_USERNAME as string;
    const salt = await createSalt();
    const password = await createHashedPassword(
      process.env.DEFAULT_ADMIN_PASSWORD as string,
      salt
    );
    const authority_level = 0;
    const g_connected = 0;

    await pool.query(
      `INSERT INTO users (username, password, salt, authority_level, g_connected) VALUES (?, ?, ?, ?, ?)`,
      [username, password, salt, authority_level, g_connected]
    );
    console.log("Created default admin user");
  } catch (error) {
    console.error(error);
  }
})();

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

app.post("/user/signup", signup);
app.post("/user/login", login);
app.post("/user/refresh", refresh);
app.post("/admin/generate-game", generateGame);
app.post("/game/enter", enterTheGame);
app.delete("/game/exit", exitTheGame);
