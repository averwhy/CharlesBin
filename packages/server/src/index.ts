import { Elysia, t } from "elysia";
import z from "zod";
import { createUser, fetchUser, userExists } from "./db/user.ts";
import { env } from "./env.ts";
import { generateAccessToken } from "./jwt.ts";

const app = new Elysia()
    .get("/", () => "Hello Elysia")
    .post(
        "/login",
        async ({ body: { email, password }, cookie: { authorization }, status }) => {
            const user = await fetchUser(email, password);

            if (!user)
                return status(404, {
                    error: "Invalid email address or password",
                });

            const token = generateAccessToken(user.id);

            authorization.set({
                httpOnly: true,
                path: "/",
                maxAge: 7 * 24 * 60 * 60,
                sameSite: "lax",
                secure: env.NODE_ENV === "production",
                value: token,
            });

            return { id: user.id, email: user.email };
        },
        {
            body: z.object({
                email: z.email().max(100),
                password: z.string().max(100),
            }),
            cookie: t.Cookie(
                {
                    authorization: t.Optional(t.String()),
                },
                {
                    httpOnly: true,
                    secure: env.NODE_ENV === "production",
                },
            ),
        },
    )
    .post(
        "/register",
        async ({ body: { email, password }, cookie: { authorization }, status }) => {
            const exists = await userExists(email);

            if (exists)
                return status(409, {
                    error: "A user with that email already exists",
                });

            const user = await createUser(email, password);

            if (!user)
                return status(500, {
                    error: "Failed to register user",
                });

            const token = generateAccessToken(user.id);

            authorization.set({
                httpOnly: true,
                path: "/",
                maxAge: 7 * 24 * 60 * 60,
                sameSite: "lax",
                secure: env.NODE_ENV === "production",
                value: token,
            });

            return { id: user.id, email: user.email };
        },
        {
            body: z.object({
                email: z.email().max(100),
                password: z.string().max(100),
            }),
            cookie: t.Cookie(
                {
                    authorization: t.Optional(t.String()),
                },
                {
                    httpOnly: true,
                    secure: env.NODE_ENV === "production",
                },
            ),
        },
    )
    .listen(3000);

export type App = typeof app;

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
