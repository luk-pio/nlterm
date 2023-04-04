export interface ChatCompletionRequest extends ChatCompletionConfig {
  messages: { role: string; content: string }[];
}

export interface ChatCompletionConfig {
  model: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  choices: Choice[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface OpenaiApiError {
  error: {
    message: string,
    type: string,
    param: string | null,
    code: string
  }
}

type Role = "user" | "assistant" | "system";

interface Choice {
  index: number;
  message: {
    role: Role;
    content: string;
  };
  finish_reason: string;
}
