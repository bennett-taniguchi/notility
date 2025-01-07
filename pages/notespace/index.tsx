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
import { cn } from "../../components/lib/utils";

function TableView({data,Router}) {
    return (
<Table className="w-[80svw] mx-auto">
        <TableCaption>Your recent Notespaces</TableCaption>
        <TableHeader  >
          <TableRow>
            <TableHead className="w-[100px]">Title</TableHead>
            <TableHead>Amount of Sources</TableHead>
            <TableHead>Created On</TableHead>
            <TableHead className="text-right">Owner</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((datum) => (
            <TableRow
              key={datum.title}
              className="w-max h-max hover:bg-zinc-200  "
            >
              <TableCell
                onClick={() => Router.push("/notespace/" + datum.title)}
                className="font-medium cursor-pointer "
              >
                {datum.title}
              </TableCell>
              <TableCell
                onClick={() => Router.push("/notespace/" + datum.title)}
                className={"cursor-pointer"}
              >
                {datum.sources}
              </TableCell>
              <TableCell
                onClick={() => Router.push("/notespace/" + datum.title)}
                className={"cursor-pointer"}
              >
                {datum.createdOn}
              </TableCell>
              <TableCell
                onClick={() => Router.push("/notespace/" + datum.title)}
                className="text-right cursor-pointer"
              >
                {datum.ownedBy}
              </TableCell>
              <TableCell className="w-[2svw] h-[5svh] hover:bg-white">
                {" "}
                <BsThreeDotsVertical className="cursor-pointer w-5 h-5" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

    )
}

function CardView({data,Router}) {
return(
    <div className="w-[80svw] mx-auto">
        {data.map((datum) => (
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
        ))}
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
export default function Notespaces() {
  const Router = useRouter();
  const initialView = {view:'list'};
const [view,dispatch] = useReducer(viewReducer, initialView)
  const data = [
    {
      title: "Math Equations",
      sources: 3,
      createdOn: "1/6/2025",
      ownedBy: "Me",
    },
  ];
 
  return (
    <div className="w-[100svw] h-[100svh] bg-white mt-[20svh] ">
      <h1 className="text-7xl text-sky-600 ml-[10svw]">Notespaces</h1>
      <Separator className="mx-auto w-[80svw] my-[2svh] py-[.5svh]" />
      <div className=" place-items-end w-[80svw] mx-auto ">
        <div className="flex flex-row-2 gap-2">

          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <div className="cursor-pointer" onClick={(e)=>dispatch({type:'list'})}>
                  <HiViewList className="basis-1/3 h-[3svh] w-[2svw] hover:bg-zinc-200 rounded-lg" />
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
                  <PiCardsFill className="basis-1/3 h-[3svh] w-[2svw] hover:bg-zinc-200 rounded-lg  " />
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
      <TableView Router={Router} data={data} />
      :
      <CardView Router={Router} data={data}/>
    }
      
      <Button className="ml-[10svw] mt-[1.5svh]" variant={"outline"}>
        Create New
      </Button>
    </div>
  );
}
