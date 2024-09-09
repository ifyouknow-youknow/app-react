import React, { useEffect, useState } from "react";
import "../STYLES/SchoolCourses.css";
import { SchoolDashNavigation } from "../UTILITIES/SchoolDashNavigation";
import {
  auth_CheckSignedIn,
  firebase_GetAllDocuments,
  firebase_GetDocument,
} from "../Firebase ";
import { useNavigate } from "react-router-dom";
import { AsyncImage } from "../UTILITIES/AsyncImage";

export function SchoolCourses() {
  const navigate = useNavigate();
  const [thisSchool, setThisSchool] = useState(null);
  const [theseCourses, setTheseCourses] = useState([]);

  useEffect(() => {
    auth_CheckSignedIn((user) => {
      const schoolId = user.uid;
      firebase_GetAllDocuments("Courses", (courses) => {
        setTheseCourses(courses);
      });
    }, navigate);
  }, []);

  return (
    <div className="main school-dash-main jakarta">
      <SchoolDashNavigation />
      <div className="school-courses-wrap">
        <div className="school-dash-row-1">
          <div className="school-courses-notice-1">
            <div>
              <h1 className="no">Create your own course!</h1>
              <br />
              <p className="no">
                We provide the tools for you to be able to create lessons,
                homeworks, and quizzes. Get started now with our Course Editor.
              </p>
              <br />
            </div>
            <button
              onClick={() => {
                navigate("/schools/course-editor/new");
              }}
            >
              Create Course
            </button>
          </div>
          {/* <div className="school-courses-notice-2">
            <div>
              <h1 className="no">
                Save time and unlock the state approved SDGA Pet Grooming
                Curriculum Course.
              </h1>
              <br />
              <p className="no">
                This course includes lessons on sanitation, breed groups, and
                formalities. It also covers much more to provide a comprehensive
                grooming education.
              </p>
              <br />
            </div>
            <button>Unlock Now</button>
          </div> */}
        </div>
        <div className="school-dash-row-2">
          <div className="school-courses">
            <h1 className="no">Courses</h1>
            <br />
            <div className="school-courses-list">
              {theseCourses.map((course, c) => {
                return (
                  <div
                    key={c}
                    className="school-list-block pointer"
                    onClick={() => {
                      navigate(`/schools/course-editor/${course.id}`);
                    }}
                  >
                    <AsyncImage
                      imagePath={
                        course.ImagePath !== undefined
                          ? course.ImagePath
                          : "Images/grooming1.jpg"
                      }
                      width={"100%"}
                      height={"20vw"}
                    />
                    <div className="school-list-block-pair">
                      <p className="no school-list-block-name">{course.Name}</p>
                      <p className="no school-list-block-desc">
                        {course.Desc.slice(0, 180)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
