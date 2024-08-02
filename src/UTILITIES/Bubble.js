import { useEffect, useState } from "react";

export function Bubble({ text, setToggle }) {
  useEffect(() => {
    setTimeout(() => {
      setToggle(false);
    }, 3000);
  }, []);

  return (
    <div className="bubble">
      <p className="no">{text}</p>
    </div>
  );
}
