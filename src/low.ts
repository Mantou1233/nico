import * as Loggers from "./services/logger";
import fs from "fs";
console.log(Loggers);
console.log(require("os").userInfo().username);
for (let [name, logger] of Object.entries(Loggers)) {
	global[name] = logger;
}

log("a");
