import { useState } from "react";
import { Button } from "../../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../ui/dialog";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { Textarea } from "../../../ui/textarea";
import BubbledInput from "../../../ui/personal/BubbledInput";
 

// OutputQuiz will be another component, rendered within the OutputArea OutputTable
export default function GuideDialog({ visible, setVisible, uri, Router }) {
  const [guideTitle, setGuideTitle] = useState("");
  const [tagList, setTagList] = useState([]);
  const [content,setContent] = useState('')
  async function createQuiz(str) {
    let title = guideTitle
    let content = ''
    const body = { title, content, uri };

    await fetch("/api/notes/create_guide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(() => {
      setVisible(false);
    });
    Router.push("/notespace/" + uri);
  }
  return (
    <Dialog modal={true} open={visible} onOpenChange={setVisible}  >
      <DialogContent className="sm:max-w-[800px]  ">
        <DialogHeader>
          <DialogTitle>Create Quiz</DialogTitle>
          <DialogDescription>
            New Guide Name: <i>{guideTitle}</i>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 items-center gap-4 -ml-[0svw]">
            <Label htmlFor="name" className="text-left">
              New Guide
            </Label>
            <Input
              id="name"
              onChange={(e) => setGuideTitle(e.currentTarget.value)}
              value={guideTitle}
              className="col-span-3"
            />
          </div>

          {/* <div className="grid grid-cols-1 items-center gap-4 -ml-[0svw]">
            <Label htmlFor="name" className="text-left">
              Select Sources, Notes, or Topics
            </Label>
            <BubbledInput
              tagList={tagList}
              setTagList={setTagList}  
            />
          </div> */}

          <div className="grid grid-cols-1 items-center gap-4 -ml-[0svw]">
            <Label htmlFor="name" className="text-left text-gray-500">
              Describe what you want your guide to be about (Please give a hefty description)
            </Label>
            <Textarea
            value={content}
              id="name"
              className="col-span-3 h-[20svh] resize-none"
              onChange={(e) => setContent(e.currentTarget.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            className="mx-auto"
            type="submit"
            onClick={() => createQuiz(guideTitle).then(() => setVisible(false))}
          >
            Generate Guide
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    
  );
}
