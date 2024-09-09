import "../STYLES/StudentDashNavigation.css";
import logo from "../IMAGES/logo-trans.png";
import { MdOutlineMenuOpen } from "react-icons/md";
import { AiOutlineBook } from "react-icons/ai";
import { useState } from "react";
import { auth_SignOut } from "../Firebase ";
import { useNavigate } from "react-router-dom";
import { LuPencilLine } from "react-icons/lu";
import { IoDocumentTextOutline } from "react-icons/io5";
import { HiOutlineReceiptPercent } from "react-icons/hi2";
import { RxDashboard } from "react-icons/rx";
import { MdOutlineArrowOutward } from "react-icons/md";
import { SlNotebook } from "react-icons/sl";

export function StudentDashNavigation() {
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
            navigate("/student/dashboard");
          }}
        >
          <RxDashboard className="student-dash-icon" />
          <p className="no">Dashboard</p>
        </div>
        <div
          className="student-dash-link pointer"
          onClick={() => {
            navigate("/student/lessons");
          }}
        >
          <AiOutlineBook className="student-dash-icon" />
          <p className="no">Lessons</p>
        </div>
        <div
          className="student-dash-link pointer"
          onClick={() => {
            navigate("/student/notes");
          }}
        >
          <SlNotebook className="student-dash-icon" />
          <p className="no">Notes</p>
        </div>
        <div
          className="student-dash-link pointer"
          onClick={() => {
            navigate(`/student/homeworks`);
          }}
        >
          <LuPencilLine className="student-dash-icon" />
          <p className="no">Homeworks</p>
        </div>
        <div
          className="student-dash-link pointer"
          onClick={() => {
            navigate("/student/tests");
          }}
        >
          <IoDocumentTextOutline className="student-dash-icon" />
          <p className="no">Tests</p>
        </div>
        <div
          className="student-dash-link pointer"
          onClick={() => {
            navigate("/student/grades");
          }}
        >
          <HiOutlineReceiptPercent className="student-dash-icon" />
          <p className="no">Grades</p>
        </div>
        <div
          className="student-dash-link pointer"
          onClick={() => {
            auth_SignOut((success) => {
              if (success) {
                navigate("/student/login");
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
                navigate("/student/dashboard");
              }}
            >
              Dashboard
            </p>
            <p
              className="no pointer student-menu-link"
              onClick={() => {
                navigate("/student/lessons");
              }}
            >
              Lessons
            </p>
            <p
              className="no pointer student-menu-link"
              onClick={() => {
                navigate("/student/notes");
              }}
            >
              Notes
            </p>
            <p
              className="no pointer student-menu-link"
              onClick={() => {
                navigate("/student/homeworks");
              }}
            >
              Homeworks
            </p>
            <p
              className="no pointer student-menu-link"
              onClick={() => {
                navigate("/student/tests");
              }}
            >
              Tests
            </p>
            <p
              className="no pointer student-menu-link"
              onClick={() => {
                navigate("/student/grades");
              }}
            >
              Grades
            </p>
          </div>
          <div className="separate_h student-menu-bottom">
            <div
              onClick={() => {
                auth_SignOut((success) => {
                  if (success) {
                    navigate("/student/login");
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
