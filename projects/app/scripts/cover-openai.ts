import { readFile } from "node:fs/promises";

import { DEFAULT_IMAGE_MODEL } from "./cover-core";
import type { ArticleBrief } from "./cover-core";

export type GenerateImageInput = {
  prompt: string;
  brief: ArticleBrief;
  previousImagePath?: string;
  revisionInstruction?: string;
};

export type GenerateImageResult = {
  bytes: Uint8Array;
  provider: string;
  model: string;
  responseId?: string;
};

export type CoverImageProvider = {
  generate(input: GenerateImageInput): Promise<GenerateImageResult>;
};

export type OpenAIImageProviderOptions = {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  responsesModel?: string;
  endpoint?: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
};

type OpenAIContentPart =
  | { type: "input_text"; text: string }
  | { type: "input_image"; image_url: string };

type OpenAIResponse = {
  id?: string;
  output?: Array<{
    type?: string;
    result?: string;
    [key: string]: unknown;
  }>;
};

const toDataUrl = async (imagePath: string) => {
  const image = await readFile(imagePath);
  return `data:image/png;base64,${image.toString("base64")}`;
};

const decodeBase64 = (value: string) => Uint8Array.from(Buffer.from(value, "base64"));

const resolveResponsesEndpoint = (baseUrl?: string) => {
  const rawBaseUrl = baseUrl ?? process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";
  const normalized = rawBaseUrl.replace(/\/+$/, "");
  return `${normalized}/responses`;
};

export class OpenAIImageProvider implements CoverImageProvider {
  private readonly apiKey?: string;
  private readonly endpoint: string;
  private readonly fetchImpl: typeof fetch;
  private readonly model: string;
  private readonly responsesModel: string;
  private readonly timeoutMs: number;

  constructor(options: OpenAIImageProviderOptions = {}) {
    this.apiKey = options.apiKey ?? process.env.OPENAI_API_KEY;
    this.endpoint = options.endpoint ?? resolveResponsesEndpoint(options.baseUrl);
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.model = options.model ?? process.env.OPENAI_IMAGE_MODEL ?? DEFAULT_IMAGE_MODEL;
    this.responsesModel = options.responsesModel ?? process.env.OPENAI_RESPONSES_MODEL ?? "gpt-5.5";
    this.timeoutMs = options.timeoutMs ?? 120000;
  }

  async generate(input: GenerateImageInput): Promise<GenerateImageResult> {
    if (!this.apiKey) {
      throw new Error("Missing OPENAI_API_KEY.");
    }

    const content: OpenAIContentPart[] = [
      {
        type: "input_text",
        text: input.revisionInstruction
          ? `${input.prompt}\n\nRevision request: ${input.revisionInstruction}`
          : input.prompt,
      },
    ];

    if (input.previousImagePath) {
      content.push({
        type: "input_image",
        image_url: await toDataUrl(input.previousImagePath),
      });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await this.fetchImpl(this.endpoint, {
        method: "POST",
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.responsesModel,
          input: [
            {
              role: "user",
              content,
            },
          ],
          tools: [
            {
              type: "image_generation",
              model: this.model,
              output_format: "png",
              quality: "high",
              size: "1536x1024",
            },
          ],
          tool_choice: {
            type: "image_generation",
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI image generation failed: ${response.status} ${errorText}`);
      }

      const data = await response.json() as OpenAIResponse;
      const imageResult = data.output?.find((item) => item.type === "image_generation_call" && typeof item.result === "string");

      if (!imageResult?.result) {
        throw new Error("OpenAI response did not include an image result.");
      }

      return {
        bytes: decodeBase64(imageResult.result),
        provider: "openai",
        model: this.model,
        responseId: data.id,
      };
    }
    catch (error) {
      if ((error as Error).name === "AbortError") {
        throw new Error("OpenAI image generation timed out.");
      }

      throw error;
    }
    finally {
      clearTimeout(timeout);
    }
  }
}
