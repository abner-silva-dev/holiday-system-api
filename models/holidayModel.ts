import mongoose from "mongoose";

const { Schema } = mongoose;

const holidaySchema = new Schema({
  name: { type: String, requiere: [true, "A holiday must be have a name"] },
});

const HolidayModel = mongoose.model("Holiday", holidaySchema);

export default HolidayModel;
