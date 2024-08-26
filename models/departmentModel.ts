import mongoose from "mongoose";

const { Schema } = mongoose;

const departmentSchema = new Schema({
  name: { type: String, requiere: [true, "A department must be have a name"] },
  enterprise: {
    type: Schema.Types.ObjectId,
    ref: "Enterprise",
    required: [true, "A department must be associated with an enterprise"],
  },
});

const Department = mongoose.model("Department", departmentSchema);

export default Department;
