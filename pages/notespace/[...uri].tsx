import { useRouter } from "next/router";
import React, {
  Suspense,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

import { getSession, useSession } from "next-auth/react";
import { Message, Notespace, Upload } from "@prisma/client";

import prisma from "../../lib/prisma";
import { GetServerSideProps } from "next";
import Header from "../../components/Header";

import {
  NotesContext,
  UserContext,
  SlugContext,
  UpdateUploadsContext,
  CollapseContext,
} from "../../components/context/context";
import Headbar from "../../components/heading/Headbar";
import { buttonVariants } from "../../components/ui/button";

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
    },
  });

  const notes = await prisma.notes.findMany({
    where: {
      uri: uuid,
    },
  });

  const permission = await prisma.permissions.findMany({
    where: {
      uri: uuid,
      email: session.user.email,
    },
    select: {
      email: true,
    },
  });

  return {
    props: { notespace, sources, messages, notes, permission },
  };
};

type Props = {
  notespace: Notespace;
  sources: Upload[];
  messages: Message[];
  notes: string[];
  permission: Object[] | null;
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
export default function NotespacesPage({
  notespace,
  sources,
  messages,
  notes,
  permission,
}: Props) {
  const [collapseState, setCollapseState] = useState(''); 
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
    if (sources)
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

  if (!session) {
    return (
      <div className="text-center">
        Login to see page
        <div className=" mx-auto text-center">
          {" "}
          <Link
            style={{ backgroundColor: "cyan" }}
            href="/api/auth/signin"
            className={buttonVariants({ variant: "link", size: "sm" })}
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  if (permission!.length == 0 && session.user.email != notespace.owner) {
    // permissions dne or current user isnt the same as creator
    return (
      <div className="text-center">
        You are signed in however the owner of this notespace hasn't given you
        permission to access it
      </div>
    );
  }

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
  <CollapseContext.Provider value={{collapse:collapseState, setCollapse:setCollapseState as any}}>
      <UserContext.Provider
        value={{ url: session!.user.image, email: session!.user.email }}
      >
        <NotesContext.Provider value={{ notes: notes as any }}>
          <UpdateUploadsContext.Provider
            value={{ updateFunction: updateUploads }}
          >
            <SlugContext.Provider value={{ slug: slug }}>
              <div className="w-[100svw] h-[100svh]  bg-transparent grid grid-rows-1 ">

                <Header />
                <Headbar notespace={notespace} slug={slug} />

                <div className=" w-[100svw] h-[90svh] flex flex-row gap-6 py-[1svh] mx-auto  content-center justify-center">
                  <div>
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
                  </div>

                  <div>
                    <Suspense fallback={<div>loading...</div>}>
                    {collapseState !='output' ?
                       <DynamicOutputArea
                       editorVisible={editorVisible}
                       setEditorVisible={setEditorVisible}
                     />
                     :<div></div>
                  
                  }
                   
                    </Suspense>
                  </div>
                </div>
            
              </div>
            </SlugContext.Provider>
          </UpdateUploadsContext.Provider>
        </NotesContext.Provider>
      </UserContext.Provider>
      </CollapseContext.Provider>
    );

  return <div>Notespace doesn't exist</div>;
}

 
