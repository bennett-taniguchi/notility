import { useRouter } from "next/router";
import React, {
  Suspense,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  ResizablePanel,
  ResizablePanelGroup,
} from "../../components/ui/resizable";
import { Textarea } from "../../components/ui/textarea";
import { RiHome2Fill } from "react-icons/ri";
import Link from "next/link";
import { FaGear, FaShare } from "react-icons/fa6";
import { FaUserAlt } from "react-icons/fa";

import dynamic from "next/dynamic";

import { getSession, useSession } from "next-auth/react";
import { Message, Notes, Notespace, Upload } from "@prisma/client";

import prisma from "../../lib/prisma";
import { GetServerSideProps } from "next";
import Header from "../../components/Header";

import {
  NotesContext,
  SlugContext,
  UpdateUploadsContext,
} from "../../components/context/context";

const DynamicChatWindow = dynamic(
  () => import("../../components/notespace/chat/ChatWindow")
);
const DynamicOutputArea = dynamic(
  () => import("../../components/notespace/tiptap/output/OutputArea")
);
const DynamicSourcesDrawer = dynamic(
  () => import("../../components/notespace/upload/SourcesDrawer")
);

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  resolvedUrl,
}) => {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );

  let uuid = resolvedUrl.split("/")[2]; // need middleware workaround??

  const session = await getSession({ req });

  if (!session) {
    res.statusCode = 403;
    return { props: { notespace: [] } };
  }

  const notespace = await prisma.notespace.findUnique({
    where: {
      uri: uuid,
    },
  });

  const sources = await prisma.upload.findMany({
    where: {
      uri: uuid,
    },
  });

  const messages = await prisma.message.findMany({
    where: {
      uri: uuid,
    }
  });

  
  const notes = await prisma.notes.findMany({
    where: {
      uri: uuid,
    }, 
  });


  return {
    props: { notespace, sources, messages, notes },
  };
};

type Props = {
  notespace: Notespace;
  sources: Upload[];
  messages: Message[];
  notes: string[];
};

function selectedReducer(state, action) {
  switch (action.type) {
    case "add_source": {
    }

    case "init_sources":
      if (!action.sources) {
        return {
          map: new Map<string, boolean>(),
          selected: "0 Sources Selected",
          selectedArr: [],
        };
      }
      let localMap = new Map<string, boolean>();

      for (let i = 0; i < action.sources.length; i++) {
        localMap.set(action.sources[i].title, false);
      }
 

      let locallyStored = localStorage.getItem("savedSelectedSources");
      
      let count = 0;
      let locallyStoredArr: Array<string> = [];
      let arr: Array<string> = [];
      if (locallyStored && locallyStored.length != 0)
        locallyStoredArr = locallyStored.split("*");
      if (locallyStored)
        for (
          let i = 0;
          i < Math.min(locallyStoredArr.length, action.sources.length);
          i++
        ) {
          if (localMap.get(locallyStoredArr[i])) continue;
          arr.push(locallyStoredArr[i]);
          count++;
          localMap.set(locallyStoredArr[i], true);
        }
      let amtselectedstr =
        count == 1 ? " Source Selected" : " Sources Selected";

      return {
        map: localMap,
        selected: count + amtselectedstr,
        selectedArr: arr,
      };
    case "toggle_source":
      let newMap = new Map(state.map);

      newMap.set(action.title, !state.map.get(action.title));

      const keys = newMap.keys();

      let strArr: Array<string> = []; //becomes selectedArr
      let str = ""; // becomes selected
      let c = 0; // track # of selected sources (used in selected)
      let savedSelectedSources = "";

      for (const key of keys) {
        let value = newMap.get(key);
        if (value) {
          let modifiedKey = key + "";
          strArr.push(modifiedKey);
          savedSelectedSources += key + "*";

          c++;
        }
      }

      if (c == 0) {
        str = "No Sources Selected, select from above!";
      } else if (c == 1) {
        str = c + " Source Selected";
      } else {
        str = c + " Sources Selected";
      }

      if (savedSelectedSources.length == 0) savedSelectedSources += "*";
      localStorage.setItem(
        "savedSelectedSources",
        savedSelectedSources.slice(0, savedSelectedSources.length - 1)
      );
      
      return { map: newMap, selected: str, selectedArr: strArr };
  }
}
export async function updateTitle(e: any, slug: string) {
  const newTitle = e.target.value;
  const uri = slug;

  const body = { newTitle, uri };

  await fetch("/api/notespace/update/title", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
export default function NotespacesPage({
  notespace,
  sources,
  messages,
  notes,
}: Props) {
  const inputRef = useRef(null);
  const Router = useRouter();
  const slug = Router.asPath.split("/")[2];
  const initialState = {
    map: new Map<string, boolean>(),
    selected: "",
    selectedArr: [],
  };

  const [editorVisible, setEditorVisible] = useState(false);
  const [isChild, setIsChild] = useState(false);
  const [selected, dispatch] = useReducer(selectedReducer, initialState);

  const [fileContent, setFileContent] = useState(null);
  const { data: session } = useSession();

  const ref = useRef(null);
  const [uploadOpened, setUploadOpened] = useState(false);

  useEffect(() => {
    if(sources)
    dispatch({
      type: "init_sources",
      sources: JSON.parse(JSON.stringify(sources)),
      sourcesArr: localStorage.getItem("savedSelectedSources"),
    });
    return () => {
      setUploadOpened(false); // Cleanup upload state when component unmounts
    };
  }, []);
  useEffect(() => {}, [selected, sources]);
  function validateFile(originalFilename: string) {
    if (!sources) return false;
    if (sources.length >= 25)
      for (let i = 0; i < sources.length; i++) {
        if (sources[i].originalFileName == originalFilename) return true;
      }
    return false;
  }
  // const options = (uri) => {
  //   return {
  //     apiKey: "public_W142iw5A2CjLkNdU7G6px7mYYKZH", // This is your API key.
  //     maxFileCount: 1,
  //     maxFileSizeBytes: 2000000,
  //     path: {
  //       folderPath: "/uploads/" + uri,
  //     },
  //     onPreUpload(file: File) {
  //       if (validateFile(file.name))
  //         return {
  //           errorMessage:
  //             "Duplicate Filename: Please rename file on your device",
  //           transformedObject: file,
  //         };
  //       return;
  //     },
  //     mimeTypes: ["application/pdf", "text/plain"],
  //   } as UploadWidgetReactConfig;
  // };

  if (!session) return <div>Login to see page</div>;
  if (!Router.isReady && session) {
    return <div>Page is Loading...</div>;
  }
  // add single upload to localstorage via dispatch
  function updateUploads(
    uri: string,
    originalFileName: string,
    title: string,
    filetype: string,
    summary: null | string,
    owner: string
  ) {
    dispatch({
      type: "update_uploads",
      uri: uri,
      originalFileName: originalFileName,
      title: title,
      filetype: filetype,
      summary: summary,
    });
  }
  if (notespace)
    return (
  <NotesContext.Provider value={{notes:notes as any}}>
      <UpdateUploadsContext.Provider value={{ updateFunction: updateUploads }}>
        <SlugContext.Provider value={{ slug: slug }}>
          <div className="w-[100svw] h-[100svh]  bg-transparent grid grid-rows-1 ">
            <Header />

            <div className="w-[100svw] h-[10svh] border-b-slate-200 drop-shadow-lg  reverse-chat-background flex flex-row divide-x-2 ">
              <div
                className="basis-1/3 text-center text-black flex flex-row-2  "
                id="top_info"
              >
                <div className="span-1/4  my-auto mr-[1svw]  ml-[1svw] rounded-md mt-[3svh]">
                  <Link href="/notespace">
                    <RiHome2Fill className="w-[3svw] h-[5svh] fill-black/70" />
                  </Link>
                </div>
                <Textarea
                  spellCheck={false}
                  onBlur={(e) => updateTitle(e, slug)}
                  className="overflow-y-hidden bg-gradient-to-r from-zinc-400/50 to-cyan-400/50 text-sky-100 span-3/4 resize-none h-[6svh] my-auto mr-[2svw] text-start   text-4xl/10 font-bold border-none"
                  defaultValue={notespace.title}
                />
              </div>

              <div id="top_sources" className="basis-1/3  m-auto  ">
                <div className={"ml-[13svw]"}></div>
              </div>

              <div
                className="border-transparent border-l-2 basis-1/3 text-center flex flex-row-3 m-auto  rounded-xl mr-[2svw] pb-[1svh]"
                id="top_sources"
              >
                <div className="ml-[20svw] span-1/3   text-cyan-800    ">
                  <FaGear className="w-[4svw] h-[4svh] cursor-pointer fill-cyan-600/80" />
                </div>
                <div className=" span-1/3  text-cyan-800">
                  <FaShare className="w-[4svw] h-[4svh] cursor-pointer fill-cyan-600/80" />{" "}
                </div>

                <div className="span-1/3 " id="top_dash text-cyan-800">
                  <FaUserAlt className="w-[4svw] h-[4svh] cursor-pointer fill-cyan-600/80" />
                </div>
              </div>
            </div>
            <div className="w-[100svw] h-[90svh]">
              <ResizablePanelGroup direction="horizontal">
                <ResizablePanel>
                  <Suspense fallback={<div>loading...</div>}>
                    <DynamicChatWindow
                      messagesLoaded={messages}
                      title={notespace.title}
                      blurb={notespace.sources_blurb}
                      selected={selected}
                      slug={slug}
                      sources={JSON.parse(JSON.stringify(sources))}
                    >
                      <DynamicSourcesDrawer
                        slug={slug}
                        sources={JSON.parse(JSON.stringify(sources))}
                        isChild={isChild}
                        setIsChild={setIsChild}
                        dispatch={dispatch}
                        selected={selected}
                        uploadOpened={uploadOpened}
                        setUploadOpened={setUploadOpened}
                        inputRef={inputRef}
                        Router={Router}
                        fileContent={fileContent}
                        setFileContent={setFileContent}
                      />
                    </DynamicChatWindow>
                  </Suspense>
                </ResizablePanel>

                <ResizablePanel>
                  <Suspense>
                  <DynamicOutputArea
                    editorVisible={editorVisible}
                    setEditorVisible={setEditorVisible}
                  />
                  </Suspense>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </div>
        </SlugContext.Provider>
      </UpdateUploadsContext.Provider>
      </NotesContext.Provider>
    );

  return <div>Notespace doesn't exist</div>;
}
