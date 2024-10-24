import mongoose, { Document, Query } from "mongoose";

import { addMonths, differenceInDays, differenceInMonths } from "date-fns";
import { Model } from "mongoose";
import { HolidayDocument } from "./holidayModel";
import { start } from "repl";
import {
  calculatedPeriod,
  computeSeniority,
  getDaysAvailables,
} from "../controllers/seniorityController";

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
  credit?: { balance: number; exp: Date };
  creditFuture?: { balance: number };
  creditPast?: { balance: number; exp: Date | null };
  daysGrantedBySeniority?: {
    balance: number;
    startDate: Date;
    endDate: Date;
  };
  daysGrantedBySeniorityFuture?: {
    balance: number;
    startDate: Date;
    endDate: Date;
  };
  daysGrantedBySeniorityPast?: {
    balance: number;
    startDate: Date;
    endDate: Date;
  };
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
      unique: true,
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
      unique: true,
    },
    daysGrantedBySeniority: {
      startDate: Date,
      endDate: Date,
      balance: Number,
    },
    daysGrantedBySeniorityFuture: {
      startDate: Date,
      endDate: Date,
      balance: Number,
    },
    daysGrantedBySeniorityPast: {
      startDate: Date,
      endDate: Date,
      balance: Number,
    },
    credit: {
      balance: {
        type: Number,
        min: [0, "El balance no puede ser negativo"],
      },
      exp: Date,
    },
    creditPast: {
      balance: {
        type: Number,
        min: [0, "El balance no puede ser negativo"],
      },
      exp: Date,
    },
    creditFuture: {
      balance: {
        type: Number,
        min: [0, "El balance no puede ser negativo"],
      },
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
  const { years, moths, days } = computeSeniority(this.dateHiring);

  return {
    years,
    moths,
    days,
  };
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

userSchema.pre("find", async function name(next) {
  // console.log("*");
});

// VALIDATION SET SENIORITY
// userSchema.pre("save", async function (next) {
//   if (!this.dateHiring) return next();
//   if (!this.isNew) return next();

//   // Compute current years
//   const { years } = computeSeniority(this.dateHiring);

//   // const currentDate = new Date();
//   // const dateHiring = new Date(this.dateHiring);

//   const daysAvailablesPast = (await getDaysAvailables(years - 1)) || 0;
//   const daysAvailables = (await getDaysAvailables(years)) || 0;
//   const daysAvailablesFuture = (await getDaysAvailables(years + 1)) || 0;

//   const currentPeriod = calculatedPeriod(this.dateHiring, 0);

//   const updatedDate = new Date(currentPeriod.endDate);
//   updatedDate.setMonth(updatedDate.getMonth() + 2);

//   const expirationPast = updatedDate;

//   this.credit = {
//     balance: daysAvailables,
//     exp: currentPeriod.endDate,
//   };

//   this.creditPast = {
//     balance: daysAvailablesPast,
//     exp: daysAvailablesPast ? expirationPast : null,
//   };

//   this.creditFuture = {
//     balance: daysAvailablesFuture,
//   };

//   // Static credit

//   // Past
//   this.daysGrantedBySeniorityPast = {
//     balance: daysAvailablesPast,
//     // ...calculatedPeriod(this.dateHiring, -2),
//     ...calculatedPeriod(this.dateHiring, -1),
//   };

//   // Current
//   this.daysGrantedBySeniority = {
//     balance: daysAvailables,
//     // ...calculatedPeriod(this.dateHiring, -1),
//     ...calculatedPeriod(this.dateHiring, 0),
//   };

//   // Future
//   this.daysGrantedBySeniorityFuture = {
//     balance: daysAvailablesFuture,
//     // ...calculatedPeriod(this.dateHiring, 0),
//     ...calculatedPeriod(this.dateHiring, 1),
//   };

//   next();
// });

// PASSWORD
// userSchema.pre("save", async function (next) {
//   //Only run this function if password was modified
//   if (!this.isModified("password")) return next();
//   this.passwordConfirm = undefined;
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

// USERS INAVILITY
// userSchema.pre(/^find/, function(next) {
//   // THIS point to current query
//   this.find({ active: { $ne: false } }).select('-__v');
//   next();
// });
