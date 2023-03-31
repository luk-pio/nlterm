import { getEnvVariable } from "./getEnvVariable";

const systemMessage = `
I want you to translate my prompts to terminal commands.
I will provide you with a prompt and I want you to answer with a command which I can run in the terminal. 
You should only reply with the terminal command and nothing else.
Do not write explanations. 
`;

export const config = {
  openai: {
    apiKey: getEnvVariable("OPENAI_API_KEY"),
    organization: process.env["OPENAI_ORG_ID"] || undefined,
  },
  systemMessage,
  message: {
    model: process.env["NLTERM_MODEL"] || "gpt-3.5-turbo",
    temperature: 0.0,
    max_tokens: 3000,
    top_p: 1.0,
    frequency_penalty: 0.2,
    presence_penalty: 0.0,
    stop: ["\n"],
  },
};
