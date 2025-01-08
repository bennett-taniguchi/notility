import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import {
  Menubar,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "./ui/menubar";
import { ReactElement } from "react-markdown/lib/react-markdown";
import { Button, buttonVariants } from "./ui/button";

export default function Header(): ReactElement {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (session) {
    return <div></div>;
  }

  return (
    <Menubar className="top-1/2 ">
      <MenubarMenu>
        <MenubarTrigger>
        <Link href='/api/auth/signin' className={buttonVariants({ variant: "link",size:'sm' })}>Log In</Link>

         
       
        </MenubarTrigger>
      </MenubarMenu>

      <MenubarSeparator />
      <MenubarMenu>
        {session ? (
          <MenubarTrigger onClick={() => signOut()}>Log Out</MenubarTrigger>
        ) : (
          <div></div>
        )}
      </MenubarMenu>
    </Menubar>
  );
}

 