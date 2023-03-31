const systemMessage = `
I want you to translate my prompts to terminal commands.
I will provide you with a prompt. 
I want you to answer with a command which I can run in the terminal. 
You should only reply with the terminal command, and nothing else.
Do not write explanations. 
`
export const config = {
  openai: {
    apiKey: getEnvVariable("OPENAI_API_KEY"),
    organization: getEnvVariable("OPENAI_ORG_ID"),
  },
  systemMessage,
  message: {
      model: "gpt-3.5-turbo",
      temperature: 0.0,
      max_tokens: 100,
      top_p: 1.0,
      frequency_penalty: 0.2,
      presence_penalty: 0.0,
      stop: ["\n"],
  }
};

function getEnvVariable(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Environment variable ${key} not found.`);
  }

  return value;
}
