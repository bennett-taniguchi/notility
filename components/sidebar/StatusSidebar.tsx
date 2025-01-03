import Link from "next/link";
import {
  Menubar,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "../ui/menubar";
import { signOut, useSession } from "next-auth/react";

export default function StatusSidebar() {
  const { data: session, status } = useSession();

  return (
    <Menubar className="bottom-0 fixed flex justify-center bg-gradient-to-r from-white to-emerald-300 to-30% shadow-inner w-[20vw] overflow-hidden border-0 rounded-none">
      <MenubarMenu>
        <div className="font-bold pr-2 landingCard ">
          <Link href="/">Notility</Link>
        </div>
      </MenubarMenu>
      <MenubarMenu>
        {session ? (
          <img className="rounded-full h-5 w-5" src={session.user.image} />
        ) : (
          <div></div>
        )}
      </MenubarMenu>
      <MenubarMenu>
        {session ? (
          <div className="w-[175px] pl-2">
            <span className="text-xs  truncate ...  block text-decoration-line: underline">
              {session.user.email}
            </span>
          </div>
        ) : (
          <div>
            {" "}
            <MenubarTrigger>
              <Link href="/api/auth/signin" legacyBehavior>
                Log In
              </Link>
            </MenubarTrigger>
          </div>
        )}
      </MenubarMenu>
      <MenubarSeparator />
      <MenubarMenu>
        {session ? (
          <MenubarTrigger
            onClick={() => signOut()}
            className="text-sm inline-block whitespace-nowrap  justify-self-end pr-2 landingCard  data-[state=open]:bg-transparent data-[state=closed]:bg-transparent p-1"
          >
            Log Out
          </MenubarTrigger>
        ) : (
          <div></div>
        )}
      </MenubarMenu>
    </Menubar>
  );
}
