import { NavLink } from "react-router";
import { HouseSimple, Moon, Sun, User } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

const getNavLinkClass = (isActive: boolean) =>
  `text-2xl hover:text-red-my transition-colors ${isActive
      ? "text-red-my font-semibold"
      : "text-gray-800 dark:text-gray-500"
    // Use focus-visible: for ring styles
  } block select-none space-y-1 rounded-md lg:py-3 px-[1rem] leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-2 focus-visible:ring-red-my focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900`;

const getButtonClass = () =>
  // Use focus-visible: for ring styles
  `text-2xl text-gray-800 dark:text-gray-500 hover:text-red-my transition-colors block select-none space-y-1 rounded-md lg:py-3 px-[1rem] leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-2 focus-visible:ring-red-my focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900`;

export function Navbar() {
  // Initialize state based on localStorage first, then the HTML class as fallback
  const [theme, setTheme] = useState(() => {
    // Default theme if window is not available (SSR)
    let initialTheme = "light";

    if (typeof window !== "undefined") {
      // First check localStorage
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark" || savedTheme === "light") {
        return savedTheme;
      }

      // If no localStorage value, check the HTML class
      if (document.documentElement.classList.contains("dark")) {
        initialTheme = "dark";
      }
    }

    return initialTheme;
  });

  // Effect to update localStorage and HTML class when theme changes (e.g., on toggle)
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem("theme", theme);
    } catch (error) {
      console.error("Failed to save theme to localStorage", error);
    }
  }, [theme]); // Dependency array ensures this runs when theme changes

  const toggleTheme = () => {
    setTheme((prevTheme) => prevTheme === "dark" ? "light" : "dark");
  };

  return (
    <nav className="w-full flex lg:flex-col items-left sticky top-0 lg:pl-[calc(6rem+2px)] z-10">
      <NavLink
        to="/"
        end
        className={({ isActive }) => getNavLinkClass(isActive)}
        title="Home"
        tabIndex={0}
      >
        <HouseSimple weight="thin" aria-label="Home" size="2rem" />
      </NavLink>
      {
        /* <NavLink
        to="/about"
        className={({ isActive }) => getNavLinkClass(isActive)}
        title="About this site"
        tabIndex={0}
      >
        <User weight="thin" aria-label="About" size="2rem"></User>
      </NavLink> */
      }

      <button
        type="button"
        onClick={toggleTheme}
        // The className now correctly includes focus-visible ring styles via getButtonClass()
        className={`${getButtonClass()} cursor-pointer`}
        title="Toggle theme"
        tabIndex={0}
        aria-label={theme === "dark"
          ? "Switch to light mode"
          : "Switch to dark mode"}
      >
        {theme === "dark"
          ? <Sun weight="thin" size="2rem" aria-hidden="true" />
          : <Moon weight="thin" size="2rem" aria-hidden="true" />}
      </button>
    </nav>
  );
}
