import { config } from "../config/config";
import { NLTError, unexpectedError, unknownError } from "../error";
import { logDebug } from "../logDebug";
import {
  ChatCompletionConfig,
  ChatCompletionRequest,
  ChatCompletionResponse,
  OpenaiApiError,
} from "./chatCompletionRequest";
import { FetchError, safeFetch } from "../safeFetch";

type HTTPMethod = "post" | "get";

export class OpenaiApi {
  private secretKey: string;
  private auth: { Authorization: string };

  private openaiApiUrl = "https://api.openai.com/v1";
  private chatCompletionUrl = "/chat/completions";

  constructor(secretKey: string) {
    this.secretKey = secretKey;
    this.auth = {
      Authorization: `Bearer ${this.secretKey}`,
    };
  }

  private async request<T, R>(
    endpoint: string,
    method: HTTPMethod,
    body: T
  ): Promise<R> {
    if (config.debug) {
      logDebug(
        `Sending request to ${
          this.openaiApiUrl + endpoint
        } with the following body`
      );
      logDebug(JSON.stringify(body, null, 2));
    }

    return await safeFetch<R>(this.openaiApiUrl + endpoint, {
      method,
      headers: {
        ...this.auth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }

  async getTerminalCommand(
    prompt: string,
    systemMessage: string,
    config: ChatCompletionConfig
  ): Promise<string> {
    return await this.getChatCompletion(prompt, systemMessage, config);
  }

  private async getChatCompletion(
    prompt: string,
    systemMessage: string,
    config: ChatCompletionConfig
  ): Promise<string> {
    let response: ChatCompletionResponse | null;
    try {
      response = await this.request<
        ChatCompletionRequest,
        ChatCompletionResponse
      >(
        this.chatCompletionUrl,
        "post",
        this.chatCompletionRequestBody(prompt, systemMessage, config)
      );
    } catch (error: unknown) {
      throw this.handleChatCompletionError(error);
    }
    return this.parseChatCompletionResponse(response);
  }

  private chatCompletionRequestBody(
    prompt: string,
    systemMessage: string,
    config: ChatCompletionConfig
  ): ChatCompletionRequest {
    return {
      ...config,
      messages: [
        {
          role: "user",
          content: `${systemMessage}"${prompt}"`,
        },
      ],
    };
  }

  handleChatCompletionError(error: unknown) {
    if (!(error instanceof Error)) {
      return unknownError();
    }

    if (error instanceof FetchError<OpenaiApiError>) {
      const openaiMessage = error.responseBody?.error?.message;
      const message = openaiMessage
        ? `${error.message}: ${openaiMessage}`
        : error.message;
      return this.openaiError(message, error);
    }

    return unknownError(error);
  }

  parseChatCompletionResponse(response: ChatCompletionResponse | null): string {
    const choice = response?.choices?.[0];
    if (!choice)
      throw this.openaiError(
        "Chat request finished successfully but did not contain a message." +
          tryAgain
      );

    const stopReason = choice?.finish_reason;
    if (stopReason !== "stop")
      throw this.openaiError(
        "Chat request finished successfully but stopped unexpectedly." +
          tryAgain
      );

    const message = choice?.message;
    const content = message?.content;
    if (message?.role !== "assistant" || !content?.length) {
      throw this.openaiError(
        "Chat request finished successfully but did not contain an answer." +
          tryAgain
      );
    }

    return content;
  }

  private openaiError(message: string, error?: Error): NLTError {
    return unexpectedError(
      this.openaiErrorMessage(message),
      error,
      "Openai API Error: "
    );
  }

  private openaiErrorMessage(message: string): string {
    return `${message}`;
  }
}

const tryAgain = " Please try again or use a different prompt.";
