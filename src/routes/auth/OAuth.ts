import dbQuery, { InsertResult } from "@src/database/connection";
import { User } from "../types/user";
import { SQLError, UserError } from "@src/common/Errors";

const findUser = (OAuth_id: string, type: string): Promise<User> => {
    const sql = `SELECT * FROM users WHERE ${getColumnByType(type)} = ? LIMIT 1`;
    return new Promise((resolve, reject) => {
        dbQuery(
            sql,
            [OAuth_id],
            (results) => {
                if (results.constructor === Array && results.length === 1) {
                    console.log("[NOTE] - OAuth登录完成");
                    resolve(results[0] as User);
                } else {
                    console.log("[SQL WARNING] - OAuth完成，但数据库找不到用户，进入注册流程");
                    reject(new UserError("用户不存在", 2));
                }
            },
            () => {
                reject(new SQLError("数据库错误"));
            }
        );
    });
};

interface createUserResult extends User {
    msg: string;
}

const createUser = (
    user: { name: string; email: string; avatar: string; github_id: string },
    type: string
): Promise<createUserResult> => {
    const { name, email, avatar, github_id } = user;
    const column = getColumnByType(type);
    const sqlColumns = `id, name, type, email, created_at, avatar, ${column}`;
    const sqlValues = `NULL, ?, ?, ?, ?, ?, ?`;
    const sqlCondition = `WHERE NOT EXISTS(SELECT name FROM users WHERE name = ?)`;
    const fullSql = `INSERT INTO users (${sqlColumns}) SELECT ${sqlValues} ${sqlCondition};`;
    return new Promise((resolve, reject) => {
        dbQuery(
            fullSql,
            [name, "reader", email, new Date(), avatar, github_id, name],
            (results) => {
                if (typeof results == "object") {
                    const insertResult: InsertResult = results as InsertResult;
                    if (insertResult.affectedRows === 1)
                        dbQuery(
                            "SELECT * FROM users where github_id = ? LIMIT 1;",
                            [github_id],
                            (results) => {
                                if (results.constructor === Array && results.length === 1) {
                                    const result = results[0] as User;
                                    console.log("[NOTE] - OAuth注册完成，用户名为" + result.name);
                                    resolve({ ...result, msg: "注册成功" });
                                } else {
                                    console.log("[SQL WARNING] - OAuth注册后未找到用户或用户重复 - " + results);
                                    reject(new UserError("用户名重复或其他错误", 1));
                                }
                            },
                            () => {
                                reject(new SQLError("数据库错误"));
                            }
                        );
                    else if (insertResult.affectedRows === 0) {
                        const newName = `${crypto.randomUUID()}-${name}-${crypto.randomUUID()}`;
                        dbQuery(
                            fullSql,
                            [newName, "reader", email, new Date(), avatar, github_id, newName],
                            (results) => {
                                if (typeof results == "object") {
                                    const insertResult: InsertResult = results as InsertResult;
                                    if (insertResult.affectedRows === 1)
                                        dbQuery(
                                            "SELECT * FROM users where github_id = ? LIMIT 1;",
                                            [github_id],
                                            (results) => {
                                                if (results.constructor === Array && results.length === 1) {
                                                    console.log("[NOTE] - OAuth注册完成，重置后的用户名为" + newName);
                                                    const result = results[0] as User;
                                                    resolve({ ...result, msg: "注册成功，但用户名已重置" });
                                                } else {
                                                    console.log(
                                                        "[SQL WARNING] - OAuth注册后未找到用户或用户重复 - " + results
                                                    );
                                                    reject(new UserError("用户名重复或其他错误", 1));
                                                }
                                            },
                                            () => {
                                                reject(new SQLError("数据库错误"));
                                            }
                                        );
                                    else if (insertResult.affectedRows === 1)
                                        reject(new UserError("用户名及其重复", 1));
                                    else reject(new SQLError("数据库错误"));
                                } else reject(new SQLError("数据库错误"));
                            },
                            () => {
                                reject(new SQLError("数据库错误"));
                            }
                        );
                    } else reject(new SQLError("数据库错误-1"));
                } else reject(new SQLError("数据库错误-2"));
            },
            () => {
                reject(new SQLError("数据库错误-3"));
            }
        );
    });
};

export default { findUser, createUser } as const;

const typeToColumnMap: { [key: string]: string } = {
    github: "github_id",
    google: "google_id",
};
function getColumnByType(type: string): string | undefined {
    return typeToColumnMap[type];
}
