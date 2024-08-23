import React from "react";
import { useNavigate } from "react-router-dom";
import '../STYLES/Footer.css'

export default function Footer() {
  const navigate = useNavigate();
  return (
    <div className="footer">
      <div className="footer-wrap">
        <div className="footer-1">
          <h3 className="no">SDGA Portal</h3>
          <br />
          <p className="no">
            San Diego Grooming Academy, founded in 2016 by Myke Ross, builds on a rich history of multi-platform entrepreneurship and a deep passion for animal care. With a focus on professional pet grooming, the academy offers a safe learning environment, combining curriculum-based lectures with hands-on training. It also supports ongoing industry development through workshops and community events. Myke’s drive for knowledge fuels his success, and he finds joy in helping others achieve their goals.
          </p>
        </div>
        <div className="footer-2">
          <h3 className="no">Quick Links</h3>
          <br />
          <div
            className="footer-link pointer underline"
            onClick={() => {
              navigate("/");
            }}
          >
            <p className="no">Main Site</p>
          </div>
          <div
            className="footer-link pointer underline"
            onClick={() => {
              navigate("/SDGA/articles");
            }}
          >
            <p className="no">Articles</p>
          </div>
          <div
            className="footer-link pointer underline"
            onClick={() => {
              navigate("/contact");
            }}
          >
            <p className="no">Contact</p>
          </div>
          <div
            className="footer-link pointer underline"
            onClick={() => {
              navigate("/SDGA/login");
            }}
          >
            <p className="no">Log In</p>
          </div>
        </div>
        <div className="footer-3">
          <h3 className="no">Edu Portals</h3>
          <br />
          <div
            className="footer-link pointer underline"
            onClick={() => {
              navigate("/SDGA")
            }}
          >
            <p className="no">SDGA</p>
          </div>
          <div
            className="footer-link pointer underline"
            onClick={() => {
              navigate("/schools")
            }}
          >
            <p className="no">Schools</p>
          </div>
          <div
            className="footer-link pointer underline"
            onClick={() => {
              navigate("/")
            }}
          >
            <p className="no">Students</p>
          </div>
        </div>
      </div>
      {/*  */}
      <div className="footer-copy">
        <p className="no">
          &copy; Copyright San Diego Grooming Academy. 2024 All
          Rights Reserved.
        </p>
      </div>
    </div>
  );
}
