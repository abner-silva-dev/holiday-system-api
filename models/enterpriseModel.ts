import mongoose from "mongoose";

const { Schema } = mongoose;

const enterpriseSchema = new Schema({
  name: { type: String, requiere: [true, "An enterprise must be have a name"] },
});

const EnterpriseModel = mongoose.model("Enterprise", enterpriseSchema);

export default EnterpriseModel;
