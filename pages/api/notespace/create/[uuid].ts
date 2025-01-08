import { getServerSession } from "next-auth/next";
import { options as authOptions } from "../../auth/[...nextauth]";
import prisma from "../../../../lib/prisma";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    const {uuid} = req.query

    const session = await getSession({ req });
 
  
   
    await prisma.notespace.create({ 
      data: { 
        uri: uuid,
        authorId: (session as any).id ,
        created_on: (new Date().toDateString()),
        title: 'New Notespace',
        owner: (session as any).user.email,
        shared:{
          create:[{  level: 3, authorId: (session as any).id}]
        }
      },
     
    });
    
    res.json({ uuid });
  }

 
