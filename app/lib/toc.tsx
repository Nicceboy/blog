import { useEffect, useState } from "react";

export function TableOfContents() {
  // Get headings from the DOM after render
  const [headings, setHeadings] = useState<
    { id: string; text: string; level: number }[]
  >([]);

  useEffect(() => {
    const headingElements = document.querySelectorAll("h2, h3, h4, h5");

    const headingsData = Array.from(headingElements)
      .filter((heading) => heading.id !== "footnote-label")
      .map((heading) => ({
        id: heading.id,
        text: heading.textContent || "",
        level: parseInt(heading.tagName.charAt(1), 10),
      }));

    setHeadings(headingsData);
  }, []);

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault();
    const targetElement = document.getElementById(id);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      // Update URL without causing navigation
      globalThis.history.pushState(null, "", `#${id}`);
    }
  };

  if (headings.length === 0) return null;

  return (
    <nav className="dark:bg-darkest-dark block w-full mb-6 lg:float-right lg:ml-8 lg:mb-8 lg:w-64 max-h-[calc(100vh-8rem)] overflow-auto p-3 border border-gray-800 rounded-lg transition-all duration-300 ">
      {headings.length > 0
        ? (
          <>
            <h2 className="text-xl  font-semibold mb-2">Table of Contents</h2>
            <ul className="space-y-1">
              {headings.map((heading, i) => (
                <li
                  key={i}
                  style={{ paddingLeft: `${(heading.level - 1) * 0.75}rem` }}
                  className=""
                >
                  <a
                    href={`#${heading.id}`}
                    onClick={(e) => handleLinkClick(e, heading.id)}
                    className="text-xl text-red-my font-semibold hover:text-red-my-hover hover:underline"
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </>
        )
        : <div className="animate-pulse bg-gray-200 h-4 w-1/2 rounded"></div>}
    </nav>
  );
}

export default TableOfContents;
