export type Awaitable<T> = T | PromiseLike<T>;
export type AllKeysOf<T> = T extends T ? keyof T : never;

export type KeyOfUnion<T> = T[keyof T];

export type Copy<T> = {
	[K in keyof T]: T[K];
};

export type SectAny<T, VType = any> = T & {
	[key: string]: VType;
};

export type ToArrayMap<T> = {
	[K in keyof T]: T[K][];
};
