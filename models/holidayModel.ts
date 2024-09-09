import mongoose from "mongoose";

const { Schema } = mongoose;

const holidaySchema = new Schema(
  {
    startingDate: {
      type: Date,
      requiere: [true, "A holiday must have a starting date"],
    },
    endDate: {
      type: Date,
      requiere: [true, "A holiday must have an end date"],
    },
    authorizationAnticipate: { type: Boolean },
    authorizationMannager: { type: Boolean },
    observation: { type: String },
    mannagerName: {
      type: String,
      requiere: [true, "A holiday must have a mannager name"],
    },
    adminName: {
      type: String,
      requiere: [true, "A holiday must have an admin name"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A holiday must be associated with a user"],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// reviewSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "user",
//     select: "-email -role",
//   });
//   next();
// });

// holidaySchema.virtual("reviews", {
//   ref: "Review",
//   foreignField: "tour",
//   localField: "_id",
// });

const Holiday = mongoose.model("Holiday", holidaySchema);

export default Holiday;
