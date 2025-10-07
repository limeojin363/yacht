// import { type RequestHandler } from "express";
// import z from "zod";
// import { pool } from "../../index.js";
// import type {
//   GetGameListResBody,
//   GetGameListReqBody,
// } from "@yacht/communications";
// import verifyAuthHeader from "../../auths/verifyUser.js";
// import { GameStatusSchema } from "@yacht/default-game";

// export const getGameList: RequestHandler<
//   {},
//   GetGameListResBody | { message: string },
//   GetGameListReqBody
// > = async (req, res) => {
//   const { authority_level } = await verifyAuthHeader(
//     req.headers["authorization"]
//   );

//   try {
//     const rows = await FromDB.getRows();

//     if (authority_level !== 0) {
//       // 관리자 권한이 아닌 경우, progress_type이 0인 게임만 필터링
//       const filteredRows = rows.filter((game) => game.progress_type === 0);
//       return res.status(200).json({
//         games: filteredRows.map(({ id, name, game_object, u_id_list }) => ({
//           id,
//           name,
//           totalPlayersNum: game_object.totalPlayersNum,
//           currentPlayers: u_id_list.length as 0 | 1 | 2 | 3 | 4,
//         })),
//       });
//     }

//     // 관리자 권한이 있는 경우, 모든 게임 반환
//     return res.status(200).json({
//       games: rows.map(({ id, name, game_object, u_id_list, u_name_list }) => ({
//         id,
//         name,
//         totalPlayersNum: game_object.totalPlayersNum,
//         currentPlayers: u_id_list.length as 0 | 1 | 2 | 3 | 4,
//         infoForAdmin: { u_id_list, u_name_list },
//       })),
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// const SchemaOf = {
//   ProcessedRows: z.array(
//     z.object({
//       game_object: GameStatusSchema,
//       id: z.number(),
//       progress_type: z.union([z.literal(0), z.literal(1), z.literal(2)]),
//       name: z.string(),
//       u_id_list: z.array(z.number()),
//       u_name_list: z.array(z.string()),
//     })
//   ),
//   Rows: z.array(
//     z.object({
//       game_object: GameStatusSchema,
//       id: z.number(),
//       progress_type: z.union([z.literal(0), z.literal(1), z.literal(2)]),
//       name: z.string(),
//       u_id_list: z.array(z.number()),
//       u_name_list: z.array(z.string()),
//     })
//   ),
// };

// const FromDB = {
//   getRows: async () => {
//     const [rows] = await pool.query(
//       `SELECT g.id,
//        g.progress_type,
//        g.name,
//        g.game_object,
//        IF(COUNT(u.id) = 0, JSON_ARRAY(),
//           JSON_ARRAYAGG(u.id)) AS u_id_list,
//        IF(COUNT(u.id) = 0, JSON_ARRAY(),
//           JSON_ARRAYAGG(u.username)) AS u_name_list
// FROM games AS g
// LEFT JOIN users AS u ON g.id = u.g_id
// GROUP BY g.id, g.progress_type, g.name, g.game_object
// LIMIT 10
// `
//     );
//     const parsedRows = SchemaOf.Rows.parse(rows);

//     const processedRows = parsedRows.map(
//       ({ game_object, id, name, progress_type, u_id_list, u_name_list }) => ({
//         id,
//         name,
//         progress_type,
//         u_id_list: u_id_list,
//         u_name_list: u_name_list,
//         game_object: game_object,
//       })
//     );

//     return SchemaOf.ProcessedRows.parse(processedRows);
//   },
// };
