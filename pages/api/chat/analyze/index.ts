import { getServerSession } from "next-auth";
import { options as authOptions } from "../../auth/[...nextauth]";
import prisma from "../../../../lib/prisma";
import { Pinecone } from "@pinecone-database/pinecone";
import {
  HTMLtoText,
  SummaryRecord,
  chunkTextByMultiParagraphs,

  embedChunksDense,
 
  upsertVectors,
} from "../../../../utils/parse_text";
import OpenAI from "openai";
import { Upload } from "@prisma/client";
import { options } from "../../auth/[...nextauth]";
async function updateUploadSummary(name,uri,overallSummary) {
  await prisma.upload.update ({

    where: {
        uri_title_originalFileName: {
            uri:uri,
            title:name,
            originalFileName:name
        }
        
    },
    data: {
        summary:overallSummary
    }
} )
}
async function getOverallSummary(chunks: string[]) {
  const openai = new OpenAI({
    apiKey: process.env["OPENAI_API_KEY"],
  });

  // Process all chunks in parallel
  const summaries = await Promise.all(
    chunks.map(async (chunk) => {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a succinct analyzer who reads chunks of information and gives a concise summary that includes broad topic keywords offering context",
          },
          {
            role: "user",
            content: chunk,
          },
        ],
      });
      
      return completion.choices[0].message.content;
    })
  );

  // If there's only one chunk, return its summary
  if (summaries.length === 1) {
    return summaries[0];
  }

  // If there are multiple chunks, create a final summary of summaries
  const combinedSummary = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are a succinct analyzer who combines multiple summaries into one coherent overview",
      },
      {
        role: "user",
        content: `Please combine these summaries into one coherent overview, ensure the first sentence is comprised entirely of most relevant keywords in a comma-separated format and begin it as 'Topics Covered:': ${summaries.join(" | ")}`,
      },
    ],
  });

  return combinedSummary.choices[0].message.content;
}
 

export default async function handle(req, res) {
  
  const session = await getServerSession(req, res,options);
   
  const { plainText, name, uri,file} = req.body;   
  if(plainText=='') {res.json('empty'); return;}
  //const parsed = HTMLtoText(notes_contents); // remove html tags

  const chunks = chunkTextByMultiParagraphs(plainText); // Chunk on max words
 

  const overallSummary = await getOverallSummary(chunks)
 
  const denseEmbeddings = await embedChunksDense(chunks); // Chunks -> Dense Vectors
 
  
  const upserted = await upsertVectors(denseEmbeddings, chunks, overallSummary!, name); // our own upsertion to pinecone db, need to split on diff users namespace


 
  /// eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee

  if (upserted)
    for (let i = 0; i < upserted[0]?.length; i++) {
      const batch = upserted[0][i];
      
      //console.log('analyze 34',batch);
      const pc = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY as string,
      });

      let index = pc.index("notespace");
      let namespace = uri;

      await index.namespace(namespace).upsert([batch] as any);
     
    
    }

 
   let convertedUpload={ ...file as  Upload, owner: session?.user.email };
 
  try {
    let result = await prisma.upload.create({
      data: {...convertedUpload, summary:overallSummary },
    });

    res.json({ result });
  } catch (e) {
    console.log(e);
  }
  
  ///eeeeeeeeeeeeeeee
  // format:
  // 0: {embedding (1536) [.1232,...], index:0, object:"embedding"},

  // uploaded to our db (for what purpose?) (* once i do more, could probably only store title?)
  //// intended feature could be taht you can scroll thru paginated combined notes and eventually
  ////// ai will give you location and annotations upon where you query and what you looked for (...)
  ////// This would be pretty cool in the case that you want to study quickly and ai is given a
  ////// list of terms you need to study and it just marks on all your notes for you and can splice
  ////// into a study page or focus upon structure and creation of related content

  // do whole embeddings process thingy for pinecone
  //
}
