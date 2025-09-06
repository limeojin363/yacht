import { RequestHandler } from "express";
import z from "zod";
import { pool } from "../..";

export const getGames: RequestHandler = (req, res) => {
    try {
        
    } catch (error) {
        
    }
};

const SchemaOf = {
    Rows: z.array(z.object({
        id: z.number(),
        in_progress: z.number().min(0).max(1),
        name: z.string(),
    }))
}

const FromDB = {
    getRows: async () => {
        const [rows] = await pool.query(
            `SELECT g.id, g.in_progress, g.name,
             JSON_ARRAYAGG(u.id) AS u_id_list,
             JSON_ARRAYAGG(u.name) AS u_name_list
            FROM games g
            LEFT JOIN users u ON g.id = u.g_id
            WHERE u.id IS NOT NULL
            GROUP BY g.id, g.in_progress, g.name
            LIMIT 10`
        );
        const parsedRows = SchemaOf.Rows.parse(rows);
        return parsedRows;
    }
};
