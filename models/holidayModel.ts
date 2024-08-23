import mongoose from "mongoose";

const { Schema } = mongoose;

const holidaySchema = new Schema({
  name: { type: String, requiere: [true, "A holiday must have a name"] },
  startingDate: { type: Date, requiere: [true, "A holiday must have a starting date"] },
  endDate: { type: Date, requiere: [true, "A holiday must have an end date"] },
  authorizationAnticipate: { type: Boolean},
  authorizationMannager: { type: Boolean},
  observation: { type: String},
  mannagerName:{type: String, requiere: [true, "A holiday must have a mannager name"]},
  adminName:{type: String, requiere: [true, "A holiday must have an admin name"]},
  firmEmployer:{type: String, requiere: [true, "A holiday must have an employer firm"]},
});

const HolidayModel = mongoose.model("Holiday", holidaySchema);

export default HolidayModel;
