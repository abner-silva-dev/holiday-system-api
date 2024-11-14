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
  user: mongoose.Types.ObjectId;
}

const familiarDataSchema = new Schema<FamiliarDataDocument>(
  {
    father: {
      name: { type: String, required: false },
      lives: { type: String, enum: ["si", "no"], required: false },
      age: { type: Number, required: false, min: 0 },
      ocupation: { type: String, required: false },
      address: { type: String, required: false },
    },
    mother: {
      name: { type: String, required: false },
      lives: { type: String, enum: ["si", "no"], required: false },
      age: { type: Number, required: false, min: 0 },
      ocupation: { type: String, required: false },
      address: { type: String, required: false },
    },
    couple: {
      name: { type: String, required: false },
      lives: { type: String, enum: ["si", "no"], required: false },
      age: { type: Number, required: false, min: 0 },
      ocupation: { type: String, required: false },
      address: { type: String, required: false },
    },
    firstSon: {
      name: { type: String, required: false },
      genre: {
        type: String,
        enum: ["", "masculino", "femenino"],
        required: false,
      },
      age: { type: Number, required: false, min: 0 },
      ocupation: { type: String, required: false },
      address: { type: String, required: false },
    },
    secondSon: {
      name: { type: String, required: false },
      genre: {
        type: String,
        enum: ["", "masculino", "femenino"],
        required: false,
      },
      age: { type: Number, required: false, min: 0 },
      ocupation: { type: String, required: false },
      address: { type: String, required: false },
    },
    thirdSon: {
      name: { type: String, required: false },
      genre: {
        type: String,
        enum: ["", "masculino", "femenino"],
        required: false,
      },
      age: { type: Number, required: false, min: 0 },
      ocupation: { type: String, required: false },
      address: { type: String, required: false },
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [
        true,
        "Los datos familiares deben estar asociados a un usuario",
      ],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const UserFamiliarData: Model<FamiliarDataDocument> =
  mongoose.model<FamiliarDataDocument>("UserFamiliarData", familiarDataSchema);

export default UserFamiliarData;
