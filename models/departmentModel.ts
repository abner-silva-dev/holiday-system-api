import mongoose from "mongoose";

const { Schema } = mongoose;

const departmentSchema = new Schema({
  name: { type: String, requiere: [true, "A department must be have a name"] },
});

const DepartmentModel = mongoose.model("Department", departmentSchema);

export default DepartmentModel;
