"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

// Type for holding footnote data throughout the process
type FootnoteData = {
  id: string; // e.g., user-content-fn-1
  content: string;
  top: number; // Initial top based on ref marker's position
  height?: number; // Measured height of the rendered sidenote
  adjustedTop?: number; // Final calculated top position after overlap adjustment
};

function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<F>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => func(...args), waitFor);
  };

  // Add a cancel method to the debounced function
  debounced.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced;
}

export function Sidenotes() {
  const [sidenoteData, setSidenoteData] = useState<FootnoteData[]>([]);
  const sidenoteRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<Element | null>(null); // Ref for the .prose container

  const debouncedProcessFootnotes = useCallback(
    debounce(() => {
      // Ensure this runs only in the browser
      if (typeof globalThis.document === "undefined") return;

      const container = containerRef.current; // Use the stored ref
      if (!container) return;

      const footnoteRefs = document.querySelectorAll<HTMLAnchorElement>(
        '[id^="user-content-fnref-"]',
      );
      const footnotesSection = document.querySelector(".footnotes");

      if (!footnotesSection || footnoteRefs.length === 0) {
        // If footnotes disappear dynamically, clear the state
        if (sidenoteData.length > 0) setSidenoteData([]);
        return;
      }

      const footnoteItems = footnotesSection.querySelectorAll("li");
      const footnoteContents = new Map<string, string>();
      footnoteItems.forEach((item) => {
        const id = item.id;
        if (!id) return;
        const contentClone = item.cloneNode(true) as HTMLElement;
        const backlink = contentClone.querySelector(
          'a[data-footnote-backref], a[href^="#user-content-fnref"]',
        );
        backlink?.remove();
        const paragraph = contentClone.querySelector("p");
        footnoteContents.set(
          id,
          paragraph?.innerHTML || contentClone.innerHTML,
        );
      });

      const initialData: FootnoteData[] = [];
      const containerRect = container.getBoundingClientRect();
      const scrollY = globalThis.scrollY || globalThis.pageYOffset;

      footnoteRefs.forEach((refLink) => {
        const match = refLink.id.match(/^user-content-fnref-(.*)$/);
        if (!match) return;
        const fnIdentifier = match[1];
        const footnoteId = `user-content-fn-${fnIdentifier}`;
        const content = footnoteContents.get(footnoteId);

        if (content) {
          const rect = refLink.getBoundingClientRect();
          const topRelativeToContainer = rect.top + scrollY -
            (containerRect.top + scrollY);
          initialData.push({
            id: footnoteId,
            content,
            top: topRelativeToContainer,
          });
        }
      });

      initialData.sort((a, b) => a.top - b.top);

      // Only update state if the calculated positions or number of notes actually changed
      // Compare based on IDs and initial top positions
      const hasChanged = sidenoteData.length !== initialData.length ||
        sidenoteData.some((sd, i) =>
          sd.id !== initialData[i]?.id || sd.top !== initialData[i]?.top
        );

      if (hasChanged) {
        sidenoteRefs.current = initialData.map(() => null);
        // Reset adjustedTop and height when recalculating initial positions
        setSidenoteData(
          initialData.map((d) => ({
            ...d,
            adjustedTop: undefined,
            height: undefined,
          })),
        );
      }
    }, 300), // Debounce time (e.g., 300ms)
    [sidenoteData], // Recreate debounce function if sidenoteData changes structure (though comparison inside handles data changes)
  );

  // Effect 1: Find container, set up observers, initial calculation
  useEffect(() => {
    // Ensure this runs only in the browser
    if (typeof globalThis.document === "undefined") return;

    containerRef.current = document.querySelector(".prose");
    const container = containerRef.current;

    if (!container) {
      console.warn("Sidenotes: '.prose' container not found.");
      return;
    }

    // Initial calculation
    debouncedProcessFootnotes();

    // Observe container size changes (catches image loads, etc.)
    const resizeObserver = new ResizeObserver(() => {
      debouncedProcessFootnotes();
    });
    resizeObserver.observe(container);

    // Optional: Recalculate on scroll as well, if needed
    // const handleScroll = () => debouncedProcessFootnotes();
    // globalThis.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      resizeObserver.disconnect();
      // globalThis.removeEventListener('scroll', handleScroll);
      debouncedProcessFootnotes.cancel(); // Cancel any pending debounced calls
    };
  }, [debouncedProcessFootnotes]); // Dependency array includes the debounced function

  // Effect 2: Measure and adjust positions (remains largely the same)
  useLayoutEffect(() => {
    // Only run if we have initial data and haven't calculated adjusted positions yet
    // OR if the initial top positions have changed (signalling a recalculation trigger)
    const needsAdjustment = sidenoteData.length > 0 &&
      sidenoteData.some((d) => d.adjustedTop === undefined);

    if (!needsAdjustment) {
      return;
    }

    const adjustedPositions: FootnoteData[] = [];
    const spacing = 16;
    const verticalOffset = -9;
    let needsStateUpdate = false;

    sidenoteData.forEach((currentSidenote, index) => {
      const element = sidenoteRefs.current[index];
      if (!element) {
        adjustedPositions.push({ ...currentSidenote });
        console.warn(`Sidenote element ref missing for ${currentSidenote.id}`);
        // Don't set needsStateUpdate here, wait for ref
        return;
      }

      const measuredHeight = element.offsetHeight;
      if (measuredHeight === 0 && element.offsetParent !== null) { // Check if it's actually rendered but maybe display:none?
        adjustedPositions.push({ ...currentSidenote });
        console.warn(
          `Sidenote element has zero height for ${currentSidenote.id}. Deferring adjustment.`,
        );
        // Don't set needsStateUpdate here, wait for height
        return;
      }

      let currentAdjustedTop = currentSidenote.top + verticalOffset;

      if (index > 0) {
        const prevAdjustedSidenote = adjustedPositions[index - 1];
        if (
          prevAdjustedSidenote.adjustedTop !== undefined &&
          prevAdjustedSidenote.height !== undefined
        ) {
          const prevBottom = prevAdjustedSidenote.adjustedTop +
            prevAdjustedSidenote.height + spacing;
          if (currentAdjustedTop < prevBottom) {
            currentAdjustedTop = prevBottom;
          }
        } else {
          // Previous element wasn't ready, cannot adjust based on it yet.
          // Keep current calculation, it might get fixed in a subsequent run.
        }
      }

      // Check if measured height or calculated top differs from current state
      if (
        currentSidenote.height !== measuredHeight ||
        currentSidenote.adjustedTop !== currentAdjustedTop
      ) {
        needsStateUpdate = true;
      }

      adjustedPositions.push({
        ...currentSidenote,
        height: measuredHeight,
        adjustedTop: currentAdjustedTop,
      });
    });

    // Update state only if heights were measured or positions were adjusted
    if (needsStateUpdate) {
      // Avoid infinite loops: only update if the data actually changed significantly
      const significantChange = sidenoteData.some((sd, i) =>
        sd.height !== adjustedPositions[i]?.height ||
        sd.adjustedTop !== adjustedPositions[i]?.adjustedTop
      );
      if (significantChange) {
        setSidenoteData(adjustedPositions);
      }
    }
  }, [sidenoteData]); // Re-run when sidenoteData changes

  // Render the sidenotes
  if (sidenoteData.length === 0) return null;

  return (
    <div className="hidden sidenotes-container xl:block top-0 h-full pointer-events-none">
      {sidenoteData.map((footnote, index) => {
        const footnoteNumberMatch = footnote.id.match(/(\d+)$/);
        const footnoteNumber = footnoteNumberMatch
          ? footnoteNumberMatch[1]
          : index + 1;
        let finalContent = footnote.content || "";
        const supTag = `<sup>${footnoteNumber}</sup> `;
        if (finalContent.trim().startsWith("<p")) {
          const firstClosingBracketIndex = finalContent.indexOf(">");
          if (firstClosingBracketIndex !== -1) {
            finalContent = finalContent.slice(0, firstClosingBracketIndex + 1) +
              supTag + finalContent.slice(firstClosingBracketIndex + 1);
          } else {
            finalContent = supTag + finalContent;
          }
        } else {
          finalContent = supTag + finalContent;
        }
        const topPosition = footnote.adjustedTop ?? footnote.top; // Use initial top as fallback before adjustment
        const isPositioned = footnote.adjustedTop !== undefined;

        return (
          <div
            key={footnote.id}
            ref={(el) => {
              sidenoteRefs.current[index] = el;
            }}
            className="bg-warm-white dark:bg-darkest-dark rounded-xl absolute left-full ml-6 max-w-[10rem] lg:max-w-[25rem] w-128 text-sm dark:text-gray-400 p-3 pointer-events-auto transition-opacity duration-300"
            style={{
              top: `${topPosition}px`,
              opacity: isPositioned ? 1 : 0,
            }}
            dangerouslySetInnerHTML={{ __html: finalContent }}
          />
        );
      })}
    </div>
  );
}
