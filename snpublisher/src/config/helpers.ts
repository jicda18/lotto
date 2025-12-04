export const toHashtag = (text: string): string => {
  let normalized = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  normalized = normalized.replace(/[^a-zA-Z0-9 ]/g, "");

  normalized = normalized.trim().replace(/\s+/g, "_");

  normalized = normalized.toLowerCase();

  return `#${normalized}`;
};
