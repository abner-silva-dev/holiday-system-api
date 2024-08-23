import Server from "./models/server";
import connectionDB from "./db/connection";

import "dotenv/config";

//connectionDB();

const server = new Server();

server.listen();
