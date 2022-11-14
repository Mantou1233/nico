class Metadata {
	get(obj, key: string | symbol, prop?: string | symbol) {
		return Reflect.getMetadata(key, obj, ...(([prop] ?? []) as [string]));
	}
	set(obj, key: string | symbol, value, prop?: string | symbol) {
		return Reflect.defineMetadata(
			key,
			value,
			obj,
			...(([prop] ?? []) as [string])
		);
	}
	delete(obj, key: string | symbol, prop?: string | symbol) {
		return Reflect.deleteMetadata(
			key,
			obj,
			...(([prop] ?? []) as [string])
		);
	}
	keys(obj, prop?: string | symbol) {
		return Reflect.getMetadataKeys(obj, ...(([prop] ?? []) as [string]));
	}
}

const md = new Metadata();
export { md, Metadata };
