import mongoose, { Model, Document } from "mongoose";
import connection from "../db/connection";

import { dataEnterprises } from "./data-enterprises";
import { dataDepartments } from "./data-departments";
import { dataUsers } from "./data-users";
import { dataHolidays } from "./data-holiday";

// MODELS
import User, { UserDocument } from "../models/userModel";
import Enterprise, { EnterpriseDocument } from "../models/enterpriseModel";
import Department, { DepartmentDocument } from "../models/departmentModel";
import Holiday, { HolidayDocument } from "../models/holidayModel";

import "dotenv/config";

// Define ModelType for each model
type UserModel = Model<UserDocument>;
type EnterpriseModel = Model<EnterpriseDocument>;
type DepartmentModel = Model<DepartmentDocument>;
type HolidayModel = Model<HolidayDocument>;

// Define ModelType as a union of all possible model types
type ModelType = UserModel | EnterpriseModel | DepartmentModel | HolidayModel;

// DATAS
const collectionsNames: string[] = [
  "department",
  "enterprise",
  "user",
  "holiday",
  "all",
];

const collectionsModel: ModelType[] = [Department, Enterprise, User, Holiday];

const JSONFiles: (
  | Partial<DepartmentDocument>[]
  | Partial<EnterpriseDocument>[]
  | Partial<UserDocument>[]
  | Partial<HolidayDocument>[]
)[] = [dataDepartments, dataEnterprises, dataUsers, dataHolidays];

// CONNECTION WITH DB
connection();

// IMPORT DATA INTO DB
const importData = async (
  JSONFile:
    | Partial<UserDocument>[]
    | Partial<EnterpriseDocument>[]
    | Partial<DepartmentDocument>[]
    | Partial<HolidayDocument>[],
  Model: ModelType
): Promise<void> => {
  try {
    await (Model as any).create(JSONFile, { validateBeforeSave: false });
    console.log("Data successfully loaded!");
    // process.exit();
  } catch (err) {
    console.error(err);
    // process.exit(1);
  }
};

// DELETE ALL DATA FROM DB
const removeAllData = async (Model: ModelType): Promise<void> => {
  try {
    await (Model as any).deleteMany();
    console.log("Data successfully removed!");
    // process.exit();
  } catch (err) {
    console.error(err);
    // process.exit(1);
  }
};

// CHECK THE USER INPUT AND VALIDATE
(async () => {
  if (process.argv[2] !== "import" && process.argv[2] !== "remove") {
    console.error("Invalid argument");
    process.exit(1);
  }

  // console.log(process.argv[3], "all");
  if (process.argv[3] === "all") {
    if (process.argv[2] === "import") {
      await importData(JSONFiles[1], collectionsModel[1]);
      await importData(JSONFiles[0], collectionsModel[0]);
      await importData(JSONFiles[2], collectionsModel[2]);
      await importData(JSONFiles[3], collectionsModel[3]);
    }

    if (process.argv[2] === "remove") {
      await removeAllData(collectionsModel[1]);
      await removeAllData(collectionsModel[0]);
      await removeAllData(collectionsModel[2]);
      await removeAllData(collectionsModel[3]);
    }
    return process.exit();
  }

  let JSONFile:
    | Partial<UserDocument>[]
    | Partial<EnterpriseDocument>[]
    | Partial<DepartmentDocument>[]
    | Partial<HolidayDocument>[]
    | undefined;
  let collection: ModelType | undefined;

  if (process.argv[3]) {
    if (!collectionsNames.includes(process.argv[3])) {
      console.error("Invalid collection name");
      process.exit(1);
    }

    const indexName = collectionsNames.indexOf(process.argv[3]);
    collection = collectionsModel[indexName];
    JSONFile = JSONFiles[indexName];
  }

  if (!collection || !JSONFile) {
    console.error("Collection or JSON file not found");
    process.exit(1);
  }

  switch (process.argv[2]) {
    case "import":
      await importData(JSONFile, collection);

      break;
    case "remove":
      await removeAllData(collection);
      break;
  }

  process.exit();
})();

// call to npm: node 'path' {import | remove} {department | user | enterprise | all}
