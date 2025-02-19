import prisma from "../../../../../lib/prisma"

export default async function handle(req,res) {

const {count,uri} = req.body

    const result = await prisma.notespace.update({
        where: {
            uri : uri
        },
        data : {
            sources_count : count
        }
    })


    res.json(result)
}