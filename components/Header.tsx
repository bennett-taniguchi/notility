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

export default function Header(): ReactElement {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (session) {
    return <div></div>;
  }

  return (
    <Menubar className="top-0 right-0 fixed w-[150px] ">
      <MenubarMenu>
        {session ? (
          <div className="text-xs">{session.user.email}</div>
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
          <MenubarTrigger onClick={() => signOut()}>Log Out</MenubarTrigger>
        ) : (
          <div></div>
        )}
      </MenubarMenu>
    </Menubar>
  );
}

// const isActive: (pathname: string) => boolean = (pathname) =>
//   router.pathname === pathname;

// const { data: session, status } = useSession();

// let left = (
//   <div className="left">
//     <Link href="/" legacyBehavior>
//       <a className="bold" data-active={isActive("/")}>
//         Feed
//       </a>
//     </Link>
//     <style jsx>{`
//       .bold {
//         font-weight: bold;
//       }

//       a {
//         text-decoration: none;
//         color: var(--geist-foreground);
//         display: inline-block;
//       }

//       .left a[data-active="true"] {
//         color: gray;
//       }

//       a + a {
//         margin-left: 1rem;
//       }
//     `}</style>
//   </div>
// );

// let right = <div></div>;

// if (status === "loading") {
//   left = (
//     <div className="left">
//       <Link href="/" legacyBehavior>
//         <a className="bold" data-active={isActive("/")}>
//           Feed
//         </a>
//       </Link>
//       <style jsx>{`
//         .bold {
//           font-weight: bold;
//         }

//         a {
//           text-decoration: none;
//           color: var(--geist-foreground);
//           display: inline-block;
//         }

//         .left a[data-active="true"] {
//           color: gray;
//         }

//         a + a {
//           margin-left: 1rem;
//         }
//       `}</style>
//     </div>
//   );
//   right = (
//     <div className="right">
//       <p>Validating session ...</p>
//       <style jsx>{`
//         .right {
//           margin-left: auto;
//         }
//       `}</style>
//     </div>
//   );
// }

// // everything below related to sign in and showing nav
// if (!session) {
//   right = (
//     <div className="right">
//       <Link href="/api/auth/signin" legacyBehavior>
//         <a data-active={isActive("/signup")}>Log in</a>
//       </Link>
//       <style jsx>{`
//         a {
//           text-decoration: none;
//           color: var(--geist-foreground);
//           display: inline-block;
//         }

//         a + a {
//           margin-left: 1rem;
//         }

//         .right {
//           margin-left: auto;
//         }

//         .right a {
//           border: 1px solid var(--geist-foreground);
//           padding: 0.5rem 1rem;
//           border-radius: 3px;
//         }
//       `}</style>
//     </div>
//   );
// }

// if (session) {
//   left = (
//     <div className="left">
//       <Link href="/" legacyBehavior>
//         <a className="bold" data-active={isActive("/")}>
//           Feed
//         </a>
//       </Link>
//       <Link href="/drafts" legacyBehavior>
//         <a data-active={isActive("/drafts")}>My drafts</a>
//       </Link>
//       <Link href="/notes/landing/" legacyBehavior>
//         <a data-active={isActive("/notes/landing/")}>My Notes</a>
//       </Link>

//       <style jsx>{`
//         .bold {
//           font-weight: bold;
//         }

//         a {
//           text-decoration: none;
//           color: var(--geist-foreground);
//           display: inline-block;
//         }

//         .left a[data-active="true"] {
//           color: gray;
//         }

//         a + a {
//           margin-left: 1rem;
//         }
//       `}</style>
//     </div>
//   );
//   right = (
//     <div className="right">
//       <p>
//         {session.user.name} ({session.user.email})
//       </p>
//       <Link href="/create" legacyBehavior>
//         <button>
//           <a>New post</a>
//         </button>
//       </Link>
//       <button onClick={() => signOut()}>
//         <a>Log out</a>
//       </button>
//       <style jsx>{`
//         a {
//           text-decoration: none;
//           color: var(--geist-foreground);
//           display: inline-block;
//         }

//         p {
//           display: inline-block;
//           font-size: 13px;
//           padding-right: 1rem;
//         }

//         a + a {
//           margin-left: 1rem;
//         }

//         .right {
//           margin-left: auto;
//         }

//         .right a {
//           border: 1px solid var(--geist-foreground);
//           padding: 0.5rem 1rem;
//           border-radius: 3px;
//         }

//         button {
//           border: none;
//         }
//       `}</style>
//     </div>
//   );
// }

// return (
//   <nav>
//     {left}
//     {right}
//     <style jsx>{`
//       nav {
//         display: flex;
//         padding: 2rem;
//         align-items: center;
//       }
//     `}</style>
//   </nav>
// );
