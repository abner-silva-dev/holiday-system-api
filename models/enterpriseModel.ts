import mongoose from "mongoose";

const { Schema } = mongoose;

const enterpriseSchema = new Schema({
  name: { type: String, requiere: [true, "An enterprise must be have a name"] },
  email: {
    type: String,
    requiere: [true, "An enterprise must be have an email"],
  },
  phoneNumber: {
    type: String,
    requiere: [true, "An enterprise must be have a phone number"],
  },
  logo: { type: String },
});

const Enterprise = mongoose.model("Enterprise", enterpriseSchema);

export default Enterprise;
