import "reflect-metadata";

interface IMetaData {
	(key: string | symbol, value: any): ReturnType<typeof Reflect["metadata"]>;
	get(obj: any, key: string | symbol, prop?: string | symbol): any;
	set(
		obj: any,
		key: string | symbol,
		value: any,
		prop?: string | symbol
	): void;
	append(obj, key: string | symbol, value: any, prop?: string | symbol): void;
	delete(obj: any, key: string | symbol, prop?: string | symbol): boolean;
	keys(obj: any, prop?: string | symbol): any[];
}

const md = function md(key: string | symbol, value) {
	return Reflect.metadata(key, value);
} as IMetaData;

Object.assign(md, {
	get(obj, key: string | symbol, prop?: string | symbol) {
		return Reflect.getMetadata(key, obj, ...([prop] as [string]));
	},
	set(obj, key: string | symbol, value, prop?: string | symbol) {
		return Reflect.defineMetadata(key, value, obj, ...([prop] as [string]));
	},
	append(obj, key: string | symbol, value, prop?: string | symbol) {
		const arr =
			Reflect.getMetadata(key, obj, ...([prop] as [string])) ?? [];
		if (!Array.isArray(arr)) throw new Error("obj origin not a array");
		arr.push(value);
		return Reflect.defineMetadata(key, arr, obj);
	},
	delete(obj, key: string | symbol, prop?: string | symbol) {
		return Reflect.deleteMetadata(key, obj, ...([prop] as [string]));
	},
	keys(obj, prop?: string | symbol) {
		return Reflect.getMetadataKeys(obj, ...([prop] as [string]));
	}
});

export default md;
export { md };
