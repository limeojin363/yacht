import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  Routing,
  createConfig,
  createServer,
  defaultEndpointsFactory,
} from "express-zod-api";
import loginEndpoint from "./endpoints/user/login.js";
import signupEndpoint from "./endpoints/user/signup.js";
import { gameListEndpoint } from "./endpoints/game/gameList.js";
import { generateGameEndpoint } from "./endpoints/game/generateGame.js";
import myInfoEndpoint from "./endpoints/user/myInfo.js";
import { deleteGameEndpoint } from "./endpoints/game/deleteGame.js";
import { updateGameEndpoint } from "./endpoints/game/updateGame.js";
import { registerSocket } from "./sockets/index.js";
import http from "http";
import z from "zod";

const routing: Routing = {
  "get /": defaultEndpointsFactory.build({
    output: z.object({
      message: z.string(),
    }),
    handler: async () => {
      return { message: "Default endpoint is working!" };
    },
  }),
  user: {
    "post /login": loginEndpoint,
    "post /signup": signupEndpoint,
    "get /me": myInfoEndpoint,
  },
  game: {
    "get /list": gameListEndpoint,
    "post /": generateGameEndpoint,
    "delete /:id": deleteGameEndpoint,
    "patch /:id": updateGameEndpoint,
  },
};

const config = createConfig({
  http: {
    listen: 3000,
  },
  cors: true,
});

createServer(config, routing).then(({ app }) => {
  dotenv.config();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  console.log("Server is running on http://localhost:3000");

  const httpServer = http.createServer(app);
  registerSocket(httpServer);
});

// const app = express();
// app.use(cors());

// const PORT = 3000;

// export const expressServer = app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

// app.get("/", (req, res) => {
//   res.status(200).json({ message: "Server is running!" });
// });

// app.post("/user/signup", signup);
// app.post("/user/login", login);
// app.post("/user/refresh", refresh);
// app.post("/game/generate", generateGame);
// app.get("/user/me", getMyInfo);
// app.get("/user/list", getUserList);
// app.get("/game/list", getGameList);

// export const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
//   database: process.env.DB_NAME,
// });

// // DB에 admin이 존재하지 않는다면 env에 입력된 DEFAULT 정보를 통해 자동 생성
// (async () => {
//   try {
//     const [rows] = await pool.query(
//       `SELECT * FROM users WHERE authority_level = 0`
//     );
//     if (!(rows instanceof Array)) throw new Error("DB Connection Error");
//     if (rows.length > 0) {
//       console.log("Admin user exists");
//       return;
//     }

//     const username = process.env.DEFAULT_ADMIN_USERNAME as string;
//     const salt = await createSalt();
//     const password = await createHashedPassword(
//       process.env.DEFAULT_ADMIN_PASSWORD as string,
//       salt
//     );
//     const authority_level = 0;
//     const g_playerId = null;

//     await pool.query(
//       `INSERT INTO users (username, password, salt, authority_level, g_playerId) VALUES (?, ?, ?, ?, ?)`,
//       [username, password, salt, authority_level, g_playerId]
//     );
//     console.log("Created default admin user");
//   } catch (error) {
//     console.error(error);
//   }
// })();

// (async () => {
//   try {
//     const [rows] = await pool.query(`SELECT * FROM games`);
//     if (!(rows instanceof Array)) throw new Error("DB Connection Error");
//     if (rows.length > 0) {
//       console.log("Game exists");
//       return;
//     }

//     await pool.query(
//       `INSERT INTO games (name, progress_type, game_object) VALUES (?, ?, ?)`,
//       ["샘플 게임", 0, JSON.stringify(getInitialGameStatus(2))]
//     );
//     console.log("Created default game");
//   } catch (error) {
//     console.error(error);
//   }
// })();
