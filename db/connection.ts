import mongoose from "mongoose";

async function connection() {
  let databaseStringConnection = process.env.DATABASE_STRING_CONNECTION;

  databaseStringConnection = databaseStringConnection
    .replace("@DATABASE_USERNAME", process.env.DATABASE_USER_NAME)
    .replace("@DATABASE_PASSWORD", process.env.DATABASE_PASSWORD)
    .replace("@DATABASE_NAME", process.env.DATABASE_NAME);

  try {
    await mongoose.connect(databaseStringConnection);
    console.log("🚀 Connection database successfull 🚀");
  } catch (error) {
    throw new Error("🔥 Error try to connect to database, try more later. 🔥");
  }
}

export default connection;
