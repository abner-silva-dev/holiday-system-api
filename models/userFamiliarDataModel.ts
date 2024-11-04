import mongoose, { Schema, Document, Model } from "mongoose";

interface FamiliarDataDocument extends Document {
  father: {
    name: string;
    lives: string;
    age: number;
    ocupation: string;
    address: string;
  };
  mother: {
    name: string;
    lives: string;
    age: number;
    ocupation: string;
    address: string;
  };
  couple: {
    name: string;
    lives: string;
    age: number;
    ocupation: string;
    address: string;
  };
  firstSon: {
    name: string;
    genre: string;
    age: number;
    ocupation: string;
    address: string;
  };
  secondSon: {
    name: string;
    genre: string;
    age: number;
    ocupation: string;
    address: string;
  };
  thirdSon: {
    name: string;
    genre: string;
    age: number;
    ocupation: string;
    address: string;
  };
}

const familiarDataSchema = new Schema<FamiliarDataDocument>(
  {
    father: {
      name: { type: String, required: true },
      lives: { type: String, enum: ["si", "no"], required: true },
      age: { type: Number, required: true, min: 0 },
      ocupation: { type: String, required: true },
      address: { type: String, required: true },
    },
    mother: {
      name: { type: String, required: true },
      lives: { type: String, enum: ["si", "no"], required: true },
      age: { type: Number, required: true, min: 0 },
      ocupation: { type: String, required: true },
      address: { type: String, required: true },
    },
    couple: {
      name: { type: String, required: true },
      lives: { type: String, enum: ["si", "no"], required: true },
      age: { type: Number, required: true, min: 0 },
      ocupation: { type: String, required: true },
      address: { type: String, required: true },
    },
    firstSon: {
      name: { type: String, required: true },
      genre: { type: String, enum: ["masculino", "femenino"], required: true },
      age: { type: Number, required: true, min: 0 },
      ocupation: { type: String, required: true },
      address: { type: String, required: true },
    },
    secondSon: {
      name: { type: String, required: true },
      genre: { type: String, enum: ["masculino", "femenino"], required: true },
      age: { type: Number, required: true, min: 0 },
      ocupation: { type: String, required: true },
      address: { type: String, required: true },
    },
    thirdSon: {
      name: { type: String, required: true },
      genre: { type: String, enum: ["masculino", "femenino"], required: true },
      age: { type: Number, required: true, min: 0 },
      ocupation: { type: String, required: true },
      address: { type: String, required: true },
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const FamiliarData: Model<FamiliarDataDocument> =
  mongoose.model<FamiliarDataDocument>("FamiliarData", familiarDataSchema);

export default FamiliarData;
