import { AxiosResponse, isAxiosError } from "axios";
import {
  Configuration,
  CreateChatCompletionRequest,
  CreateChatCompletionResponse,
  OpenAIApi,
} from "openai";
import { config } from "./config/config";
import { NLTError } from "./error";

const openai = new OpenAIApi(new Configuration(config.openai));

export async function getTerminalCommand(prompt: string): Promise<string> {
  let response;
  try {
    response = await openai.createChatCompletion(
      getChatCompletionRequest(prompt)
    );
  } catch (error: unknown) {
    if (isAxiosError(error)) throw new NLTError(error.message, 4);
    throw error;
  }

  return validateResponse(
    // todo
    response as AxiosResponse<CreateChatCompletionResponse>
  );
}

const getChatCompletionRequest = (
  prompt: string
): CreateChatCompletionRequest => ({
  ...config.message,
  messages: [
    {
      role: "user",
      content: `${config.systemMessage}
            My prompt is "${prompt}"`,
    },
  ],
});

const validateResponse = (
  response: AxiosResponse<CreateChatCompletionResponse, any> | undefined
): string => {
  const command = response?.data?.choices?.[0]?.message?.content;
  if (!command?.length) {
    throw new NLTError(
      "Chat request finished successfully but did not contain an answer. Try again or modify your prompt.",
      2
    );
  }
  return command;
};
