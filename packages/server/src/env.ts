import z from "zod";

export const env = z
    .object({
        /** CORS origin for client. */
        CORS_ORIGIN: z.url(),
        /** Postgres connection string. */
        DATABASE_URL: z.url(),
        /** JWT access token secrets. */
        JWT_ACCESS_SECRET: z.string(),
        /** Runtime environment. Currently only changes whether secure cookies are used. */
        NODE_ENV: z.enum(["development", "production", "test"]),
    })
    .transform(env => {
        const { JWT_ACCESS_SECRET, ...rest } = env;

        return {
            ...rest,
            ...{
                jwtSecrets: {
                    access: JWT_ACCESS_SECRET,
                },
            },
        };
    })
    .parse(process.env);
