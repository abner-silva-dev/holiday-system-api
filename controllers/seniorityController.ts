import { addMonths, differenceInDays, differenceInMonths } from "date-fns";
import Seniority from "../models/seniorityModel";

import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handleFactory";

export const computeSeniority = (date: Date) => {
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

export const getDaysAvailables = async (yearsWorked: number) => {
  try {
    const [{ maxYears }] = await Seniority.aggregate([
      {
        $group: {
          _id: null,
          maxYears: { $max: "$maxYears" },
        },
      },
    ]);

    if (yearsWorked > maxYears) yearsWorked = maxYears;

    const vacation = await Seniority.findOne({
      minYears: { $lte: yearsWorked },
      maxYears: { $gte: yearsWorked },
    });
    return vacation ? vacation.vacationDays : null;
  } catch (err) {
    console.error(err);
  }
};

export const createSeniority = createOne(Seniority);

export const getAllSeniority = getAll(Seniority);
export const updateSeniority = updateOne(Seniority);
export const deleteSeniority = deleteOne(Seniority);

export const getSeniority = getOne(Seniority);
