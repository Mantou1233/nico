import "reflect-metadata";

let n = 1;
class Decorators {
	static plugin(meta) {
		return function (constructor) {
			for (let key of Object.getOwnPropertyNames(constructor.prototype)) {
				const bew = Reflect.getMetadata(
					"command",
					constructor.prototype[key]
				);
				console.log({ key, bew });
			}
			Reflect.defineMetadata("pluginInfo", {}, constructor);
		};
	}

	static command(obj, key, descriptor) {
		Reflect.defineMetadata("command", n++, descriptor.value);
	}
}

@Decorators.plugin(1)
class a {
	@Decorators.command
	p() {}

	@Decorators.command
	p3() {}
}
