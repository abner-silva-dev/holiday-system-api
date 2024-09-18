import mongoose, { Query } from "mongoose";
import { Model } from "mongoose";

const { Schema } = mongoose;

export interface EnterpriseDocument extends Document {
  name: string;
  nameAbreviate: string;
  email: string;
  phoneNumber: string;
  logo?: string;
}

const enterpriseSchema = new Schema({
  name: {
    type: String,
    requiere: [true, "An enterprise must be have a name"],
  },
  nameAbreviate: {
    type: String,
    requiere: [true, "An enterprise must have an abreviated name"],
  },
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

enterpriseSchema.pre<Query<any, any>>(/^find/, function (next) {
  this.find().select("-__v");
  next();
});

const Enterprise: Model<EnterpriseDocument> =
  mongoose.model<EnterpriseDocument>("Enterprise", enterpriseSchema);

export default Enterprise;
