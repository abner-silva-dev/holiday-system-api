import mongoose, { Schema, Document, Model } from "mongoose";

interface ComplementaryDataDocument extends Document {
  rfc: string;
  imssNumber: string;
  curp: string;
  infonavitCredit: string;
  afore: string;
  travelAvailability: string;
  residenceChange: string;
  license: string;
  familyInCompany: string;
  jobSource: string;
  previousWorkInCompany: string;
  previousWorkDate?: Date;
  previousWorkDepartment?: string;
  currentLivingSituation: string;
  economicDependents: string;
  familyContribution: string;
  ownsCar: string;
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
    travelAvailability: { type: String, required: true },
    residenceChange: { type: String, required: true },
    license: { type: String, required: true },
    familyInCompany: { type: String, required: true },
    jobSource: { type: String, required: true },
    previousWorkInCompany: { type: String, required: true },
    previousWorkDate: { type: Date },
    previousWorkDepartment: { type: String },
    currentLivingSituation: { type: String, required: true },
    economicDependents: { type: String, required: true },
    familyContribution: { type: String, required: true },
    ownsCar: { type: String, required: true },
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
