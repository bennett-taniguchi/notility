import OpenAI from "openai";
import { getServerSession } from "next-auth/next";
import { options as authOptions } from "../../../auth/[...nextauth]";
import prisma from "../../../../../lib/prisma";
import { z } from "zod";
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions";
import { getAiTitle } from "../title";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

/**
 * Define the JSON schema for our subtopic list using OpenAI's structured output format.
 * This schema tells the AI exactly what we expect: an array of subtopics
 */
const subTopicSchema: OpenAI.ResponseFormatJSONSchema["json_schema"] = {
  name: "createSubTopics",
  description:
    "Create a high-quality list of subtopics that are related to the subject matter presented by the information provided",
  schema: {
    type: "object",
    properties: {
      subTopics: {
        type: "array",
        description: `Create the prompt required number of subtopics that are required to understand the topics presented and could each correspond to a type of question a user can study`,
        items: {
          type: "string",
          description:
            "A possible sub-topic the user can deeply study and understand to guarantee better understanding of the information provided",
        },
      },
    },
    required: ["subtopics"],
    additionalProperties: false,
  },
  strict: true,
};

const aiSubTopics = z.object({
  subTopics: z.array(z.string()),
});
export type AiSubTopic = z.infer<typeof aiSubTopics>;

/**
 * getAIPoll calls OpenAI's chat completion API using structured outputs.
 *
 * @param prompt - The prompt provided by the user to guide poll creation.
 * @param languageCode - The language in which the poll should be generated.
 * @param params - Additional parameters for the OpenAI API.
 * @returns A promise that resolves to a validated poll object.
 */
export const getAiSubTopics = async (
  prompt: string,
  languageCode: string,
  params: Partial<ChatCompletionCreateParamsBase> = {}
): Promise<AiSubTopic> => {
  const resp = await openai.beta.chat.completions.parse({
    ...params,
    stream: false,
    model: "gpt-4o-2024-11-20",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful teaching assistant and you are tasked with identifying several subtopics related to a student question to provide areas to study upon.",
      },
      {
        role: "user",
        content: `The amount of required sub-topics is: ${prompt}. Generate the response in English`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: subTopicSchema,
    },
  });

  // Parse and validate the response using Zod
  return aiSubTopics.parse(resp.choices[0]?.message.parsed);
};

// {"role": "system", "content": "You are a helpful assistant."},
// {"role": "user", "content": "message 1 content."},
export default async function handle(req, res) {
  const { prompt, amount, uri } = req.body;

  const result = await getAiSubTopics(prompt, "EN");


const topics = result.subTopics.map((topic)=> {return {
 topic,

}})

  // directly pass result so we can use in quizgen => generate questions
  res.json(topics);
}
