import { useState } from "react";

export function Accordion({ top, bottom }) {
  const [toggle, setToggle] = useState(false);
  return (
    <div>
      <div
        className="pointer"
        onClick={() => {
          setToggle((prev) => !prev);
        }}
      >
        {top}
      </div>
      {toggle && <div>{bottom}</div>}
    </div>
  );
}
