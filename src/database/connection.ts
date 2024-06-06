import { FieldPacket, QueryError, QueryResult } from "mysql2";
import pool from "./database";

export default function dbQuery(
    query: string,
    params: any[],
    onSuccess: (results: QueryResult, fields: FieldPacket[]) => void,
    onError: (err: QueryError | NodeJS.ErrnoException) => void
) {
    pool.getConnection((err, con) => {
        if (err) {
            console.log("\x1B[31m%s\x1B[0m", "[SQL ERROR]", err.message);
            onError(err);
            con.release();
            return;
        }
        con.query(query, params, function (err, results, fields) {
            if (err) {
                console.log("\x1B[31m%s\x1B[0m", "[SQL ERROR]", err.message);
                onError(err);
                return;
            }
            onSuccess(results, fields);
            con.release();
        });
    });
}
