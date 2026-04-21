import { cors } from "@elysiajs/cors";
import { eq } from "drizzle-orm";
import { Elysia } from "elysia";
import { humanId } from "human-id";
import z from "zod";
import { db } from "./db/index.ts";
import { pastes, users } from "./db/schema.ts";
import { createUser, fetchUser, userExists } from "./db/user.ts";
import { env } from "./env.ts";
import { generateAccessToken, verifyToken } from "./jwt.ts";

const app = new Elysia()
    .use(
        cors({
            origin: env.CORS_ORIGIN,
            credentials: true,
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
        }),
    )
    .post(
        "/login",
        async ({ body: { email, password }, status }) => {
            const user = await fetchUser(email, password);

            if (!user)
                return status(404, {
                    error: "Invalid email address or password",
                });

            const token = generateAccessToken(user.id);

            return { token, user: { id: user.id, email: user.email } };
        },
        {
            body: z.object({
                email: z.email().max(100),
                password: z.string().max(100),
            }),
        },
    )
    .post(
        "/register",
        async ({ body: { email, password }, set, status }) => {
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

            return { token, user: { id: user.id, email: user.email } };
        },
        {
            body: z.object({
                email: z.email().max(100),
                password: z.string().max(100),
            }),
        },
    )
    .get("/pastes/:short_id", async ({ params: { short_id }, status }) => {
        const [result] = await db.select().from(pastes).where(eq(pastes.short_id, short_id)).limit(1);

        if (!result) return status(404, { error: "Paste not found" });

        return { language: result.language, text: result.text };
    })
    .derive(async ({ headers, status }) => {
        const token = headers.authorization;

        if (!token || typeof token !== "string")
            return status(401, {
                error: "Unauthorized",
            });

        const verifiedToken = verifyToken(token);

        if (!verifiedToken)
            return status(401, {
                error: "Unauthorized",
            });

        const user = (await db.select().from(users).where(eq(users.id, verifiedToken.sub)).limit(1))[0];

        if (!user)
            return status(404, {
                error: "User not found",
            });

        return { user: { id: user.id, email: user.email } };
    })
    .get("/user", async ({ user }) => {
        return { id: user.id, email: user.email };
    })
    .post(
        "/pastes",
        async ({ body: { language, text }, status, user }) => {
            const [result] = await db
                .insert(pastes)
                .values({
                    language,
                    owner: user.id,
                    short_id: humanId({
                        capitalize: false,
                    }),
                    text,
                })
                .returning();

            if (!result) return status(500, { error: "Failed to create paste" });

            return { short_id: result.short_id };
        },
        {
            body: z.object({
                language: z.string().max(50).optional(),
                text: z.string().max(1_000_000),
            }),
        },
    )
    .listen(3000);

export type App = typeof app;

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
