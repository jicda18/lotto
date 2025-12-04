import { DateTime } from "luxon";

export const LuxonAdapter = {
  toDate: (dte: string | Date): Date => {
    if (typeof dte === "string") {
      return DateTime.fromISO(dte).toJSDate();
    }

    return dte;
  },

  format: (dte: Date | string, format: string = "yyyy-MM-dd"): string => {
    if (typeof dte === "string") {
      return DateTime.fromISO(dte).toFormat(format);
    }

    return DateTime.fromJSDate(dte).toFormat(format);
  },
};
