import mongoose, { CallbackError, Document, Query } from "mongoose";
import { NextFunction } from "express";

import { addMonths, differenceInDays, differenceInMonths } from "date-fns";
import { Model } from "mongoose";
import { HolidayDocument } from "./holidayModel";

const { Schema } = mongoose;

export interface UserDocument extends Document {
  name: string;
  role: "user" | "admin" | "manager";
  dateHiring: Date;
  paternSurname: string;
  motherSurname?: string;
  employNumber: string;
  email: string;
  photo?: string;
  phoneNumber: string;
  enterprise: mongoose.Types.ObjectId;
  department: mongoose.Types.ObjectId;
  holidays?: HolidayDocument[];
  password?: string;
  passwordConfirm?: string;
  correctPassword(candidatePassword: string, userPassword: string): boolean;
}

const userSchema = new Schema(
  {
    name: { type: String, required: [true, "Por favor diganos su nombre"] },
    paternSurname: {
      type: String,
      requiered: [true, "Por favor diganos su apellido paterno"],
    },
    motherSurname: { type: String },
    employNumber: {
      type: String,
      requiered: [true, "Un usuario debe tener un numero de empleado"],
    },
    photo: { type: String, default: "default.jpg" },
    role: { type: String, enum: ["user", "admin", "manager"], default: "user" },
    dateHiring: {
      type: Date,
      requiered: [true, "Un usuario debe tener fecha que ingreso a la empresa"],
    },
    email: {
      type: String,
      requiered: [true, "Por favor proporcione un correo electronico"],
    },
    phoneNumber: {
      type: String,
      requiered: [true, "Por favor proporcione un numero de telefono"],
    },
    enterprise: {
      type: Schema.Types.ObjectId,
      ref: "Enterprise",
      required: [true, "Un usuario debe de estar vinculado a una empresa"],
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: [true, "Por favor proporcione el departamento del usuario."],
    },
    password: {
      type: String,
      // require: [true, "Please provide a password"],
      // minlength: 8,
      // select: false,
    },
    passwordConfirm: {
      type: String,
      require: [true, "Please confirm your password"],
      validate: {
        // This only work on CREATE and SAVE!
        validator: function (el: string) {
          return el === (this as any).password;
        },
        message: () => "Passwords do not match",
      },
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.virtual("holidays", {
  ref: "Holiday",
  foreignField: "user",
  localField: "_id",
});

userSchema.virtual("seniority").get(function () {
  if (!this.dateHiring) return;

  const startDate = this.dateHiring;
  const endDate = new Date();

  const totalMonths = differenceInMonths(endDate, startDate);

  // Calculate years and remaining months
  const years = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;

  // Calculate remaining days
  const lastFullMonth = addMonths(startDate, years * 12 + remainingMonths);
  const days = differenceInDays(endDate, lastFullMonth);

  return {
    years,
    moths: remainingMonths,
    days,
  };
});

// POPULATE
userSchema.pre<Query<any, any>>(/^find/, function (next) {
  // this.select("-__v");

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

// PASSWORD
userSchema.pre("save", async function (next) {
  //Only run this function if password was modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  // this.password = await bcrypt.hash(this.password, 12);

  // Delete the passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

// USERS INAVILITY
// userSchema.pre(/^find/, function(next) {
//   // THIS point to current query
//   this.find({ active: { $ne: false } }).select('-__v');
//   next();
// });

/*METHODS (point to current DOC)*/

userSchema.methods.correctPassword = (
  candidatePassword: string,
  userPassword: string
) => {
  return candidatePassword === userPassword;
};

const User: Model<UserDocument> = mongoose.model<UserDocument>(
  "User",
  userSchema
);

export default User;
