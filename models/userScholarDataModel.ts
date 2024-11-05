import mongoose, { Schema, Document, Model } from "mongoose";

interface ScholarDataDocument extends Document {
  // Secondary School
  secondary: {
    yearsCoursed: number;
    schoolName: string;
    startDate: string;
    endDate: string;
    hasCertificate: string;
  };
  // High School
  highSchool: {
    yearsCoursed: number;
    schoolName: string;
    startDate: string;
    endDate: string;
    hasCertificate: string;
  };
  // University
  university: {
    yearsCoursed: number;
    schoolName: string;
    startDate: string;
    endDate: string;
    hasCertificate: string;
  };
  // Degree
  degree: {
    yearsCoursed: number;
    schoolName: string;
    startDate: string;
    endDate: string;
    hasCertificate: string;
    career: string;
  };

  currentStudying: string;
  currentStudySchedule: string;
  currentStudyName: string;
  currentSchool: string;
  user: mongoose.Types.ObjectId;
}

const scholarDataSchema = new Schema<ScholarDataDocument>(
  {
    // Secondary School
    secondary: {
      yearsCoursed: { type: Number, required: true },
      schoolName: { type: String, required: true },
      startDate: { type: String, required: true },
      endDate: { type: String, required: true },
      hasCertificate: { type: String, enum: ["si", "no"], required: true },
    },
    // High School
    highSchool: {
      yearsCoursed: { type: Number, required: true },
      schoolName: { type: String, required: true },
      startDate: { type: String, required: true },
      endDate: { type: String, required: true },
      hasCertificate: { type: String, enum: ["si", "no"], required: true },
    },
    // University
    university: {
      yearsCoursed: { type: Number, required: true },
      schoolName: { type: String, required: true },
      startDate: { type: String, required: true },
      endDate: { type: String, required: true },
      hasCertificate: { type: String, enum: ["si", "no"], required: true },
    },
    // Degree
    degree: {
      yearsCoursed: { type: Number, required: true },
      schoolName: { type: String, required: true },
      startDate: { type: String, required: true },
      endDate: { type: String, required: true },
      hasCertificate: { type: String, enum: ["si", "no"], required: true },
      career: { type: String, required: true },
    },
    // Current Studies
    currentStudying: { type: String, enum: ["si", "no"], required: true },
    currentStudySchedule: { type: String, required: true },
    currentStudyName: { type: String, required: true },
    currentSchool: { type: String, required: true },

    // Reference to User
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [
        true,
        "Los datos escolares deben estar asociados a un usuario",
      ],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const UserScholarData: Model<ScholarDataDocument> =
  mongoose.model<ScholarDataDocument>("UserScholarData", scholarDataSchema);

export default UserScholarData;
