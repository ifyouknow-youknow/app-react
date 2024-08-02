import React from "react";
import Navigation from "./UTILITIES/Navigation";
import Footer from "./UTILITIES/Footer";
import "./STYLES/Login.css";
import {
  auth_ResetPasword,
  auth_SignIn,
  firebase_GetDocument,
} from "./Firebase ";
import { useNavigate } from "react-router-dom";

export function Login() {
  const navigate = useNavigate();

  function onSignIn() {
    const email = document.querySelector("#tbEmail").value;
    const password = document.querySelector("#tbPassword").value;
    auth_SignIn(
      email,
      password,
      (user) => {
        console.log(user);
        firebase_GetDocument("Users", user.uid, (person) => {
          console.log(person);
          if (person.Role === "IPG") {
            navigate("/ipg/dashboard");
          } else {
            alert("This account is not authorized to use this portal.");
          }
        });
      },
      (error) => {
        if (error !== "") {
          alert(error);
        }
      }
    );
  }
  return (
    <div className="main jakarta">
      <Navigation />
      <div className="login-main">
        <div></div>
        <div className="login-form">
          <h3 className="green no text-center">IPG</h3>
          <h1 className="no">Login</h1>
          <br />
          <input
            id="tbEmail"
            type="text"
            className="login-input"
            placeholder="jdoe@gmail.com"
          />
          <input
            id="tbPassword"
            type="password"
            className="login-input"
            placeholder="********"
          />
          <button
            className="login-btn pointer"
            onClick={() => {
              onSignIn();
            }}
          >
            Log In
          </button>
          <br />
          <p
            className="no underline login-forgot pointer"
            onClick={() => {
              const email = document.querySelector("#tbEmail").value;
              console.log(email);
              auth_ResetPasword(email, (success) => {
                if (success) {
                  alert(
                    "Your reset password link has been sent to this email. Please check your junk folder if it is not in your inbox."
                  );
                }
              });
            }}
          >
            Forgot your password?
          </p>
        </div>
        <div></div>
      </div>
      <Footer />
    </div>
  );
}
