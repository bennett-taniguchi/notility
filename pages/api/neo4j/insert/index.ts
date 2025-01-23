import OpenAI from "openai";
import { getServerSession } from "next-auth/next";
import { options } from "../../auth/[...nextauth]";
import "neo4j-driver";
import { LLMGraphTransformer } from "@langchain/community/experimental/graph_transformers/llm";
import { ChatOpenAI } from "@langchain/openai";
import { Document } from "@langchain/core/documents";

import "neo4j-driver";
import { Neo4jGraph } from "@langchain/community/graphs/neo4j_graph";
import { string } from "zod";

const model = new ChatOpenAI({
  temperature: 0,
  model: "gpt-4-turbo-preview",
});

const llmGraphTransformer = new LLMGraphTransformer({
  llm: model,
  allowedNodes: ["PERSON", "ORGANIZATION"],
  allowedRelationships: [
    "PARENT",
    "SIBLING",
    "COLLEAGUE",
    "KNOWS",
    "KILLED",
    "ENEMY_OF",
    "ALLY_OF",
  ],
  nodeProperties: ["good_or_evil", "job"],
  strictMode: false,
});

export default async function handle(req, res) {
  const session = await getServerSession(req, res, options);
  const { chunk } = req.body;
  console.log("neo4j", chunk);
  const url = process.env.NEO4J_URI;
  const username = process.env.NEO4J_USER;
  const password = process.env.NEO4J_PASSWORD;
  const database = process.env.NEO4J_AURA;
  const graph = await Neo4jGraph.initialize({ url, username, password } as any);

  try {
    const result = await llmGraphTransformer.convertToGraphDocuments([
      new Document({ pageContent: chunk }),
    ]);

    await graph.addGraphDocuments(result);

    res.json({ success: true, message: "Graph documents added successfully" });
  } catch (e) {
    console.log(e);
  }
}
