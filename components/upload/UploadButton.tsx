// Filename - App.js

import axios from "axios";
import React, { Component, useContext, useState } from "react";
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
import { stat } from "fs";
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
    const [fileName,setFileName] = useState("")
    const allowedFiletypes = ['.csv','.pdf','.md','.tex','.json','.txt']
    const slug = useContext(SlugContext)
    let state = {
      // Initially, no file is selected
      selectedFile: null as null | FileType,
    };

    // On file select (from the pop up)
    const onFileChange = (event) => {
      // Update the state
      let extension = '.'+event.target.files[0].name.split('.').slice(-1) 
      if(!allowedFiletypes.includes(extension)) {
        setFileName(`Error file extension not allowed: ${extension} is not one of:`+allowedFiletypes.join())
          event.target.value=""
        return "";
      }
      if(event.target.files[0].size > 5242880) {//26214400
     
    // event.target.value="Error filesize is too large max size is 5242880 Bytes / 25 Mb"
        setFileName(`Error file is too large: ${event.target.files[0].size} Bytes, max size is: 5242880 Bytes or 5Mb`)
          event.target.value=""
        return "";
      } else {
        state.selectedFile = event.target.files[0];
        setFileName(event.target.files[0].name)
      }

    


      //console.log(this.setFileContent,this.fileContent )
    };

    // On file upload (click the upload button)
    // const onFileUpload = () => {
    //   // Create an object of formData
    //   const formData = new FormData();
  
     
    //   // Update the formData object
    //   formData.append(
    //     "myFile",
    //     state.selectedFile as any,
    //     state.selectedFile!.name
    //   );

    //   // Details of the uploaded file
    //   console.log(state.selectedFile);

    //   // Request made to the backend api
    //   // Send formData object
    //   axios.post("api/uploadfile", formData);
    // };

    // Returning  nodes from neo4j, currently includes document type nodes
    // need to specifically return person type?
    // good to cache results instead of querying becavuse this whole operation is slow
    // merges on names on f-name l-name rule
    const onClickQuery = async (e: any) => {
      e.preventDefault();
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

          let names = props.id; //

          if (Array.isArray(names)) {
            // we dont want to try to merge on already merged
            // we want to merge on [a,b] if c should be merged for some reason
            // maybe if there is a super long title that exists
          } else {
            // 'fname lname'
            // map either has fname or lname
            // merged on fname,lname,name

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
            //OR

            // 'fname' OR 'lname'
            // is map has 'fname lname'
            // merged on fname,lname,name
          }
        }
      }
      console.log(map, merged);
       merged.forEach(async (toBeMerged: string[]) => {
          let nameA = toBeMerged[0]
          let nameB = toBeMerged[1]
          const body = {nameA,nameB}

          let res = await fetch("/api/neo4j/merge/on_entity/", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body)
            });
            let data = await res.json()
            console.log(data)
       })
    };

    // Take uploaded file (if it exists) and converts then inserts -> neo4j
    // need to also update supabase
    //
    const onClickSubmit = async (e: any) => {
      e.preventDefault();

      if (state.selectedFile) {
        let filename = state.selectedFile.name.split('.')[0]

        let extensionType = state.selectedFile.name.slice(
          state.selectedFile.name.length - 3,
          state.selectedFile.name.length
        );
     

        //console.log(filename.slice(filename.length-3,filename.length))
        if (extensionType == "pdf") {
          let txt = await getPdfText(state.selectedFile);

          let chunked = chunkTextByMultiParagraphs(txt);
        
          const body = { chunked,filename };
            
          await fetch("/api/neo4j/insert", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });

          const upload = { uri: slug.slug, originalFileName: filename, title: filename, filetype: extensionType, summary:null } 
          await fetch('/api/supabase/upload/create/',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({upload})
          })
        
        } else {
          console.log(state.selectedFile);
          let txt = await (state.selectedFile as any).text();

          let chunked = chunkTextByMultiParagraphs(txt);
            console.log(txt)

            const upload = { uri: slug.slug, originalFileName: filename, title: filename, filetype: extensionType, summary:null } 
            await fetch('/api/supabase/upload/create/',{
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({upload})
            })

            // add to   localstorage via function
            const body = { chunked,filename };
         
            await fetch("/api/neo4j/insert", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            });
     
           
        //   chunked.forEach(async (chunk) => {
        //     const body = { chunk };
        //     console.log("txt", chunk);
        //     await fetch("/api/neo4j/insert", {
        //       method: "POST",
        //       headers: { "Content-Type": "application/json" },
        //       body: JSON.stringify(body),
        //     });
        //   });

     
        }
      } else {
        console.log("please select a file to upload");
      }
    };

    // File content to be displayed after
    // file upload is complete
    const fileData = () => {
     
      if (state.selectedFile) {
        return (
          <div>
            <h2>File Details:</h2>
            <p>File Name: {state.selectedFile.name}</p>

            <p>File Type: {state.selectedFile.type}</p>

            <p>
              Last Modified:
              {state.selectedFile.lastModifiedDate.toDateString()}
            </p>
          </div>
        );
      } else {
        return (
          <div>
            <br />
            <h4>Choose before Pressing the Upload button</h4>
          </div>
        );
      }
    };

    return (
      <div>
        <h1>Upload for Neo4j and Querying Testing</h1>
      
        <div>
          <input type="file" onChange={onFileChange}   />
          {/* <Button onClick={onFileUpload}>Upload!</Button> */}

          <Button onClick={onClickSubmit}>Submit into Neo4j</Button>
          
          <Button onClick={onClickQuery}>Query25</Button>
        </div>
        
        <i>{fileName}</i>
      </div>
    );

 
  }
);


export default UploadButton;
