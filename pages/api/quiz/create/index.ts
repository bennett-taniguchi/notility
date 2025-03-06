import { headers } from "next/headers";

export default async function handle(req,res) {
    const {prompt,uri,amount} = req.body;
    let body = {prompt,uri,amount}
//  const {amount,topics,prompt,uri} = req.body

    //(1)
   // if (note/guide) => upload to pinecone and prisma as source
   
   //(2) {generate subtopics then questions on each subtopic} {assume valid call}
   const subTopics = await fetch('/api/openai/generate/subtopic',
    {method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify(body)
    }
   )
   const subTitle = subTopics[0].title
   //  (**Optionally**) use prompt if provided to flavor and narrow down list of topics
   // { }

   //(3) Generate questions per subTopic
   //const questions = fetch /api/question/createMany
        
 
}