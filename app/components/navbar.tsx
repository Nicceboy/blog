import { NavLink } from "react-router";

const getNavLinkClass = (isActive: boolean) =>
  `text-2xl hover:text-red-my transition-colors ${
    isActive ? "text-red-my font-semibold" : "text-gray-800 dark:text-gray-500"
  } block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground`;

export function Navbar() {
  return (
    <nav className="w-full flex lg:flex-col items-left sticky top-0 bg-white dark:bg-black p-1 lg:pl-[4em] z-10">
      <NavLink
        to="/"
        end
        className={({ isActive }) => getNavLinkClass(isActive)}
      >
        /root
      </NavLink>
      <NavLink
        to="/about"
        className={({ isActive }) => getNavLinkClass(isActive)}
      >
        /about
      </NavLink>

      {/* Add theme toggle at the end with ml-auto to push it to the right */}
    </nav>
  );
}
