import mongoose, { Schema, Document, Model } from "mongoose";

interface PersonalReferenceDocument extends Document {
  person1: {
    name: string;
    duration: string;
    phone: string;
    occupation: string;
  };
  person2: {
    name: string;
    duration: string;
    phone: string;
    occupation: string;
  };
  person3: {
    name: string;
    duration: string;
    phone: string;
    occupation: string;
  };
  user: mongoose.Types.ObjectId; // Para asociar a un usuario
}

const personalReferenceSchema = new Schema<PersonalReferenceDocument>(
  {
    person1: {
      name: { type: String, required: true },
      duration: { type: String, required: true },
      phone: { type: String, required: true },
      occupation: { type: String, required: true },
    },
    person2: {
      name: { type: String, required: true },
      duration: { type: String, required: true },
      phone: { type: String, required: true },
      occupation: { type: String, required: true },
    },
    person3: {
      name: { type: String, required: true },
      duration: { type: String, required: true },
      phone: { type: String, required: true },
      occupation: { type: String, required: true },
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true,"Las referencias personales deben estar asociadas a un usuario"] // Si es necesario
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const UserPersonalReference: Model<PersonalReferenceDocument> = 
mongoose.model<PersonalReferenceDocument>(
  "UserPersonalReference",
  personalReferenceSchema
);

export default UserPersonalReference;
