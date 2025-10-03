import mysql from "mysql2/promise";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { login } from "./routes/user/login.js";
import { refresh } from "./routes/user/refresh.js";
import { generateGame } from "./routes/game/generateGame.js";
import { signup } from "./routes/user/signup.js";
import { enterTheGame } from "./routes/game/enter.js";
import { exitTheGame } from "./routes/game/exit.js";
import { getUserList } from "./routes/user/getUserList.js";
import { getGameList } from "./routes/game/getGameList.js";
import { createHashedPassword, createSalt } from "./auths/hash.js";
import { wss } from "./sockets/wss.js";
import { getInitialGameStatus } from "@yacht/default-game";
import getMyInfo from "./routes/user/getMyInfo.js";

dotenv.config();

const app = express();
app.use(cors());

const PORT = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export const expressServer = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

wss();

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running!" });
});

app.post("/user/signup", signup);
app.post("/user/login", login);
app.post("/user/refresh", refresh);
app.post("/game/generate", generateGame);
app.get("/user/me", getMyInfo);
app.get("/user/list", getUserList);
app.get("/game/list", getGameList);
app.post("/game/enter", enterTheGame);
app.delete("/game/exit", exitTheGame);

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
    const g_playerId = null;

    await pool.query(
      `INSERT INTO users (username, password, salt, authority_level, g_playerId) VALUES (?, ?, ?, ?, ?)`,
      [username, password, salt, authority_level, g_playerId]
    );
    console.log("Created default admin user");
  } catch (error) {
    console.error(error);
  }
})();

(async () => {
  try {
    const [rows] = await pool.query(`SELECT * FROM games`);
    if (!(rows instanceof Array)) throw new Error("DB Connection Error");
    if (rows.length > 0) {
      console.log("Game exists");
      return;
    }

    await pool.query(
      `INSERT INTO games (name, progress_type, game_object) VALUES (?, ?, ?)`,
      ["샘플 게임", 0, JSON.stringify(getInitialGameStatus(2))]
    );
    console.log("Created default game");
  } catch (error) {
    console.error(error);
  }
})();
