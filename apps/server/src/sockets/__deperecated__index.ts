// import { GameStatusSchema, type PlayersNum } from "@yacht/default-game";
// import { expressServer } from "../index";
// import z from "zod";
// import { Server } from "socket.io";
// import verifyAuthHeader from "../auths/verifyUser";
// import onConnection from "./handlers";

// export const wss = () => {
//   const io = new Server(expressServer, {
//     cors: {
//       origin: [
//         "https://shiny-space-capybara-q5v4qxjx6vx3x75g-5173.app.github.dev",
//       ],
//       methods: ["GET", "POST"],
//     },
//   });

//   io.of("/game", onConnection(io));

//   io.of("/game")
//     .on("connection", async (socket) => {
//       let userId: number,
//         username: string,
//         gameId: number,
//         totalPlayersNum: PlayersNum,
//         g_playerId: number | null,
//         g_playerColor: string | null,
//         progressType: number;
//       try {
//         let gameIdFromAuth: number | null;
//         ({
//           id: userId,
//           username,
//           g_id: gameIdFromAuth,
//           g_playerId,
//           g_playerColor,
//         } = await verifyAuthHeader(
//           socket.handshake.query["Authorization"] as string
//         ));
//         gameId = Number(socket.handshake.query["gameId"]);

//         // 게임 ID가 유효하지 않음
//         if (!gameId) throw new Error("No gameId given from client");
//         // 유저가 게임에 등록되어 있고, 그 게임이 다른 게임임
//         if (gameIdFromAuth !== null && gameIdFromAuth !== gameId)
//           throw new Error("User is already in another game");

//         ({
//           game_object: { totalPlayersNum },
//           progress_type: progressType,
//         } = await FromDB.getGameInfo(gameId));

//         if (progressType === 2) {
//           socket.send("Game has already ended");
//           socket.disconnect();
//           return;
//         }

//         // 아직 등록되지 않은 유저(신규 입장)
//         if (gameIdFromAuth === null) {
//           gameIdFromAuth = gameId;
//           // DB의 게임 정보로부터 playerId 생성
//           g_playerId = await FromDB.generatePlayerId(gameId, totalPlayersNum);
//           g_playerColor = generateRandomHexColor();

//           // DB에 등록
//           await FromDB.setUser({
//             g_playerColor,
//             g_id: gameIdFromAuth,
//             g_playerId,
//             userId,
//             g_connected: 1,
//           });

//           // 해당 방에 접속한 클라이언트들에게 새 유저 입장 알림
//           socket.to(String(gameId)).emit("new-player-entered", {
//             username,
//             g_playerId,
//             g_playerColor,
//             userId,
//             g_connected: 1,
//           });
//         }
//         // 이미 등록된 유저(재접속)
//         else {
//           await FromDB.setUser({
//             g_playerColor,
//             g_id: gameIdFromAuth,
//             g_playerId,
//             userId,
//             g_connected: 1,
//           });

//           socket.to(String(gameId)).emit("player-reconnected", userId);
//         }

//         // 소켓을 gameId에 해당되는 room에 등록
//         socket.join(String(gameId));
//       } catch (error) {
//         console.log(error);
//         socket.send(error);
//         socket.disconnect();
//         return;
//       }

//       const getPlayerList = async () => {
//         const _playerList = await FromDB.getCurrentPlayers(gameId);
//         const playerList: (null | {
//           username: string;
//           userId: number;
//           playerColor: string | null;
//           connected: number;
//         })[] = Array.from({ length: totalPlayersNum }, () => null);
//         _playerList.forEach((p) => {
//           if (p.g_playerId !== null)
//             playerList[p.g_playerId] = {
//               username: p.username,
//               userId: p.userId,
//               playerColor: p.g_playerColor,
//               connected: p.g_connected,
//             };
//         });
//         return playerList;
//       };

//       // 기존 방 정보를 클라이언트에 전파
//       socket.emit("current-room-info", {
//         playerList: await getPlayerList(),
//         progressType,
//         gameObject: (await FromDB.getGameInfo(gameId)).game_object,
//       });

//       // exit -> DB에서 제거 후 disconnect
//       socket.on("exit", async () => {
//         console.log("exit received", { g_id: gameId, userId });
//         try {
//           // 시작 안한 상태에서 나가기
//           if (progressType === 0) {
//             // socket room에서 제거
//             socket.leave(String(gameId));
//             // 유저 퇴장 알림
//             socket.to(String(gameId)).emit("player-exited", userId);
//             // 해당 socket 끊기
//             socket.disconnect();

//             // DB상의 유저 - 게임 참조 삭제
//             await FromDB.setUser({
//               userId,
//               g_id: null,
//               g_playerId: null,
//               g_playerColor: null,
//               g_connected: 0,
//             });
//           }
//           // 게임 진행 중 나가기
//           if (progressType === 1) {
//             // socket room에서 제거
//             socket.leave(String(gameId));
//             // 유저 퇴장 알림
//             socket.to(String(gameId)).emit("player-exited", userId);
//             // 해당 room과 연결된 모든 소켓 끊기
//             socket.to(String(gameId)).disconnectSockets();

//             // DB상의 유저 - 게임 참조 삭제
//             await FromDB.setUser({
//               userId,
//               g_id: null,
//               g_playerId: null,
//               g_playerColor: null,
//               g_connected: 0,
//             });
//             // 게임 row 삭제
//             await FromDB.deleteGame(gameId);
//           }
//         } catch (error) {
//           console.log("Error on exit: ", error);
//         }
//       });

//       // disconnect - 오류 등으로 우연히 끊긴 것으로 간주하고 방에서만 제거(DB 유지 및 재접속 대기)
//       socket.on("disconnect", async () => {
//         try {
//           const { g_id } = await verifyAuthHeader(
//             socket.handshake.query["Authorization"] as string
//           );
//           // 이미 exit 수행됨
//           if (g_id === null) return;

//           // 소켓 방에서 제거
//           socket.leave(String(gameId));
//           // DB에서 연결 끊김 처리
//           await FromDB.setUser({
//             userId,
//             g_id,
//             g_playerId,
//             g_playerColor,
//             g_connected: 0,
//           });
//           // 유저 연결 끊김 알림
//           socket.to(String(gameId)).emit("player-disconnected", userId);
//         } catch (error) {
//           console.log("Error on disconnect: ", error);
//         }
//       });

//       socket.on("game-start", async () => {
//         try {
//           // 어드민만 시작할 수 있음
//           const { authority_level } = await verifyAuthHeader(
//             socket.handshake.query["Authorization"] as string
//           );
//           if (authority_level !== 0)
//             throw new Error("No permission to start game");

//           // 인원 수 체크
//           if (
//             (await FromDB.getCurrentPlayers(gameId)).length !== totalPlayersNum
//           )
//             throw new Error("Not enough players to start the game");

//           // 이미 시작된 게임인지 체크
//           if (progressType !== 0) throw new Error("Game has already started");

//           // 클라이언트에 전파
//           socket.to(String(gameId)).emit("game-start");

//           await FromDB.setGameProgressType(gameId, 1);
//         } catch (error) {
//           console.log("Error on game start: ", error);
//         }
//       });

//       socket.on("game-interaction", async ({ type, payload }) => {
//         try {
//           if (progressType === 0) throw new Error("Game has not started yet");
//           if (progressType === 2) throw new Error("Game has already ended");

//           // 클라이언트에 전파
//           socket.to(String(gameId)).emit("game-interaction", { type, payload });
//           console.log({ type, payload });

//           // DB 백업(재접속 대비)
//           const { game_object } = await FromDB.getGameInfo(gameId);
//           const updatedGameStatus = getUpdatedGameStatus(game_object)({
//             type,
//             payload,
//           });

//           if (isGameFinished(updatedGameStatus)) {
//             await FromDB.setGameProgressType(gameId, 2);
//           }

//           await FromDB.setGameStatus(gameId, updatedGameStatus);
//         } catch (error) {
//           console.log("Error on game interaction: ", error);
//         }
//       });
//     });

//   const SchemaOf = {
//     GameRows: z.array(
//       z.object({
//         id: z.number(),
//         game_object: GameStatusSchema,
//         progress_type: z.number(),
//       })
//     ),
//     PlayerRows: z.array(
//       z.object({
//         username: z.string(),
//         g_playerId: z.number(),
//         g_playerColor: z.string().nullable(),
//         userId: z.number(),
//         g_connected: z.number(),
//       })
//     ),
//   };

//   const FromDB = {
//     getGameInfo: async (gameId: number) => {
//       const [rows] = await pool.query("SELECT * FROM games WHERE id = ?", [
//         gameId,
//       ]);
//       const parseResult = SchemaOf.GameRows.safeParse(rows);
//       if (!parseResult.success) throw new Error("Invalid game status");

//       return parseResult.data[0]!;
//     },
//     deleteGame: async (gameId: number) => {
//       await pool.query("DELETE FROM games WHERE id = ?", [gameId]);
//     },
//     generatePlayerId: async (gameId: number, totalPlayersNum: number) => {
//       const [rows] = await pool.query(
//         "SELECT username, g_playerId, g_playerColor, id AS userId, g_connected FROM users WHERE g_id = ?",
//         [gameId]
//       );
//       const parsedPlayers = SchemaOf.PlayerRows.parse(rows);
//       const takenIds = parsedPlayers.map((p) => p.g_playerId);
//       for (let i = 0; i < totalPlayersNum; i++) {
//         if (!takenIds.includes(i)) return i;
//       }
//       throw new Error("No available player IDs");
//     },
//     getCurrentPlayers: async (gameId: number) => {
//       const [playerRows] = await pool.query(
//         "SELECT username, g_playerId, g_playerColor, g_connected, id AS userId FROM users WHERE g_id = ?",
//         [gameId]
//       );
//       const parsedPlayers = SchemaOf.PlayerRows.parse(playerRows);

//       return parsedPlayers;
//     },
//     setGameStatus: async (gameId: number, gameStatus: GameStatus) => {
//       await pool.query("UPDATE games SET game_object = ? WHERE id = ?", [
//         JSON.stringify(gameStatus),
//         gameId,
//       ]);
//     },
//     setGameProgressType: async (gameId: number, progressType: number) => {
//       await pool.query("UPDATE games SET progress_type = ? WHERE id = ?", [
//         progressType,
//         gameId,
//       ]);
//     },
//     setUser: async ({
//       g_playerColor,
//       g_connected,
//       g_id,
//       g_playerId,
//       userId,
//     }: {
//       g_playerColor: string | null;
//       g_connected: number;
//       g_id: number | null;
//       g_playerId: number | null;
//       userId: number;
//     }) => {
//       await pool.query(
//         "UPDATE users SET g_playerColor = ?, g_connected = ?, g_id = ?, g_playerId = ? WHERE id = ?",
//         [g_playerColor, g_connected, g_id, g_playerId, userId]
//       );
//     },
//   };
// };
