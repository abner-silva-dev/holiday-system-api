import mongoose, { Schema, Document, Model } from "mongoose";

interface ComplementaryDataDocument extends Document {
  rfc: string;
  imssNumber: string;
  curp: string;
  infonavitCredit: string;
  afore: string;
  travelAvailability: boolean;
  residenceChange: boolean;
  license: string;
  familyInCompany: boolean;
  jobSource: string;
  previousWorkInCompany: boolean;
  previousWorkDate?: Date;
  previousWorkDepartment?: string;
  currentLivingSituation: string;
  economicDependents: boolean;
  familyContribution: boolean;
  ownsCar: boolean;
  carModel?: string;
  user: mongoose.Types.ObjectId;
}

const complementaryDataSchema = new Schema<ComplementaryDataDocument>(
  {
    rfc: { type: String, required: true },
    imssNumber: { type: String, required: true },
    curp: { type: String, required: true },
    infonavitCredit: { type: String, required: true },
    afore: { type: String, required: true },
    travelAvailability: { type: Boolean, required: true },
    residenceChange: { type: Boolean, required: true },
    license: { type: String, required: true },
    familyInCompany: { type: Boolean, required: true },
    jobSource: { type: String, required: true },
    previousWorkInCompany: { type: Boolean, required: true },
    previousWorkDate: { type: Date },
    previousWorkDepartment: { type: String },
    currentLivingSituation: { type: String, required: true },
    economicDependents: { type: Boolean, required: true },
    familyContribution: { type: Boolean, required: true },
    ownsCar: { type: Boolean, required: true },
    carModel: { type: String },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Las vacaciones deben estar asociadas a un usuario"],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const UserComplementaryData: Model<ComplementaryDataDocument> =
  mongoose.model<ComplementaryDataDocument>(
    "UserComplentaryData",
    complementaryDataSchema
  );

export default UserComplementaryData;
