import { NextFunction } from "express";
import mongoose, { CallbackError, Document, Query } from "mongoose";
import { Model } from "mongoose";

const { Schema } = mongoose;

export interface UserDocument extends Document {
  name: string;
  role: "user" | "admin" | "manager";
  dateHiring: Date;
  paternSurname: string;
  motherSurname?: string;
  employNumber: string;
  email: string;
  phoneNumber: string;
  enterprise: mongoose.Types.ObjectId;
  department: mongoose.Types.ObjectId;
}

const usersSchema = new Schema(
  {
    name: { type: String, requiere: [true, "A user must have a name"] },
    role: { type: String, enum: ["user", "admin", "manager"], default: "user" },
    dateHiring: {
      type: Date,
      requiere: [true, "A user must have a date hiring"],
    },
    paternSurname: {
      type: String,
      requiere: [true, "A user must have a pattern surname"],
    },
    motherSurname: { type: String },
    employNumber: {
      type: String,
      requiere: [true, "A user must have an employ number"],
    },
    email: { type: String, requiere: [true, "A user must have an email"] },
    phoneNumber: {
      type: String,
      requiere: [true, "A user must have a phone number"],
    },
    enterprise: {
      type: Schema.Types.ObjectId,
      ref: "Enterprise",
      required: [true, "A user must be associated with an enterprise"],
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: [true, "A user must be associated with a department"],
    },
    // seniority: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Seniority",
    //   required: [true, "A user must be associated with a seniority"],
    // },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// VIRTUAL POPULATE
usersSchema.virtual("holiday", {
  ref: "Holiday",
  foreignField: "holiday",
  localField: "_id",
});

// POPULATE
usersSchema.pre<Query<any, any>>(/^find/, function (next) {
  this.populate({
    path: "department",
    select: "-email -role",
  });

  this.populate({
    path: "enterprise",
    select: "-email -role",
  });
  next();
});

const User: Model<UserDocument> = mongoose.model<UserDocument>(
  "User",
  usersSchema
);

export default User;
