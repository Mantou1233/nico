export type Awaitable<T> = T | PromiseLike<T>;
export type AllKeysOf<T> = T extends T ? keyof T : never;

export type KeyOfUnion<T> = T[keyof T];
