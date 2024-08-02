import { useEffect, useState } from "react";
import {
  auth_CheckSignedIn,
  firebase_GetAllDocumentsQueried,
  firebase_GetDocument,
} from "../Firebase ";
import { removeDuplicatesByProperty, sortObjects } from "../Functions";
import { StudentDashNavigation } from "../UTILITIES/StudentDashNavigation";
import { useNavigate } from "react-router-dom";
import "../STYLES/StudentLessons.css";

import { Loading } from "../UTILITIES/Loading";
import { IoChevronDownSharp } from "react-icons/io5";
import { PrimaryButton } from "../COMPONENTS/PrimaryButton";

export function StudentHomeworks() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [me, setMe] = useState(null)
  const [courses, setCourses] = useState([]);
  const [chosenCourse, setChosenCourse] = useState(null);
  const [chosenHomeworks, setChosenHomeworks] = useState([]);
  const [studentPlan, setStudentPlan] = useState([]);
  //
  function onPickCourse(course) {
    if (chosenCourse !== null && chosenCourse.id === course.id) {
      setChosenCourse(null);
      setChosenHomeworks([]);
    } else {
      setLoading(true);
      setChosenCourse(course);
      firebase_GetAllDocumentsQueried(
        "StudentPlans",
        [{ field: "CourseId", operator: "==", value: course.id },
          { field: "StudentId", operator: "==", value: me.id }
        ],
        (plan) => {
          if (plan.length > 0) {
            setStudentPlan(plan[0].Plan);
          }
          firebase_GetDocument("Plans", course.id, (plan) => {
            const thisPlan = plan.Plan;
            setChosenHomeworks(thisPlan.filter((ting) => ting.Type === "Homework"));
            setLoading(false);
          });
        }
      );
    }
  }

  useEffect(() => {
    auth_CheckSignedIn((person) => {
      console.log(person);
      setMe(person)
      firebase_GetAllDocumentsQueried(
        "CourseSubscriptions",
        [{ field: "StudentId", operator: "==", value: person.id }],
        (subs) => {
          for (var sub of subs) {
            firebase_GetDocument("Courses", sub.CourseId, (course) => {
              setCourses((prev) =>
                removeDuplicatesByProperty([...prev, course], "id")
              );
            });
          }
        }
      );
    }, navigate);
  }, []);
  //
  return (
    <div className="student-dash jakarta">
      {loading && <Loading />}
      <StudentDashNavigation />
      <div className="student-lessons-top">
        <h1 className="no">Course Homeworks</h1>
        <div className="student-courses-wrap">
          {courses.map((course, c) => {
            return (
              <div key={c} className="">
                <div
                  className="separate_h align-center pointer"
                  onClick={() => {
                    onPickCourse(course);
                  }}
                >
                  <p className="no student-course-name">{course.Name}</p>
                  <IoChevronDownSharp size={24} />
                </div>
                {chosenCourse !== null && chosenCourse.id === course.id && (
                  <div className="student-lessons-wrap">
                    {sortObjects(chosenHomeworks, "Order")
                      .map((work, w) => {
                        return (
                          <div
                            className="student-lesson-block separate_h align-center pointer"
                            key={w}
                            onClick={() => {
                              navigate(`/student/homework/${work.id}`);
                            }}
                          >
                            <p className="no student-lesson-name">
                              {work.Name}
                            </p>
                            {studentPlan
                              .map((ting) => {
                                return ting.id;
                              })
                              .includes(work.id) && (
                              <PrimaryButton
                                text={"Start"}
                                classes={"fit-content"}
                              />
                            )}
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
