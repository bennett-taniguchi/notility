// Filename - App.js

import axios from "axios";
import React, { useContext, useState } from "react";
import { Button } from "../ui/button";
import {
  chunkTextByMultiParagraphs,
  embedChunksDense,
  getPdfText,
} from "../../utils/parse_text";
import { cva, VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { Upload } from "@prisma/client";
import { SlugContext } from "../context/context";

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

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  setFileContent: any;
  fileContent: any;
}

const UploadButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, ...props }) => {
    const [fileName, setFileName] = useState("");
    const [selectedFile, setSelectedFile] = useState<FileType | null>(null);
    const [fileDetails, setFileDetails] = useState<JSX.Element | null>(null);
    const [errorMessage, setErrorMessage] = useState("");
    
    const allowedFiletypes = ['.csv', '.pdf', '.md', '.tex', '.json', '.txt'];
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
      const extension = '.' + file.name.split('.').pop();
      
      // Validate file type
      if (!allowedFiletypes.includes(extension)) {
        const errorMsg = `Error: file extension not allowed: ${extension} is not one of: ${allowedFiletypes.join(', ')}`;
        setErrorMessage(errorMsg);
        setFileName(errorMsg);
        event.target.value = "";
        setSelectedFile(null);
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5242880) {
        const errorMsg = `Error: file is too large: ${file.size} Bytes, max size is: 5242880 Bytes or 5MB`;
        setErrorMessage(errorMsg);
        setFileName(errorMsg);
        event.target.value = "";
        setSelectedFile(null);
        return;
      }
      
      // File passed validation
      setSelectedFile(file);
      setFileName(file.name);
      
      // Update file details display
      setFileDetails(
        <div>
          <h2>File Details:</h2>
          <p>File Name: {file.name}</p>
          <p>File Type: {file.type}</p>
          <p>Last Modified: {new Date(file.lastModified).toDateString()}</p>
        </div>
      );
    };

    // Returning nodes from neo4j, currently includes document type nodes
    const onClickQuery = async (e: any) => {
      e.preventDefault();
      try {
        let res = await fetch("/api/neo4j/get/", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        let data = await res.json();

        let map = new Map();
        let merged = [] as string[][];
        for (const datum of data.records) {
          let props = datum._fields[0].properties;

          if (props && props.id) {
            console.log(props.id);

            let names = props.id;

            if (Array.isArray(names)) {
              // We don't want to try to merge on already merged
            } else {
              // 'fname lname'
              if (names.includes(" ")) {
                let split = names.split(" ");

                split.forEach((name) => {
                  if (map.has(name)) {
                    map.set(name, names); // point to fullname
                    map.set(names, names); // fullest name we know
                    merged.push([name, names]); // create merge pair
                  } else {
                    map.set(name, names); // point to fullname
                  }
                });
                map.set(names, names); // fullest name we know
              } else {
                let name = names;
                if (map.has(name) && map.get(name) != name) {
                  merged.push([name, map.get(name)]); // merge: fname, fullname
                } else {
                  map.set(name, name);
                }
              }
            }
          }
        }
        
        console.log(map, merged);
        
        // Process merges
        for (const toBeMerged of merged) {
          let nameA = toBeMerged[0];
          let nameB = toBeMerged[1];
          const body = { nameA, nameB };

          let res = await fetch("/api/neo4j/merge/on_entity/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
          });
          let data = await res.json();
          console.log(data);
        }
      } catch (error) {
        console.error("Error in query operation:", error);
        setErrorMessage("Error in query operation");
      }
    };

    // Take uploaded file (if it exists) and converts then inserts -> neo4j
    const onClickSubmit = async (e: any) => {
      e.preventDefault();
      
      if (!selectedFile) {
        setErrorMessage("Please select a file to upload");
        return;
      }
      
      try {
        const filename = selectedFile.name.split('.')[0];
        const extensionType = selectedFile.name.split('.').pop();
        
        if (extensionType === "pdf") {
          let txt = await getPdfText(selectedFile);
          let chunked = chunkTextByMultiParagraphs(txt);
          
          const body = { chunked, filename };
            
          await fetch("/api/neo4j/insert", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });

          const upload = { 
            uri: slug.slug, 
            originalFileName: filename, 
            title: filename, 
            filetype: extensionType, 
            summary: null 
          };
          
          await fetch('/api/supabase/upload/create/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({upload})
          });
        } else {
          let txt = await (selectedFile as any).text();
          let chunked = chunkTextByMultiParagraphs(txt);
          
          const upload = { 
            uri: slug.slug, 
            originalFileName: filename, 
            title: filename, 
            filetype: extensionType, 
            summary: null 
          };
          
          await fetch('/api/supabase/upload/create/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({upload})
          });

          // Add to localstorage via function
          const body = { chunked, filename };
       
          await fetch("/api/neo4j/insert", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
        }
        
        // Show success message
        setErrorMessage("");
        alert("File successfully uploaded and processed!");
      } catch (error) {
        console.error("Error in submit operation:", error);
        setErrorMessage("Error processing file. Please try again.");
      }
    };

    return (
      <div>
        <h1>Upload for Neo4j and Querying Testing</h1>
        
        <div>
          <input type="file" onChange={onFileChange} />
          
          <Button 
            onClick={onClickSubmit}
            disabled={!selectedFile}
          >
            Submit into Neo4j
          </Button>
          
          <Button onClick={onClickQuery}>Query25</Button>
        </div>
        
        {errorMessage ? (
          <p style={{ color: 'red' }}>{errorMessage}</p>
        ) : (
          <i>{fileName}</i>
        )}
        
        {fileDetails}
      </div>
    );
  }
);

export default UploadButton;