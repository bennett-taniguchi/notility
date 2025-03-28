import { useContext, useState } from "react";
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
import { SlugContext } from "../../../context/context";
import { Popover, PopoverContent, PopoverTrigger } from "../../../ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../../../ui/command";
import { cn } from "../../../lib/utils";
import { toast } from "../../../../hooks/use-toast";
 
 

// OutputQuiz will be another component, rendered within the OutputArea OutputTable
export default function QuizDialog({ visible, setVisible, uri, Router }) {
  const [quizTitle, setQuizTitle] = useState("");
  const [tagList, setTagList] = useState([]);
  const [prompt,setPrompt] = useState('')
  const [amount,setAmount] = useState(10)


  async function createQuiz() {
 
    let notes_selected = 'n_a'
    let title = quizTitle
    let body = {prompt,uri,amount,notes_selected,title}
    if(!title || !prompt ) {

      toast({
        title:'Error: Please Provide a title or prompt',
        description:'Make sure both fields are filled out'
      })

      return;
    }

    if(amount < 5 || amount > 20 ) {

      toast({
        title:'Error: Please Change amount of specified questions',
        description:'Amount of questions must be 5 or greater AND less than 21'
      })
      return;
    }


    const res = await fetch('/api/quiz/create', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    })
    const data = await res.json()
    Router.push('/notespace/'+uri)
    console.log(data)
 
  }
  return (
    <Dialog modal={true} open={visible} onOpenChange={setVisible}  >
      <DialogContent className="sm:max-w-[800px]  ">
        <DialogHeader>
          <DialogTitle>Create Quiz</DialogTitle>
          <DialogDescription>
            <i>{quizTitle}<span className="text-white select-none">.</span></i>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 items-center gap-4 -ml-[0svw]">
            <Label htmlFor="name" className="text-left">
             Title:
            </Label>
            <Input
              id="name"
              onChange={(e) => setQuizTitle(e.currentTarget.value)}
              value={quizTitle}
              className="col-span-3"
            />
          </div>

          <div className="flex flex-col">
          <Label htmlFor="amount" className="text-left">
              Amount of Questions (5 to 20)
            </Label>

            <Input
              id="amount"
              onKeyDown={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }

                
              }}
              onChange={(e) => setAmount(Number(e.currentTarget.value))}
              value={amount}
              className="col-span-3 w-[50px] mt-[5px]"
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
              Describe what you want to be quizzed on  
            </Label>
            <Textarea
              id="name"
              onChange={(e) => setPrompt((e.currentTarget.value))}
              className="col-span-3 h-[20svh] resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            className="mx-auto"
            type="submit"
            onClick={() => createQuiz().then(() => setVisible(false))}
          >
            Generate Quiz
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    
  );
}
