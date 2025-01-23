import OpenAI from "openai";
import { getServerSession } from "next-auth/next";
import { options  } from "../../auth/[...nextauth]";
import "neo4j-driver";
import { LLMGraphTransformer } from "@langchain/community/experimental/graph_transformers/llm";
import { ChatOpenAI } from "@langchain/openai";
import { Document } from "@langchain/core/documents";
const model = new ChatOpenAI({
    temperature: 0,
    model: "gpt-4-turbo-preview",
  });
 
  let text = `
  Marie Curie, was a Polish and naturalised-French physicist and chemist who conducted pioneering research on radioactivity.
  She was the first woman to win a Nobel Prize, the first person to win a Nobel Prize twice, and the only person to win a Nobel Prize in two scientific fields.
  Her husband, Pierre Curie, was a co-winner of her first Nobel Prize, making them the first-ever married couple to win the Nobel Prize and launching the Curie family legacy of five Nobel Prizes.
  She was, in 1906, the first woman to become a professor at the University of Paris.
  `;
const llmGraphTransformer = new LLMGraphTransformer({
    llm: model,
  });
  
export default async function handle(req,res) {
    const session = await getServerSession(req, res, options);
    const {upload} = req.body 

    const result = await llmGraphTransformer.convertToGraphDocuments([
        new Document({ pageContent: text }),
      ]);
      
    try {
      

         
    } catch(e) {

        console.log(e)
    }


}