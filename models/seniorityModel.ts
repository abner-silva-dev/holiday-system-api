import mongoose from "mongoose";

const { Schema } = mongoose;

const senioritySchema = new Schema({
  name: { type: String, requiere: [true, "A seniority must have a name"] },
  yearsOld: {
    type: Number,
    requiere: [true, "A seniority must have years old"],
  },
  daysAvailables: {
    type: Number,
    requiere: [true, "A seniority must have days availables"],
  },
});

const Seniority = mongoose.model("Seniority", senioritySchema);

export default Seniority;
