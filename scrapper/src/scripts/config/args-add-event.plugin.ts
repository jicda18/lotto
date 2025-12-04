import yargs from "yargs";
import { hideBin } from "yargs/helpers";

export const args = yargs(hideBin(process.argv))
  .command(
    "$0 <date> <lottery> <game> <results>",
    "Add event to EDA",
    (yargs) =>
      yargs
        .positional("date", {
          type: "string",
          describe: "Results date",
          demandOption: true,
        })
        .positional("lottery", {
          type: "string",
          describe: "lottery id",
          demandOption: true,
        })
        .positional("game", {
          type: "string",
          describe: "game id",
          demandOption: true,
        })
        .positional("results", {
          type: "string",
          describe: "Results",
          demandOption: true,
        })
  )
  .strict()
  .help()
  .parseSync();
