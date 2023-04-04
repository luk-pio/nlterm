#!/usr/bin/env node
import { config, setDebug } from "./config/config";
import { handleError } from "./error";
import { logDebug } from "./logDebug";
import { OpenaiApi } from "./openai/api";
import { parseArgs } from "./command/parseArgs";

(async () => await main())().catch((error: unknown) => handleError(error));
process.on("unhandledRejection", handleError);
process.on("uncaughtException", handleError);
process.removeAllListeners("warning");

async function main() {
  const { prompt, debug } = parseArgs();
  if (debug) {
    setDebug();
    logDebug("Using the following config values:");
    logDebug(JSON.stringify(config, null, 2));
  }

  const openaiApi = new OpenaiApi(
    config.openai.apiUrl,
    config.openai.apiKey,
    config.debug
  );

  const command = await openaiApi.getTerminalCommand(
    prompt,
    config.systemMessage,
    config.chatCompletionConfig
  );
  console.log(command);
  process.exit(0);
}
