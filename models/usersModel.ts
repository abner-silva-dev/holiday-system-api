import mongoose from "mongoose";

const { Schema } = mongoose;

const usersSchema = new Schema({
  name: { type: String, requiere: [true, "Users must have a name"] },
});

const UsersModel = mongoose.model("Users", usersSchema);

export default UsersModel;
