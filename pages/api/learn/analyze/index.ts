import { getServerSession } from "next-auth";
import { options as authOptions } from "../../auth/[...nextauth]";
import prisma from "../../../../lib/prisma";
import { Pinecone } from "@pinecone-database/pinecone";
import {
  HTMLtoText,
  chunkTextByMultiParagraphs,
  embedChunks,
  upsertVectors,
} from "../../../../utils/parse_text";
export default async function handle(req, res) {
  const session = await getServerSession(req, res, authOptions);

  const { notes_contents, notes_titles } = req.body;

  const result = await prisma.upload.upsert({
    where: {
      title_authorId: { authorId: session.id, title: notes_titles },
    },
    update: {
      content: notes_contents,
      title: notes_titles,
    },
    create: {
      authorId: session.id,
      title: notes_titles,
      content: notes_contents,
    },
  }); // works

  //   res.json(result);

  const parsed = HTMLtoText(notes_contents); // remove html tags

  const chunks = chunkTextByMultiParagraphs(parsed); // split on max words

  const embeddedResult = await embedChunks(chunks); // to vecs

  const upserted = await upsertVectors(embeddedResult, chunks, true); // our own upsertion to pinecone db, need to split on diff users namespace

  /// eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee

  if (upserted)
    for (let i = 0; i < upserted[0]?.length; i++) {
      const batch = upserted[0][i];
      console.log(batch);
      const pc = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY as string,
      });

      let index = pc.index("notility");
      let namespace = session.user.email;

      const result = await index.namespace(namespace).upsert([batch] as any);

      res.json(result);
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
