import OpenAI from "openai";
import { getServerSession } from "next-auth/next";
import { options } from "../../auth/[...nextauth]";
import { auth, driver } from "neo4j-driver";
import "neo4j-driver";
import prisma from "../../../../lib/prisma";
// import { options  } from "../../../auth/[...nextauth]";
// import prisma from "../../../../../lib/prisma";
const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

function extractRelationships(mappings:Object) {
let totalStr = ""
let previousEntries = new Map()
 for (const i in mappings) {
  const mapping = mappings[i]
  const relationships = mapping.relationships;
  let mappingStr = ""
  for (const i in relationships) {
    if(!previousEntries.has(relationships[i])) {
      mappingStr += (" *" + relationships[i])
      previousEntries.set(relationships[i],1)
    }
  }
  totalStr+=mappingStr
 }

 return totalStr;
}
// convert nodes to flattened format representing each n-(r)->n
function nodesToDict(nodePairs:Object) {
  // nodePairs [0] : usually not Document, has .elementId field  
  // nodePairs [1] : usually  Document, has .elementId field  
  // nodePairs [2] : relationship is array with each element has .startNodeElementId and .endNodeElementId
  
  let dict = new Map()
  let chunks = new Map()
  // entity object: name, relationships: []
  let edges = [] as any
 
  for (const i in (nodePairs as any).records) { // process all entities first then loop thru edges later
    
      let a = (nodePairs as any).records[i]._fields[0];
      let b = (nodePairs as any).records[i]._fields[1];

    if(!a || !b) continue
 
      let a_name = a.elementId
      let b_name = b.elementId
    if(!a_name || !b_name) continue
      let rels = (nodePairs as any).records[i]._fields[2];
      edges.push(...rels)
  
      if(!dict.has(a_name)) {
          if(a.labels.includes('Document')) {
              dict.set(a_name,{name:a.properties.title ,relationships:[]})
              
              if(a_name && !chunks.has( a_name)) {
                chunks.set( a_name,a.properties.text)
              }
          } else {
              dict.set(a_name,{name:a.properties.id ,relationships:[]})
          }
         
      }
  
      if(!dict.has(b_name)) {
          if(b.labels.includes('Document')) {
              dict.set(b_name,{name:b.properties.title ,relationships:[]})

              if(b_name && !chunks.has(b_name)) {
                chunks.set(b_name,b.properties.text)
              }
          } else {
              dict.set(b_name,{name:b.properties.id ,relationships:[]})
          }
      }
  }
   
  edges.forEach((edge)=> {
      let a_elementId = edge.startNodeElementId
      let b_elementId = edge.endNodeElementId
  
      let a = dict.get(a_elementId)
      let b = dict.get(b_elementId)
 
      let relationship = a.name + ' ' + edge.type + " " + b.name
  
      a.relationships.push(relationship)
      b.relationships.push(relationship)
  
      dict.set(a_elementId,  a)
      dict.set(b_elementId , b)
  })
  
  return {'Array':Array.from(dict.values()), 'Text': Array.from(chunks.values())}
  
  }

export default async function handle(req, res) {
  const { prompt, messages, title, uri, selectedArr } = req.body;
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
  const embedded = response.data as any;
  const embedding = await embedded[0].embedding;
 

  // 2) Query DB with embedded
  // GIVEN HARDCODED LIMIT
  let limit = 25
  const { records } = await graph.executeQuery(
    `CALL db.index.vector.queryNodes('vecs', 10, ${JSON.stringify(embedding)})
YIELD node as d, score
WHERE d.userEmail = 'bennettt356@gmail.com'
OPTIONAL MATCH path = (d)-[*0..2]-(n:Person|Organization)
RETURN DISTINCT n, d, relationships(path) as rels, score
LIMIT ${limit}`,

    { database: "neo4j" }
  );

  // 3) Format Neo4j Queru
  const parsed = nodesToDict({'records':records})
  const mappings =  parsed.Array 
  const relationshipsString = extractRelationships(mappings) // context for llm
  const chunks = parsed.Text.join() // try without formatting to see if works

 
  // 4) Create Context
  let context = 'RelationshipsString: ' + relationshipsString + "EndRelationshipsString TextExcerpts: " + chunks
  context += "EndTextExcerpts  User's Question: " + prompt;


  // 5) messages just dont accidentally use context and rules block in first recorded message
  // update chat based on uri, given chat messages
  let truncated = messages;
  if (messages.length >= 20) {
    //// truncate
    let new_messages = <number[]>[];
    //say 50 -> 30-50
    let index = messages.length - 20;

    for (index; index < messages.length; index++) {
      new_messages.push(messages[index]);
    }
    truncated = new_messages;
  }

 // 6) Create Message using openai api call
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "Given a user prompt refer to the information within RelationshipsString and TextExcerpts directly and formulate a referential answer" },
      ...truncated.map((m) => ({
        role: m.role,
        // content: m.content,
        content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
          DO NOT SHARE REFERENCE URLS THAT ARE NOT INCLUDED IN THE CONTEXT BLOCK.
          AI assistant will not apologize for previous responses, but instead will indicate new information was gained.
          If user asks about or refers to the current "workspace" AI will refer to the the content after START CONTEXT BLOCK and before END OF CONTEXT BLOCK as the CONTEXT BLOCK. 
          AI will not provide any reference to a page number or url related to where the relevant information was obtained.
          If AI is asked to give quotes, please bias towards providing reference links to the original source of the quote.
          AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation. It will say that the prompt is not long enough if CONTEXT BLOCK is empty.
          AI assistant will not invent anything that is not drawn directly from the context.
          AI assistant will not answer questions that are not related to the context.
          AI assistant is very precise with outtputed text and ensure their format is LaTeX , NEVER markdown formatting
          When answering:
          - If the user's question is unclear, ask for clarification instead of saying the prompt is too short
          - If you find partially relevant information, acknowledge it and explain how it relates to their question
          - If you need to make reasonable inferences based on the context, explicitly state your assumptions
          - If the context doesn't contain exact information, suggest related information that might be helpful
          - Only consider formatting answer LaTeX delimeters only
          START CONTEXT BLOCK
          Topics: The query is related to topics regarding: ${selectedArr.toString()}

          User Query:
          ${context}
          END OF CONTEXT BLOCK`,
      })),
      { role: "user", content: prompt },
    ],
    model: "gpt-4o-mini",
  });

  // response (role = 'user') items
  let content_user = prompt;

  // response (role = 'system') items
  let content_system = completion.choices[0].message.content as string;

  let queriedTitles = selectedArr.length != 0 ? selectedArr.toString() : title


  // try {
  //   const result = await prisma.$transaction(async (tx) => {
  //     // Create first message
  //     const message1 = await tx.message.create({
  //       data: {
  //         uri: uri,
  //         content: content_user,
  //         authorId: session.id,
  //         role: "user",
  //         title: queriedTitles,
  //       },
  //     });
  
  //     // Create second message, using the first message's index + 1
  //     const message2 = await tx.message.create({
  //       data: {
  //         uri: uri,
  //         index: message1.index + 1,  // Explicitly use message1's index + 1
  //         content: content_system,
  //         authorId: session.id,
  //         role: "system",
  //         title: queriedTitles,
  //       },
  //     });
  
  //     return [message1, message2];
  //   });
    
  //   res.json({ result });
  // } catch (e) {
  //   console.log(e);
  //   res.status(500).json({ error: e.message });
  // }
  // 7) update supabase entries:

//   const res1=await prisma.message.create({
//     data:  
//       {
//         uri:uri,
//         content: content_user,
//         authorId: session.id,
//         role: "user",
//         title: queriedTitles,
      
//     } 
// })

// const res2= await prisma.message.create({
//   data: 
//     {
//       uri:uri,
//       content: content_system,
//       authorId: session.id,
//       role: "system",
//       title: queriedTitles,
    
//   } 
// })
 
try {
 
  const result = await prisma.message.createMany({
    data: [
      {
        uri:uri,
       
        content: content_user,
        authorId: session.id,
        role: "user",
        title: queriedTitles,
      },
      {
        uri:uri,
       
        content: content_system,
        authorId: session.id,
        role: "system",
        title: queriedTitles,
 
      },
    ],
  });
  res.json({result})
} catch(e) {
  console.log(e)
}
 
  // console.log('chunks',chunks)
  // console.log('relationshipsSTRING: ',relationshipsString)
  // res.json(({res1,res2}));
 
}
