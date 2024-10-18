import mongoose, { Model } from "mongoose";

const { Schema } = mongoose;

export interface SeniorityDocument extends Document {
  minYears: number;
  maxYears: number;
  vacationDays: number;
}

const senioritySchema = new Schema({
  minYears: {
    type: Number,
    required: true,
  },
  maxYears: {
    type: Number,
    required: true,
  },
  vacationDays: {
    type: Number,
    required: true,
  },
});

const Seniority: Model<SeniorityDocument> = mongoose.model<SeniorityDocument>(
  "Seniority",
  senioritySchema
);

export default Seniority;
