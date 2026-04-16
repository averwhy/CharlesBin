import { compare, hash } from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "./index.ts";
import { users } from "./schema.ts";

export async function createUser(email: string, password: string) {
    return (
        await db
            .insert(users)
            .values({
                email: email.toLowerCase(),
                password: await hash(password, 10),
            })
            .onConflictDoNothing({ target: users.email })
            .returning()
    )[0];
}

export async function fetchUser(email: string, password: string) {
    const user = (await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1))[0];

    if (!user) return;

    if (!(await compare(password, user.password))) return;

    return user;
}

export async function userExists(email: string) {
    return !!(await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1))[0];
}
