import React from "react";
import "../STYLES/ActionButtons.css";
import { PrimaryButton } from "../COMPONENTS/PrimaryButton";
import { CancelButton } from "../COMPONENTS/CancelButton";
import { DestructiveButton } from "../COMPONENTS/DestructiveButton";

export default function ActionButtons({ message, buttons }) {
  return (
    <div className="action-btns">
      {/*  */}
      <div></div>
      <div className="action-btns-wrap">
        <h1 className="no">{message}</h1>
        <br />
        <div className="action-btns-flex">
          {buttons.map((btn, b) => {
            if (btn.Type === "primary") {
              return (
                <PrimaryButton key={b} text={btn.Text} onPress={btn.Func} />
              );
            } else if (btn.Type === "cancel") {
              return (
                <CancelButton key={b} text={btn.Text} onPress={btn.Func} />
              );
            } else if (btn.Type === "destructive") {
              return (
                <DestructiveButton key={b} text={btn.Text} onPress={btn.Func} />
              );
            }
          })}
        </div>
      </div>
      <div></div>
    </div>
  );
}
