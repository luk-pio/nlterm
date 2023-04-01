import minimist from "minimist";
import { config } from "./config/config";
import { handleError, logDebug, NLTError } from "./error";
import { OpenaiApi } from "./openai/openai";

(async () => await main())().catch((error: unknown) => handleError(error));
process.on("unhandledRejection", handleError);
process.on("uncaughtException", handleError);
process.removeAllListeners("warning");

async function main() {
  const { prompt, debug } = parseArgs();
  if (debug) setDebug();
  if (debug) {
    logDebug("Using the following config values:");
    logDebug(JSON.stringify(config, null, 2));
  }

  const openaiApi = new OpenaiApi(config.openai.apiKey);
  const command = await openaiApi.getTerminalCommand(
    prompt,
    config.systemMessage,
    config.chatCompletionConfig
  );
  console.log(command);
  process.exit(0);
}

function setDebug() {
  config.debug = true;
}

type Args = { prompt: string; debug: boolean };
function parseArgs(): Args {
  const args = minimist(process.argv.slice(2), {
    boolean: ["help", "debug"],
    alias: {
      h: "help",
    },
  });

  const { _: positional, debug } = args;
  const prompt = positional[0];

  if (!prompt?.length) {
    throw new NLTError(
      "Missing prompt value. Provide the prompt string as the first argument",
      1
    );
  }

  return { prompt, debug };
}
