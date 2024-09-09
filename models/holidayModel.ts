import mongoose, { Query } from "mongoose";

const { Schema } = mongoose;

const holidaySchema = new Schema(
  {
    days: {
      type: [Date],
      requiere: [true, "A holiday must have a day for create holidays"],
    },
    authorizationAdmin: { type: Boolean },
    authorizationMannager: { type: Boolean },
    observation: { type: String },
    mannager: {
      type: String,
      requiere: [true, "A holiday must have a mannager name"],
    },
    admin: {
      type: String,
      requiere: [true, "A holiday must have an admin name"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A holiday must be associated with a user"],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }
);

holidaySchema.pre<Query<any, any>>(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "",
  });

  this.populate({
    path: "admin",
    select: "",
  });

  this.populate({
    path: "mannager",
    select: "",
  });

  next();
});

// holidaySchema.virtual("reviews", {
//   ref: "Review",
//   foreignField: "tour",
//   localField: "_id",
// });

const Holiday = mongoose.model("Holiday", holidaySchema);

export default Holiday;
