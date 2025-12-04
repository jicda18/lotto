import { DateTime } from "luxon";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

export const args = yargs(hideBin(process.argv))
  .usage("Usage: $0 <date> [options]")
  .positional("date", {
    type: "string",
    describe: "Results date that you want to search",
    demandOption: true,
  })
  .command("$0 <date>", "Run the result search task", (yargs) =>
    yargs.positional("date", {
      type: "string",
      describe: "Results date that you want to search",
      demandOption: true,
    })
  )
  .option("lotteries", {
    alias: "l",
    type: "string",
    array: true,
    default: [],
    describe: "ids or names of game's lotteries to search",
  })
  .option("games", {
    alias: "g",
    type: "string",
    array: true,
    default: [],
    describe: "ids or names of games to search",
  })
  .option("all", {
    alias: "a",
    type: "boolean",
    default: false,
    describe: "Search all lotteries and games",
  })
  .option("delay", {
    alias: "D",
    type: "number",
    describe: "Delay in milliseconds to start the task",
  })
  .check((argv) => {
    const parsed = DateTime.fromISO(argv.date);
    if (!parsed.isValid) {
      throw new Error("Invalid date format. Use valid ISO 8601.");
    }

    if (!argv.all && !argv.lotteries.length && !argv.games.length) {
      throw new Error(
        "You must specify at least one of --all, --lotteries, or --games options."
      );
    }

    if (argv.all) {
      if (argv.lotteries.length || argv.games.length) {
        console.warn(
          "Warning: --all option is set, lotteries and games options will be ignored."
        );
      }

      return true;
    }

    if (argv.lotteries.length && argv.games.length) {
      throw new Error(
        "You cannot specify both --lotteries and --games options at the same time."
      );
    }

    return true;
  })
  .strict()
  .help()
  .parseSync();
