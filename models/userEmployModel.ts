import mongoose, { Document, Model } from "mongoose";

const { Schema } = mongoose;

interface EmployDocument extends Document {
  companyName: string;
  businessField: string;
  address: string;
  phone: string;
  startDate: string;
  endDate: string;
  position: string;
  finalSalary: string;
  immediateBoss: string;
  separationReason: string;
}

export interface EmploysDocument extends Document {
  employs: EmployDocument[];
  user: mongoose.Types.ObjectId;
}

const employSchema = new Schema<EmploysDocument>({
  employs: [
    {
      companyName: { type: String, required: true },
      businessField: { type: String, required: true },
      address: { type: String, required: true },
      phone: { type: String, required: true },
      startDate: { type: String, required: true },
      endDate: { type: String, required: true },
      position: { type: String, required: true },
      finalSalary: { type: String, required: true },
      immediateBoss: { type: String, required: true },
      separationReason: { type: String, required: true },
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const UserEmploy: Model<EmployDocument> = mongoose.model<EmployDocument>(
  "userEmploys",
  employSchema
);

export default UserEmploy;
