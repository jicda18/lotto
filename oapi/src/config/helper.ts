export const Helper = {
  groupBy: <T extends Record<string, unknown>>(
    values: T[],
    by: keyof T
  ): T[][] =>
    Object.values(
      values.reduce((acc, value) => {
        let key: string | null = null;
        const keyValue = value[by];

        if (
          typeof keyValue === "string" ||
          typeof keyValue === "number" ||
          typeof keyValue === "bigint" ||
          typeof keyValue === "boolean"
        ) {
          key = keyValue.toString();
        } else if (keyValue instanceof Date && !isNaN(keyValue.getTime())) {
          key = keyValue.toISOString();
        }

        if (key === null)
          throw new Error(`Invalid property value for "${String(by)}"`);

        if (!acc[key]) {
          acc[key] = [];
        }

        acc[key].push(value);

        return acc;
      }, {} as Record<string, T[]>)
    ),
};
