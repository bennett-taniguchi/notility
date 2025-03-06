import OpenAI from "openai";
import { getServerSession } from "next-auth/next";
import { options as authOptions } from "../../../auth/[...nextauth]";
import prisma from "../../../../../lib/prisma";
import { z } from "zod";
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

/**
 * Define the JSON schema for our subtopic list using OpenAI's structured output format.
 * This schema tells the AI exactly what we expect: an array of subtopics
 */
const subTopicSchema: OpenAI.ResponseFormatJSONSchema["json_schema"] = {
  name: "createTitle",
  description:
    "Create an overarching title that describes all of the sub titles provided",
  schema: {
    type: "object",
    properties: {
      title: {
        type:'string',
        description:'The overaching title that describes the topics together if they are related in an Academic-Sense, Business-Sense, or Creative-Sense try to focus on one Sense' 
      },
    },
    required: ["title"],
    additionalProperties: false,
  },
  strict: true,
};

const aiTitle = z.object({
  title: (z.string()),
});
export type AiTitle = z.infer<typeof aiTitle>;

/**
 * getAiTitle calls OpenAI's chat completion API using structured outputs.
 *
 * @param prompt - The prompt provided by the user to guide poll creation.
 * @param languageCode - The language in which the poll should be generated.
 * @param params - Additional parameters for the OpenAI API.
 * @returns A promise that resolves to a validated poll object.
 */
export const getAiTitle = async (
  prompt: string[],
  languageCode: string,
  params: Partial<ChatCompletionCreateParamsBase> = {}
): Promise<AiTitle> => {
  const resp = await openai.beta.chat.completions.parse({
    ...params,
    stream: false,
    model: "gpt-4o-2024-11-20",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful teaching assistant and you are tasked with categorizing the overarching topic title that relates all the provided sub-topics",
      },
      {
        role: "user",
        content: `The sub-topics are: ${prompt}. Generate the response in English`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: subTopicSchema,
    },
  });

  // Parse and validate the response using Zod
  return aiTitle.parse(resp.choices[0]?.message.parsed);
};
