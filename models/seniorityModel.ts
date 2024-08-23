import mongoose from "mongoose";

const { Schema } = mongoose;

const senioritySchema = new Schema({
  name: { type: String, requiere: [true, "A seniority must have a name"] },
});

const SeniorityModel = mongoose.model("Seniority", senioritySchema);

export default SeniorityModel;
