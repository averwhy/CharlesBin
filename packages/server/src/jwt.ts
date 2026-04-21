import { sign, verify, type JwtPayload } from "jsonwebtoken";
import { env } from "./env.ts";

export function generateAccessToken(userId: string): string {
    return sign({ sub: userId, type: "access" }, env.jwtSecrets.access, {
        expiresIn: "7d",
    });
}

export function verifyToken(token: string): (JwtPayload & { sub: string }) | null {
    const secret = env.jwtSecrets.access;

    try {
        const decoded = verify(token, secret) as JwtPayload;

        // Verify token contains a user id
        if (!decoded.sub) {
            return null;
        }

        // Verify token type matches expected type
        if (decoded.type !== "access") {
            return null;
        }

        if (typeof decoded.sub !== "string") {
            return null;
        }

        return decoded as JwtPayload & { sub: string };
    } catch {
        return null;
    }
}
