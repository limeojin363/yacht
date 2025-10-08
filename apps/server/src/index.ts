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
import { PrismaClient } from "@prisma/client";
import { createHashedPassword, createSalt } from "./auths/hash.js";

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
  cors: ({ defaultHeaders }) => {
    defaultHeaders["Access-Control-Allow-Origin"] = "*";
    defaultHeaders["Access-Control-Allow-Methods"] =
      "GET, POST, PUT, DELETE, PATCH";
    defaultHeaders["Access-Control-Allow-Headers"] =
      "Content-Type, Authorization";

    return defaultHeaders;
  },
});

dotenv.config();

(async () => {
  const { app } = await createServer(config, routing);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  const expressServer = app.listen(3000);
  registerSocket(expressServer);

  console.log("Server is running on http://localhost:3000");
})();

// DB에 admin이 존재하지 않는다면 env에 입력된 DEFAULT 정보를 통해 자동 생성
(async () => {
  try {
    const prismaClient = new PrismaClient();
    const admin = await prismaClient.user.findFirst({
      where: { authorityLevel: 0 },
    });
    if (admin) {
      console.log("Admin exists");
      return;
    }

    const defaultAdminUsername = process.env.DEFAULT_ADMIN_USERNAME;
    const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD;

    if (!defaultAdminUsername || !defaultAdminPassword) {
      console.error("Default admin credentials are not set in env");
      return;
    }

    const salt = await createSalt();
    const hashedPassword = await createHashedPassword(
      defaultAdminPassword,
      salt
    );

    await prismaClient.user.create({
      data: {
        name: defaultAdminUsername,
        password: hashedPassword,
        salt,
        authorityLevel: 0,
      },
    });

    console.log("Created default admin user");
  } catch (error) {
    console.error(error);
  }
})();

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
