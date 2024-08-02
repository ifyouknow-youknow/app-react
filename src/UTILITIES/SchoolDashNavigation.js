import "../STYLES/StudentDashNavigation.css";
import logo from "../IMAGES/logo-trans.png";
import { MdOutlineMenuOpen } from "react-icons/md";
import { AiOutlineBook } from "react-icons/ai";
import { useState } from "react";
import { auth_SignOut } from "../Firebase ";
import { useNavigate } from "react-router-dom";
import { FiLayers } from "react-icons/fi";
import { IoPeopleOutline } from "react-icons/io5";
import { HiOutlineReceiptPercent } from "react-icons/hi2";
import { RxDashboard } from "react-icons/rx";
import { MdOutlineArrowOutward } from "react-icons/md";

export function SchoolDashNavigation() {
  const navigate = useNavigate();
  const [toggleMenu, setToggleMenu] = useState(false);
  return (
    <div className="student-dash-nav">
      
      <div className="student-dash-logo">
        <img src={logo} />
      </div>
      <div
        className="student-burger"
        onClick={() => {
          setToggleMenu(true);
        }}
      >
        <MdOutlineMenuOpen className="student-burger-icon" />
      </div>
      <div className="student-dash-menu">
        <div
          className="student-dash-link pointer"
          onClick={() => {
            navigate("/schools/dashboard");
          }}
        >
          <RxDashboard className="student-dash-icon" />
          <p className="no">Dashboard</p>
        </div>
        <div
          className="student-dash-link pointer"
          onClick={() => {
            navigate("/schools/courses");
          }}
        >
          <FiLayers className="student-dash-icon" />
          <p className="no">Courses</p>
        </div>
        <div
          className="student-dash-link pointer"
          onClick={() => {
            navigate("/schools/students");
          }}
        >
          <IoPeopleOutline className="student-dash-icon" />
          <p className="no">Students</p>
        </div>
        <div
          className="student-dash-link pointer align-center"
          onClick={() => {
            auth_SignOut((success) => {
              if (success) {
                navigate("/schools/login");
              }
            });
          }}
        >
          <MdOutlineArrowOutward className="student-dash-icon red" />
          <p className="no red">sign out</p>
        </div>
      </div>

      {/*  */}
      {toggleMenu && (
        <div className="student-menu-body fade-in">
          <div className="student-menu-body-wrap">
            <br />
            <p
              className="no pointer student-menu-link"
              onClick={() => {
                navigate("/schools/dashboard");
                setToggleMenu(false);
              }}
            >
              Dashboard
            </p>
            <p
              className="no pointer student-menu-link"
              onClick={() => {
                navigate("/schools/courses");
                setToggleMenu(false);
              }}
            >
              Courses
            </p>
            <p
              className="no pointer student-menu-link"
              onClick={() => {
                navigate("/schools/students");
                setToggleMenu(false);
              }}
            >
              Students
            </p>
          </div>
          <div className="separate_h student-menu-bottom">
            <div
              onClick={() => {
                auth_SignOut((success) => {
                  if (success) {
                    navigate("/schools/login");
                  }
                });
              }}
            >
              <p className="no">
                <span className="red">sign out</span>
              </p>
            </div>
            <div
              onClick={() => {
                setToggleMenu(false);
              }}
            >
              <p className="no">close</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
