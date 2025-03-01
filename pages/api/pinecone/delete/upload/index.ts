import { Pinecone } from "@pinecone-database/pinecone";
import prisma from "../../../../../lib/prisma";

// ensure within a given namespace target an upload
export default async function handle(req,res) {

    const {uri,name} = req.body
    const pc = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY as string,
      });
    const PINECONE_HOST = process.env.PINECONE_HOST as string
    const index = pc.index("notespace", PINECONE_HOST)
    
    const result = await index.namespace(uri).deleteMany(
      { filter:{'name': {$eq: name}} }
    );

    res.json(result)
}