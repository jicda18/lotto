import { DateTime, DateTimeUnit } from "luxon";

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

  fromFormat: (dte: string, format: string = "yyyy-MM-dd") => {
    return DateTime.fromFormat(dte, format).toJSDate();
  },

  compare: (
    dte1: Date,
    dte2: Date,
    operator:
      | "!"
      | "="
      | "<"
      | ">"
      | "<="
      | ">="
      | "same:day"
      | "same:hour"
      | "same: minute"
      | "same:second" = "="
  ): Boolean => {
    const dt1 = DateTime.fromJSDate(dte1).toMillis();
    const dt2 = DateTime.fromJSDate(dte2).toMillis();

    switch (operator) {
      case "=":
        return dt1 === dt2;
      case "!":
        return dt1 !== dt2;
      case "<":
        return dt1 < dt2;
      case ">":
        return dt1 > dt2;
      case "<=":
        return dt1 <= dt2;
      case ">=":
        return dt1 >= dt2;
      default:
        if (!operator.startsWith("same:"))
          throw new Error(`Invalid operator: ${operator}`);
        const unit = operator.substring(5) as DateTimeUnit;
        return LuxonAdapter.compare(
          DateTime.fromMillis(dt1).startOf(unit).toJSDate(),
          DateTime.fromMillis(dt2).startOf(unit).toJSDate(),
          "="
        );
    }
  },

  startOf: (dte: Date | string, unit: DateTimeUnit): Date => {
    if (typeof dte === "string") {
      return DateTime.fromISO(dte).startOf(unit).toJSDate();
    }

    return DateTime.fromJSDate(dte).startOf(unit).toJSDate();
  },

  endof: (dte: Date | string, unit: DateTimeUnit): Date => {
    if (typeof dte === "string") {
      return DateTime.fromISO(dte).endOf(unit).toJSDate();
    }

    return DateTime.fromJSDate(dte).endOf(unit).toJSDate();
  },
};
