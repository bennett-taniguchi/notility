// get by uri, title,

import prisma from "../../../../lib/prisma";

export default async function handle(req,res) {

    const {uri,title} = req.body;

    const result = await prisma.question.findMany({
        where: {
            uri:uri,
            title:title
        },
    })

    res.json(result)

}