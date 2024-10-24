import Server from "./models/server";
import connectionDB from "./db/connection";

import "dotenv/config";

connectionDB();

const server = new Server();

const serv = server.listen();

//handler error asyncronus
// process.on("unhandledRejection", (err: Error) => {
//   console.log("UNHANDLED REJECTION! 💥 Shutting down...");
//   console.log(err.name, err.message);
//   serv.close(() => {
//     process.exit(1);
//   });
// });
