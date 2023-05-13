import "reflect-metadata";
import { GenericMap, MapValue, ToArrayMap, ToObjectMap } from "./../core/Utils";
import { Registries } from "./Registries";

interface IMetaData<
	M extends {
		[key: string]: any;
	},
	AM extends {
		[key: string]: any[];
	},
	OM extends {
		[key: string]: any;
	}
> {
	<K extends keyof M>(key: K, value: M[K]): ReturnType<
		(typeof Reflect)["metadata"]
	>;
	<K extends keyof AM>(key: K, value: AM[K]): ReturnType<
		(typeof Reflect)["metadata"]
	>;
	<K extends keyof OM>(key: K, value: OM[K]): ReturnType<
		(typeof Reflect)["metadata"]
	>;
	get<K extends keyof M>(obj: any, key: K, prop?: keyof any): M[K];
	get<K extends keyof AM>(obj: any, key: K, prop?: keyof any): AM[K];
	get<K extends keyof OM>(obj: any, key: K, prop?: keyof any): OM[K];
	set<K extends keyof M>(
		obj: any,
		key: K,
		value: M[K],
		prop?: keyof any
	): void;
	set<K extends keyof AM>(
		obj: any,
		key: K,
		value: AM[K],
		prop?: keyof any
	): AM[K][];
	set<K extends keyof OM>(
		obj: any,
		key: K,
		value: OM[K],
		prop?: keyof any
	): OM[K];
	append<K extends keyof AM>(
		obj,
		key: K,
		value: AM[K][number],
		prop?: keyof any
	): void;
	appendMap<K extends keyof OM>(
		obj,
		key: K,
		key2: string,
		value: OM[K][string],
		prop?: keyof any
	): void;
	delete<K extends keyof M>(obj: any, key: K, prop?: keyof any): boolean;
	keys(obj: any, prop?: keyof any): keyof M;
}

const md = function md(key: keyof any, value) {
	return Reflect.metadata(key, value);
} as IMetaData<
	Registries.MetadataMap,
	ToArrayMap<Registries.MetadataArrayMap>,
	ToObjectMap<Registries.MetadataObjectMap>
>;

Object.assign(md, {
	get(obj, key: keyof any, prop?: keyof any) {
		return (
			Reflect.getMetadata(key, obj, ...([prop] as [string])) ??
			Reflect.getMetadata(
				key,
				Object.getPrototypeOf(obj) || {},
				...([prop] as [string])
			)
		);
	},
	set(obj, key: keyof any, value, prop?: keyof any) {
		return Reflect.defineMetadata(key, value, obj, ...([prop] as [string]));
	},
	append(obj, key: keyof any, value, prop?: keyof any) {
		const origin =
			Reflect.getMetadata(key, obj, ...([prop] as [string])) ?? [];
		if (!Array.isArray(origin)) throw new Error("obj origin not a array");
		origin.push(value);
		return Reflect.defineMetadata(key, origin, obj);
	},
	appendMap(
		obj,
		key: keyof any,
		key2: keyof any,
		value: any,
		prop?: keyof any
	) {
		const origin =
			Reflect.getMetadata(key, obj, ...([prop] as [string])) ?? {};
		if (!isObj(origin)) throw new Error("obj origin not a object");
		origin[key2] = value;
		return Reflect.defineMetadata(key, origin, obj);
	},
	delete(obj, key: keyof any, prop?: keyof any) {
		return Reflect.deleteMetadata(key, obj, ...([prop] as [string]));
	},
	keys(obj, prop?: keyof any) {
		return Reflect.getMetadataKeys(obj, ...([prop] as [string]));
	}
});
function isObj(arg) {
	return Object.prototype.toString.call(arg) == "[object Object]";
}

export default md;
export { md };
