import { MetadataSetter, Reflector } from "typed-reflector";

export type MetadataMap = {
	PluginMeta: string;
};
export type MetadataArrayMap = {
	PluginInjects: string;
};
const metadata = new MetadataSetter<MetadataMap, MetadataArrayMap>();
const reflector = new Reflector<MetadataMap, MetadataArrayMap>();

@metadata.set("PluginMeta", "me")
class g {}

Reflect.decorate([metadata.set("PluginMeta", "a")], g);

console.log(reflector.get("PluginMeta", g));
