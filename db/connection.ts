import mongoose from "mongoose";

async function connection() {
  try {
    await mongoose.connect(
      `mongodb://127.0.0.1:27017/${process.env.DATABASE_NAME}`
    );
    // await mongoose.connect(
    //   `mongodb+srv://${process.env.USER_NAME_DB}:${process.env.PASSWORD_DB}@dai-piap-db.jjye5.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.DATABASE_NAME}`
    // );
    console.log("connection successfull");
  } catch (error) {
    throw new Error("Error try to connect to database, try more later. ");
  }
}

export default connection;
