import { getServerSession } from "next-auth/next"
import { options } from "../../../auth/[...nextauth]"
import prisma from "../../../../../lib/prisma"

export default async function handle(req,res) {

    const {emails, level,uri} = req.body

    const session = await getServerSession(req,res,options)
    let results = []
    const emailArray = Array.isArray(emails) ? emails : [emails]
    console.log('emailARRRR',emailArray)
    for(const email of emailArray) {
  const result =await prisma.permissions.upsert({
        where: {
           uri_email:{
            uri:uri,
            email:email
           }
        },
        update: {
            level:level
        },
        create: {
            notespace: {connect: {uri:uri}},
            authorId: session.id,
            email:email,
            level:level,
            

        }
    })
    results+= result as any
    }
    // const result = await prisma.permissions.upsert({
    //     where: {
    //        uri_email:{
    //         uri:uri,
    //         email:emails
    //        }
    //     },
    //     update: {
    //         level:level
    //     },
    //     create: {
    //         notespace: {connect: {uri:uri}},
    //         authorId: session.id,
    //         email:emails,
    //         level:level,
    //         uri:uri

    //     }
    // })
return res.json({results})
   
}