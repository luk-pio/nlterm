import minimist from "minimist";
import { printHelp } from "./printHelp";
import { EXIT_CODE } from "./exitCodes";

export type Args = { prompt: string; debug: boolean };

export function parseArgs(): Args {
  const args = minimist(process.argv.slice(2), {
    boolean: ["help", "debug"],
    alias: {
      h: "help",
    },
  });

  const { _: positional, debug } = args;
  const prompt = positional[0];

  if (!prompt?.length) {
    printHelp();
    process.exit(EXIT_CODE.USER_ERROR);
  }

  if (args.h) {
    printHelp();
    process.exit(EXIT_CODE.SUCCESS);
  }

  return { prompt, debug };
}
