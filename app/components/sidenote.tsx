"use client";

import { useEffect, useState } from "react";

type FootnotePosition = {
  id: string;
  content: string;
  top: number;
};

// Type for adjusted positions including calculated height and final top
type AdjustedFootnotePosition = FootnotePosition & {
  adjustedTop: number;
  height: number;
};

export function Sidenotes() {
  const [adjustedFootnotePositions, setAdjustedFootnotePositions] = useState<
    AdjustedFootnotePosition[]
  >([]);

  useEffect(() => {
    const processFootnotes = () => {
      const container = document.querySelector(".prose");
      if (!container) return;

      const footnoteRefs = document.querySelectorAll(
        '[id^="user-content-fnref-"]',
      );
      const footnotesSection = document.querySelector(".footnotes");
      if (!footnotesSection || footnoteRefs.length === 0) return;

      const footnoteItems = footnotesSection.querySelectorAll("li");
      const footnoteContents = new Map();

      footnoteItems.forEach((item) => {
        const id = item.id;
        const contentClone = item.cloneNode(true) as HTMLElement;

        // Remove the backlink (last link that points back to reference)
        // This is often added by Markdown processors.
        const backlink = contentClone.querySelector(".data-footnote-backref");
        if (backlink) {
          backlink.remove();
        } else {
          // Fallback: Try removing the last link if it looks like a backlink.
          const links = contentClone.querySelectorAll("a");
          if (links.length > 0) {
            const lastLink = links[links.length - 1];
            if (
              lastLink.getAttribute("href")?.includes("#fnref") ||
              lastLink.querySelector("svg") ||
              lastLink.textContent === "↩" ||
              lastLink.textContent === "↩︎" ||
              lastLink.textContent === "↵"
            ) {
              lastLink.remove();
            }
          }
        }

        const content = contentClone.innerHTML;
        footnoteContents.set(id, content);
      });

      const initialPositions: FootnotePosition[] = [];
      const containerRect = container.getBoundingClientRect();

      footnoteRefs.forEach((ref) => {
        const link = ref as HTMLAnchorElement;
        const id = link.id.replace("fnref", "fn");
        const content = footnoteContents.get(id);

        if (content) {
          const rect = link.getBoundingClientRect();
          initialPositions.push({
            id,
            content,
            top: rect.top - containerRect.top,
          });
        }
      });

      initialPositions.sort((a, b) => a.top - b.top);

      // Calculate adjusted positions to prevent overlap
      const adjustedPositions: AdjustedFootnotePosition[] = [];
      const spacing = 16; // Desired vertical space between footnotes (in px)
      const verticalOffset = -9; // Initial vertical offset for each footnote

      initialPositions.forEach((currentFootnote, index) => {
        const calculatedHeight = calculateFootnoteHeight(currentFootnote.content);
        let currentAdjustedTop = currentFootnote.top + verticalOffset;

        if (index > 0) {
          const prevAdjustedFootnote = adjustedPositions[index - 1];
          const prevBottom = prevAdjustedFootnote.adjustedTop + prevAdjustedFootnote.height + spacing;

          // If current footnote overlaps with the previous one, adjust its top
          if (currentAdjustedTop < prevBottom) {
            currentAdjustedTop = prevBottom;
          }
        }

        adjustedPositions.push({
          ...currentFootnote,
          adjustedTop: currentAdjustedTop,
          height: calculatedHeight,
        });
      });

      setAdjustedFootnotePositions(adjustedPositions);
    };

    // Wait for the page to fully render before processing footnotes
    if (document.readyState === "complete") {
      processFootnotes();
      return () => {};
    } else {
      self.addEventListener("load", processFootnotes);
      // Fallback timer in case 'load' event doesn't fire as expected
      const timer = setTimeout(processFootnotes, 1000);
      return () => {
        self.removeEventListener("load", processFootnotes);
        clearTimeout(timer);
      };
    }
  }, []);

  // Calculate approximate height for footnotes based on content and fixed width.
  // This is an estimation as actual rendering can vary.
  const calculateFootnoteHeight = (content: string) => {
    // Use the large screen max-width (lg:max-w-[25rem] -> 400px) for calculation
    const footnoteWidthPx = 25 * 16;
    // Account for padding (p-3 -> 0.75rem * 16px/rem = 12px each side)
    const contentWidthPx = footnoteWidthPx - 2 * 12;
    // Estimate characters per line (avg char width ~8px for text-sm)
    const avgCharWidthPx = 8;
    const charsPerLine = Math.floor(contentWidthPx / avgCharWidthPx);

    // Remove HTML tags for a more accurate character count of visible text
    const textOnly = content.replace(/<[^>]*>/g, "");
    const totalChars = textOnly.length;

    // Calculate approx lines needed (ensure at least 1 line)
    const estimatedLines = Math.ceil(totalChars / charsPerLine) || 1;

    // Line height for text-sm (leading-relaxed is ~1.625, using 1.5 for safety/simplicity)
    // text-sm is 14px, but using 16px base for rem calculation consistency.
    const lineHeightPx = 1.5 * 16;
    // Add vertical padding (p-3 -> 12px top + 12px bottom)
    const verticalPaddingPx = 2 * 12;

    return estimatedLines * lineHeightPx + verticalPaddingPx;
  };

  if (adjustedFootnotePositions.length === 0) return null;

  return (
    <div className="hidden sidenotes-container xl:block top-0 h-full pointer-events-none">
      {adjustedFootnotePositions.map((footnote, index) => {
        // Extract footnote number from id (e.g., user-content-fn-1 -> 1)
        const footnoteNumberMatch = footnote.id.match(/(\d+)$/);
        const footnoteNumber = footnoteNumberMatch ? footnoteNumberMatch[1] : index + 1;

        let finalContent = footnote.content;
        const supTag = `<sup>${footnoteNumber}</sup> `;

        // Prepend the superscript number, handling potential <p> tags at the start.
        if (finalContent.trim().startsWith("<p")) {
          const firstClosingBracketIndex = finalContent.indexOf(">");
          if (firstClosingBracketIndex !== -1) {
            finalContent = finalContent.slice(0, firstClosingBracketIndex + 1) +
                           supTag +
                           finalContent.slice(firstClosingBracketIndex + 1);
          } else {
            finalContent = supTag + finalContent; // Fallback for malformed <p>
          }
        } else {
          finalContent = supTag + finalContent;
        }

        return (
          <div
            key={footnote.id}
            className="absolute left-full ml-6 max-w-[10rem] lg:max-w-[25rem] w-128 text-sm dark:text-gray-500 p-3 pointer-events-auto"
            style={{
              top: `${footnote.adjustedTop}px`,
            }}
            dangerouslySetInnerHTML={{ __html: finalContent }}
          />
        );
      })}
    </div>
  );
}
