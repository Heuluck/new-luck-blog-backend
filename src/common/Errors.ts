export class UserError extends Error {
    code: number;
    /**
     * 1: 用户名冲突
     * 2: 用户不存在
     */
    constructor(message: string,code: number) {
        super(message);
        this.code = code;
        this.name = "UserError";
    }
}

export class SQLError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InternalError";
    }
}