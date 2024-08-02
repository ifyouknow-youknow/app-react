import React, { useEffect, useRef, useState } from "react";
import {
  coco_ChatSendMessage,
  coco_ChatSetup,
  randomString,
  removeDuplicatesByProperty,
} from "../Functions";
import { IoSend } from "react-icons/io5";
import "../STYLES/CocoAIChat.css";
import { HiMiniXMark } from "react-icons/hi2";

export function CocoAIChat({
  setToggle,
  instructions,
  subject,
  initialMessage,
}) {
  const [chat, setChat] = useState();
  const didRun = useRef(false);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "coco",
      message: initialMessage,
      date: new Date(),
      id: randomString(10),
    },
  ]);
  const chatBodyRef = useRef(null);
  //
  function formatMessage(message) {
    const formattedMessage = message.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
    return { __html: formattedMessage };
  }
  function onCocoSendMessage() {
    const message = document.querySelector("#tbMessage").value;
    if (message !== "") {
      setMessageText("");
      setMessages((prev) =>
        removeDuplicatesByProperty(
          [
            ...prev,
            {
              id: randomString(10),
              role: "user",
              message: message,
              date: new Date(),
            },
          ],
          "id"
        )
      );
      coco_ChatSendMessage(chat, message, (res) => {
        console.log(res);
        setMessages((prev) =>
          removeDuplicatesByProperty(
            [
              ...prev,
              {
                id: randomString(10),
                role: "coco",
                message: res,
                date: new Date(),
              },
            ],
            "id"
          )
        );
      });
    }
  }

  useEffect(() => {
    if (!didRun.current) {
      coco_ChatSetup(instructions, (thisChat) => {
        setChat(thisChat);
      });
      didRun.current = true;
    }
  }, []);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="chat-wrap jakarta fade-in">
      {/* TOP */}
      <div className="chat-top separate_h padding_sm">
        <div className="">
          <p className="no bold">Coco AI Assistant</p>
          <p className="no label">{subject} helper</p>
        </div>
        <div
          className="chat-close pointer"
          onClick={() => {
            setToggle(false);
          }}
        >
          <HiMiniXMark size={32} className="chat-close-icon" />
        </div>
      </div>
      {/* BODY */}
      <div className="chat-body gap_sm" ref={chatBodyRef}>
        {messages.map((message, m) => {
          return (
            <div
              className={`chat-message ${
                message.role === "coco" && "chat-coco"
              }`}
              key={m}
            >
              <p className="no">
                {message.message.split("\n").map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
              </p>
            </div>
          );
        })}
      </div>
      {/* BOTTOM */}
      <div className="side-by padding_sm">
        <input
          type="text"
          id="tbMessage"
          className="input-text"
          placeholder="Ask a question.."
          style={{ width: "100%", boxSizing: "border-box" }}
          value={messageText}
          onChange={(e) => {
            setMessageText(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onCocoSendMessage();
            }
          }}
        />
        <div
          className="chat-btn pointer"
          onClick={() => {
            onCocoSendMessage();
          }}
        >
          <IoSend size={22} color="#117DFA" />
        </div>
      </div>
    </div>
  );
}
