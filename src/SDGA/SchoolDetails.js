import React, { useEffect, useState } from "react";
import DashNavigation from "../UTILITIES/DashNavigation";
import { useNavigate, useParams } from "react-router-dom";
import "../STYLES/SchoolDetails.css";
import { auth_CheckSignedIn, firebase_GetDocument } from "../Firebase ";
import { IoArrowBackSharp } from "react-icons/io5";
import { AsyncImage } from "../UTILITIES/AsyncImage";

export function SchoolDetails() {
  const { schoolId } = useParams();
  const navigate = useNavigate();
  const [school, setSchool] = useState(null);
  const [me, setMe] = useState(null);
  // 

  useEffect(() => {
    auth_CheckSignedIn((person) => {
      setMe(person);
    }, navigate);
    firebase_GetDocument("Schools", schoolId, (thing) => {
      if (thing && thing !== undefined) {
        setSchool(thing);
      }
    });
  }, []);

  return (
    <div className="dash-main jakarta">
      <DashNavigation />
      <div
        className="pointer"
        onClick={() => {
          navigate("/SDGA/dashboard");
        }}
      >
        <IoArrowBackSharp className="back-arrow" />
      </div>
      <br />
      <div className="SDGA-school-wrap">
        <h1 className="no SDGA-school-title">{school && school.SchoolName}</h1>
        <br />
        <div className="SDGA-school-block gap">
          <div className="padding center">
            <AsyncImage
              imagePath={
                school &&
                school.ImagePath !== undefined
                  ? school.ImagePath
                  : "Images/no-image.jpg"
              }
              width={80}
              height={80}
            />
          </div>
          <div>
            <p className="no label">Email</p>
            <p className="no normal_text">{school && school.Email}</p>
          </div>
          <div>
            <p className="no label">Address</p>
            <p className="no normal_text">
              {school && school.Address} {school && school.City}, {school && school.State}
            </p>
          </div>
          <div>
            <p className="no label">Info</p>
            <p className="no normal_text">
              {school && school.AdditionalInfo}
            </p>
          </div>
        </div>
        <br/>
        <div className="">
        </div>
      </div>
    </div>
  );
}
