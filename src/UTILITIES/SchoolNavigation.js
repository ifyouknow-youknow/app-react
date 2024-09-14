import React, { useState } from "react";
import logo from "../IMAGES/logo-trans.png";
import "../STYLES/Navigation.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { HiOutlineXMark } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { MdArrowOutward } from "react-icons/md";

export default function SchoolNavigation() {
  const navigate = useNavigate();
  const [toggleNavBody, setToggleNavBody] = useState(false);
  return (
    <div className="jakarta nav">
      <div className="nav-top">
        <div
          className="logo pointer"
          onClick={() => {
            navigate("/schools");
          }}
        >
          <img src={logo} alt="Pet Gromming Edu Logo" className="logo-img" />
        </div>
        <div className="right">
          <div className="nav-links">
            <div className="nav-link pointer" onClick={() => {
              navigate("/school-docs")
            }}>
              <p className="no">Documentation</p>
            </div>
            <div className="nav-link pointer" onClick={() => {
              navigate("/contact")
            }}>
              <p className="no">Contact</p>
            </div>
            <div className="nav-link login pointer" onClick={() => {
              navigate("/schools/login")
            }}>
              <p className="no">Log In</p>
            </div>
          </div>
          <div
            className="burger pointer"
            onClick={() => {
              setToggleNavBody(true);
            }}
          >
            <GiHamburgerMenu className="burger-icon" />
          </div>
        </div>
      </div>

      {/* NAV BODY */}
      {toggleNavBody && (
        <div className="nav-body fade-in">
          <div className="nav-body-top">
            <div
              className="nav-body-logo pointer"
              onClick={() => {
                navigate("/schools");
              }}
            >
              <img src={logo} alt="Pet Groomers Edu Logo" />
            </div>
            <div
              className="nav-body-close pointer"
              onClick={() => {
                setToggleNavBody(false);
              }}
            >
              <HiOutlineXMark className="nav-body-close-icon" />
            </div>
          </div>
          <div className="nav-body-middle">
            <div className="nav-body-link" onClick={() => {
              setToggleNavBody(false)
              navigate("/schools")
            }}>
              <p className="no">Home</p>
              <MdArrowOutward className="nav-body-link-icon" />
            </div>
            <div className="nav-body-link" onClick={() => {
              setToggleNavBody(false)
              navigate("/schools/docs")
            }}>
              <p className="no">Documentation</p>
              <MdArrowOutward className="nav-body-link-icon" />
            </div>
            <div className="nav-body-link" onClick={() => {
              setToggleNavBody(false)
              navigate("/contact")
            }}>
              <p className="no">Contact</p>
              <MdArrowOutward className="nav-body-link-icon" />
            </div>
            <div className="nav-body-link login" onClick={() => {
              setToggleNavBody(false)
              navigate("/schools/login")
            }}>
              <p className="no">Login</p>
              <MdArrowOutward className="nav-body-link-icon" />
            </div>
          </div>
          <div className="nav-body-bottom">
            <p className="no text-center">&copy; Copyright International Professional Groomers Inc. 2024 All Rights Reserved.</p>
          </div>
        </div>
      )}
    </div>
  );
}
