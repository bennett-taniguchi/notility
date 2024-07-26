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

  function handleBold() {
    if (!window.getSelection()) return;
    var selection = window.getSelection();
    console.log(window.getSelection()?.anchorNode?.parentNode);

    var selection_text = selection?.toString();

    console.log(selection?.anchorNode);
    console.log(selection?.focusNode);
    // How do I add a span around the selected text?
    //const parent = document.querySelectorAll("[id='bold_tag']").item(0);

    // Function to check if an element has a <b> tag with the ID "bold_tag"
    //   function hasBoldTagWithId(node) {
    //     // Traverse up the DOM tree to check for the <b> tag
    //     while (node) {
    //         if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'B' && node.id === 'bold_tag') {
    //             return true;
    //         }
    //         node = node.parentNode;
    //     }
    //     return false;
    // }

    var b = document.createElement("b");
    b.id = "bold_tag";
    b.textContent = selection_text;

    //console.log(selection_text);
    var range = selection?.getRangeAt(0);
    console.log(range?.commonAncestorContainer);
    range?.deleteContents();
    range?.insertNode(b);
  }
  return (
    <ToggleGroup type="multiple" variant="outline">
      <ToggleGroupItem
        value="bold"
        aria-label="Toggle bold"
        className="[date-state]-1"
        onClick={() => handleBold()}
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
