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
              // Sort the course.Plan by 'Order' and find the first item that has no submission
              const sortedPlans = sortObjects(course.Plan, "Order", "asc");
              const nextOne = sortedPlans.find((plan) => {
                if (plan.Type === "Lesson") {
                  return submissions.filter((ting) => ting.LessonId === plan.id).length === 0;
                }
                if (plan.Type === "Homework") {
                  return submissions.filter((ting) => ting.HomeworkId === plan.id).length === 0;
                }
                if (plan.Type === "Test") {
                  return submissions.filter((ting) => ting.TestId === plan.id).length === 0;
                }
                return false;
              });

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
                      <p className="no">{course.Desc.replaceAll("jjj", "\n")}</p>
                    </div>
                    <div className="divider"></div>
                    <div>
                      {course.Plan.length > 0 ? (
                        <div>
                          <p className="no label">Upcoming:</p>
                          <p className="no blue">{nextOne ? nextOne.Name : "Waiting for next unlocked assignment."}</p>
                          <br />
                          {/* Render button or 'Completed' status */}
                          {nextOne &&
                            <div
                              className="student-dash-start-btn side-by align-center pointer"
                              onClick={() => {
                                onChooseCourse(nextOne);
                              }}
                            >
                              <p className="no">Open {nextOne.Type}</p>
                              <IoArrowForward size={18} />
                            </div>
                          }
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
            {courses.length === 0 && (
              <p>No subscribed courses yet. Please talk to your school instructor.</p>
            )}
          </div>
        </div>
        <div className="student-dash-block">{/* AI */}</div>
      </div>
    </div>
  );
}
