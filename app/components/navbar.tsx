import { NavLink } from "react-router";

const getNavLinkClass = (isActive: boolean) =>
  `text-2xl hover:text-red-my transition-colors ${
    isActive ? "text-red-my font-semibold" : "text-gray-500"
  } block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground`;

export function Navbar() {
  return (
    <nav className="flex gap-6 sticky top-0 bg-black p-1 z-10">
      <NavLink
        to="/"
        end
        className={({ isActive }) => getNavLinkClass(isActive)}
      >
        /root
      </NavLink>
      <NavLink
        to="/posts"
        end
        className={({ isActive }) => getNavLinkClass(isActive)}
      >
        /posts
      </NavLink>
      <NavLink
        to="/about"
        className={({ isActive }) => getNavLinkClass(isActive)}
      >
        /about
      </NavLink>
    </nav>
  );
}
