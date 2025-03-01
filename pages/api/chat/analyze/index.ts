import prisma from "../../../../lib/prisma";
import { Pinecone } from "@pinecone-database/pinecone";
import {
  chunkTextByMultiParagraphs,
  createVectorRecords,
  embedChunksDense,
  
} from "../../../../utils/parse_text";
import OpenAI from "openai";
 
 

// moving to summarize by first chunk out of laziness
async function getOverallSummary(chunks: string[]) {
  const openai = new OpenAI({
    apiKey: process.env["OPENAI_API_KEY"],
  });

  const chunk = chunks[0]
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a succinct analyzer who reads chunks of information and gives a concise summary that includes broad topic keywords offering context",
      },
      {
        role: "user",
        content: chunk,
      },
    ],
  });
  return completion.choices[0].message.content;
 
}

export default async function handle(req, res) {
 
 
  const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY as string,
  });
  const PINECONE_HOST = process.env.PINECONE_HOST as string
  const { plainText, filename, uri, file } = req.body;
  if (plainText == "") {
    res.json("empty");
    return;
  }

  //const parsed = HTMLtoText(notes_contents); // remove html tags

  const chunks = chunkTextByMultiParagraphs(plainText); // Chunk on max words

  const overallSummary = await getOverallSummary(chunks);
  const denseEmbeddings = await embedChunksDense(chunks); // Chunks -> Dense Vectors
  const vecs = await createVectorRecords(
    denseEmbeddings,
    chunks,
    overallSummary!,
    filename
  );  

  console.log('upload64',vecs)
  let index = pc.index("notespace",PINECONE_HOST);
  let namespace = uri;
 
  // Batch processing
  const BATCH_SIZE = 200;
  let batches = [] as any;
  
  // First, split vectors into batches of 200
  for (let i = 0; i < vecs.length; i += BATCH_SIZE) {
    batches.push(vecs.slice(i, i + BATCH_SIZE));
  }

  console.log(`Split ${vecs.length} vectors into ${batches.length} batches`);
  
  try {
    // Process each batch
    for (let j = 0; j < batches.length; j++) {
      console.log(`Upserting batch ${j + 1}/${batches.length} with ${batches[j].length} vectors`);
      await index.namespace(namespace).upsert(batches[j]);
      console.log(`Successfully upserted batch ${j + 1}`);
    }

    // Save to database
    let result = await prisma.upload.create({
      data: { ...file, summary: overallSummary },
    });

    res.json({ result });
  } catch (e) {
    console.error("Error in batch processing:", e);
    res.status(500).json({ error: "Failed to process vectors" });
  }
}
