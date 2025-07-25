import React, { useContext, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { chunkTextByMultiParagraphs, getPdfText } from "../../utils/parse_text";
import { cva, VariantProps } from "class-variance-authority";
import { SlugContext } from "../context/context";
import { toast } from "../../hooks/use-toast";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Separator } from "../ui/separator";
import { Upload, File, AlertCircle } from "lucide-react";

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

function FileSelector({ onFileChange, fileName, selectedFile,setErrorMessage }) {
  const hiddenFileInput = useRef(null);

  const handleClick = (event) => {
    (hiddenFileInput.current as any)?.click();
   setErrorMessage("")
    
  };

  const isError = fileName.includes("Error:");

  return (
    <div className="space-y-3">
      {/* File selection area */}
      <div
        onClick={handleClick}
        className="
          relative border-2 border-dashed border-gray-300 rounded-lg p-6
          hover:border-gray-400 hover:bg-gray-50 
          transition-colors duration-200 cursor-pointer
          focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20
        "
      >
        <input
          type="file"
          onChange={onFileChange}
          ref={hiddenFileInput}
          className="sr-only"
          accept=".csv,.pdf,.md,.tex,.json,.txt"
        />

        <div className="text-center">
          <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          <div className="text-sm text-gray-600 mb-1">
            <span className="font-medium text-blue-600 hover:text-blue-500">
              Click to upload
            </span>{" "}
            or drag and drop
          </div>
          <p className="text-xs text-gray-500">
            PDF, TXT, MD, TEX, JSON, CSV files only
          </p>
        </div>
      </div>

      {/* File status display */}
      {fileName && (
        <div
          className={`
          p-3 rounded-md border
          ${
            isError != ""
              ? "bg-red-50 border-red-200 text-red-700"
              : "bg-green-50 border-green-200 text-green-700"
          }
        `}
        >
          <div className="flex items-start gap-2">
            {isError ? (
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
            ) : (
              <File className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">
                {isError ? "Upload Error" : "File Selected"}
              </p>
              <p className="text-xs break-words">
                {isError ? fileName : `${fileName}`}
              </p>
              {selectedFile && !isError && (
                <p className="text-xs opacity-75 mt-1">
                  {(selectedFile.size / 1024).toFixed(1)} KB •{" "}
                  {selectedFile.type || "Unknown type"}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  setFileContent: any;
  fileContent: any;
  setLoading: any;
  onUploadStart?: (filename: string, originalFileName: string) => void;
  onUploadComplete?: (filename: string, sourceData: any) => void;
  onUploadError?: (filename: string, error: string) => void;
  setSources?: any;
  sources?: any;
}

const UploadButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, ...props }) => {
    const { data: session, status } = useSession();
    const [fileName, setFileName] = useState("");
    const [selectedFile, setSelectedFile] = useState<FileType | null>(null);
    const [fileDetails, setFileDetails] = useState<JSX.Element | null>(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const Router = useRouter();
    const allowedFiletypes = [".csv", ".pdf", ".md", ".tex", ".json", ".txt"];
    const slug = useContext(SlugContext);

    // On file select (from the pop up)
    const onFileChange = (event) => {
      setErrorMessage("");
      setFileName("");
      setSelectedFile(null);

      if (!event.target.files || event.target.files.length === 0) {
        setSelectedFile(null);
        setFileName("");
        return;
      }

      const file = event.target.files[0];
      const extension = "." + file.name.split(".").pop();

      if (file.name.includes("Error")) {
        const errorMsg = `Error: file name cannot contain: "Error" `;
        setErrorMessage(errorMsg);
        setFileName(errorMsg);
        event.target.value = "";
        setSelectedFile(null);
        return;
      }

      if (file.size > 26214400) { // 25MB
        const errorMsg = `Error: file size greater than 25MB not allowed`;
        setErrorMessage(errorMsg);
        setFileName(errorMsg);
        event.target.value = "";
        setSelectedFile(null);
        return;
      }

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

      // File passed validation
      setSelectedFile(file);
      setFileName(file.name);
    };

    const onClickSubmit = async (e: any) => {
      e.preventDefault();

      if (!session) {
        toast({
          title: "User is not logged in!",
          description: "Please login",
        });
        return;
      }

      if (!selectedFile) {
        setErrorMessage("Please select a file to upload");
        return;
      }

      const filename = selectedFile.name.split(".")[0];
      const extensionType = selectedFile.name.split(".").pop();

      // Start the upload process
      setIsUploading(true);
      props.onUploadStart?.(filename, selectedFile.name);
      props.setLoading?.(true);

      try {
       let plainText = "";
  if (extensionType === "pdf") {
    plainText = await getPdfText(selectedFile as any);
  } else if (extensionType === "txt") {
    plainText = await (selectedFile as any).text();
  } else {
    throw new Error(`Unsupported file type: ${extensionType}`);
  }

  let uri = slug.slug;
  const file = {
    uri: uri,
    originalFileName: selectedFile.name,
    title: filename,
    owner: session!.user!.email,
    filetype: extensionType,
    summary: null,
  };

  // Batching configuration
  const BATCH_SIZE = 500 * 1750; // ~875KB per batch (well under 1MB limit)
  const totalBatches = Math.ceil(plainText.length / BATCH_SIZE);
  
  console.log(`Processing ${plainText.length} characters in ${totalBatches} batches`);
  
  let allResults = [] as any;
  let overallSummary = null;

  // Process each batch
  for (let i = 0; i < totalBatches; i++) {
    const startIndex = i * BATCH_SIZE;
    const endIndex = Math.min(startIndex + BATCH_SIZE, plainText.length);
    const batchText = plainText.slice(startIndex, endIndex);
    
    // Create chunks for this batch
    const batchChunks = chunkTextByMultiParagraphs(batchText);
    
    const batchBody = {
      plainText: batchText, // for pinecone
      filename: `${filename}`,
      uri,
      file: {
        ...file,
        title: `${filename}` // for postgresql
      },
      batchInfo: {
        currentBatch: i + 1,
        totalBatches: totalBatches,
        isLastBatch: i === totalBatches - 1
      }
    };

    console.log(`Uploading batch ${i + 1}/${totalBatches}...`);

    const response = await fetch("/api/chat/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(batchBody),
    });

    if (!response.ok) {
      throw new Error(`Batch ${i + 1} upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    allResults.push(result);
    
    // Store summary from the first batch or last batch
    if (i === 0 || result.result?.summary) {
      overallSummary = result.result?.summary;
    }

    console.log(`Batch ${i + 1} completed successfully`);
  }

  // Only reload and update UI after ALL batches are complete
  Router.reload();

  const newSource = {
    title: filename,
    filetype: extensionType,
    summary: overallSummary || null,
    originalFileName: selectedFile.name,
    uri: uri,
    owner: session!.user!.email,
  };

  // Notify completion
  props.onUploadComplete?.(filename, newSource);

  // Reset form
  setSelectedFile(null);
  setFileName("");
  setFileDetails(null);
  setErrorMessage("");

  toast({
    title: "Upload Successful",
    description: `${selectedFile.name} has been processed in ${totalBatches} batches and added to your sources`,
  });
      } catch (error) {
        console.error("Upload error:", error);
        const errorMessage = error.message || "Upload failed";
        props.onUploadError?.(filename, errorMessage);

        toast({
          title: "Upload Failed",
          description: errorMessage,
        });
      } finally {
        setIsUploading(false);
        props.setLoading?.(false);
      }
    };

    const getFileTypeDisplay = (extension) => {
      const types = {
        pdf: "PDF Document",
        txt: "Text File",
        md: "Markdown File",
        tex: "LaTeX Document",
        json: "JSON Data",
        csv: "CSV Spreadsheet",
      };
      return types[extension] || "Unknown File Type";
    };
 
    return (
      <div className="w-full space-y-4">
        {/* Header */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Add New Source
          </h3>
          <p className="text-sm text-gray-600">
            Upload a document to add it to your knowledge base
          </p>
        </div>

        <Separator />

        {/* File selector */}
        <FileSelector
          onFileChange={onFileChange}
          fileName={fileName}
          selectedFile={selectedFile}
          setErrorMessage={setErrorMessage}
        />

        {/* Error message */}
        {errorMessage && !fileName.includes("Error:") && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Upload button */}
        <Button
          onClick={onClickSubmit}
          disabled={!selectedFile || isUploading || fileName.includes("Error:")}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5"
        >
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Add Source
            </>
          )}
        </Button>

        {/* Help text */}
        <div className="text-xs text-gray-500 text-center space-y-1">
          <p>Supported formats: PDF, TXT, MD, TEX, JSON, CSV</p>
          <p>Files are processed and embedded for AI search</p>
        </div>
      </div>
    );
  }
);

export default UploadButton;
