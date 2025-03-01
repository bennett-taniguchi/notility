// Filename - App.js

import React, { useContext, useRef, useState } from "react";
import { Button } from "../ui/button";
import { chunkTextByMultiParagraphs, getPdfText } from "../../utils/parse_text";
import { cva, VariantProps } from "class-variance-authority";
import { SlugContext } from "../context/context";
import { toast } from "../../hooks/use-toast";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Separator } from "../ui/separator";

type FileType = {
  name: string;
  lastModifiedDate: Date;
  type: string;
  size: number;
};

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-zinc-300",
  {
    variants: {
      variant: {
        default:
          "bg-zinc-900 text-zinc-50 shadow hover:bg-zinc-900/90 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90",
        destructive:
          "bg-red-500 text-zinc-50 shadow-sm hover:bg-red-500/90 dark:bg-red-900 dark:text-zinc-50 dark:hover:bg-red-900/90",
        outline:
          "border border-zinc-200 bg-white shadow-sm hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
        secondary:
          "bg-zinc-100 text-zinc-900 shadow-sm hover:bg-zinc-100/80 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-800/80",
        ghost:
          "hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
        link: "text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-5 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function FileSelector({onFileChange,fileName}) {
  const hiddenFileInput = useRef(null); 

  const handleClick = event => {
    (hiddenFileInput!.current! as any).click();   
  };

 let redText = false
  if(fileName.includes('Error: file extension not allowed:') && fileName.includes('is not one of: .csv, .pdf, .md, .tex, .json, .txt')) {
    redText = true
    console.log('redText',redText)
  }
  return (
    <>
     <div className="flex flex-col">
          <Button   onClick={handleClick} className="animated-button w-[200px] mx-auto">Select File</Button>
            <input  type="file" onChange={onFileChange} ref={hiddenFileInput} style={{display:'none'}}/>
            {fileName ? <p style={{color: redText ? 'red' : 'black',fontWeight: redText ? 'lighter' : 'bold', marginTop:'1px'}}>Uploaded file: {fileName}</p> : null}
          </div>
    </>
  )
}
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean; 
  setFileContent: any;
  fileContent: any;
}

const UploadButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, ...props }) => {
    const { data: session, status } = useSession();
    const [fileName, setFileName] = useState("");
    const [selectedFile, setSelectedFile] = useState<FileType | null>(null);
    const [fileDetails, setFileDetails] = useState<JSX.Element | null>(null);
    const [errorMessage, setErrorMessage] = useState("");
    const Router = useRouter();
    const allowedFiletypes = [".csv", ".pdf", ".md", ".tex", ".json", ".txt"];
    const slug = useContext(SlugContext);

    // On file select (from the pop up)
    const onFileChange = (event) => {
      // Reset error state
      setErrorMessage("");

      if (!event.target.files || event.target.files.length === 0) {
        setSelectedFile(null);
        setFileName("");
        return;
      }

      const file = event.target.files[0];
      const extension = "." + file.name.split(".").pop();

      // Validate file type
      if (!allowedFiletypes.includes(extension)) {
        const errorMsg = `Error: file extension not allowed: ${extension} is not one of: ${allowedFiletypes.join(
          ", "
        )}`;
        setErrorMessage(errorMsg);
        setFileName(errorMsg);
        event.target.value = "";
        setSelectedFile(null);
        return;
      }

      // Size checking removed to allow large files

      // File passed validation
      setSelectedFile(file);
      setFileName(file.name);

      // Update file details display
      setFileDetails(
        <div>
          <p>File Name: {file.name}</p>
          <p>File Type: {file.type}</p>
        </div>
      );
    };

    // Take uploaded file (if it exists) and converts then inserts -> neo4j
    const onClickSubmit = async (e: any) => {
      e.preventDefault();

      if (!session) {
        toast({
          title: " User is not logged in!",
          description: "Please login",
        });
      }
      if (!selectedFile) {
        setErrorMessage("Please select a file to upload");
        return;
      }
      // new
      try {
        const filename = selectedFile.name.split(".")[0];
        const extensionType = selectedFile.name.split(".").pop();

        if (extensionType == "pdf") {
          const plainText = await getPdfText(selectedFile);

          let uri = slug.slug;
          const file = {
            uri: uri,
            originalFileName: selectedFile.name,
            title: filename,
            owner: session!.user!.email,
            filetype: extensionType,
            summary: null,
          };
          const body = { plainText, filename, uri, file };
          await fetch("/api/chat/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });

          // addToLocalStorage()
          Router.push("/notespace/" + uri);
        } else if (extensionType == "txt") {
          const plainText = await (selectedFile as any).text();

          let uri = slug.slug;
          const file = {
            uri: uri,
            originalFileName: selectedFile.name,
            title: filename,
            owner: session!.user!.email,
            filetype: extensionType,
            summary: null,
          };
          const body = { plainText, filename, uri, file };
          await fetch("/api/chat/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });

          // addToLocalStorage()
          Router.push("/notespace/" + uri);
        }
      } catch (e) {
        toast({
          title: "Uh Oh",
          description:
            "Something went wrong with file upload please try again!",
        });
      }
    };


    return (
      <div className="flex flex-row  w-[33.5svw] ml-[-6.5svw]">
        
        <div className="flex flex-col mx-auto text-sm">
      
          <div className="text-center text-zinc-600 text-extrabold mb-2">
            Upload a File:
          </div>
   
         <FileSelector onFileChange={onFileChange} fileName={fileName}/>
          <Button
            className=" bg-indigo-500 mx-auto mt-[10px] w-[130px] "
            onClick={onClickSubmit}
            disabled={!selectedFile}
          >
            Add Source
          </Button>
        </div>
  
  
      </div>
    );
  }
);

export default UploadButton;
