// Filename - App.js

import axios from "axios";
import React, { Component } from "react";
import { Button } from "../ui/button";
import { getPdfText } from "../../utils/parse_text";
import { cva, VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
type FileType = {
    name: string;
    lastModifiedDate: Date;
    type: string;
}

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
  setFileContent:any,
  fileContent:any
}
 
const UploadButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({asChild = false,...props }) => {
     
        const Comp = asChild ? Slot : "button";
      return (
        < Comp
         
          {...props}
        /> 
      );
    }
  );
// const UploadButton= React.forwardRef<HTMLButtonElement, ButtonProps>(
//     ({ className, variant, size, asChild = false, ...props }, ref) =>   {

//     setFileContent    =  ((this).props as any ).setFileContent;
//     fileContent    =  ((this).props as any).fileContent;

//     state = {
//         // Initially, no file is selected
//         selectedFile: null  as null | FileType
//     };

//     // On file select (from the pop up)
//     onFileChange = (event) => {
//         // Update the state
//         this.setState({
//             selectedFile: event.target.files[0]
//         });
        
//     console.log(this.setFileContent,this.fileContent )
//     };

//     // On file upload (click the upload button)
//     onFileUpload = () => {
//         // Create an object of formData
//         const formData = new FormData();

//         // Update the formData object
//         formData.append(
//             "myFile",
//             this.state.selectedFile as any,
//             (this.state.selectedFile!).name  
//         );

//         // Details of the uploaded file
//         console.log(this.state.selectedFile);

//         // Request made to the backend api
//         // Send formData object
//         axios.post("api/uploadfile", formData);
//     };

//     onClickSubmit = async(e:any) => {
        
//         e.preventDefault();

//         if(this.state.selectedFile) {
//             let filename = this.state.selectedFile.name.slice(this.state.selectedFile.name.length-3,this.state.selectedFile.name.length)
//             console.log(filename)
 
//             //console.log(filename.slice(filename.length-3,filename.length))
//             if(filename == 'pdf'){
//                 console.log(await getPdfText(this.state.selectedFile))

//                 return
//             } else {
//                 console.log( this.state.selectedFile)
//                 console.log(await (this.state.selectedFile as any).text())

//                 return
//             }
            

//         }
       
//     }

    
//     // File content to be displayed after
//     // file upload is complete
//     fileData = () => {
//         if (this.state.selectedFile) {
//             return (
//                 <div>
//                     <h2>File Details:</h2>
//                     <p>File Name: {this.state.selectedFile.name}</p>

//                     <p>File Type: {this.state.selectedFile.type}</p>

//                     <p>
//                         Last Modified:
//                         {this.state.selectedFile.lastModifiedDate.toDateString()}
//                     </p>
//                 </div>
//             );
//         } else {
//             return (
//                 <div>
//                     <br />
//                     <h4>Choose before Pressing the Upload button</h4>
//                 </div>
//             );
//         }
//     };

   
//         return (
//             <div>
//                 <h1>GeeksforGeeks</h1>
//                 <h3>File Upload using React!</h3>
//                 <div>
//                     <input type="file" onChange={this.onFileChange} />
//                     <Button onClick={this.onFileUpload}>Upload!</Button>
//                     <Button onClick={this.onClickSubmit}>Submit!</Button>
//                 </div>
//                 {this.fileData()}
//             </div>
//         );
 

// }
// )

export default UploadButton;