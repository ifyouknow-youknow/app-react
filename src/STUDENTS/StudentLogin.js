import React from "react";
import "../STYLES/Login.css";
import { auth_ResetPasword, auth_SignIn, firebase_GetDocument } from "../Firebase ";
import { useNavigate } from "react-router-dom";
import SchoolNavigation from "../UTILITIES/SchoolNavigation";
import SchoolFooter from "../UTILITIES/SchoolFooter";
import StudentNavigation from "../UTILITIES/StudentNavigation";

export function StudentLogin() {
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
          if (person.Role === "Student") {
            navigate("/student/dashboard");
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
      <StudentNavigation />
      <div className="login-main">
        <div></div>
        <div className="login-form">
          <h3 className="blue no text-center">Student</h3>
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
            className="no underline login-forgot"
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
      <SchoolFooter />
    </div>
  );
}
