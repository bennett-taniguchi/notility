import {cache} from "react";
import { getSession } from "next-auth/react"
import prisma from "../../../../../lib/prisma"


 
 
export default async function handler(req,res) {
    const {uri, newTitle} = req.body;
    const session = await getSession({req})

    const result = await prisma.notespace.update({
        data: {
            title: newTitle
        },
        where:{
            uri:uri
        }
    })


    res.json({result})
}