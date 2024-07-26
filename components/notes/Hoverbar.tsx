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

  return <ToggleGroup type="multiple" variant="outline"></ToggleGroup>;
}
