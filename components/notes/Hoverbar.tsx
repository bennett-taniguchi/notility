import {
  FontBoldIcon,
  FontItalicIcon,
  UnderlineIcon,
  PaperPlaneIcon,
  Cross1Icon,
} from "@radix-ui/react-icons";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { title } from "process";
import { Button } from "../ui/button";
import { useState } from "react";

export default function Hoverbar({ saveNotes, deleteNotes }) {
  const [selected, setSelected] = useState<boolean[]>(Array(5).fill(false)); // state of button press
  // todo : split into separate functions for each but not now cuz im lazy
  function handleSelected(num: number) {
    selected[num] = !selected[num];
  }
  return (
    <ToggleGroup type="multiple" variant="outline">
      <ToggleGroupItem
        value="bold"
        aria-label="Toggle bold"
        className="[date-state]-1"
        onClick={() => handleSelected(0)}
      >
        <FontBoldIcon className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="italic"
        aria-label="Toggle italic"
        onClick={() => handleSelected(1)}
      >
        <FontItalicIcon className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="strikethrough"
        aria-label="Toggle strikethrough"
        onClick={() => handleSelected(2)}
      >
        <UnderlineIcon className="h-4 w-4" />
      </ToggleGroupItem>
      <Button
        variant="outline"
        value="paperplane"
        aria-label="Toggle paperplane"
        onClick={saveNotes}
        className=""
      >
        <PaperPlaneIcon className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        value="cross"
        aria-label="toggle cross"
        onClick={(e) => deleteNotes(e, title)}
        className="active:bg-zinc-400"
      >
        <Cross1Icon className="h-4 w-4" />
      </Button>
    </ToggleGroup>
  );
}
