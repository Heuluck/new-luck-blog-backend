/**
 * Express router paths go here.
 */

export default {
    Base: "/api",
    Ping: {
        Base: "/ping",
        Get: "/",
    },
    Blog: {
        Base: "/blog",
        Get: "/list",
        GetById: "/:id",
        GetByTitleURL: "/article/:titleURL",
    },
    Users: {
        Base: "/users",
        Get: "/all",
        Add: "/add",
        Update: "/update",
        Delete: "/delete/:id",
    },
    Auth: {
        Base: "/auth",
        REST: "/",
        Register: "/reg",
        OAuth:{
            Google: "/oauth/google",
            Facebook: "/oauth/facebook",
            Github: "/oauth/github",
            Twitter: "/oauth/twitter",
            LinkedIn: "/oauth/linkedin",
            Microsoft: "/oauth/microsoft",
            Apple: "/oauth/apple",
            Discord: "/oauth/discord",
            Slack: "/oauth/slack",
            Reddit: "/oauth/reddit",
            Twitch: "/oauth/twitch",
            Gitlab:"/oauth/gitlab",
        }
    },
} as const;
