import React from "react";
import { useNavigate } from "react-router-dom";
import "../STYLES/Footer.css";

export default function SchoolFooter() {
  const navigate = useNavigate();
  return (
    <div className="footer">
      <div className="footer-wrap">
        <div className="footer-1">
          <h3 className="no">School Portal</h3>
          <br />
          <p className="no">
            The care and safety of the pets we work with is our passion, and
            helping groomers thrive is our dream. At SDGA, we support a diverse
            network of grooming schools, each with its unique name but united by
            a single mission: to teach driven individuals the art and skill of
            pet grooming. Our platform enables these schools to efficiently
            manage their students, monitor their progress, and ensure
            comprehensive learning. With our fully equipped dashboard, schools
            can configure capabilities, create message boards for communication,
            and issue licenses for student accounts. Join the largest Groomers
            Association, with members in 35 countries, and become part of a
            community dedicated to elevating the grooming profession.
          </p>
        </div>
        <div className="footer-2">
          <h3 className="no">Quick Links</h3>
          <br />
          <div
            className="footer-link pointer underline"
            onClick={() => {
              navigate("/student-docs");
            }}
          >
            <p className="no">Student Docs</p>
          </div>
          <div
            className="footer-link pointer underline"
            onClick={() => {
              navigate("/school-docs");
            }}
          >
            <p className="no">School Docs</p>
          </div>
          <div
            className="footer-link pointer underline"
            onClick={() => {
              navigate("/about");
            }}
          >
            <p className="no">About</p>
          </div>
          <div
            className="footer-link pointer underline"
            onClick={() => {
              navigate("/contact");
            }}
          >
            <p className="no">Contact</p>
          </div>
          {/* <div
            className="footer-link pointer underline"
            onClick={() => {
              navigate("/schools/login");
            }}
          >
            <p className="no">Log In</p>
          </div> */}
        </div>
        <div className="footer-3">
          <h3 className="no">Edu Portals</h3>
          <br />
          <div
            className="footer-link pointer underline"
            onClick={() => {
              navigate("/SDGA");
            }}
          >
            <p className="no">SDGA Inc.</p>
          </div>
          <div
            className="footer-link pointer underline"
            onClick={() => {
              navigate("/schools");
            }}
          >
            <p className="no">Schools</p>
          </div>
          <div
            className="footer-link pointer underline"
            onClick={() => {
              navigate("/");
            }}
          >
            <p className="no">Students</p>
          </div>
        </div>
      </div>
      {/*  */}
      <div className="footer-copy">
        <p className="no">
          &copy; Copyright International Professional Groomers Inc. 2024 All
          Rights Reserved.
        </p>
      </div>
    </div>
  );
}
