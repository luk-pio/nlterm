import { OpenaiApi } from "../openai/api";
import fetchMock from "jest-fetch-mock";
import { ChatCompletionConfig } from "../openai/chatCompletionRequest";
import { FetchError } from "../safeFetch";
import { NLTError } from "../error";
fetchMock.enableMocks();

const mockResponse = {
  id: "chatcmpl-123",
  object: "chat.completion",
  created: 1677652288,
  choices: [
    {
      index: 0,
      message: {
        role: "assistant",
        content: "ls -al",
      },
      finish_reason: "stop",
    },
  ],
  usage: {
    prompt_tokens: 9,
    completion_tokens: 12,
    total_tokens: 21,
  },
};

const mockErrorResponse = {
  error: {
    message:
      "Incorrect API key provided: test-secret-key. You can find your API key at https://platform.openai.com/account/api-keys.",
    type: "invalid_request_error",
    param: null,
    code: "invalid_api_key",
  },
};

describe("OpenaiApi", () => {
  const secretKey = "test-secret-key";
  const openaiApi = new OpenaiApi(secretKey);
  const prompt = "Test prompt";
  const systemMessage = "Test system message";
  const chatCompletionConfig: ChatCompletionConfig = {
    model: "chat-gpt3.5-turbo",
    temperature: 0.5,
    max_tokens: 100,
  };

  it("should return terminal command on successful chat completion request", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const result = await openaiApi.getTerminalCommand(
      prompt,
      systemMessage,
      chatCompletionConfig
    );

    expect(result).toEqual("ls -al");
  });

  it("should throw NLTError on failed chat completion request", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockErrorResponse), {
      status: 401,
      statusText: "Unauthorized",
    });

    await expect(
      openaiApi.getTerminalCommand(prompt, systemMessage, chatCompletionConfig)
    ).rejects.toMatchObject({
      message: `Openai API Error: Unauthorized: ${mockErrorResponse.error.message}`,
      code: 2,
    });
  });

  it("should throw NLTError on unexpected chat completion response", async () => {
    const response = {
      ...mockResponse,
      choices: [
        {
          message: {
            role: "assistant",
            content: "",
          },
          finish_reason: "stop",
        },
      ],
    };

    fetchMock.mockResponseOnce(JSON.stringify(response));

    await expect(
      openaiApi.getTerminalCommand(prompt, systemMessage, chatCompletionConfig)
    ).rejects.toMatchObject({
      message:
        "Openai API Error: Chat request finished successfully but did not contain an answer. Please try again or use a different prompt.",
      code: 2,
    });
  });
});
