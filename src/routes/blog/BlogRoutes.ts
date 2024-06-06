import HttpStatusCodes from "@src/common/HttpStatusCodes";

import { IReq, IRes } from "../types/express/misc";
import dbQuery from "@src/database/connection";

async function getAll(_: IReq, res: IRes) {
    dbQuery(
        //只选择content的前80个字符
        "SELECT id, username, lastUpdate, title, LEFT(content, 80) AS content,titleURL FROM articles;",
        [],
        (results) => {
            return res.status(HttpStatusCodes.OK).json({ code: 200, message: "查询成功", data: results });
        },
        () => {
            return res
                .status(HttpStatusCodes.OK)
                .json({ code: 500, message: "[DATABASE ERROR] - Please check the logs" });
        }
    );
}

async function getById(req: IReq, res: IRes) {
    const id = +req.params.id;
    dbQuery(
        //只选择content的前80个字符
        "SELECT * FROM articles WHERE id = ?",
        [id],
        (results) => {
            return res.status(HttpStatusCodes.OK).json({ code: 200, message: "查询成功", data: results });
        },
        () => {
            return res
                .status(HttpStatusCodes.OK)
                .json({ code: 500, message: "[DATABASE ERROR] - Please check the logs" });
        }
    );
}

async function getByTitleURL(req: IReq, res: IRes) {
    const titleURL = req.params.titleURL;
    dbQuery(
        //只选择content的前80个字符
        "SELECT * FROM articles WHERE titleURL = ? LIMIT 1",
        [titleURL],
        (results) => {
            return results.constructor === Array && results.length > 0
                ? res.status(HttpStatusCodes.OK).json({ code: 200, message: "查询成功", data: results[0] })
                : res.status(HttpStatusCodes.NOT_FOUND).json({ code: 404, message: "找不到文章" });
        },
        () => {
            return res
                .status(HttpStatusCodes.OK)
                .json({ code: 500, message: "[DATABASE ERROR] - Please check the logs" });
        }
    );
}

export default {
    getAll,
    getById,
    getByTitleURL,
} as const;
