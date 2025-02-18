import Link from "next/link";
import { RiHome2Fill } from "react-icons/ri";
import { Textarea } from "../ui/textarea";
import { FaGear, FaShare } from "react-icons/fa6";
import { FaUserAlt } from "react-icons/fa";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import BubbledInput from "../ui/personal/BubbledInput";
import { RiPencilFill } from "react-icons/ri";
import { useContext, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
 import Image from 'next/image'
import { UserContext, SlugContext } from "../context/context";
import { signOut } from "next-auth/react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { useRouter } from "next/router";

export function UserPopover() {
    const {url,email} = useContext(UserContext)
    function handleSignout() {
        signOut({redirect:true,callbackUrl:'/'})
    }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="span-1/3 ml-[10px] cursor-pointer drop-shadow-xl    " id="top_dash text-cyan-800">
        <Image src={url} alt='User Profile Picture' height={42} width={42} className="rounded-full border-2 border-cyan-500 hover:brightness-90 3xl"/>
          
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h2 className="font-medium leading-none text-cyan-800">{email}</h2>
          
          </div>
           <div className="text-right"><Button onClick={()=>handleSignout()} className="rounded-full bg-slate-400 hover:bg-slate-600">Sign Out</Button></div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// not really a 'dialog' just a delete option
export function DeleteDialog({asText=false,title,ownerEmail,slug}) {
    const Router = useRouter()
 
    const {email} = useContext(UserContext)
    async function handleSubmit(Router,slug,email,ownerEmail) {
        
        if(email!=ownerEmail){
            console.log('Error user email is not the same as owner email')
            return;
        }
        let uri = slug
        try {
        
        const body = {uri}
            await fetch("/api/notespace/delete/", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
          
              });
            
        } catch(e) {
            console.log(e,'can\'t delete someone else\'s notespace')
        }
   
        
        Router.push('/notespace')
    }
return (
    <AlertDialog>
  <AlertDialogTrigger><div className="cursor-pointer hover:underline text-cyan-800">
        Delete
    </div></AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This will permanently delete this notespace: <i>{title}</i>
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={()=>handleSubmit(Router,slug,email,ownerEmail)}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
    
)

}
export function ShareDialog({asText=false}) {
  const [options, setOptions] = useState([]);
  const [visible, setVisible] = useState(false);
  let { slug } = useContext(SlugContext);
  const [permissionSelected, setPermissionSelected] = useState("");
  const [emails, setEmails] = useState([]);

  async function handleSubmit(slug) {
    let uri = slug;
    let level = 0;
    if (permissionSelected.toLocaleLowerCase() == "write") {
      level = 1;
    }

    const body = { level, uri, emails };
    if (permissionSelected != "" && emails.length > 0) {
      const res = await fetch("/api/supabase/permissions/upsert", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }
  }

  function emailValidator(str) {
    console.log(str);
    // only 1 @ in the right place
    // only 1 .
    // ends with tld
    let tld = [".com", ".net", ".org", ".co", ".us", ".gov", ".edu"];
    let extension = str.split("@").slice(-1)[0];
    console.log(extension);
    if (extension.split(".").length != 2) return false;

    extension = "." + extension.split(".").slice(-1);

    if (!str.includes("@") || extension.length != 2)
      if (!tld.includes(extension)) return false;

    let splitondot = str.split(".");

    if (splitondot.length != 2) return false;
    if (!tld.includes("." + splitondot[1])) return false;

    if (splitondot[0].length > 64) return false;
    if (splitondot[0].includes("/")) return false;
    if (splitondot[0].includes(" ")) return false;

    return true;
  }

  const inputValue = useRef(null) as any;
  useEffect(() => {
    if (inputValue && inputValue.current) {
      setEmails(inputValue.current.get());
      console.log(emails);
    }
  });
  return (
    <div>
      <div className=" span-1/3  text-cyan-800">
      {asText ? 
      <div 
      className="w-[40px] h-[20px] hover:cursor-pointer  hover:underline "
      onClick={() => setVisible(true)}
      >
        Share
        </div>
      :
      <FaShare
      onClick={() => setVisible(true)}
      className="w-[4svw] h-[4svh] cursor-pointer fill-cyan-600/80 hover:fill-cyan-600"
    /> 
      }
       
      </div>
      <Dialog modal={true} open={visible} onOpenChange={setVisible}>
        <DialogContent className="sm:max-w-[800px]  ">
          <DialogHeader>
            <DialogTitle>Share</DialogTitle>
            <DialogDescription>
              Share with others via email, enter valid email and press enter
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 items-center gap-4 -ml-[0svw]">
              <Label htmlFor="name" className="text-left">
                Email:
              </Label>
              <BubbledInput
                inputValue={inputValue}
                customInput={true}
                tagList={options}
                setTagList={setOptions}
                validator={emailValidator as any}
              />
            </div>
            <div className="mx-auto">
              <Label className="ml-[30px]">Select Permissions</Label>
              <Select onValueChange={setPermissionSelected}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Permissions</SelectLabel>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="write">Write</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              className="mx-auto"
              type="submit"
              onClick={() => handleSubmit(slug)}
            >
              Share
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
function OptionsPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="ml-[20svw] span-1/3   text-cyan-800    ">
          <FaGear className="w-[4svw] h-[4svh] cursor-pointer fill-cyan-600/80 hover:fill-cyan-600" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Options</h4>
            <p className="text-sm text-muted-foreground">
              Change settings related to this notespace.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Theme</Label>
              <Input
                id="width"
                defaultValue="100%"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxWidth">Export</Label>
              <Input
                id="maxWidth"
                defaultValue="300px"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="height">Change Default</Label>
              <Input
                id="height"
                defaultValue="25px"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxHeight">Other</Label>
              <Input
                id="maxHeight"
                defaultValue="none"
                className="col-span-2 h-8"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
export default function Headbar({ notespace, slug }) {
  async function updateTitle(e: any, slug: string) {
    const newTitle = e.target.value;
    const uri = slug;

    const body = { newTitle, uri };

    await fetch("/api/notespace/update/title", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  return (
    <div className="w-[100svw] h-[10svh] border-b-slate-200   flex flex-row divide-x-2 ">
      <div
        className="basis-1/3 text-center text-black flex flex-row-2  "
        id="top_info"
      >
        <div className="span-1/4  my-auto mr-[1svw]  ml-[1svw] rounded-md mt-[3svh]">
          <Link href="/notespace">
            <RiHome2Fill className="w-[3svw] h-[5svh] fill-black/70 hover:fill-black/80" />
          </Link>
        </div>
        <Textarea
          spellCheck={false}
          onBlur={(e) => updateTitle(e, slug)}
          className="whitespace-nowrap overflow-hidden bg-gradient-to-r  shadow-none    text-cyan-500/80 span-3/4 resize-none h-[6svh] my-auto mr-[2svw] text-start   text-4xl/10 font-bold border-none "
          defaultValue={notespace.title}
        />
      
      </div>
      
     
      <div id="top_sources" className="basis-1/3  m-auto  ">
        <div className={"ml-[13svw]"}></div>
      </div>

      <div
        className="mt-[3.5svh] border-transparent border-l-2 basis-1/3 text-center flex flex-row-3 m-auto  rounded-xl mr-[2svw] pb-[1svh]"
        id="top_sources"
      >
        <OptionsPopover />
        <ShareDialog />
        <UserPopover   />
      </div>
    </div>
  );
}
