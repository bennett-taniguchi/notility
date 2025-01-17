import OpenAI from "openai";
import {
  Pinecone,
  PineconeRecord,
  RecordMetadata,
  RecordId,
} from "@pinecone-database/pinecone";
import { Record } from "@prisma/client/runtime/library";
import * as pdfjsLib from "pdfjs-dist";
 
import { jsx } from "react/jsx-runtime";


export async function getPdfText(file: any) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = (window as any).location.origin + "/pdf.worker.min.mjs";
  console.log(window.location.origin, window.location.origin + "/pdf.worker.min.mjs")
  //const pdf1 = await fs.readFile((file.originalFile.file as File).arrayBuffer());
  let actualFile: File = file.originalFile.file;
  const pdf = await pdfjsLib.getDocument(await actualFile.arrayBuffer())
    .promise;
  let fullText = "";
  console.log("14", pdf);
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();

    fullText += textContent.items.map((item: any) => item.str).join(" ");
  }
  console.log("21", fullText);
  return fullText;
}

export function HTMLtoText(text: string): string {
  text = text.replace(/<[^>]+>/g, "");
  return text;
}


// we already have a bunch of split chunks and we need to summarize them
// then we summarize those summaries
export async function getSummary(chunks:string[]) {
  let token = 75 // 75 words ~ token
  let maxLength = token*4000;

  let summaries  = ""
  chunks.forEach(async (prompt) => {
   const body = { prompt };
    const res = await fetch("/api/openai/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
   
    });
    const data = await res.json()  
    summaries+=(data)
  })

  if(summaries.length <= maxLength) {
    let prompt = summaries
    const body = { prompt };
    const res = await fetch("/api/openai/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
   
    });
    const data = await res.json()  
    return {summaries:summaries,overallSummary:data}
  } else {
    //
    console.log('summaries is too long...')
    let prompt = summaries.substring(0,maxLength)
    const body = { prompt };
    const res = await fetch("/api/openai/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
   
    });
    const data = await res.json()  
    return {summaries:summaries,overallSummary:data}
  }
  
}
/**
 * Splits a given text into chunks of 1 to many paragraphs.
 *
 * @param text - The input text to be chunked.
 * @param maxChunkSize - The maximum size (in characters) allowed for each chunk. Default is 1000.
 * @param minChunkSize - The minimum size (in characters) required for each chunk. Default is 100.
 * @returns An array of chunked text, where each chunk contains 1 or multiple "paragraphs"
 */
// Expect our non html text
// Return array of strings aka chunks
export function chunkTextByMultiParagraphs(
  text: string,
  maxChunkSize = 1500,
  minChunkSize = 500
): string[] {
  const chunks: string[] = [];
  let currentChunk = "";

  let startIndex = 0;
  while (startIndex < text.length) {
    let endIndex = startIndex + maxChunkSize;
    if (endIndex >= text.length) {
      endIndex = text.length;
    } else {
      // Just using this to find the nearest paragraph boundary
      const paragraphBoundary = text.indexOf("\n\n", endIndex);
      if (paragraphBoundary !== -1) {
        endIndex = paragraphBoundary;
      }
    }

    const chunk = text.slice(startIndex, endIndex).trim();
    if (chunk.length >= minChunkSize) {
      chunks.push(chunk);
      currentChunk = "";
    } else {
      currentChunk += chunk + "\n\n";
    }

    startIndex = endIndex + 1;
  }

  if (currentChunk.length >= minChunkSize) {
    chunks.push(currentChunk.trim());
  } else if (chunks.length > 0) {
    chunks[chunks.length - 1] += "\n\n" + currentChunk.trim();
  } else {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

/**
 * Embed a piece of text using an embedding model or service.
 * This is a placeholder and needs to be implemented based on your embedding solution.
 *
 * @param text The text to embed.
 * @returns The embedded representation of the text.
 */

// expects chunks, on all chunks
// return res from open ai call
export async function embedChunks(chunks: string[]): Promise<any> {
  // You can use any embedding model or service here.
  // In this example, we use OpenAI's text-embedding-3-small model.
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: chunks,
      encoding_format: "float",
      dimensions: 1536,
    });
    return response.data;
  } catch (error) {
    console.error("Error embedding text with OpenAI:", error);
    throw error;
  }
}

// for multiple documents in a namespace, need to target certain chunks
// iterates and adds appropriate ids to make editing and deleting easier
export async function processEmbeddings(embeddings: number[]) {
  // // Combine the chunks and their corresponding embeddings
  // // Construct the id prefix using the documentId and the chunk index
  // for (let i = 0; i < chunks.length; i++) {
  //     document.chunks.push({
  //     id: `${document.documentId}:${i}`,
  //     values: embeddings[i].embedding,
  //     text: chunks[i],
  // });
}

// export async function upsertData(document: string, namespaceId: string) {
//   const pc = new Pinecone();

//   const vectors: PineconeRecord<RecordMetadata>[] = document.chunks.map(
//     (chunk) => ({
//       id: chunk.id,
//       values: chunk.values,
//       metadata: {
//         text: chunk.text,
//         referenceURL: document.documentUrl,
//       },
//     })
//   );

//   // Batch the upsert operation
//   const batchSize = 200;
//   for (let i = 0; i < vectors.length; i += batchSize) {
//     const batch = vectors.slice(i, i + batchSize);
//     await namespace.upsert(batch);
//   }
// }

type embedding = {
  embedding: number[];
  index: number;
  object: string;
};

type VectorRecord = {
  id: number;
  values: number[];
  metadata?: string;
};

type SummaryRecord = {
  summaries: string[];
  overallSummary: string
}
// batches appropriate vectors and upserts using api path into the namespace matching users email
export async function upsertVectors(
  embeddings: embedding[],
  chunks: string[],
  summaries: SummaryRecord,
  name: string,
) {
  // Get the Pinecone index
  //   let index = pc.index("notility");
  const vectors: any[] = chunks.map((chunk, idx) => ({
    id: "vec" + idx,
    values: embeddings[idx].embedding,
    metadata: {
      text: chunk,
      name: name,
      summary: summaries.summaries[idx]
    },
  }));

  //Batch the upsert operation
  let batches = [] as VectorRecord[][];
  const batchSize = 200;
  for (let i = 0; i < vectors.length; i += batchSize) {
    const batch = vectors.slice(i, i + batchSize) as VectorRecord[]; // {id: "vec1", values: [1536]}
    const body = { batch };
  
    batches = [...batches, batch];
    // } else {
    //   await fetch("/api/pinecone/upsert/", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(body),
    //   });
     }
  

  
    return batches;
  
}
