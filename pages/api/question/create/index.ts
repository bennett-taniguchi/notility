import OpenAI from "openai";
import type { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions";
import { z } from "zod";
import prisma from "../../../../lib/prisma";
import { getAiTitle } from "../../openai/generate/title";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

/**
 * Define the JSON schema for our poll using OpenAI's structured output format.
 * This schema tells the AI exactly what we expect—a question and an array of options.
 */
const questionSchema: OpenAI.ResponseFormatJSONSchema["json_schema"] = {
  name: "createAIQuizQuestion",
  description:
    "Create a high-quality quiz question that engages participants and develops deepened understanding",
  schema: {
    type: "object",
    properties: {
      hint: {
        type: "string",
        description:
          "A short hint that offers a useful explanation of what the question is trying to convey or test on.",
      },

      question: {
        type: "string",
        description:
          "A clear and concise question that can be answered by selecting one of the provided options.",
      },
      options: {
        type: "array",
        description:
          "A list of possible answers for the quiz. Each option should be distinct and cover a range of likely responses. Aim to create 3 incorrect and 1 correct options. Ensure the first answer is always the correct one",
        items: {
          type: "string",
          description:
            "A possible answer to the poll question. Ensure each option is concise and unambiguous.",
        },
      },
    },
    required: ["question", "options", "hint"],
    additionalProperties: false,
  },
  strict: true,
};

/**
 * Create a Zod schema to validate the API response.
 */
const aiQuestion = z.object({
  question: z.string(),
  options: z.array(z.string()),
  hint: z.string(),
});

export type AiQuestion = z.infer<typeof aiQuestion>;

/**
 * getAiQuestion calls OpenAI's chat completion API using structured outputs.
 *
 * @param prompt - The prompt provided by the user to guide poll creation.
 * @param languageCode - The language in which the poll should be generated.
 * @param params - Additional parameters for the OpenAI API.
 * @returns A promise that resolves to a validated poll object.
 */
export const getAiQuestion = async (
  prompt: string,
  languageCode: string,
  params: Partial<ChatCompletionCreateParamsBase> = {}
): Promise<AiQuestion> => {
  const resp = await openai.beta.chat.completions.parse({
    ...params,
    stream: false,
    model: "gpt-4o-2024-11-20",
    messages: [
      {
        role: "system",
        content:
          "You are a quiz generator AI. Your task is to generate challenging quizzes that improve nuanced understanding. Focus on providing options that develop a deepened understanding of the subject.",
      },
      {
        role: "user",
        content: `The prompt for the poll is: ${prompt}. Generate the response in English`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: questionSchema,
    },
  });

  // Parse and validate the response using Zod
  return aiQuestion.parse(resp.choices[0]?.message.parsed);
};

export default async function handle(req, res) {
  const { prompt, uri } = req.body;
  const {title} = await getAiTitle(prompt,'EN')
  const result = await getAiQuestion(prompt, "EN");

  await prisma.question.create({
    data: {
      uri: uri,
      a: result.options[0],
      b: result.options[1],
      c: result.options[2],
      d: result.options[3],
      hint: result.hint,
      question: result.question,
      correctOption: result.options[0],
      title:title,
      topic:prompt
    },
  });

  // EXAMPLE RESULT USAGE
  //     {
  //         question: 'Which type of machine learning model uses labeled data to train and make predictions?',
  //         options: [
  //           'Supervised learning',
  //           'Unsupervised learning',
  //           'Reinforcement learning',
  //           'Generative modeling'
  //         ],
  //         hint: 'Consider the different paradigms in machine learning, such as supervised, unsupervised, reinforced learning, and others.'
  //       }

  res.json(result);
}
