// import HelloPost from "~/posts/hello.mdx";
import * as Run from "~/posts/run.mdx";
import { PostContainer } from "~/posts/container.tsx";
import Components from "../typography.tsx";
// import {
//   NavigationMenu,
//   NavigationMenuContent,
//   NavigationMenuIndicator,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
//   NavigationMenuTrigger,
//   NavigationMenuViewport,
// } from "~/components/navigation.tsx";

export function Post({ message }: { message: string }) {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <header className="flex flex-col items-center gap-9">
          <div className="w-[500px] max-w-[100vw] p-4">
            <h1 className="text-4xl text-red-my">
              This is an awesome blog!
            </h1>
          </div>
        </header>
        {
          /* <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink>Link</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu> */
        }
        <PostContainer meta={Run.metadata}>
          <Run.default components={Components} />
        </PostContainer>
      </div>
    </main>
  );
}
