import { useRouter } from "next/router";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from "../../components/ui/table";
import { BsThreeDotsVertical } from "react-icons/bs";
import { HiViewList } from "react-icons/hi";
import { PiCardsFill } from "react-icons/pi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "../../components/ui/card";
import { useEffect, useReducer, useState } from "react";
import { FaPlusSquare } from "react-icons/fa"
import { cn } from "../../components/lib/utils";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../lib/prisma";
import { Notespace } from "@prisma/client";
import { v4 } from "uuid";
import { empty } from "@prisma/client/runtime/library";
import Header from "../../components/Header";

// retrieve notes and messages with chatbot, don't need to fetch both if only one is needed...
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });

  if (!session) {
    res.statusCode = 403;
    return { props: { notes: [] } };
  }

  const notespaces = await prisma.notespace.findMany({
    where: {
      authorId:   session?.user.id ,
    },
  });
 

  return {
    props: { notespaces },
  };
};

 type Props = {
  notespaces: Notespace[];
};

function TableView({data,Router}) {

  if(!data) return (<div></div>)
    return (
<Table className="w-[80svw] mx-auto">
       
        <TableHeader    >
          <TableRow>
            <TableHead className="w-[100px] text-black">Title</TableHead>
            <TableHead className="text-black">Amount of Sources</TableHead>
            <TableHead  className="text-black">Created On</TableHead>
            <TableHead className="text-right text-black">Owner</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {  data.map((datum) => (
            <TableRow
              key={datum.title}
              className="w-max h-max hover:bg-slate-200/50  "
            >
              <TableCell
                onClick={() => Router.push("/notespace/" + datum.uri)}
                className="font-medium cursor-pointer "
              >
                {datum.title}
              </TableCell>
              <TableCell
                onClick={() => Router.push("/notespace/" + datum.uri)}
                className={"cursor-pointer"}
              >
                {datum.sources}
              </TableCell>
              <TableCell
                onClick={() => Router.push("/notespace/" + datum.uri)}
                className={"cursor-pointer"}
              >
                {datum.created_on}
              </TableCell>
              <TableCell
                onClick={() => Router.push("/notespace/" + datum.uri)}
                className="text-right cursor-pointer"
              >
                {datum.owner}
              </TableCell>
              <TableCell className="w-[2svw] h-[5svh] hover:bg-white">
                {" "}
                <BsThreeDotsVertical className="cursor-pointer w-5 h-5" />
              </TableCell>
            </TableRow>
          ))
         
        }
        </TableBody>
      </Table>

    )
}

function CardView({data,Router}) {
  if(!data) return (<div></div>)
return(
    <div className="w-[80svw] mx-auto">
        {data ? data.map((datum) => (
            <Card onClick={()=>Router.push('/notespace/'+datum.title)} className="cursor-pointer w-[25svw] h-[20svh] bg-gradient-to-r from-cyan-500 to-white opacity-85 hover:opacity-100 ">
                <CardTitle className="ml-[2svw] mt-[1svh]">
                    {datum.title}
                </CardTitle>
                <CardDescription  className="ml-[2svw] text-slate-800">
                    Amount of Sources: {datum.sources}
                </CardDescription>
                <CardContent>
                    
                </CardContent>
                <CardFooter className="text-sm text-slate-800 ml-[.75svw] ">
                    Created on {datum.createdOn}
                </CardFooter>
            </Card>
        )) :
        <div></div>}
        </div>
)
}

function viewReducer(views,action) {
    switch(action.type) {
        case 'card':
            return {view:'card'}
        case 'list':
            return {view:'list'}
    }
}





export default function Notespaces({notespaces}: Props) {
  const createAndNavigate = async () => {
    let uuid = v4()
    const res = await fetch('/api/notespace/create/'+uuid, { method: 'POST' });
   
    Router.push(`notespace/${uuid}`);
  };

  const Router = useRouter();
  const initialView = {view:'list'};
const [view,dispatch] = useReducer(viewReducer, initialView)

 
 
  return (
    <div style={{ backgroundImage: `url(${'/pic/complex-bg.png'})`, backgroundSize:'100svw 100svh' }} className="w-[100svw] h-[100svh] bg-white pt-[20svh] ">
      <Header/>
      <h1 className="font-roboto text-7xl  drop-shadow-[0_1.2px_1.2px_rgba(99,102,241,1)]  text-white ml-[10svw] mb-[1.85svh]">Notespaces</h1>
      <Separator className="mx-auto w-[80svw] my-[1svh] py-[.2svh] bg-black" />
      <div className=" place-items-end w-[80svw] mx-auto ">
        <div className="flex flex-row-2 gap-2">

        <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <div className="cursor-pointer absolute left-[10svw] flex flex-row bg-white/50 rounded-xl px-5" onClick={()=>createAndNavigate()}>
               
                <div className="text-md font-bold ml-2 text-white drop-shadow-[0_1.2px_1.2px_rgba(99,102,241,.5)]">  Make New Notespace </div>
                </div>
              </TooltipTrigger>
              <TooltipContent >
                <p>New Notespace</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

      

          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <div className="cursor-pointer" onClick={(e)=>dispatch({type:'list'})}>
                  <HiViewList className="basis-1/3 h-[3svh] w-[2svw] hover:bg-zinc-100 rounded-lg" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>List View</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <div className="cursor-pointer"  onClick={(e)=>dispatch({type:'card'})}>
                  <PiCardsFill className="basis-1/3 h-[3svh] w-[2svw] hover:bg-zinc-100 rounded-lg  " />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Card View</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      {view!.view =='list' ?
      <TableView Router={Router} data={notespaces} />
      :
      <CardView Router={Router} data={notespaces}/>
    }
    {/* <div className="mt-2">
    <h1 className="font-roboto text-7xl  drop-shadow-[0_1.2px_1.2px_rgba(99,102,241,1)]  text-white ml-[10svw] mb-[1.85svh]">Tracks</h1>
    <Separator className="mx-auto w-[80svw] my-[1svh] py-[.2svh] bg-black" />
     <TableView  Router={Router} data={data} />
     </div> */}
    </div>
  );
}
