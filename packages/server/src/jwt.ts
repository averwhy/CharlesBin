import { sign } from "jsonwebtoken";
import { env } from "./env.ts";

export function generateAccessToken(userId: string): string {
    return sign({ sub: userId, type: "access" }, env.jwtSecrets.access, {
        expiresIn: "7d",
    });
}
