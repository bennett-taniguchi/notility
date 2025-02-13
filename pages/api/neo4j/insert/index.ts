import OpenAI from "openai";
import { getServerSession } from "next-auth/next";
import { options } from "../../auth/[...nextauth]";
import "neo4j-driver";
import { LLMGraphTransformer } from "@langchain/community/experimental/graph_transformers/llm";
import { ChatOpenAI } from "@langchain/openai";
import { Document } from "@langchain/core/documents";

import "neo4j-driver";
import {  Neo4jGraph } from "@langchain/community/graphs/neo4j_graph";
import { string } from "zod";
import { config } from "process";
import { embedChunksDense } from "../../../../utils/parse_text";

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
  const { chunked,filename } = req.body;
  console.log("neo4j", chunked);
  const url = process.env.NEO4J_URI;
  const username = process.env.NEO4J_USER;
  const password = process.env.NEO4J_PASSWORD;
  const database = process.env.NEO4J_AURA;
  const graph = await Neo4jGraph.initialize({ url, username, password } as any);

  try {

    let docs = [] as Document[]
    chunked.forEach((chunk) => {
        docs.push( new Document({ pageContent: chunk }))
    })
    const results = await llmGraphTransformer.convertToGraphDocuments(docs);
    console.log('50',results)
    const embeddings = await(embedChunksDense(chunked));
    console.log('52',embeddings)
 
    console.log('57',session.user,session.id,session.user.email)
    // here modify all nodes to have an attribute based on user's id
    results.forEach((resultant,idx) => {
      
       resultant.source.id =   session.id
        resultant.source.metadata = {...embeddings[idx],title:filename, userEmail:session.user.email}
    })

    console.log('61',results)
    await graph.addGraphDocuments(results, {includeSource:true});

    res.json({ success: true, message: "Graph documents added successfully" });
  } catch (e) {
    console.log(e);
  }
}
