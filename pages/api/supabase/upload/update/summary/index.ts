import prisma from "../../../../../../lib/prisma"

export default async function handle(req,res) {
    const {name,uri,overallSummary} = req.body
    console.log('summary',overallSummary)
    const result = await prisma.upload.update ({

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


    res.json(result)
}