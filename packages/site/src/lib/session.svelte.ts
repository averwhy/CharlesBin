import type { api } from "./api";

export type User = NonNullable<Awaited<ReturnType<typeof api.user.get>>["data"]>;

export let session = $state<{ user: User | null }>({ user: null });
