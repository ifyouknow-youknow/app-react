import { useEffect, useState } from "react";
import {
  auth_CheckSignedIn,
  firebase_GetAllDocumentsQueried,
  firebase_GetDocument,
} from "../Firebase ";
import { useNavigate } from "react-router-dom";
import { StudentDashNavigation } from "../UTILITIES/StudentDashNavigation";
import "../STYLES/StudentDashboard.css";
import { AsyncImage } from "../UTILITIES/AsyncImage";
import { removeDuplicatesByProperty, sortObjects } from "../Functions";
import { PrimaryButton } from "../COMPONENTS/PrimaryButton";
import { Loading } from "../UTILITIES/Loading";
import { BsArrowRight } from "react-icons/bs";
import { IoArrowForward } from "react-icons/io5";

export function StudentDashboard() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submissions, setSubmissions] = useState([]);

  //
  function onChooseCourse(comp) {
    if (comp.Type === "Lesson") {
      navigate(`/student/lesson/${comp.id}`);
    } else if (comp.Type === "Homework") {
      navigate(`/student/homework/${comp.id}`);
    } else if (comp.Type === "Test") {
      navigate(`/student/test/${comp.id}`);
    }
  }
  //
  useEffect(() => {
    auth_CheckSignedIn((person) => {
      firebase_GetAllDocumentsQueried(
        "CourseSubscriptions",
        [{ field: "StudentId", operator: "==", value: person.id }],
        (subs) => {
          for (var sub of subs) {
            firebase_GetDocument("Courses", sub.CourseId, (course) => {
              firebase_GetAllDocumentsQueried(
                "Completions",
                [{ field: "UserId", operator: "==", value: person.id }],
                (completions) => {
                  setSubmissions(completions);
                }
              );
              firebase_GetAllDocumentsQueried(
                "StudentPlans",
                [
                  { field: "CourseId", operator: "==", value: course.id },
                  { field: "StudentId", operator: "==", value: person.id },
                ],
                (thesePlans) => {
                  if (thesePlans.length > 0) {
                    const obj = {
                      id: course.id,
                      ...course,
                      Plan: thesePlans[0].Plan,
                    };
                    setCourses((prev) =>
                      removeDuplicatesByProperty(
                        [
                          ...prev,
                          {
                            id: course.id,
                            ...course,
                            Plan: thesePlans[0].Plan,
                          },
                        ],
                        "id"
                      )
                    );
                  } else {
                    setCourses((prev) =>
                      removeDuplicatesByProperty(
                        [...prev, { id: course.id, ...course, Plan: [] }],
                        "id"
                      )
                    );
                  }
                }
              );
            });
          }
        }
      );
    }, navigate);
  }, []);

  return (
    <div className="student-dash jakarta">
      {loading && <Loading />}
      <StudentDashNavigation />
      <div className="student-dash-panel-1">
        <div className="student-dash-block">
          <h1 className="no">Courses</h1>
          <p className="no student-dash-block-caption">
            The latest courses you are subscribed to.
          </p>
          <br />
          <div className="student-dash-courses">
            {courses.map((course, c) => {
              const thisOne =
                sortObjects(course.Plan, "Order", "desc").length > 0
                  ? sortObjects(course.Plan, "Order", "desc")[0]
                  : null;
              return (
                <div key={c} className="student-dash-course">
                  <AsyncImage
                    imagePath={
                      course.ImagePath !== undefined
                        ? course.ImagePath
                        : `Images/no-image.jpg`
                    }
                  />
                  <div>
                    <div className="student-dash-course-bottom">
                      <h3 className="no">{course.Name}</h3>
                      <p className="no">
                        {course.Desc.replaceAll("jjj", "\n")}
                      </p>
                    </div>
                    <div className="divider"></div>
                    <div className="">
                      {course.Plan.length > 0 ? (
                        <div>
                          <p className="no label">Upcoming:</p>
                          <p className="no">{thisOne && thisOne.Name}</p>
                          <br />
                          {/* BTN */}
                          {/* LESSON */}
                          {thisOne &&
                            thisOne.Type === "Lesson" &&
                            submissions.filter(
                              (ting) => ting.LessonId === thisOne.id
                            ).length === 0 && (
                              <div
                                className="student-dash-start-btn side-by align-center pointer"
                                onClick={() => {
                                  onChooseCourse(thisOne);
                                }}
                              >
                                <p className="no">Open {thisOne.Type}</p>
                                <IoArrowForward size={18} />
                              </div>
                            )}
                          {thisOne &&
                            thisOne.Type === "Lesson" &&
                            submissions.filter(
                              (ting) => ting.LessonId === thisOne.id
                            ).length > 0 && (
                              <p className="no blue normal_text">Completed</p>
                            )}

                            {/* HOMEWORK */}
                            {thisOne &&
                            thisOne.Type === "Homework" &&
                            submissions.filter(
                              (ting) => ting.HomeworkId === thisOne.id
                            ).length === 0 && (
                              <div
                                className="student-dash-start-btn side-by align-center pointer"
                                onClick={() => {
                                  onChooseCourse(thisOne);
                                }}
                              >
                                <p className="no">Open {thisOne.Type}</p>
                                <IoArrowForward size={18} />
                              </div>
                            )}
                          {thisOne &&
                            thisOne.Type === "Homework" &&
                            submissions.filter(
                              (ting) => ting.HomeworkId === thisOne.id
                            ).length > 0 && (
                              <p className="no blue normal_text">Completed</p>
                            )}

                          {/* TESTS */}
                          {thisOne &&
                            thisOne.Type === "Test" &&
                            submissions.filter(
                              (ting) => ting.TestId === thisOne.id
                            ).length === 0 && (
                              <div
                                className="student-dash-start-btn side-by align-center pointer"
                                onClick={() => {
                                  onChooseCourse(thisOne);
                                }}
                              >
                                <p className="no">Open {thisOne.Type}</p>
                                <IoArrowForward size={18} />
                              </div>
                            )}
                          {thisOne &&
                            thisOne.Type === "Test" &&
                            submissions.filter(
                              (ting) => ting.TestId === thisOne.id
                            ).length > 0 && (
                              <p className="no blue normal_text">Completed</p>
                            )}
                        </div>
                      ) : (
                        <div>
                          <p className="no">No assignments yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {courses.length === 0 && <p>No subscribed courses yet. Please talk to your school instructor.</p>}
          </div>
        </div>
        <div className="student-dash-block">{/* AI */}</div>
      </div>
    </div>
  );
}
