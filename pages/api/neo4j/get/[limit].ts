import OpenAI from "openai";
import { getServerSession } from "next-auth/next";
import { options } from "../../auth/[...nextauth]";
import "neo4j-driver";


import  {driver,auth} from "neo4j-driver";
// export default async function handle(req, res) {
//   try {
//     console.log("API route called with query:", req.query); // Debug log
    
//     const session = await getServerSession(req, res, options);
//     console.log("Session email:", session?.user?.email); // Debug log
    
//     const query = req.query.limit;
//     const url = process.env.NEO4J_URI;
//     const username = process.env.NEO4J_USERNAME;
//     const password = process.env.NEO4J_PASSWORD;
    
//     console.log("Connecting to Neo4j..."); // Debug log
//     let graph = driver(url!, auth.basic(username!, password!));
    
//     const { records, summary, keys } = await graph.executeQuery(
//       `MATCH (d:Document)
//        WHERE d.userEmail = $email
//        OPTIONAL MATCH (d)-[*0..2]-(n:Person|Organization)
//        RETURN DISTINCT n, d
//        LIMIT $limit`,
//       { 
//         database: 'neo4j',
//         params: {
//           email: session.user.email,
//           limit: parseInt(query)
//         }
//       }
//     );
    
//     console.log("Query executed, records:", records.length); // Debug log
    
//     res.json({records, summary, keys});
//   } catch (error) {
//     console.error("API route error:", error);
//     res.status(500).json({ error: error.message });
//   }
//}

// get all within two connections that are either a person or organization from the chunks with session's email
// given total amount of nodes to return
export default async function handle(req, res) {
  const session = await getServerSession(req, res, options);
  const  query = req.query.limit;
 
  const url = process.env.NEO4J_URI;
  const username = process.env.NEO4J_USER;
  const password = process.env.NEO4J_PASSWORD;
  const database = process.env.NEO4J_AURA;


  
  try {
    //let graph = driver(url!, auth.basic(username!,password!, database!))
    let graph = driver(url!, auth.basic(username!, password!,database!))
   
      const { records  } = await graph.executeQuery(
        `MATCH (d:Document)
        WHERE d.userEmail = '${'bennettt356@gmail.com'}'
        OPTIONAL MATCH path = (d)-[*0..2]-(n:Person|Organization)
        RETURN DISTINCT n, d, relationships(path) as rels
        LIMIT ${query}`,
          { database: 'neo4j' }
        )
  
   
      await res.json({records });   
  } catch(e) {

    console.log(e)
  }

  
  
}
