import React from "react";
import { useNavigate } from "react-router-dom";
import '../STYLES/Footer.css'

export default function Footer() {
  const navigate = useNavigate();
  return (
    <div className="footer">
      <div className="footer-wrap">
        <div className="footer-1">
          <h3 className="no">IPG Portal</h3>
          <br />
          <p className="no">
            The care and safety of the pets we work with is our passion, and
            helping groomers thrive is our dream. At IPG, we offer certification
            for groomers by groomers, allowing you to certify in the comfort of
            your own salon. Start your journey today and become part of the
            largest Groomers Association, with members in 35 countries. IPG
            educates and certifies groomers to ensure the safety of the pets in
            our care while enhancing and acknowledging our groomers' skills to
            elevate the grooming profession. Join the growing community of
            IPG-certified groomers in 35 countries and counting!
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
              navigate("/ipg/articles");
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
              navigate("/ipg/login");
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
              navigate("/ipg")
            }}
          >
            <p className="no">IPG Inc.</p>
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
          &copy; Copyright International Professional Groomers Inc. 2024 All
          Rights Reserved.
        </p>
      </div>
    </div>
  );
}
