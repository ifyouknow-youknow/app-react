import React, { useEffect, useState } from "react";
import { auth_CheckSignedIn, firebase_GetAllDocuments } from "../Firebase ";
import { useNavigate } from "react-router-dom";
import DashNavigation from "../UTILITIES/DashNavigation";
import { AiOutlinePlus } from "react-icons/ai";
import "../STYLES/Dashboard.css";
import { VscChevronRight } from "react-icons/vsc";
import { AsyncImage } from "../UTILITIES/AsyncImage";

export function Dashboard() {
  const [me, setMe] = useState(null);
  const navigate = useNavigate();
  //
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    auth_CheckSignedIn((person) => {
      setMe(person);
      //   SIGNED IN
      firebase_GetAllDocuments("Schools", (things) => {
        console.log(things);
        setSchools(things);
      });
    }, navigate);
  }, []);

  return (
    <div className="main dash-main jakarta">
      <DashNavigation />
      <div className="dash-panel-1">
        <div className="dash-block">
          <div className="separate_h">
            <h1 className="no">Schools</h1>
            <button
              className="pointer"
              onClick={() => {
                navigate("/ipg/new-school");
              }}
            >
              <AiOutlinePlus className="dash-btn-icon" />
              <p className="no">New School</p>
            </button>
          </div>
          <br />
          <div className="dash-schools divisions">
            {schools.map((school, s) => {
              return (
                <div key={s} className="dash-school hover pointer padding_v" onClick={() => {
                navigate(`/ipg/school/${school.id}`)
                }}>
                  <div className="side-by">
                    <AsyncImage
                      imagePath={school.ImagePath !== undefined ? school.ImagePath : "Images/no-image.jpg"}
                      width={40}
                      height={40}
                      radius={100}
                    />
                    <div>
                    <p className="no dash-school-name">{school.SchoolName}</p>
                    <p className="no dash-school-city">{school.City}</p>
                      </div>
                  </div>
                  <VscChevronRight className="dash-school-icon" />
                </div>
              );
            })}
          </div>
        </div>
        <div className="dash-block">
          <div className="separate_h">
            <h1 className="no">Message Board</h1>
            <button className="">
              <AiOutlinePlus className="dash-btn-icon" />
              <p className="no">New Message</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
