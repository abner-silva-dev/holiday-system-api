import mongoose, { Query } from "mongoose";
import { Model } from "mongoose";

const { Schema } = mongoose;

export interface DepartmentDocument extends Document {
  name: string;
  nameAbreviate: string;
  enterprise: mongoose.Types.ObjectId;
}

const departmentSchema = new Schema({
  name: { type: String, requiere: [true, "A department must be have a name"] },
  nameAbreviate: {
    type: String,
    requiere: [true, "A department must have an abreviated name"],
  },
  enterprise: {
    type: Schema.Types.ObjectId,
    ref: "Enterprise",
    required: [true, "A department must be associated with an enterprise"],
  },
});

// POPULATE
departmentSchema.pre<Query<any, any>>(/^find/, function (next) {
  this.populate({
    path: "enterprise",
  }).select("-__v");
  next();
});

const Department: Model<DepartmentDocument> =
  mongoose.model<DepartmentDocument>("Department", departmentSchema);

export default Department;
