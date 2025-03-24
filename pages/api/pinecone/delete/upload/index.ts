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
    
    let pageList = await index.namespace(uri).listPaginated({ prefix: name });
    if(!pageList || !pageList.vectors) {res.json(pageList); return;}
   
    // page one exists
    let vecIds = pageList!.vectors.map((vector) => vector.id);
    console.log(vecIds)
    await index.namespace(uri).deleteMany(vecIds);

    while (pageList.pagination != undefined) {
      let page_next = pageList.pagination.next
      pageList = await index.namespace(uri).listPaginated({ prefix: name, paginationToken: page_next });
      if(!pageList || !pageList.vectors) {res.json(pageList); return;}
      vecIds = pageList.vectors.map((vector) => vector.id);

      await index.deleteMany(vecIds);
    }

    res.json(pageList)
}