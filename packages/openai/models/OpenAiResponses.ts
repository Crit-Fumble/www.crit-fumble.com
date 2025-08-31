/**
 * OpenAI API Response Models
 */

export interface OpenAiMessage {
  role: 'system' | 'user' | 'assistant' | 'function' | 'tool';
  content: string;
  name?: string;
  function_call?: {
    name: string;
    arguments: string;
  };
}

export interface OpenAiChatCompletionRequest {
  model: string;
  messages: OpenAiMessage[];
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  stream?: boolean;
  functions?: any[];
  function_call?: string | { name: string };
}

export interface OpenAiChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  choices: {
    message: OpenAiMessage;
    finish_reason: string;
    index: number;
  }[];
}

export interface OpenAiImageGenerationRequest {
  prompt: string;
  n?: number;
  size?: string;
  response_format?: string;
}

export interface OpenAiImageGenerationResponse {
  created: number;
  data: {
    url?: string;
    b64_json?: string;
  }[];
}

export interface OpenAiFunctionDefinition {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface OpenAiCompletionRequest {
  model: string;
  prompt: string | string[];
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  n?: number;
  stream?: boolean;
  stop?: string | string[];
}

export interface OpenAiCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    text: string;
    index: number;
    logprobs: any;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface OpenAiEmbeddingRequest {
  model: string;
  input: string | string[];
  encoding_format?: string;
}

export interface OpenAiEmbeddingResponse {
  object: string;
  data: {
    object: string;
    embedding: number[];
    index: number;
  }[];
  model: string;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}
