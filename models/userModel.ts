import mongoose, { Document, Query } from "mongoose";

import { addMonths, differenceInDays, differenceInMonths } from "date-fns";
import { Model } from "mongoose";
import { HolidayDocument } from "./holidayModel";
import { start } from "repl";

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
  credit: number;
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
    credit: {
      type: Number,
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

const getSeniority = (date: Date) => {
  const startDate = date;
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
};

userSchema.virtual("seniority").get(function () {
  if (!this.dateHiring) return;
  const { years, moths, days } = getSeniority(this.dateHiring);

  return {
    years,
    moths,
    days,
  };
});

userSchema.virtual("daysGrantedBySeniority").get(function () {
  if (!this.dateHiring) return;
  const { years } = getSeniority(this.dateHiring);

  let daysGrantedBySeniority = 0;

  if (years < 1) daysGrantedBySeniority = 0;
  if (years >= 1 && years < 2) daysGrantedBySeniority = 12;
  if (years >= 2 && years < 3) daysGrantedBySeniority = 14;
  if (years >= 3 && years < 4) daysGrantedBySeniority = 16;
  if (years >= 4 && years < 5) daysGrantedBySeniority = 18;
  if (years >= 5 && years < 6) daysGrantedBySeniority = 20;
  if (years >= 6 && years < 11) daysGrantedBySeniority = 22;
  if (years >= 11 && years < 16) daysGrantedBySeniority = 24;
  if (years >= 16 && years < 21) daysGrantedBySeniority = 26;
  if (years >= 21 && years < 26) daysGrantedBySeniority = 28;
  if (years >= 26 && years < 31) daysGrantedBySeniority = 30;
  if (years >= 31) daysGrantedBySeniority = 32;

  return daysGrantedBySeniority;
});

// POPULATE
userSchema.pre<Query<any, any>>(/^find/, function (next) {
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

start;

userSchema.pre("find", async function name(next) {
  // this.find.;
});

// VALIDATION SET SENIORITY
userSchema.pre("save", async function (next) {
  if (!this.dateHiring) return next();

  if (!this.isNew) return next();

  const { years } = getSeniority(this.dateHiring);

  if (years < 1) this.credit = 0;
  if (years >= 1 && years < 2) this.credit = 12;
  if (years >= 2 && years < 3) this.credit = 14;
  if (years >= 3 && years < 4) this.credit = 16;
  if (years >= 4 && years < 5) this.credit = 18;
  if (years >= 5 && years < 6) this.credit = 20;
  if (years >= 6 && years < 11) this.credit = 22;
  if (years >= 11 && years < 16) this.credit = 24;
  if (years >= 16 && years < 21) this.credit = 26;
  if (years >= 21 && years < 26) this.credit = 28;
  if (years >= 26 && years < 31) this.credit = 30;
  if (years >= 31) this.credit = 32;

  next();
});

// PASSWORD
userSchema.pre("save", async function (next) {
  //Only run this function if password was modified
  if (!this.isModified("password")) return next();
  this.passwordConfirm = undefined;
  next();
});

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

// USERS INAVILITY
// userSchema.pre(/^find/, function(next) {
//   // THIS point to current query
//   this.find({ active: { $ne: false } }).select('-__v');
//   next();
// });
