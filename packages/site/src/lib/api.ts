import { treaty } from "@elysiajs/eden";
import type { App } from "../../../server/src/index";

export const api = treaty<App>(import.meta.env.VITE_API_HOSTNAME);
