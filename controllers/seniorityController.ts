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

/**
 * Computes the start and end period based on the hiring date and a relative time value.
 *
 * @param dateHiring - The date when the employee was hired.
 * @param time - The relative period that determines which year to compute.
 *               - `-1` previous period, `0` current period,  `1` next period.
 * @returns An object containing the start and end dates of the computed period.
 *
 * @example
 * ```ts
 * const dateHiring = new Date('2020-05-15');
 * const period = computePeriod(dateHiring, -1);
 * // period = { startDate: Date, endDate: Date }
 * ```
 */
type Time = -1 | 0 | 1;

export const calculatedPeriod = (dateHiring: Date, time: Time) => {
  const currentDate = new Date();

  const startDate = new Date(
    currentDate.getFullYear() + time,
    dateHiring.getMonth(),
    dateHiring.getDate() + 1
  );

  const endDate = new Date(
    currentDate.getFullYear() + time + 1,
    dateHiring.getMonth(),
    dateHiring.getDate()
  );

  return { startDate, endDate };
};

export const createSeniority = createOne(Seniority);

export const getAllSeniority = getAll(Seniority);
export const updateSeniority = updateOne(Seniority);
export const deleteSeniority = deleteOne(Seniority);

export const getSeniority = getOne(Seniority);
