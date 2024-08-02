import React, { useState } from "react";
import DashNavigation from "../UTILITIES/DashNavigation";
import "../STYLES/NewSchool.css";
import { Loading } from "../UTILITIES/Loading";
import { emailjs_SendEmail, randomString } from "../Functions";
import {
  auth_CreateUser,
  firebase_CreateDocument,
  storage_UploadMedia,
} from "../Firebase ";
import { useNavigate } from "react-router-dom";
import { IoArrowBackSharp } from "react-icons/io5";
import { MdAddPhotoAlternate } from "react-icons/md";

export function NewSchool() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [image, setImage] = useState(null);

  function onCreateSchool() {
    const name = document.querySelector("#tbSchoolName").value;
    const email = document.querySelector("#tbEmail").value;
    const address = document.querySelector("#tbAddress").value;
    const city = document.querySelector("#tbCity").value;
    const state = document.querySelector("#tbState").value;
    const additional = document.querySelector("#taAdditionalInfo").value;
    if (
      name !== "" &&
      email !== "" &&
      address !== "" &&
      city !== "" &&
      state !== ""
    ) {
      setLoading(true);
      const temporaryPass = `IPG-${randomString(10)}`
      const imagePath = `Images/${randomString(12)}.jpg`;

      // 
      emailjs_SendEmail(email, "Pet Grooming Edu - Temporary Password", `Your temporary password for this email is ${temporaryPass}.`,(success) => {
        if (!success) {
          alert("There was a problem sending your temporary password.")
        }
      })

      const args = {
        SchoolName: name,
        Email: email,
        Address: address,
        City: city,
        State: state,
        AdditionalInfo: additional.replaceAll("\n", "jjj"),
        ImagePath: image !== null ? imagePath : "Images/no-image.jpg",
      };
      auth_CreateUser(email, temporaryPass, (thisUser) => {
        const thisUserId = thisUser.uid
        if (image !== null) {
          storage_UploadMedia(image, imagePath, (success) => {
            if (success) {
              firebase_CreateDocument("Users", thisUserId, {Role: "School", Email: email, Date: new Date()}, (thisOne) => {
                if (thisOne) {
                  firebase_CreateDocument("Schools", thisUserId, args, (thisTwo) => {
                    setLoading(false);
                    if (thisTwo) {
                      alert("Success! School record was created.");
                      navigate("/ipg/dashboard");
                    }
                  });
                }
              })
            }
          });
        } else {
          firebase_CreateDocument("Users", thisUserId, {Role: "School", Email: email, Date: new Date()}, (thisOne) => {
            if (thisOne) {
              firebase_CreateDocument("Schools", thisUserId, args, (thisTwo) => {
                setLoading(false);
                if (thisTwo) {
                  alert("Success! School record was created.");
                  navigate("/ipg/dashboard");
                }
              });
            }
          })
        }
      });
    } else {
      alert("Please fill out necessary fields.");
    }
  }
  function onChangeImage(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <div className="dash-main jakarta">
      {loading && <Loading />}
      <DashNavigation />
      <div
        className="pointer"
        onClick={() => {
          navigate("/ipg/dashboard");
        }}
      >
        <IoArrowBackSharp className="back-arrow" />
      </div>
      <div className="new-wrap">
        <div className="new-form">
          <h1 className="no">New School</h1>
          <br />
          {/* NAME */}
          <div className="new-form-block">
            <p className="no">School Name</p>
            <input
              id="tbSchoolName"
              type="text"
              className="new-form-input"
              placeholder="ex. Paws For Life"
            />
          </div>
          {/* EMAIL */}
          <div className="new-form-block">
            <p className="no">Email</p>
            <input
              id="tbEmail"
              type="text"
              className="new-form-input"
              placeholder="ex. jdoe@grooming.com"
            />
          </div>
          {/* ADDRESS */}
          <div className="new-form-block">
            <p className="no">Address</p>
            <input
              id="tbAddress"
              type="text"
              className="new-form-input"
              placeholder="ex. 1234 Grooming St."
            />
          </div>
          {/* CITY AND STATE */}
          <div className="split">
            <div className="new-form-block">
              <p className="no">City</p>
              <input
                id="tbCity"
                type="text"
                className="new-form-input"
                placeholder="ex. Estes Park"
              />
            </div>
            <div className="new-form-block">
              <p className="no">State/Province</p>
              <input
                id="tbState"
                type="text"
                className="new-form-input"
                placeholder="ex. Colorado"
              />
            </div>
          </div>
          {/* DETAILS */}
          <div className="new-form-block">
            <p className="no">Additional Info</p>
            <textarea
              id="taAdditionalInfo"
              type="text"
              className="new-form-textarea jakarta"
              placeholder="Enter any additional information about this school."
            ></textarea>
          </div>
          {/* LOGO */}
          <div className="new-form-block">
            <p className="no">Logo</p>
            {image !== null && <img src={image} />}
            <div
              className="new-form-btn pointer"
              onClick={() => {
                document.getElementById("hiddenFileInput").click();
              }}
            >
              <MdAddPhotoAlternate className="new-form-btn-icon" />
              <input
                type="file"
                id="hiddenFileInput"
                style={{ display: "none" }}
                onChange={onChangeImage}
              ></input>
            </div>
          </div>
          <button onClick={onCreateSchool}>Create</button>
        </div>
      </div>
    </div>
  );
}
