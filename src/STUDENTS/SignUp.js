import React, { useState } from "react";
import StudentNavigation from "../UTILITIES/StudentNavigation";
import Footer from "../UTILITIES/Footer";
import {
  auth_CreateUser,
  firebase_CreateDocument,
  firebase_DeleteDocument,
  firebase_GetDocument,
} from "../Firebase ";
import { useNavigate } from "react-router-dom";
import { Loading } from "../UTILITIES/Loading";

export function SignUp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");
  const [key, setKey] = useState("");

  //

  function onSignUp() {
    const firstName = document.querySelector("#tbFirstName").value;
    const lastName = document.querySelector("#tbLastName").value;
    const email = document.querySelector("#tbEmail").value;
    const password = document.querySelector("#tbPassword").value;
    const passwordConfirmation =
      document.querySelector("#tbConfirmPassword").value;
    const key = document.querySelector("#tbKey").value;

    if (firstName === "") {
      alert("Please provide a first name.");
      return;
    } else if (lastName === "") {
      alert("Please provide a last name.");
      return;
    } else if (email === "") {
      alert("Please provide a email.");
      return;
    } else if (password === "") {
      alert("Please enter a password.");
      return;
    } else if (passwordConfirmation === "") {
      alert("Please confirm your password.");
      return;
    }

    setLoading(true)

    firebase_GetDocument("Keys", key, (thisKey) => {
      if (thisKey !== null) {
        auth_CreateUser(email, password, (thisUser) => {
          const userId = thisUser.uid;
          firebase_CreateDocument(
            "Users",
            userId,
            {
              FirstName: firstName,
              LastName: lastName,
              Email: email,
              Role: "Student",
              Date: new Date(),
              SchoolId: thisKey.SchoolId,
            },
            (success) => {
              if (success) {
                firebase_DeleteDocument("Keys", key, (success2) => {
                  if (success2) {
                    alert("Success! Use your email and password to sign in.");
                    setLoading(false)
                    navigate("/student/login");
                  }
                });
              }
            }
          );
        });
      } else {
        alert("Key is not valid. Please request a new key from your school.");
        return;
      }
    });
  }

  return (
    <div className="main jakarta">
        {loading && <Loading />}
      <StudentNavigation />
      <div className="login-main">
        <div></div>
        <div className="login-form">
          <h3 className="blue no text-center">Student</h3>
          <h1 className="no">Sign Up</h1>
          <br />
          <div>
            <p className="no label">First Name</p>
            <input
              id="tbFirstName"
              type="text"
              className="login-input"
              placeholder="ex. John"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
            />
          </div>
          <div>
            <p className="no label">Last Name</p>
            <input
              id="tbLastName"
              type="text"
              className="login-input"
              placeholder="ex. Doe"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
            />
          </div>
          <div>
            <p className="no label">Email</p>
            <input
              id="tbEmail"
              type="text"
              className="login-input"
              placeholder="ex. jdoe@gmail.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div>
            <p className="no label">Password</p>
            <input
              id="tbPassword"
              type="password"
              className="login-input"
              placeholder="8 chars minimum"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            {password !== "" && password.length < 8 && (
              <p className="no blue small_text">
                Password must be at least 8 characters.
              </p>
            )}
          </div>
          <div>
            <p className="no label">Confirm Password</p>
            <input
              id="tbConfirmPassword"
              type="password"
              className="login-input"
              placeholder="8 chars minimum"
              value={passwordConf}
              onChange={(e) => {
                setPasswordConf(e.target.value);
              }}
            />
            {password !== "" &&
              passwordConf !== "" &&
              password !== passwordConf && (
                <p className="no red small_text">Passwords do not match.</p>
              )}
            {password !== "" &&
              passwordConf !== "" &&
              password === passwordConf && (
                <p className="no green small_text">Passwords match!</p>
              )}
          </div>
          <div>
            <p className="no label">Access Key</p>
            <input
              id="tbKey"
              type="text"
              className="login-input"
              placeholder="16 character key (case sensitive)"
              value={key}
              onChange={(e) => {
                setKey(e.target.value);
              }}
            />
          </div>
          <button
            className="login-btn pointer"
            onClick={() => {
              onSignUp();
            }}
          >
            Sign Up
          </button>
          <br />
        </div>
        <div></div>
      </div>
      <Footer />
    </div>
  );
}
