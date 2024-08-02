import { useEffect, useState } from "react";

export function TypeWriter({ text, classes }) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (text !== undefined && currentIndex < text.length) {
      const timeout = setTimeout(() => {
        let nextChar = text[currentIndex];

        // Handle newline characters
        if (nextChar === "\n") {
          setDisplayText((prevText) => prevText + "<br />");
        } else {
          setDisplayText((prevText) => prevText + nextChar);
        }

        setCurrentIndex(currentIndex + 1);
      }, 15); // Typing speed in milliseconds (adjust as needed)

      return () => clearTimeout(timeout);
    }
  }, [text, currentIndex]);

  return (
    <span
      className={classes}
      dangerouslySetInnerHTML={{ __html: displayText }}
    />
  );
}
