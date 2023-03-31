import { handleError, NLTError } from "./error";
import { getTerminalCommand } from "./openai";

(async () => await main())().catch((error: unknown) => handleError(error));
process.on("unhandledRejection", handleError);
process.on("uncaughtException", handleError);

async function main() {
  const prompt = parseArgs();
  const command = await getTerminalCommand(prompt);
  console.log(command);
  process.exit(0);
}

function parseArgs(): string {
  const prompt = process.argv[2];

  if (!(prompt?.length)) {
    throw new NLTError(
      "Missing prompt value. Provide the prompt string as the first argument",
      1
    );
  }
  return prompt;
}
