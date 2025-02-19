import { getServerSession } from "next-auth/next"
import {  options } from "../../auth/[...nextauth]";
import prisma from "../../../../lib/prisma"

export default async function handler(req,res) {

    const session = await getServerSession(req,res,options)
    const {uri} = req.body;
    console.log(uri,session!.user.email)
    const result = await prisma.notespace.delete({
        where: {uri:uri,owner:session.user.email}
    })



    res.json(result)
}