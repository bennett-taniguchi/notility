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

  async function createQuiz(str) {
    //   let oldTitle = title;
    //   const body = { newTitle, oldTitle, uri };
    //   await fetch("/api/notes/update/title", {
    //     method: "PATCH",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(body),
    //   });
    //   Router.push("/notespace/" + uri);
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
              New Quiz
            </Label>
            <Input
              id="name"
              onChange={(e) => setGuideTitle(e.currentTarget.value)}
              value={guideTitle}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-1 items-center gap-4 -ml-[0svw]">
            <Label htmlFor="name" className="text-left">
              Select Sources, Notes, or Topics
            </Label>
            <BubbledInput
              tagList={tagList}
              setTagList={setTagList}  
            />
          </div>

          <div className="grid grid-cols-1 items-center gap-4 -ml-[0svw]">
            <Label htmlFor="name" className="text-left text-gray-500">
              Describe what you want to be quizzed on (optional)
            </Label>
            <Textarea
              id="name"
              className="col-span-3 h-[20svh] resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            className="mx-auto"
            type="submit"
            onClick={() => createQuiz(guideTitle).then(() => setVisible(false))}
          >
            Generate Quiz
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    
  );
}
