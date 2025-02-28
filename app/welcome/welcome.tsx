// import HelloPost from "~/posts/hello.mdx";
import React, { useState } from "react";
import * as Run from "~/posts/run.mdx";
import { PostContainer } from "~/posts/container.tsx";
import Components from "../typography.tsx";
import { NavigationMenuDemo } from "./navtes.tsx";
import { Link, NavLink } from "react-router";

const getNavLinkClass = (isActive: boolean) =>
  `text-2xl hover:text-red-my transition-colors ${
    isActive ? "text-red-my font-semibold" : "text-gray-500"
  } block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground`;

export function Post({ message }: { message: string }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };
  return (
    <main className="flex items-center justify-center pt-16 ">
      <div className="flex-1 flex flex-col items-center gap-6 min-h-0">
        <header className="flex flex-col items-center gap-9">
          <nav className="flex gap-6 sticky top-0 bg-black p-1 z-10 ">
            <NavLink
              to="/"
              end
              className={({ isActive }) => getNavLinkClass(isActive)}
            >
              /home
            </NavLink>
            <NavLink
              to="/trending"
              end
              className={({ isActive }) => getNavLinkClass(isActive)}
            >
              /blog
            </NavLink>
            <NavLink
              to="/concerts"
              className={({ isActive }) => getNavLinkClass(isActive)}
            >
              /about
            </NavLink>
          </nav>
        </header>
        <div className={`${isFlipped ? "rotate-x-180" : ""}`}>
          <PostContainer meta={Run.metadata}>
            <Run.default components={Components} />
          </PostContainer>
        </div>
      </div>
    </main>
  );
}
