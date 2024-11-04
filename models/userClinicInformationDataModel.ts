import mongoose, { Schema, Document, Model } from "mongoose";

interface ClinicInformationDocument extends Document {
  height: number;
  weight: number;
  bloodType: string;
  hasMedicalConditions: string;
  medicalConditions?: string; // Opcional en caso de no aplicar
  hasSurgery: string;
  surgeryType?: string; // Opcional en caso de no aplicar
  hasPhysicalImpediment: string;
  certifyInformation: boolean;
  user: mongoose.Types.ObjectId; // Para asociar a un usuario
}

const clinicInformationSchema = new Schema<ClinicInformationDocument>(
  {
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    bloodType: { type: String, required: true },
    hasMedicalConditions: { type: String, required: true },
    medicalConditions: { type: String },
    hasSurgery: { type: String, required: true },
    surgeryType: { type: String },
    hasPhysicalImpediment: { type: String, required: true },
    certifyInformation: { type: Boolean, required: true },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true,"La informacion clinica deben estar asociadas a un usuario"]
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const UserClinicInformation: Model<ClinicInformationDocument> =
 mongoose.model<ClinicInformationDocument>(
  "UserClinicInformation",
  clinicInformationSchema
);

export default UserClinicInformation;
