// easier to chain api calls here then in the client side, and it makes sense in fact, so i could rename this

import OpenAI from "openai";
import { getServerSession } from "next-auth/next";
import { options as authOptions } from "../../../auth/[...nextauth]";
import prisma from "../../../../../lib/prisma";
import { Pinecone, RecordMetadata } from "@pinecone-database/pinecone";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});
const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY as string,
});
// {"role": "system", "content": "You are a helpful assistant."},
// {"role": "user", "content": "message 1 content."},
export default async function handle(req, res) {

  ///
  //TITLE PROBLEM NEED TO OPT TO DEFAULT QUERY BRANCH IF SELECTEDARR BLANK AS TITLE IS FOR THE NOTESPACE NOT RELATED TO THE SOURCES UPLOADED
  ///
  const { prompt, messages, uri, selectedArr, title } = req.body;
console.log('rag 18', req.body)
  const session = await getServerSession(req, res, authOptions);
  /// for context query:
  // 1) embed query
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: prompt,
    encoding_format: "float",
    dimensions: 1536,
  });
  const embedded = await response.data;
 
  // 2) use embedded to query pinecone
  let index = pc.index("notespace");
  let namespace = uri

//   hybrid_params = {
//     "vector": query_vector,
//     "alpha": alpha,
//     "top_k": top_k,
//     "include_metadata": True,
//     "sparse_vector": self._generate_sparse_vector(query),
// }

// # Add text match conditions for both full text and summary
// hybrid_params["filter"] = {
//     "$or": [
//         # Search in full text with higher weight
//         {"text_content": {"$contains": {"text": query, "weight": 1 - summary_weight}}},
//         # Search in summary with lower weight
//         {"summary": {"$contains": {"text": query, "weight": summary_weight}}}
//     ]
// }
  let titleArr = selectedArr.length != 0 ?  selectedArr : [title]
  const queryResponse = await index.namespace(namespace).query({
    vector: embedded[0].embedding,
    topK: 3,
    includeMetadata: true,
    filter: {
      "name": {"$in": titleArr}
    }
  });
 
  const preFiltered = queryResponse.matches;

  const matches = preFiltered.length >= 5 ? preFiltered.filter(
    match => match.score! >= 0.25  
  ) : preFiltered
  ;


  console.log('matches from pinecone:',matches);
  let metadata = '';
  for (let i = 0; i < matches.length; i++) {
    metadata +=
      "From " + matches[0].id + (matches[0].metadata as RecordMetadata).text;
  }
  // Returns:
  // {
  //   matches: [
  //             {
  //               id: 'C',
  //               score: 0.000072891,
  //               values: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3]
  //             },
  //             {
  //               id: 'B',
  //               score: 0.080000028,
  //               values: [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2]
  //             },
  //             {
  //               id: 'D',
  //               score: 0.0800001323,
  //               values: [0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4]
  //             }
  //           ],
  //   namespace: 'example-namespace',
  //   usage: {readUnits: 5}}
  // }

  let context = metadata + " Users Question: " + prompt;
  console.log(context);
  // 3) use result in content :
  // 	content: {
  // 		rules {

  // 		context(from db + question at end)
  // 		}
  // 	}

  // 4) messages just dont accidentally use context and rules block in first recorded message
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

  // content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
  //         DO NOT SHARE REFERENCE URLS THAT ARE NOT INCLUDED IN THE CONTEXT BLOCK.
  //         AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
  //         If user asks about or refers to the current "workspace" AI will refer to the the content after START CONTEXT BLOCK and before END OF CONTEXT BLOCK as the CONTEXT BLOCK.
  //         If AI sees a REFERENCE URL in the provided CONTEXT BLOCK, please use reference that URL in your response as a link reference right next to the relevant information in a numbered link format e.g. ([reference number](link))
  //         If link is a pdf and you are CERTAIN of the page number, please include the page number in the pdf href (e.g. .pdf#page=x ).
  //         If AI is asked to give quotes, please bias towards providing reference links to the original source of the quote.
  //         AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation. It will say it does not know if the CONTEXT BLOCK is empty.
  //         AI assistant will not invent anything that is not drawn directly from the context.
  //         AI assistant will not answer questions that are not related to the context.
  //         START CONTEXT BLOCK
  //         ${context}
  //         END OF CONTEXT BLOCK`,

  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "Given a user query, expand it to be more specific and detailed while maintaining the original intent. Include relevant synonyms and related concepts." },
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
          When answering:
          - If the user's question is unclear, ask for clarification instead of saying the prompt is too short
          - If you find partially relevant information, acknowledge it and explain how it relates to their question
          - If you need to make reasonable inferences based on the context, explicitly state your assumptions
          - If the context doesn't contain exact information, suggest related information that might be helpful
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

  //console.log(completion.choices[0]); // do use this

  // response (role = 'user') items
  let content_user = prompt;

  // response (role = 'system') items
  let content_system = completion.choices[0].message.content as string;

  let queriedTitles = selectedArr.length != 0 ? selectedArr.toString() : title

  const result = await prisma.message.createMany({
    data: [
      {
        uri:uri,
        index: messages.length + 1,
        content: content_user,
        authorId: session.id,
        role: "user",
        title: queriedTitles,
      },
      {
        uri:uri,
        index: messages.length + 2,
        content: content_system,
        authorId: session.id,
        role: "system",
        title: queriedTitles,
      },
    ],
  });

  res.json(result);
}
