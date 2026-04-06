import z from "zod";

export const env = z
    .object({
        /** Postgres connection string. */
        DATABASE_URL: z.url(),
    })
    .transform(env => {
        const { ...rest } = env;

        return {
            ...rest,
        };
    })
    .parse(process.env);
