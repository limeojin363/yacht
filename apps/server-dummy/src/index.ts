// src/index.ts
import express, { Request, Response } from 'express';
import { getInitialGameStatus } from "@yacht/default-game";
import http from "http";
import { Server } from "socket.io";

const app = express();
const port = process.env.PORT || 3000;

export const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Express with TypeScript!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
getInitialGameStatus(3);