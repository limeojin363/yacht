import mysql from "mysql2/promise";
import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import http from "http";
import dotenv from "dotenv";
import { signup } from "./routes/signup";
import { login } from "./routes/login";
import { refresh } from "./routes/refresh";

dotenv.config();

const app = express();

const server = http.createServer(app);

export const wss = new WebSocketServer({ server });

app.use(cors());

const PORT = 3000;

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

app.post("/user", signup);
app.post("/login", login);
app.post("/refresh", refresh);

