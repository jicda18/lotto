import { envs } from "./envs.plugin";

export const SelfHelper = {
  MakeUrl: (uri: string) => `${envs.SELF_URL}${uri}`,
};
