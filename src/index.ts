#!/usr/bin/env node
import { config, setDebug } from "./config/config";
import { handleError } from "./error";
import { logDebug } from "./logDebug";
import { OpenaiApi } from "./openai/api";
import { parseArgs } from "./command/parseArgs";

(async () => await main())().catch((error: unknown) => handleError(error, config.debug));
process.on("unhandledRejection", (error) => handleError(error, config.debug));
process.on("uncaughtException", (error) => handleError(error, config.debug));
process.removeAllListeners("warning");

async function main() {
  const { prompt, debug } = parseArgs();
  if (debug) {
    setDebug();
    logDebug("Using the following config values:");
    logDebug(JSON.stringify(config, null, 2));
  }

  const {apiUrl, apiKey} = config.openai;
  if (!apiKey) {
    throw new Error("No OpenAI API key provided. Please set the OPENAI_API_KEY environment variable.");
  }
  const openaiApi = new OpenaiApi(
    apiUrl,
    apiKey,
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
