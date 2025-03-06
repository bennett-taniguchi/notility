import { headers } from "next/headers";
import {getAiSubTopics} from '../../openai/generate/subtopic'
import {  getAiQuiz, populateQuestionsAndQuiz}  from '../../question/createMany'
import { getAiTitle } from "../../openai/generate/title";
export default async function handle(req,res) {
    const {prompt,uri,amount,notes_selected,title} = req.body;
    let body = {prompt,uri,amount}
 
    //(1) Notes/Guides => Sources {notes_selected are to be uploaded}
        // insert into prisma and pinecone


   //(2) {generate subtopics then questions on each subtopic} {assume valid call}
    const topics = (await getAiSubTopics(prompt,amount, "EN")).subTopics;

   //  {(**Optionally**) use prompt if provided to flavor and narrow down list of topics}
 
   //(3) Generate questions per subTopic
  
   const quiz = await getAiQuiz(prompt, 'EN', topics)
   const transaction = await populateQuestionsAndQuiz(quiz,title,topics,uri)
 
   res.json(transaction)
}