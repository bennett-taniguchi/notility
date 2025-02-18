import { Upload } from "@prisma/client";
import { Checkbox } from "@radix-ui/react-checkbox";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";

import { Drawer } from "../../ui/drawer";
import { Button } from "../../ui/button";
import {
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "../../ui/drawer";
import UploadButton from "../../upload/UploadButton";
import dynamic from "next/dynamic";
import { getPdfText } from "../../../utils/parse_text";

const BsFiletypeCsv = dynamic(() =>
  import("react-icons/bs").then((module) => module.BsFiletypeCsv)
);
const BsThreeDotsVertical = dynamic(() =>
  import("react-icons/bs").then((module) => module.BsThreeDotsVertical)
);
const FaFilePdf = dynamic(() =>
  import("react-icons/fa6").then((module) => module.FaFilePdf)
);
const FaMarkdown = dynamic(() =>
  import("react-icons/fa6").then((module) => module.FaMarkdown)
);
const SiLatex = dynamic(() =>
  import("react-icons/si").then((module) => module.SiLatex)
);
const TbJson = dynamic(() =>
  import("react-icons/tb").then((module) => module.TbJson)
);
const TbTxt = dynamic(() =>
  import("react-icons/tb").then((module) => module.TbTxt)
);

// Need to add:
// add files to pinecone
// variable chunk based on file
async function addFileNamesToDB(files: any, uri: string, Router: any) {
  if (!files || files.length == 0) return [];
  let uploads: any[] = [];
  let res_arr: any[] = [];
  function splitOnFileType(filename: string) {
    let lastDotI = filename.lastIndexOf(".");
    let fileExtension = filename.substring(lastDotI, filename.length);
    let name = filename.substring(0, lastDotI);

    return { extension: fileExtension, name: name };
  }
  const reader = new FileReader();
  files.map(
    async (
      file: { originalFile: { originalFileName: string }; fileUrl: any },
      idx: number
    ) => {
      let { name, extension } = splitOnFileType(
        file.originalFile.originalFileName
      );
      let upload = {
        uri: uri,
        fileUrl: file.fileUrl,
        originalFileName: file.originalFile.originalFileName,
        title: name,
        filetype: extension,
      };
      uploads.push(upload);

      getPdfText(file)
        .then(async (text) => {
          const plainText = text;
          let file = upload;
          const body2 = { plainText, name, uri, file };
          await fetch("/api/chat/analyze/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body2),
          });
        })
        .catch((err) => console.error(err));

      // file.file                name
    }
  );

  Router.push("/notespace/" + uri);
}

async function updateSources(selected: any, uri: string, Router: any) {
  let count = selected.selectedArr.length;
  const body = { count, uri };

  await fetch("/api/notespace/update/sources_count", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  setTimeout(() => {
    Router.push("/notespace/" + uri); // Replace with your target route
  }, 2000); // 2000ms = 2 seconds
}

function getKeywords(summary: string) {
  return summary.split(".")[0];
}

export default function SourcesDrawer({
  selected,
  slug,
  sources,
  isChild,
  setIsChild,

  dispatch,
  uploadOpened,
  setUploadOpened,
  inputRef,
  Router,
  fileContent,
  setFileContent,
}) {
  function FileIcon({ extension }) {
    switch (extension) {
      case ".pdf":
        return (
          <FaFilePdf className="right-0 absolute mr-[.5svw] h-[1.25svw] w-[1.25svw] mt-[.9svh] stroke-rose-800 fill-rose-800" />
        );
      case ".md":
        return (
          <FaMarkdown className="right-0 absolute mr-[.5svw] h-[1.25svw] w-[1.25svw] mt-[.9svh] stroke-blue-800 fill-blue-800" />
        );
      case ".csv":
        return (
          <BsFiletypeCsv className="right-0 absolute mr-[.5svw] h-[1.25svw] w-[1.25svw] mt-[.9svh] stroke-green-800 fill-green-800" />
        );
      case ".tex":
        return (
          <SiLatex className="right-0 absolute mr-[.5svw] h-[1.25svw] w-[1.25svw] mt-[.9svh] stroke-green-400 fill-green-400" />
        );
      case ".json":
        return (
          <TbJson className="right-0 absolute mr-[.5svw] h-[1.25svw] w-[1.25svw] mt-[.9svh] stroke-yellow-600" />
        );

      case ".txt":
        return (
          <TbTxt className="right-0 absolute mr-[.5svw] h-[1.25svw] w-[1.25svw] mt-[.9svh] stroke-zinc-600" />
        );
    }
    return (
      <TbTxt className="right-0 absolute mr-[.5svw] h-[1.25svw] w-[1.25svw] mt-[.9svh] stroke-zinc-600" />
    );
  }

  return (
    <Drawer open={isChild}>
      <DrawerTrigger asChild>
        <div 
        // className=" text-left ml-[-7svw] flex flex-row py-[1svw]"
        >
          <Button
            onClick={() => setIsChild(true)}
            variant="outline"
            style={{zIndex:999}}
            className="hover:drop-shadow-sm   border-sky-400/50   animated-button w-[8svw] h-[5svh]"
          >
            <svg
              className="mr-1"
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 3H12V12H3L3 3ZM2 3C2 2.44771 2.44772 2 3 2H12C12.5523 2 13 2.44772 13 3V12C13 12.5523 12.5523 13 12 13H3C2.44771 13 2 12.5523 2 12V3ZM10.3498 5.51105C10.506 5.28337 10.4481 4.97212 10.2204 4.81587C9.99275 4.65961 9.6815 4.71751 9.52525 4.94519L6.64048 9.14857L5.19733 7.40889C5.02102 7.19635 4.7058 7.16699 4.49327 7.34329C4.28073 7.5196 4.25137 7.83482 4.42767 8.04735L6.2934 10.2964C6.39348 10.4171 6.54437 10.4838 6.70097 10.4767C6.85757 10.4695 7.00177 10.3894 7.09047 10.2601L10.3498 5.51105Z"
                fill="currentColor"
                fill-rule="evenodd"
                clip-rule="evenodd"
              ></path>
            </svg>
            Select Sources
          </Button>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm h-[80svh]">
          <DrawerHeader className="absolute left-[1.5svw]">
            <DrawerTitle>Selected Sources:</DrawerTitle>
            <DrawerDescription>Upload or Enter Link</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0 mt-[3svw]">
            <div className="flex items-center justify-center space-x-2 flex-col group">
              {sources.map((source: Upload, idx) => (
                <div
                  key={source.title}
                  className=" shadow-cyan-800/40 group hover:shadow-cyan-600/40 hover:shadow-md hover:my-[.3svh] transform duration-300 shadow-sm ml-1.5  animated-button px-[1svw] rounded-md  w-[30svw] flex flex-row h-[5svh] mt-1 border-b-[.1svw]  border-r-[.1svw] border-l-[.1svw] mb-[.1svw] border-zinc-300  "
                >
                  <div className="my-auto  ">
                    <Checkbox
                      id={source.title}
                      className="mr-3 hover:bg-cyan-100/30"
                      defaultChecked={selected.map.get(source.title)}
                      value={selected.map.get(source.title)}
                      onClick={(e) =>
                        dispatch({
                          type: "toggle_source",
                          title: source.title,
                        })
                      }
                    />
                    <TooltipProvider>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                          <label
                            htmlFor={source.title}
                            className="text-slate-700 font-roboto text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70  "
                          >
                            {source.title}
                          </label>
                        </TooltipTrigger>
                        <TooltipContent className="multiline w-[40svw] overflow-y-auto font-bold">
                          {source.summary
                            ? getKeywords(source.summary)
                            : "No Summary Yet, Please Wait"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <BsThreeDotsVertical className="right-0 absolute mr-[2svw] h-[1.5svw] w-[1.5svw] mt-[.9svh]  fill-slate-700" />
                  <FileIcon extension={source.filetype as any} />
                  <TooltipProvider>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <div className="w-[2svw] h-[5svh]   right-0 absolute" />
                      </TooltipTrigger>
                      <TooltipContent>{source.filetype}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ))}
            </div>
            <div className="mt-3 h-[40svh]"></div>
          </div>{" "}
          <div className="text-md">{selected.selected}</div>
          <DrawerFooter className="flex flex-row  ml-[2svw] mb-[20svh]   absolute">
          

         
            <UploadButton
              fileContent={fileContent}
              setFileContent={setFileContent}
            />
          
            <DrawerClose asChild>
              <Button
                className="w-[10svh]  "
                variant="outline"
                onClick={() => {
                  setIsChild(false);
                }}
              >
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
