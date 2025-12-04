import { v7 as uuidv7, validate } from "uuid";

export const generateUUID = () => {
  return uuidv7();
};

export const isValidUUID = (uuid: string) => {
  return validate(uuid);
};
