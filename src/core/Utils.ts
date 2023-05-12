export type Awaitable<T> = T | PromiseLike<T>;
export type AllKeysOf<T> = T extends T ? keyof T : never;

export type KeyOfUnion<T> = T[keyof T];

export type Copy<T> = {
	[K in keyof T]: T[K];
} & {};

export type SectAny<T, VType = any> = T & {
	[key: string]: VType;
};

export type ToArrayMap<T> = {
	[K in keyof T]: T[K][];
};

type ArrayValue<
	AM extends StringDict,
	K extends Key<ToArrayMap<AM>>
> = ToArrayMap<AM>[K];

export type ToObjectMap<T> = {
	[key: string]: T;
};

type ObjectValue<
	OM extends StringDict,
	K extends Key<ToObjectMap<OM>>
> = ToObjectMap<OM[K]>;

export type MergeKey<
	M extends StringDict,
	AM extends StringDict,
	OM extends StringDict
> = Key<M> | Key<AM> | Key<OM>;

type Key<T> = keyof T & string;
type StringDict = Record<string, any>;

export type GenericMap<
	M extends StringDict,
	AM extends StringDict,
	OM extends StringDict
> = keyof (M & ToArrayMap<AM> & ToObjectMap<OM>) & string;

export type MapValue<
	M extends StringDict,
	AM extends StringDict,
	OM extends StringDict,
	K extends MergeKey<M, AM, OM>
> = K extends Key<AM>
	? ArrayValue<AM, K>
	: K extends Key<OM>
	? ObjectValue<OM, K>
	: K extends Key<M>
	? M[K]
	: never;
