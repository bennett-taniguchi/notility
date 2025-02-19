import OpenAI from "openai";
import { getServerSession } from "next-auth/next";
import { options } from "../../auth/[...nextauth]";
import { auth, driver } from "neo4j-driver";
import "neo4j-driver";
// import { options  } from "../../../auth/[...nextauth]";
// import prisma from "../../../../../lib/prisma";
const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

export default async function handle(req, res) {
  const { prompt, messages, title, limit } = req.body;
  const session = await getServerSession(req, res, options);

  // query
  const query = req.query.limit;

  // neo4j setup
  const url = process.env.NEO4J_URI;
  const username = process.env.NEO4J_USER;
  const password = process.env.NEO4J_PASSWORD;
  const database = process.env.NEO4J_AURA;
  let graph = driver(url!, auth.basic(username!, password!, database!));
  //

  // 1) Embed Prompt
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: prompt,
    encoding_format: "float",
    dimensions: 1536,
  });
  const embedded = (response.data as any);
  const embedding = await embedded[0].embedding
console.log('potato',embedding,embedded)
  // 2) Query DB with embedded
  const { records } = await graph.executeQuery(
    `CALL db.index.vector.queryNodes('vecs', 10, ${JSON.stringify(embedding)})
YIELD node as d, score
WHERE d.userEmail = 'bennettt356@gmail.com'
OPTIONAL MATCH path = (d)-[*0..2]-(n:Person|Organization)
RETURN DISTINCT n, d, relationships(path) as rels, score
LIMIT ${limit}`,

    { database: "neo4j" }
  );

  res.json(records)
}
