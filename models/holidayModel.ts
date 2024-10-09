import mongoose, { Query, Document, Model } from "mongoose";

const { Schema } = mongoose;

type StateAutorization = "pending" | "approved" | "rejected";

export interface HolidayDocument {
  days: Date[];
  authorizationAdmin: StateAutorization;
  authorizationManager: StateAutorization;
  observation: string;
  observationManager: string;
  observationAdmin: string;
  createdAt?: Date;
  admin: mongoose.Types.ObjectId;
  manager: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
}

const holidaySchema = new Schema(
  {
    days: {
      type: [Date],
      required: [true, "A holiday must have a day for create holidays"],
    },
    authorizationAdmin: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    authorizationManager: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    observation: { type: String },
    observationManager: { type: String },
    observationAdmin: { type: String },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    manager: {
      type: Schema.Types.ObjectId,
      ref: "User",
      // required: [
      //   true,
      //   "Las vacaciones deben estar asociadas a un jefe de departamento",
      // ],
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
      // required: [
      //   true,
      //   "Las vacaciones deben estar asociadas a un administrador",
      // ],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Las vacaciones deben estar asociadas a un usuario"],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

holidaySchema.pre<Query<any, any>>(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "-__v",
  });

  this.populate({
    path: "admin",
    select: "-__v",
  });

  this.populate({
    path: "manager",
    select: "-__v",
  });

  next();
});

// holidaySchema.pre("findOneAndUpdate", async function (next) {
//   const update = this.getUpdate();

//   if (!update || typeof update !== "object" || Array.isArray(update))
//     return next();

//   if (
//     update.authorizationAdmin === "approved" &&
//     update.authorizationManager === "approved"
//   ) {
//     // get
//   }

//   next();
// });

const Holiday: Model<HolidayDocument> = mongoose.model<HolidayDocument>(
  "Holiday",
  holidaySchema
);

export default Holiday;
