const axios = require("axios");

axios
	.get("https://japi.rest/discord/v1/user/305389581304463360")
	.then(v =>
		require("fs").writeFileSync(
			"./sb.json",
			JSON.stringify(v.data, null, 4)
		)
	);
