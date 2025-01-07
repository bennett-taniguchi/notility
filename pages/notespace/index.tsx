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

export default function Notespaces() {
  const Router = useRouter();
  const data = [
    {
      title: "Math Equations",
      sources: 3,
      createdOn: "1/6/2025",
      ownedBy: "Me",
    },
  ];
  return (
    <div className="w-[100svw] h-[100svh] bg-white  ">
      <h1 className="text-7xl text-sky-600 ml-[10svw]">Notespaces</h1>
      <Separator className="mx-auto w-[80svw] my-[2svh] py-[.5svh]" />
      <div className=" place-items-end w-[80svw] mx-auto ">
        <div className="flex flex-row-2 gap-2">

          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <div className="cursor-pointer">
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
                <div className="cursor-pointer">
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

      <Button className="ml-[10svw] mt-[1.5svh]" variant={"outline"}>
        Create New
      </Button>
    </div>
  );
}
