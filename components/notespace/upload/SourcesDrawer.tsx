import { Upload } from "@prisma/client";
import { createPortal } from "react-dom";
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
import { Checkbox } from "../../ui/checkbox";
import { ScrollArea } from "../../ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import { Info } from "lucide-react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { useEffect, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { useRouter } from "next/router";
import PulsingDots from "../chat/loading/PulsingDots";
import { selectedReducer } from "../../../pages/notespace/[...uri]";
import {
  Table2,
  EllipsisVertical,
  FileText,
  SquareSigma,
  FileJson,
} from "lucide-react";

function getKeywords(summary: string) {
  return summary.split(".")[0];
}

// Responsive FileIcon component
function FileIcon({ extension, className = "" }) {
  const baseClasses = "h-4 w-4 flex-shrink-0";
  const iconClasses = `${baseClasses} ${className}`;
  
  switch (extension) {
    case "pdf":
      return <FileText className={`${iconClasses} stroke-rose-800 fill-rose-800`} />;
    case "md":
      return <FileText className={`${iconClasses} stroke-blue-800 fill-blue-800`} />;
    case "csv":
      return <Table2 className={`${iconClasses} stroke-green-800 fill-green-800`} />;
    case "tex":
      return <SquareSigma className={`${iconClasses} stroke-green-400 fill-green-400`} />;
    case "json":
      return <FileJson className={`${iconClasses} stroke-yellow-600`} />;
    case "txt":
      return <FileText className={`${iconClasses} stroke-zinc-600`} />;
    default:
      return <FileText className={`${iconClasses} stroke-zinc-600`} />;
  }
}

// Uploading source component
function UploadingSourceItem({ uploadingSource }) {
  const getStatusIcon = () => {
    switch (uploadingSource.status) {
      case 'uploading':
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>;
      case 'processing':
        return <div className="animate-pulse rounded-full h-4 w-4 bg-yellow-500"></div>;
      case 'error':
        return (
          <div className="rounded-full h-4 w-4 bg-red-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">!</span>
          </div>
        );
    }
  };

  const getStatusText = () => {
    switch (uploadingSource.status) {
      case 'uploading':
        return 'Uploading...';
      case 'processing':
        return 'Processing...';
      case 'error':
        return uploadingSource.error || 'Upload failed';
    }
  };

  const extension = uploadingSource.originalFileName.split('.').pop()?.toLowerCase();

  return (
    <div className={`
      w-full px-3 py-3 rounded-md flex items-center justify-between gap-3
      border border-l-4 mb-2 transition-all duration-300
      ${uploadingSource.status === 'error' 
        ? 'border-red-300 border-l-red-500 bg-red-50' 
        : 'border-blue-300 border-l-blue-500 bg-blue-50'
      }
    `}>
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {getStatusIcon()}
        <div className="min-w-0 flex-1">
          <div className="font-medium text-slate-700 truncate">
            {uploadingSource.title}
          </div>
          <div className="text-sm text-slate-500">
            {getStatusText()}
          </div>
        </div>
      </div>
      <FileIcon extension={extension} />
    </div>
  );
}

function SourceOptions({ slug, title, setLoading, sources, setSources, dispatch }) {
  const Router = useRouter();
  const [deleteReady, setDeleteReady] = useState(false);
  const buttonRef = useRef(null);
  const animationTimeout = useRef(null);

  async function deleteSource(setLoading) {
    let uri = slug;
    let name = title;
    let body = { name, uri };
    setLoading(true);
    
    await fetch("/api/pinecone/delete/upload", {
      headers: { "Content-Type": "application/json" },
      method: "DELETE",
      body: JSON.stringify(body),
    });

    await fetch("/api/supabase/upload/delete", {
      headers: { "Content-Type": "application/json" },
      method: "DELETE",
      body: JSON.stringify(body),
    });

    setLoading(false);
    let s_d = [...sources];
    s_d = s_d.filter((s) => s.title != name);
    setSources(s_d);
    dispatch({
      type: "remove_source",
      title: name,
    });

    let selected = localStorage.getItem(slug + "*savedSelectedSources");
    if (!selected) return;
    selected = selected.replace(title, "");
    localStorage.setItem(slug + "*savedSelectedSources", selected);

    Router.push("/notespace/" + slug);
  }

  const handleMouseEnter = () => {
    (animationTimeout as any).current = setTimeout(() => {
      setDeleteReady(true);
    }, 2000);
  };

  const handleMouseLeave = () => {
    if (animationTimeout.current) {
      clearTimeout(animationTimeout.current);
    }
    setDeleteReady(false);
  };

  const handleDelete = (setLoading) => {
    if (deleteReady) {
      deleteSource(setLoading);
      setDeleteReady(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-blue-100"
        >
          <EllipsisVertical className="h-4 w-4 text-slate-600" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          ref={buttonRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleDelete(setLoading)}
          className="text-red-700 focus:text-red-700 focus:bg-red-50"
        >
          Delete Source
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function SourcesDrawer({
  selected,
  slug,
  sources,
  setSources,
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
  type UploadingSource = {
    title: string;
    originalFileName: string;
    status: 'uploading' | 'processing' | 'error';
    error?: string;
    startTime: number;
  };

  const [loading, setLoading] = useState(false);
  const [uploadingSources, setUploadingSources] = useState<UploadingSource[]>([]);

  function onUploadStart(filename: string, originalFileName: string) {
    setUploadingSources(prev => [
      ...prev,
      {
        title: filename,
        originalFileName: originalFileName,
        status: 'uploading',
        startTime: Date.now()
      }
    ]);
  }

  function onUploadComplete(filename: string, sourceData: any) {
    setUploadingSources(prev =>
      prev.filter(item => item.title != filename)
    );
    setSources(prev => [...prev, sourceData]);
    dispatch({
      type: "toggle_source",
      title: filename,
    });
  }

  function onUploadError(filename: string, error: string) {
    console.log('Upload failed for:', filename, error);

    setUploadingSources(prev =>
      prev.map(item =>
        item.title === filename
          ? { ...item, status: 'error' as const, error }
          : item
      )
    );

    setTimeout(() => {
      setUploadingSources(prev =>
        prev.filter(item => item.title !== filename)
      );
    }, 5000);
  }

  return (
    <Drawer open={isChild}>
      <DrawerTrigger asChild>
        <div className="fixed top-5 right-14 z-50">
          <Button
            onClick={() => setIsChild(true)}
            variant="outline"
            className="
              flex items-center gap-2 px-4 py-2 h-11 
              bg-white border border-gray-200 rounded-lg 
              hover:bg-gray-50 hover:shadow-md 
              transition-all duration-200
              text-gray-700 font-medium
            "
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 3H12V12H3L3 3ZM2 3C2 2.44771 2.44772 2 3 2H12C12.5523 2 13 2.44772 13 3V12C13 12.5523 12.5523 13 12 13H3C2.44771 13 2 12.5523 2 12V3ZM10.3498 5.51105C10.506 5.28337 10.4481 4.97212 10.2204 4.81587C9.99275 4.65961 9.6815 4.71751 9.52525 4.94519L6.64048 9.14857L5.19733 7.40889C5.02102 7.19635 4.7058 7.16699 4.49327 7.34329C4.28073 7.5196 4.25137 7.83482 4.42767 8.04735L6.2934 10.2964C6.39348 10.4171 6.54437 10.4838 6.70097 10.4767C6.85757 10.4695 7.00177 10.3894 7.09047 10.2601L10.3498 5.51105Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </svg>
            <span className="hidden sm:inline">Sources</span>
          </Button>
        </div>
      </DrawerTrigger>
      
      <DrawerContent className="h-[90vh] max-h-[800px]">
        <div className="flex flex-col h-full max-w-2xl mx-auto w-full">
          <DrawerHeader className="flex-shrink-0 text-center border-b">
            <DrawerTitle>Selected Sources</DrawerTitle>
            <DrawerDescription>Upload files or manage your sources</DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 overflow-hidden p-4">
            <ScrollArea className="h-full" viewportRef={null}>
              <div className="space-y-2">
                {/* Uploading sources */}
                {uploadingSources.map((uploadingSource) => (
                  <UploadingSourceItem
                    key={`uploading-${uploadingSource.title}`}
                    uploadingSource={uploadingSource}
                  />
                ))}

                {/* Completed sources */}
                {sources.map((source: Upload, idx) => (
                  <div
                    key={source.title}
                    className="
                      w-full px-3 py-3 rounded-md border border-gray-200
                      hover:border-cyan-300 hover:shadow-md 
                      transition-all duration-200 bg-white
                      flex items-center justify-between gap-3
                    "
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Checkbox
                        id={source.title}
                        className="flex-shrink-0"
                        defaultChecked={selected.map.get(source.title)}
                        onClick={(e) =>
                          dispatch({
                            type: "toggle_source",
                            title: source.title,
                          })
                        }
                      />
                      <label
                        htmlFor={source.title}
                        className="font-medium text-slate-700 cursor-pointer truncate flex-1"
                      >
                        {source.title}
                      </label>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <TooltipProvider>
                        <Tooltip delayDuration={300}>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-blue-100"
                            >
                              <Info className="h-4 w-4 text-slate-500" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent
                            side="left"
                            className="max-w-xs p-3 text-sm bg-cyan-700/90 text-white"
                          >
                            <ReactMarkdown>
                              {source.summary
                                ? getKeywords(source.summary)
                                : "No Summary Yet, Please Wait"}
                            </ReactMarkdown>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip delayDuration={300}>
                          <TooltipTrigger asChild>
                            <div className="p-1">
                              <FileIcon extension={source.filetype as any} />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            {source.filetype}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <SourceOptions
                        dispatch={dispatch}
                        slug={slug}
                        title={source.title}
                        setLoading={setLoading}
                        sources={sources}
                        setSources={setSources}
                      />
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {loading && (
                  <div className="flex justify-center py-4">
                    <PulsingDots loading={loading} />
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          <DrawerFooter className="flex-shrink-0 border-t bg-gray-50/50">
            <UploadButton
              fileContent={fileContent}
              setFileContent={setFileContent}
              setLoading={setLoading}
              onUploadStart={onUploadStart}
              onUploadComplete={onUploadComplete}
              onUploadError={onUploadError}
            />
            <DrawerClose asChild>
              <Button
                variant="outline"
                className="w-24 mx-auto"
                onClick={() => setIsChild(false)}
              >
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}