import OpenAI from "openai";
import { getServerSession } from "next-auth/next";
import { options } from "../../../auth/[...nextauth]";
import "neo4j-driver";

import { driver, auth } from "neo4j-driver";

export default async function handle(req, res) {
  const session = await getServerSession(req, res, options);
  const { nameA,nameB } = req.body;
 
  const url = process.env.NEO4J_URI;
  const username = process.env.NEO4J_USER;
  const password = process.env.NEO4J_PASSWORD;
  const database = process.env.NEO4J_AURA;
  let graph = driver(url!, auth.basic(username!, password!));

  try {
    const { records, summary, keys } = await graph.executeQuery(
      `MATCH (a1:Person{id: '${nameA}'}), (a2:Person {id:'${nameB}'})
WITH head(collect([a1,a2])) as nodes
CALL apoc.refactor.mergeNodes(nodes,{
    properties:"combine",
    mergeRels:true
})
YIELD node
RETURN count(*)`,
      { database: "neo4j" }
    );

    res.json({ records, summary, keys });
  } catch (e) {
    console.log(e);
  }
}
