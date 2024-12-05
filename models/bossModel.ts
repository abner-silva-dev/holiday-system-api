import mongoose, { Model, Query, Schema } from "mongoose";

export interface BossDocument extends Document {
  department: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
}

const bossSchema = new Schema({
  department: {
    type: Schema.Types.ObjectId,
    ref: "Department",
    required: [true, "Un jefe debe estar asociado a un departamento"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Un jefe debe estar asociado a un usuario"],
    // unique: true,
  },
});

bossSchema.pre<Query<any, any>>(/^find/, function (next) {
  this.populate({
    path: "user",
  }),
    this.populate({
      path: "department",
    });

  next();
});

const Boss: Model<BossDocument> = mongoose.model<BossDocument>(
  "Boss",
  bossSchema
);

export default Boss;
