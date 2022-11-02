// import "reflect-metadata";
// import "dotenv/config";

// import { Database } from "quickmongo";

// import { Client, Partials, GatewayIntentBits } from "discord.js";

// const db = new Database(
//     "mongodb+srv://"
// ); ///process.env.MONGO!);

// const client = new Client({
//     intents: [
//         GatewayIntentBits.Guilds,
//         GatewayIntentBits.GuildMessages,
//         GatewayIntentBits.GuildPresences,
//         GatewayIntentBits.GuildMessageReactions,
//         GatewayIntentBits.DirectMessages,
//         GatewayIntentBits.MessageContent
//     ],
//     partials: [
//         Partials.Channel,
//         Partials.Message,
//         Partials.User,
//         Partials.GuildMember,
//         Partials.Reaction
//     ],
//     allowedMentions: {
//         parse: ["users"],
//         repliedUser: false
//     }
// });

// globalThis.storage = {
//     db,
//     client
// };

// async function main() {
//     await db.connect();

//     app.set("json spaces", 4);

//     app.use(express.static("public"));
//     app.use(express.json());
//     app.use(express.urlencoded({ extended: true }));

//     app.use(timeout("20s"));

//     app.use("/api", api);

//     //The 404 Route (ALWAYS Keep this as the last route)
//     app.get("*", function (req: Request, res: Response) {
//         if (req.accepts("html")) return res.redirect("/404.html");
//         res.status(404).sendFile(
//             __dirname.replace("\\dist", "") + "/public/404.html"
//         );
//     });

//     app.all("*", function (req, res) {
//         res.status(404).json({
//             error: "No routes found."
//         });
//     });

//     app.listen(process.env.PORT!, () => console.log("opened!"));
// }

// main();

// function a() {}
// a.bind;
