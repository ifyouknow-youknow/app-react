import React, { useEffect, useState } from "react";
import { StudentDashNavigation } from "../UTILITIES/StudentDashNavigation";
import "../STYLES/StudentGrades.css";
import {
  auth_CheckSignedIn,
  firebase_GetAllDocumentsQueried,
  firebase_GetDocument,
} from "../Firebase ";
import { useNavigate } from "react-router-dom";
import { removeDuplicatesByProperty, sortObjects } from "../Functions";
import { Loading } from "../UTILITIES/Loading";
import { MdExpandMore } from "react-icons/md";

export function StudentGrades() {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [responses, setResponses] = useState([]);
  const [chosenRes, setChosenRes] = useState(null);
  //

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      auth_CheckSignedIn((person) => {
        setMe(person);

        firebase_GetAllDocumentsQueried(
          "CourseSubscriptions",
          [{ field: "StudentId", operator: "==", value: person.id }],
          (subs) => {
            for (const sub of subs) {
              firebase_GetDocument("Courses", sub.CourseId, (course) => {
                setCourses((prev) =>
                  removeDuplicatesByProperty([...prev, course], "id")
                );

                firebase_GetAllDocumentsQueried(
                  "Responses",
                  [
                    { field: "StudentId", operator: "==", value: person.id },
                    { field: "CourseId", operator: "==", value: course.id },
                  ],
                  (theseResponses) => {
                    for (const res of theseResponses) {
                      const thisRes = { ...res };
                      const handleComponentFetch = (comp) => {
                        const obj = {
                          ...thisRes,
                          Component: comp,
                        };
                        setResponses((prev) =>
                          removeDuplicatesByProperty([...prev, obj], "id")
                        );
                      };

                      if (thisRes.Type === "lesson") {
                        firebase_GetDocument(
                          "Lessons",
                          thisRes.ComponentId,
                          handleComponentFetch
                        );
                      } else if (thisRes.Type === "homework") {
                        firebase_GetDocument(
                          "Homeworks",
                          thisRes.ComponentId,
                          handleComponentFetch
                        );
                      } else if (thisRes.Type === "test") {
                        firebase_GetDocument(
                          "Tests",
                          thisRes.ComponentId,
                          handleComponentFetch
                        );
                      }
                    }
                  }
                );
              });
            }
            setLoading(false);
          }
        );
      }, navigate);
    };

    fetchData().catch((error) => {
      console.error("Error fetching data:", error);
      setLoading(false);
    });

    // Return a cleanup function to avoid returning non-function values
    return () => {};
  }, []);

  return (
    <div className="dash-main jakarta">
      {loading && <Loading />}
      <StudentDashNavigation />
      <div className="grades-wrap">
        <h1 className="no grades-title">Overall Grades</h1>

        <div className="grades-blocks divisions">
          {courses.map((course, c) => {
            return (
              <div className="" key={c}>
                <p className="no grades-course-name">{course.Name}</p>
                <div className="grades-block divisions">
                  {sortObjects(responses, "Date", "desc").map((res, r) => {
                    return (
                      <div className="grades-response" key={r}>
                        <div
                          className="padding_sm separate_h align-center pointer hover"
                          onClick={() => {
                            if (chosenRes !== null && chosenRes.id === res.id) {
                              setChosenRes(null);
                            } else {
                              console.log(res);
                              setChosenRes(res);
                            }
                          }}
                        >
                          <p className="no grades-comp-name">
                            {res.Component.Name}
                          </p>
                          <div className="side-by">
                            <p className="no">{res.Grade}%</p>
                            <MdExpandMore size={24} />
                          </div>
                        </div>
                        {chosenRes && chosenRes.id === res.id && (
                          <div className="">
                            {chosenRes.Type === "homework" && (
                              <div className="grade-res-blocks divisions">
                                {sortObjects(res.Responses, "Order").map(
                                  (thisRes, t) => {
                                    return (
                                      <div
                                        key={t}
                                        className="grade-res-block padding_v"
                                      >
                                        <p className="no"></p>
                                        <p className="no label">Your Answer:</p>
                                        <p className="no small_text">
                                          {thisRes.StudentResponse.replaceAll(
                                            "jjj",
                                            "<br>"
                                          )
                                            .split("<br>")
                                            .map((line, index) => (
                                              <React.Fragment key={index}>
                                                {line}
                                                <br />
                                              </React.Fragment>
                                            ))}
                                        </p>
                                        <br />
                                        <p className="no label">
                                          Correct Answer:
                                        </p>
                                        <p className="no blue">
                                          {thisRes.Response.replaceAll(
                                            "jjj",
                                            "<br>"
                                          )
                                            .split("<br>")
                                            .map((line, index) => (
                                              <React.Fragment key={index}>
                                                {line}
                                                <br />
                                              </React.Fragment>
                                            ))}
                                        </p>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            )}
                            {chosenRes.Type === "test" && (
                              <div className="grade-res-blocks divisions">
                                {sortObjects(res.Responses, "Order").map(
                                  (thisRes, t) => {
                                    return (
                                      <div
                                        key={t}
                                        className="grade-res-block padding_v"
                                      >
                                        <p className="no"></p>
                                        <p className="no label">Your Answer:</p>
                                        <p className="no small_text">
                                          {thisRes.StudentAnswer.map(
                                            (ting) => ting.Answer
                                          )
                                            .join(",")
                                            .replaceAll("jjj", "<br>")
                                            .split("<br>")
                                            .map((line, index) => (
                                              <React.Fragment key={index}>
                                                {line}
                                                <br />
                                              </React.Fragment>
                                            ))}
                                        </p>
                                        <br />
                                        <p className="no label">
                                          Correct Answer:
                                        </p>
                                        <p className="no green">
                                          {thisRes.CorrectAnswer.length > 1
                                            ? thisRes.CorrectAnswer.filter(
                                                (ting) => ting.Answer
                                              )
                                                .map((ting) => {
                                                  return ting.Choice;
                                                })
                                                .join(", ")
                                                .replaceAll("jjj", "<br>")
                                                .split("<br>")
                                                .map((line, index) => (
                                                  <React.Fragment key={index}>
                                                    {line}
                                                    <br />
                                                  </React.Fragment>
                                                ))
                                            : sortObjects(
                                                thisRes.CorrectAnswer,
                                                "Order"
                                              )
                                                .join(", ")
                                                .replaceAll("jjj", "<br>")
                                                .split("<br>")
                                                .map((line, index) => (
                                                  <React.Fragment key={index}>
                                                    {line}
                                                    <br />
                                                  </React.Fragment>
                                                ))}
                                        </p>
                                        <br />
                                        <p className="no label">Response:</p>
                                        <p className="no blue">
                                          {thisRes.Response
                                            .replaceAll("jjj", "<br>")
                                            .split("<br>")
                                            .map((line, index) => (
                                              <React.Fragment key={index}>
                                                {line}
                                                <br />
                                              </React.Fragment>
                                            ))}
                                        </p>
                                        <br />
                                        <p className="no green">
                                          {thisRes.Points} Points
                                        </p>
                                      </div>
                                    );
                                  }
                                )}
                                <div className="separate_h align-center padding_v">
                                  <div></div>
                                  <p className="no">Grade: {res.Grade}%</p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <div className="separate_h align-center">
                    <div></div>
                    <div className="padding">
                      <p className="no bold grades-overall">
                        Overall:{" "}
                        {responses.length > 0
                          ? (
                              responses.reduce(
                                (acc, curr) => acc + curr.Grade,
                                0
                              ) / responses.length
                            ).toFixed(0)
                          : 0}
                        %
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
