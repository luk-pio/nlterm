import { getEnvVariable } from "./getEnvVariable";

const systemMessage = `I want you to translate my prompts to terminal commands. I will provide you with a prompt and I want you to answer with a command which I can run in the terminal. You should only reply with the terminal command and nothing else. Do not write explanations. Do not format the command in a code block. My prompt is: `;

const MAX_TOKENS = 2048

export const config = {
  debug: false,
  openai: {
    apiKey: getEnvVariable("OPENAI_API_KEY"),
    organization: process.env["OPENAI_ORG_ID"] || undefined,
  },
  systemMessage,
  chatCompletionConfig: {
    model: process.env["NLTERM_MODEL"] || "gpt-3.5-turbo",
    max_tokens: MAX_TOKENS,
    temperature: 0.0,
    top_p: 1,
    n: 1,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  },
};
