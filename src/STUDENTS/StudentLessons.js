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

export function StudentLessons() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [me, setMe] = useState(null);
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [chosenCourse, setChosenCourse] = useState(null);
  const [chosenLessons, setChosenLessons] = useState([]);
  const [studentPlan, setStudentPlan] = useState([]);
  //
  function onPickCourse(course) {
    if (chosenCourse !== null && chosenCourse.id === course.id) {
      setChosenCourse(null);
      setChosenLessons([]);
      setStudentPlan([]);
    } else {
      setLoading(true);
      setChosenCourse(course);
      firebase_GetAllDocumentsQueried(
        "StudentPlans",
        [
          { field: "CourseId", operator: "==", value: course.id },
          { field: "StudentId", operator: "==", value: me.id },
        ],
        (plan) => {
          if (plan.length !== 0) {
            setStudentPlan(plan[0].Plan);
          }
          firebase_GetDocument("Plans", course.id, (plan) => {
            const thisPlan = plan.Plan;
            setChosenLessons(thisPlan.filter((ting) => ting.Type === "Lesson"));
            setLoading(false);
          });
        }
      );
    }
  }

  useEffect(() => {
    auth_CheckSignedIn((person) => {
      console.log(person);
      setMe(person);
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
        <h1 className="no">Course Lessons</h1>
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
                    {sortObjects(chosenLessons, "Order").map((lesson, l) => {
                      return (
                        <div
                          className="student-lesson-block separate_h align-center pointer"
                          key={l}
                          onClick={() => {
                            navigate(`/student/lesson/${lesson.id}`);
                          }}
                        >
                          <p className="no student-lesson-name">
                            {lesson.Name}
                          </p>
                          {studentPlan
                            .map((ting) => {
                              return ting.id;
                            })
                            .includes(lesson.id) && (
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
