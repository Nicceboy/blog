"use client";

import { useEffect, useRef, useState } from "react";

type FootnotePosition = {
  id: string;
  content: string;
  top: number;
};

export function Sidenotes() {
  const [footnotePositions, setFootnotePositions] = useState<
    FootnotePosition[]
  >([]);
  const updateScheduledRef = useRef(false);
  const observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    // Only process footnotes when needed to prevent infinite loops
    const processFootnotes = () => {
      if (updateScheduledRef.current) return;
      updateScheduledRef.current = true;
      console.log("Processing footnotes...");

      // Wait for any DOM updates to settle
      setTimeout(() => {
        updateScheduledRef.current = false;
        const container = document.querySelector(".prose");
        if (!container) return;

        // Find all footnote references
        const footnoteRefs = document.querySelectorAll(
          '[id^="user-content-fnref-"]',
        );
        const footnotesSection = document.querySelector(".footnotes");
        if (!footnotesSection || footnoteRefs.length === 0) return;

        // Get footnote contents
        const footnoteItems = footnotesSection.querySelectorAll("li");
        const footnoteContents = new Map();

        footnoteItems.forEach((item) => {
          const id = item.id;
          const content = item.innerText;
          footnoteContents.set(id, content);
        });

        // Calculate positions
        const positions: FootnotePosition[] = [];
        const containerRect = container.getBoundingClientRect();

        footnoteRefs.forEach((ref) => {
          const link = ref as HTMLAnchorElement;
          const id = link.id.replace("fnref", "fn");
          const content = footnoteContents.get(id);

          if (content) {
            const rect = link.getBoundingClientRect();
            positions.push({
              id,
              content,
              top: rect.top - containerRect.top,
            });
          }
        });

        setFootnotePositions(positions);
      }, 100);
    };

    // Run once after component mounts
    processFootnotes();

    // Simple event listeners for window resize
    globalThis.addEventListener("resize", processFootnotes);
    globalThis.addEventListener("scroll", processFootnotes);

    // Simple mutation observer that runs less frequently
    observerRef.current = new MutationObserver(() => {
      processFootnotes();
    });

    const prose = document.querySelector(".prose");
    if (prose) {
      observerRef.current.observe(prose, {
        childList: true,
        subtree: true,
        attributes: false,
      });
    }

    return () => {
      globalThis.removeEventListener("resize", processFootnotes);
      globalThis.removeEventListener("scroll", processFootnotes);
      observerRef.current?.disconnect();
    };
  }, []);

  if (footnotePositions.length === 0) return null;
  // Calculate approximate line height for footnotes based on content
  const calculateFootnoteHeight = (content: string) => {
    // Estimate characters per line (assuming avg char width ~ 0.5em in 1rem font)
    const charsPerLine = Math.floor((25 * 16) / 8); // 25rem * 16px/rem / 8px per char (approx)

    // Count words and estimate total length
    const words = content.split(" ");
    let totalChars = 0;
    words.forEach((word) => {
      totalChars += word.length + 1; // +1 for the space
    });

    // Calculate approx lines needed
    const estimatedLines = Math.ceil(totalChars / charsPerLine);

    // Line height ~1.5em in typical text
    return estimatedLines * 1.5 * 16; // in pixels (1.5 * 16px per line)
  };

  return (
    <div className="hidden sidenotes-container lg:block absolute top-0 right-0 h-full pointer-events-none">
      {footnotePositions.map((footnote, index) => {
        // Calculate offset based on previous footnotes
        let offset = 0;
        if (index > 0) {
          const prevFootnote = footnotePositions[index - 1];
          const prevHeight = calculateFootnoteHeight(prevFootnote.content);
          // If current footnote is too close to previous one, add offset
          if (footnote.top - prevFootnote.top < prevHeight) {
            offset = prevHeight - (footnote.top - prevFootnote.top) + 16; // 16px extra spacing
          }
        }

        return (
          <div
            key={footnote.id}
            className="absolute left-full ml-6 max-w-[10rem] lg:max-w-[25rem] w-128 text-sm text-gray-500 p-3 pointer-events-auto"
            style={{
              top: `${footnote.top - 5 + offset}px`,
            }}
          >
            {footnote.content}
          </div>
        );
      })}
    </div>
  );
}
