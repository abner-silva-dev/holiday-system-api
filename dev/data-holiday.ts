import mongoose from "mongoose";
import { HolidayDocument } from "../models/holidayModel";

export const dataHolidays: HolidayDocument[] = [
  // {
  //   days: [
  //     new Date("2024-09-28"),
  //     new Date("2024-09-29"),
  //     new Date("2024-09-30"),
  //   ],
  //   authorizationAdmin: "pending",
  //   authorizationManager: "pending",
  //   observation: "",
  //   observationManager: "",
  //   observationAdmin: "",
  //   createdAt: new Date(),
  //   manager: new mongoose.Types.ObjectId("64fbf01e9b9f146bdc6a1a01"),
  //   admin: new mongoose.Types.ObjectId("64fbf01e9b9f146bdc6a1a03"),
  //   user: new mongoose.Types.ObjectId("64fbf01e9b9f146bdc6a1a02"),
  // },
  // {
  //   days: [new Date("2024-10-05"), new Date("2024-10-06")],
  //   authorizationAdmin: "approved",
  //   authorizationManager: "pending",
  //   observation: "approved by admin",
  //   observationManager: "",
  //   observationAdmin: "Admin approved on 2024-09-20",
  //   createdAt: new Date(),
  //   manager: new mongoose.Types.ObjectId("64fbf01e9b9f146bdc6a1a05"),
  //   admin: new mongoose.Types.ObjectId("64fbf01e9b9f146bdc6a1a07"),
  //   user: new mongoose.Types.ObjectId("64fbf01e9b9f146bdc6a1a08"),
  // },
  // {
  //   days: [new Date("2024-10-15"), new Date("2024-10-16")],
  //   authorizationAdmin: "rejected",
  //   authorizationManager: "pending",
  //   observation: "Request rejected due to workload",
  //   observationManager: "",
  //   observationAdmin: "Admin rejected on 2024-10-20",
  //   createdAt: new Date(),
  //   manager: new mongoose.Types.ObjectId("64fbf01e9b9f146bdc6a1a09"),
  //   admin: new mongoose.Types.ObjectId("64fbf01e9b9f146bdc6a1a03"),
  //   user: new mongoose.Types.ObjectId("64fbf01e9b9f146bdc6a1a06"),
  // },
  // {
  //   days: [new Date("2024-12-20"), new Date("2024-12-21")],
  //   authorizationAdmin: "pending",
  //   authorizationManager: "approved",
  //   observation: "",
  //   observationManager: "Manager approved on 2024-12-01",
  //   observationAdmin: "",
  //   createdAt: new Date(),
  //   manager: new mongoose.Types.ObjectId("64fbf01e9b9f146bdc6a1a04"),
  //   admin: new mongoose.Types.ObjectId("64fbf01e9b9f146bdc6a1a07"),
  //   user: new mongoose.Types.ObjectId("64fbf01e9b9f146bdc6a1a05"),
  // },
];
//
