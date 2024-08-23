import React, { useState } from "react";
import logo from "../IMAGES/logo-trans.png";
import "../STYLES/DashNavigation.css";
import { AiOutlineMenu } from "react-icons/ai";
import { BsStars } from "react-icons/bs";
import { CocoAIChat } from "./CocoAIChat";
import { useNavigate } from "react-router-dom";
import { PiSignOutBold } from "react-icons/pi";
import { auth_SignOut } from "../Firebase ";

export default function DashNavigation() {
  const [toggleCoco, setToggleCoco] = useState(false);
  const navigate = useNavigate();
  const instructions = `
  Your name is Coco, and you are an AI Assistant for helping SDGA members understand how to use the SDGA Dashboard. 
  SDGA stands for International Professional Groomers Association.
  These are the features that the SDGA Dashboard has in case they ask any question about any of these. If you do not know the answer, kindly let them know.
  If you are going to respond with a list, make sure to use new lines.
  Do not use **
  FEATURES:
  - Creating a new school account: 
  1. Navigate to the dashboard and click on the New School button. 
  2. Then fill out the required fields. It is optional to include a logo.
  3. When the form is submitted, the school will be receiving a temporary password to sign in. They can use the Forgot Password button to change their password.
  - Finding School information such as address, email, and additional information:
  1. Navigate to the SDGA dashboard.
  2. Select the school from the list.
  `;
  return (
    <div className="dash-nav">
      {toggleCoco && (
        <CocoAIChat
          instructions={instructions}
          subject={"SDGA Dashboard"}
          setToggle={setToggleCoco}
          initialMessage={
            "Hello, my name is Coco and I am here to help you with any questions about the SDGA Dashboard. Ask me any question such as how to create a new School account, or where to find the a specific school address."
          }
        />
      )}
      <div
        className="dash-nav-logo"
        onClick={() => {
          navigate("/SDGA/dashboard");
        }}
      >
        <img src={logo} alt="Pet Grooming Edu Logo" />
      </div>
      <div className="dash-nav-btns">
        <div
          className="dash-btn pointer"
          onClick={() => {
            setToggleCoco(true);
          }}
        >
          <BsStars className="dash-nav-btn-icon" />
        </div>
        <div className="dash-btn pointer" onClick={() => {
          auth_SignOut((success) => {
            if (success) {
              navigate("/SDGA")
            }
          })
        }}>
          <PiSignOutBold className="red dash-nav-btn-icon" />
        </div>
      </div>
    </div>
  );
}
