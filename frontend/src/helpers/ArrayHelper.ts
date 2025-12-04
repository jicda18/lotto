export const ArrayHelper = {
  join: (items: string[], separator: string, lastSeparator?: string) => {
    if (items.length === 0) return "";
    if (items.length === 1) return items[0];

    const last = items.at(-1);
    const rest = items.slice(0, -1);

    return rest.join(separator) + (lastSeparator ?? separator) + last;
  },
};
