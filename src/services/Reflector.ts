import { MetadataSetter, Reflector } from "typed-reflector";
import { ToArrayMap } from "~/core/Utils";
import { Registries } from "./Registries";

const metadata = new MetadataSetter<
	Registries.MetadataMap,
	Registries.MetadataArrayMap
>();

const reflector = new Reflector<
	Registries.MetadataMap,
	Registries.MetadataArrayMap
>();

class Injector<T> {
	patch<K extends keyof T>(obj, key: K, value: T[K], prop?) {
		Reflect.defineMetadata(key, value, obj, prop);
	}
}

const injector = new Injector<
	Registries.MetadataMap & ToArrayMap<Registries.MetadataArrayMap>
>();

export { metadata as md, reflector as rf, injector as ij };
