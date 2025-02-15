import { useRouter } from "next/router";
import { Separator } from "../../components/ui/separator";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "../../components/ui/card";
import { useReducer } from "react";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import prisma from "../../lib/prisma";
import { Notespace } from "@prisma/client";
import { v4 } from "uuid";
import Header from "../../components/Header";
import Image from "next/image";
import { ShareDialog, UserPopover } from "../../components/heading/Headbar";
import { UserContext } from "../../components/context/context";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
 
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

// retrieve notes and messages with chatbot, don't need to fetch both if only one is needed...
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });

  if (!session) {
    res.statusCode = 403;
    return { props: { notes: [] } };
  }

  const notespaces = await prisma.notespace.findMany({
    where: {
      owner: session.user.email,
    },
    select: {
      title: true,
      sources_count: true,
      owner: true,
      created_on: true,
      uri: true,
    },
  });

  const permissions = await prisma.permissions.findMany({
    where: {
      email: session.user.email,
    },
    include: {
      notespace: {
        select: {
          title: true,
          sources_count: true,
          owner: true,
          created_on: true,
          uri: true,
        },
      }, // This includes all notespace data,
    },
  });

  let sharedNotespaces = {}
  if(permissions) {
    sharedNotespaces = 
    permissions
      .map((item) => item.notespace)
      .filter((notespace) => notespace !== null);
  }


  return {
    props: { notespaces, sharedNotespaces },
  };
};

type Props = {
  notespaces: Notespace[];
  sharedNotespaces: Notespace[];
};

function TableView({ data, Router }) {
  if (!data) return <div></div>;
  return (
    <Table className="w-[80svw] mx-auto ">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px] text-black">Title</TableHead>
          <TableHead className="text-black">Amount of Sources</TableHead>
          <TableHead className="text-black">Created On</TableHead>
          <TableHead className="text-right text-black">Owner</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((datum) => (
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
              {datum.sources ? datum.sources : 0}
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
            <Popover>
      <PopoverTrigger asChild>
      <TableCell className="w-[2svw] h-[5svh] hover:bg-white">
              {" "}
              <BsThreeDotsVertical className="cursor-pointer w-5 h-5" />
            </TableCell>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Dimensions</h4>
            <p className="text-sm text-muted-foreground">
              Set the dimensions for the layer.
            </p>
          </div>
           <div>
            Delete
           </div>

           <div>
            <ShareDialog asText={true}/>
           </div>
        </div>
      </PopoverContent>
    </Popover>
          
          </TableRow>
        ))}

        <TableRow>
          <TableCell className="h-[5svh]">
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <div
                    className="cursor-pointer absolute left-[10svw] flex flex-row bg-white/50 rounded-xl px-5 active:bg-indigo-300 hover:scale-105"
                    onClick={() => createAndNavigate(Router)}
                  >
                    <div className="text-md font-bold ml-2 text-white drop-shadow-[0_1.2px_1.2px_rgba(99,102,241,.5)]">
                      {" "}
                      Make New Notespace{" "}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>New Notespace</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

function CardView({ data, Router }) {
  if (!data) return <div></div>;
  return (
    <div className="w-[80svw] mx-auto">
      {data ? (
        data.map((datum) => (
          <Card
            onClick={() => Router.push("/notespace/" + datum.title)}
            className="cursor-pointer w-[25svw] h-[20svh] bg-gradient-to-r from-cyan-500 to-white opacity-85 hover:opacity-100 "
          >
            <CardTitle className="ml-[2svw] mt-[1svh]">{datum.title}</CardTitle>
            <CardDescription className="ml-[2svw] text-slate-800">
              Amount of Sources: {datum.sources}
            </CardDescription>
            <CardContent></CardContent>
            <CardFooter className="text-sm text-slate-800 ml-[.75svw] ">
              Created on {datum.createdOn}
            </CardFooter>
          </Card>
        ))
      ) : (
        <div></div>
      )}
    </div>
  );
}

function viewReducer(views, action) {
  switch (action.type) {
    case "card":
      return { view: "card" };
    case "list":
      return { view: "list" };
  }
}

const createAndNavigate = async (Router) => {
  let uuid = v4();
  try {
    const res = await fetch("/api/notespace/create/" + uuid, {
      method: "POST",
    });
    if (!res.ok) throw new Error("Notespace creation failed");

    Router.push(`notespace/${uuid}`);
  } catch (e) {
    console.log(e, "Error in creation of Notespace");
  }
};

export default function Notespaces({ notespaces, sharedNotespaces }: Props) {
  const Router = useRouter();
  const initialView = { view: "list" };
  const { data: session } = useSession();
  const [view, dispatch] = useReducer(viewReducer, initialView);
 
  if (!session) {
    return  <div
    // style={{ backgroundImage: `url(${'/pic/complex-bg.png'})`, backgroundSize:'100svw 200svh' }}
    className="h-[100svh] bg-transparent  "
  >
    <Image
      width="0"
      height="0"
      sizes="100vw"
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        zIndex: -100,
      }}
      src="/pic/complex-bg.png"
      alt="Picture of the author"
    />
    <div
      style={{ zIndex: 999 }}
      className=" absolute right-0 mr-[30px] mt-[20px]   "
    >
 
    </div>
    <Header />

    <h1 className="font-roboto text-7xl  drop-shadow-[0_1.2px_1.2px_rgba(99,102,241,1)]  text-white ml-[10svw] mb-[1.85svh]">
      Notespaces
    </h1>
    <Separator className="mx-auto w-[80svw] my-[1svh] py-[.2svh] bg-black" />
    <div className=" place-items-end w-[80svw] mx-auto ">
      <div className="flex flex-row-2 gap-2">
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div
                className="cursor-pointer"
                onClick={(e) => dispatch({ type: "list" })}
              >
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
              <div
                className="cursor-pointer"
                onClick={(e) => dispatch({ type: "card" })}
              >
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

  
  </div>;
  }
  return (
    <UserContext.Provider
      value={{ url: session!.user.image, email: session!.user.email }}
    >
      <div
        // style={{ backgroundImage: `url(${'/pic/complex-bg.png'})`, backgroundSize:'100svw 200svh' }}
        className="h-[100svh] bg-transparent  "
      >
        <Image
          width="0"
          height="0"
          sizes="100vw"
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            zIndex: -100,
          }}
          src="/pic/complex-bg.png"
          alt="Picture of the author"
        />
        <div
          style={{ zIndex: 999 }}
          className=" absolute right-0 mr-[30px] mt-[20px]   "
        >
          <UserPopover />
        </div>
       
        <Header />
      
        <h1 className="font-roboto text-7xl  drop-shadow-[0_1.2px_1.2px_rgba(99,102,241,1)]  text-white ml-[10svw] mb-[1.85svh]">
          Notespaces
        </h1>
        <Separator className="mx-auto w-[80svw] my-[1svh] py-[.2svh] bg-black" />
        <div className=" place-items-end w-[80svw] mx-auto ">
          <div className="flex flex-row-2 gap-2">
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <div
                    className="cursor-pointer"
                    onClick={(e) => dispatch({ type: "list" })}
                  >
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
                  <div
                    className="cursor-pointer"
                    onClick={(e) => dispatch({ type: "card" })}
                  >
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

        {view!.view == "list" ? (
          <TableView
            Router={Router}
            data={[...notespaces, ...sharedNotespaces]}
          />
        ) : (
          <CardView
            Router={Router}
            data={[...notespaces, ...sharedNotespaces]}
          />
        )}
      </div>
    </UserContext.Provider>
  );
}
