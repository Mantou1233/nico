import "reflect-metadata";

interface IMetaData {
	(key: keyof any, value: any): ReturnType<typeof Reflect["metadata"]>;
	get(obj: any, key: keyof any, prop?: keyof any): any;
	set(obj: any, key: keyof any, value: any, prop?: keyof any): void;
	append(obj, key: keyof any, value: any, prop?: keyof any): void;
	appendMap(
		obj,
		key: keyof any,
		key2: keyof any,
		value: any,
		prop?: keyof any
	): void;
	delete(obj: any, key: keyof any, prop?: keyof any): boolean;
	keys(obj: any, prop?: keyof any): any[];
}

const md = function md(key: keyof any, value) {
	return Reflect.metadata(key, value);
} as IMetaData;

Object.assign(md, {
	get(obj, key: keyof any, prop?: keyof any) {
		return Reflect.getMetadata(key, obj, ...([prop] as [string]));
	},
	set(obj, key: keyof any, value, prop?: keyof any) {
		return Reflect.defineMetadata(key, value, obj, ...([prop] as [string]));
	},
	append(obj, key: keyof any, value, prop?: keyof any) {
		const arr =
			Reflect.getMetadata(key, obj, ...([prop] as [string])) ?? [];
		if (!Array.isArray(arr)) throw new Error("obj origin not a array");
		arr.push(value);
		return Reflect.defineMetadata(key, arr, obj);
	},
	appendMap(
		obj,
		key: keyof any,
		key2: keyof any,
		value: any,
		prop?: keyof any
	) {
		const arr =
			Reflect.getMetadata(key, obj, ...([prop] as [string])) ?? {};
		if (!isObj(arr)) throw new Error("obj origin not a object");
		arr[key2] = value;
		return Reflect.defineMetadata(key, arr, obj);
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
