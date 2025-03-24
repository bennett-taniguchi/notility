import OpenAI from "openai";
import type { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions";
import { z } from "zod";
import prisma from "../../../../lib/prisma";
import { AiQuestion } from "../create";
import { getAiTitle } from "../../openai/generate/title";
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]";
import { Question } from "@prisma/client";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

/**
 * Define the JSON schema for our poll using OpenAI's structured output format.
 * This schema tells the AI exactly what we expect—a question and an array of options.
 */
const quizSchema: OpenAI.ResponseFormatJSONSchema["json_schema"] = {
    name: "createAIQuiz",
    description:
      "Create a high-quality quiz question that engages participants and develops deepened understanding",
    schema: {
      type: "object",
      properties: {
        questions: {
          type: "array",
          description: "An array of multiple choice quiz questions that test a user's understanding of subtopics",
          items: {
            type: "object", // This was missing
            properties: {  // You need to wrap your properties in a properties object
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
            additionalProperties: false,
            required: ["question", "options", "hint"] // Move these required fields here for the item level
          }
        },
      },
      required: ["questions"], // This should only contain top-level required properties
      additionalProperties: false,
    },
    strict: true,
  };

/**
 * Create a Zod schema to validate the API response.
 */
const aiQuiz = z.object({
    questions: z.array(
      z.object({
        question: z.string(),
        options: z.array(z.string()),
        hint: z.string()
      })
    ) 
  });

export type AIPoll = z.infer<typeof aiQuiz>;

/**
 * getAiQuiz calls OpenAI's chat completion API using structured outputs.
 *
 * @param prompt - The prompt provided by the user to guide poll creation.
 * @param languageCode - The language in which the poll should be generated.
 * @param params - Additional parameters for the OpenAI API.
 * @returns A promise that resolves to a validated poll object.
 */
export const getAiQuiz = async (
  prompt: string,
  languageCode: string,
  topics:string[],
  params: Partial<ChatCompletionCreateParamsBase> = {}
): Promise<AIPoll> => {
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
        content: `The prompt for the poll is: ${prompt} The amount of questions is: ${topics.length}. Generate the response in English`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: quizSchema,
    },
  });

  // Parse and validate the response using Zod
  return aiQuiz.parse(resp.choices[0]?.message.parsed);
};
export async function populateQuestionsAndQuiz(quiz, title, topics, uri,email) {
  const transaction = await prisma.$transaction(async (tx) => {
      // Create Quiz with nested questions
      const quizResult = await tx.quiz.create({
          data: {
            createdBy: email,
              createdOn: (new Date()).toDateString(),
              notespace: { connect: { uri: uri } },
              title: title,
              topics: topics,
              questions: {
                  create: quiz.questions.map((quest:any, idx) => ({
                   
                      a: quest.options[0],
                      b: quest.options[1],
                      c: quest.options[2],
                      d: quest.options[3],
                      hint: quest.hint,
                      question: quest.question,
                      correctOption: quest.options[0],
                    
                      topic: topics[idx],
                  }))
              }
          },
          include: {
              questions: true
          }
      });

      return quizResult;
  });

  return transaction;
}

export default async function handle(req, res) {
  const session = await getServerSession(req, res, options);
  const { prompt, uri, topics } = req.body;

  const {title} = await getAiTitle(topics,'EN')
  const quiz = await getAiQuiz(prompt, "EN",topics);
  const email = session.user.email;
    const transaction = await populateQuestionsAndQuiz(quiz,title,topics,uri,email)

  // see /api/question/create for example usage of single question
  res.json(transaction);
}
