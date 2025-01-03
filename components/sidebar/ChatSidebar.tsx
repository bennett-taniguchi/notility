import { FaBoltLightning } from "react-icons/fa6";
import { CommandGroup, CommandItem } from "../ui/command";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { useState } from "react";
import Link from "next/link";
import { MinusCircledIcon } from "@radix-ui/react-icons";

export default function ChatSidebar({ Router, location, props }) {
  const [checkboxSelected, setCheckboxSelected] = useState<number[]>([]); // modal
  const [minusHover, setMinusHover] = useState(false);
  async function handleCheckboxClicked(e: React.SyntheticEvent) {
    const checked = (e.target as HTMLInputElement).getAttribute("data-state");

    if (checked == "checked") {
      let found = checkboxSelected.filter(
        (n) => n !== parseInt((e.target as HTMLInputElement).id)
      );
      setCheckboxSelected(found);
    } else {
      setCheckboxSelected([
        ...checkboxSelected,
        +(e.target as HTMLInputElement).id,
      ]);
    }
  }

  // main chat page
  async function handleNavChat() {
    if (location === "chat" && !Router.query) return;
    await Router.push("/chat");
  }

  // dynamically routed chat page
  async function handleNavAnalyzed(title: string) {
    // { pathname: `/notes/[slug]`, query: { slug: data.title } },
    //     undefined,
    //     { shallow: true }
    await Router.push(
      {
        pathname: `/chat/` + title,

        query: { slug: title },
      },
      undefined
    );
  }
  // takes current text (in first note) then
  //  chunks it
  //  split on paragraphs
  //  and then embeds it
  //  then upserts it
  async function handleLightningClick(content: any) {
    // const parsed = HTMLtoText(props.notes[0].content);
    // const chunks = chunkTextByMultiParagraphs(parsed);
    // const res = await embedChunks(chunks);
    // const upserted = await upsertVectors(res, chunks);
    // format:
    // 0: {embedding (1536) [.1232,...], index:0, object:"embedding"},

    setCheckboxSelected([]);
  }

  // for chosen notes
  const handleAnalyzeSubmit = async (e: React.SyntheticEvent) => {
    // call 2 in one: forall checkbox indices: do api calls on indices:
    // for(let i = 0; i< checkboxSelected.length; i++) {
    // }

    let chosen_contents = "";
    let chosen_titles = "";

    const textEncoder = new TextEncoder();

    for (let i = 0; i < checkboxSelected.length; i++) {
      chosen_contents =
        chosen_contents + "_" + props.notes[checkboxSelected[i]].content;
      if (textEncoder.encode(chosen_contents).length >= 200000000) {
        // err msg
        // end upload
        console.log("the file size is too large");
        return;
      }

      chosen_titles =
        chosen_titles + "_" + props.notes[checkboxSelected[i]].title;
    }
    const notes_contents = chosen_contents;
    const notes_titles = chosen_titles;

    await analyzeSubmission(notes_contents, notes_titles);
  };

  const analyzeSubmission = async (notes_contents, notes_titles) => {
    const body = { notes_contents, notes_titles };

    await fetch("/api/chat/analyze", {
      headers: { "Content-Type": "application/json" },
      method: "PUT",
      body: JSON.stringify(body),
    });
  };
 // Delete Clicked Note
 const deleteNotes = async (e: React.SyntheticEvent, title: string) => {
  e.preventDefault();
  const body = {title}
  const res = await fetch("/api/chat/delete/" , {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  

  await Router.push("/chat/");
};
   // for minus icon
   const handleMinusClick = (e: React.SyntheticEvent) => {
    let removedNote = props.notes[(e.target as HTMLElement).id];
    if (removedNote) {
      deleteNotes(e, removedNote.title);
    }
  };
  console.log(Router.asPath)
  return (
    <CommandGroup className="pb-[50px]">
      {/* Prompt Bar Component  (Chat) */}
      <Link href="/chat">
      <CommandItem
        onSelect={handleNavChat}
        className={
          location === "chat"
            ? "bg-emerald-100  drop-shadow-[5px_5px_5px_rgb(103,232,249,.5)] hover:drop-shadow-[5px_5px_5px_rgb(31,78,47,.5)] landingCard"
            : "bg-[rgba(177,218,74,0.81)] landingCard"
        }
      >
        <span className="text-md text-zinc-600 font-medium ">
          Chat with Notes 📖
        </span>
        <Dialog modal={true}>
          <DialogTrigger asChild>
            <div  onClick={handleLightningClick} className="item-end">
            <FaBoltLightning
             
              className="absolute right-5 stroke-zinc-600 stroke-[.5px] bottom-2 hover:stroke-zinc-200 hover:fill-yellow-400"
            />
            </div>
          </DialogTrigger>
          <DialogContent className="xl:max-w-[600px] xl:max-h-[500px] h-[500px] ">
            <DialogHeader>
              <DialogTitle>Analyze Notes</DialogTitle>
              <DialogDescription className="relative top-[10px]">
                Here you can choose which notes to use to create a chat channel
                where the AI deeply understands the uploaded content. You can
                also upload PDFs to be analyze here as well
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-rows-2 grid-flow-col gap-1 justify-items-center pt-[10px]">
              <div className=" ">
                <Label className="text-lg">Choose Notes to Analyze</Label>
              </div>
              <div className="relative top-[-120px] ">
                <ScrollArea
                  className="rounded-md  fixed h-[200px] w-[200px] overflow-y-auto  "
                  viewportRef={null}
                >
                  <div>
                    {props.notes.map((note, idx) => (
                      
                        <div key={idx}>
                          <Checkbox id={idx} onClick={handleCheckboxClicked} />
                          <Label className="pl-[5px] font-light text-md ">
                            {note.title}
                          </Label>
                        </div>
                      
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <div className=" ">
                <Label className="text-lg ">Upload a PDF</Label>
              </div>
              <div className="font-light text-md relative top-[-120px] ">
                coming soon
              </div>
            </div>
            <DialogFooter className="fixed bottom-10 right-10">
              {checkboxSelected.length != 0 ? (
                <DialogClose>
                  <Button type="submit" onClick={handleAnalyzeSubmit}>
                    Analyze
                  </Button>
                </DialogClose>
              ) : (
                <Button disabled type="submit">
                  Analyze
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CommandItem>
      </Link>
      <div>
        {props.analyzed.map((item,idx) => (
          <div key={idx}>
            <Link href={'/chat/'+item.title}>
            <CommandItem
              onSelect={(e) => handleNavAnalyzed(item.title)}
              className={
                decodeURIComponent(Router.asPath).includes(item.title) ?
                 "landingCard bg-emerald-200 mt-1 text-slate-600"
                :
                "landingCard bg-[rgba(177,218,74,0.2)] mt-1 text-slate-600"
              }
            >
              {item.title}
                  <span className="outline-none ">
                              <MinusCircledIcon
                                id={idx + ""}
                                onClick={handleMinusClick}
                                className="stroke-zinc-600 stroke-[.5px] right-5 position: absolute hover:stroke-zinc-200 scale-110 translate-y-[-.5rem]"
                                onMouseEnter={(e) => setMinusHover(true)}
                                onMouseLeave={(e) => setMinusHover(false)}
                              />
                            </span>
            </CommandItem>
            </Link>
          </div>
        ))}
      </div>
    </CommandGroup>
  );
}
