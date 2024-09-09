import { SchoolDashNavigation } from "../UTILITIES/SchoolDashNavigation";
import "../STYLES/SchoolStudents.css";
import "../STYLES/SchoolDashboard.css";
import { useEffect, useState } from "react";
import {
  auth_CheckSignedIn,
  firebase_CreateDocument,
  firebase_DeleteDocument,
  firebase_GetAllDocumentsQueried,
  firebase_GetDocument,
  firebase_UpdateDocument,
} from "../Firebase ";
import { Loading } from "../UTILITIES/Loading";
import {
  formatDate,
  randomString,
  removeDuplicatesByProperty,
  sortObjects,
} from "../Functions";
import { FaLock, FaLockOpen, FaTrash } from "react-icons/fa";
import ActionButtons from "../UTILITIES/ActionButtons";
import { FaXmark } from "react-icons/fa6";

export function SchoolDashboard() {
  // #region DECLARATIONS
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [chosenCourse, setChosenCourse] = useState(null);
  const [plan, setPlan] = useState([]);
  const [studentPlans, setStudentPlans] = useState([]);
  // TOGGLES
  const [toggleUnlockConfirmation, setToggleUnlockConfirmation] =
    useState(false);
  const [toggleLockConfirmation, setToggleLockConfirmation] = useState(false);
  const [chosenStudent, setChosenStudent] = useState(null);
  const [chosenComp, setChosenComp] = useState(null);
  // 
  const [notifications, setNotifications] = useState([])
  // #endregion

  function onUnlockComponent(student, chosenCourse, comp) {
    setToggleUnlockConfirmation(false);
    setLoading(true);
    const chosenOne = studentPlans.find(
      (ting) =>
        ting.CourseId === chosenCourse.id && ting.StudentId === student.id
    );
    if (chosenOne !== undefined) {
      // UPDATE
      console.log("UPDATING");
      const newPlan = {
        CourseId: chosenCourse.id,
        Plan: [...chosenOne.Plan, comp],
        StudentId: student.id,
      };
      firebase_UpdateDocument(
        "StudentPlans",
        chosenOne.id,
        newPlan,
        (success) => {
          if (success) {
            setLoading(false);
            setToggleUnlockConfirmation(false);
            setStudentPlans((prev) =>
              prev.map((plan) =>
                chosenOne.id === plan.id
                  ? { id: chosenOne.id, ...newPlan }
                  : plan
              )
            );
          }
        }
      );
    } else {
      console.log("CREATING");
      const planId = randomString(25);
      // CREATE
      firebase_CreateDocument(
        "StudentPlans",
        planId,
        {
          Plan: [comp],
          CourseId: chosenCourse.id,
          StudentId: student.id,
        },
        (success) => {
          if (success) {
            setLoading(false);
            setToggleUnlockConfirmation(false);
            setStudentPlans((prev) => [
              ...prev,
              {
                id: planId,
                Plan: [comp],
                CourseId: chosenCourse.id,
                StudentId: student.id,
              },
            ]);
          }
        }
      );
    }
  }
  function onLockComponent(student, chosenCourse, comp) {
    setLoading(true);
    const chosenOne = studentPlans.find(
      (ting) =>
        ting.CourseId === chosenCourse.id && ting.StudentId === student.id
    );
    if (chosenOne !== undefined) {
      const newPlan = {
        StudentId: student.id,
        Plan: chosenOne.Plan.filter((item) => item.id !== comp.id),
        CourseId: chosenCourse.id,
      };
      firebase_UpdateDocument(
        "StudentPlans",
        chosenOne.id,
        newPlan,
        (success) => {
          if (success) {
            setLoading(false);
            setToggleLockConfirmation(false);
            setStudentPlans((prev) =>
              prev.map((plan) =>
                plan.id === chosenOne.id
                  ? { id: chosenOne.id, ...newPlan }
                  : plan
              )
            );
          }
        }
      );
    }
  }
  async function onRemoveNotif(notifId) {
    setLoading(true)
    await firebase_DeleteDocument('Notifications', notifId, (success) => {
      if (success) {
        setNotifications((prev) => removeDuplicatesByProperty([...prev.filter((ting) => ting.id !== notifId)], "id"))
        setLoading(false)
      }
    })
  }

  useEffect(() => {
    auth_CheckSignedIn((person) => {
      setMe(person);
      firebase_GetAllDocumentsQueried('Notifications', [
        { field: 'SchoolId', operator: "==", value: person.id }
      ], (notifs) => {
        setNotifications(notifs)
      })
      firebase_GetAllDocumentsQueried(
        "Users",
        [{ field: "SchoolId", operator: "==", value: person.id }],
        (things) => {
          setStudents(things);
          for (var stud of things) {
            firebase_GetDocument("CourseSubscriptions", stud.id, (sub) => {
              // GET COURSE PLAN
              const courseId = sub.CourseId;
              firebase_GetDocument("Plans", courseId, (things) => {
                if (things !== null) {
                  const obj = things.Plan;
                  setPlan(obj);
                }
              });
              firebase_GetAllDocumentsQueried(
                "StudentPlans",
                [{ field: "CourseId", operator: "==", value: courseId }],
                (plans) => {
                  if (plans.length > 0) {
                    setStudentPlans((prev) =>
                      removeDuplicatesByProperty([...prev, ...plans], "id")
                    );
                  }
                }
              );
              firebase_GetAllDocumentsQueried(
                "CourseSubscriptions",
                [{ field: "CourseId", operator: "==", value: courseId }],
                (things) => {
                  setSubscriptions((prev) =>
                    removeDuplicatesByProperty([...prev, ...things], "id")
                  );
                }
              );
              firebase_GetDocument("Courses", courseId, (course) => {
                setCourses((prev) =>
                  removeDuplicatesByProperty([...prev, course], "id")
                );
              });
            });
          }
        }
      );
    });
  }, []);

  return (
    <div className="dash-main jakarta">
      {loading && <Loading />}
      {toggleUnlockConfirmation && (
        <ActionButtons
          message={`Are you sure you want to UNLOCK ${chosenComp.Name} for ${chosenStudent.FirstName} ${chosenStudent.LastName}?`}
          buttons={[
            {
              Type: "cancel",
              Text: "Cancel",
              Func: () => {
                setToggleUnlockConfirmation(false);
              },
            },
            {
              Type: "primary",
              Text: "Unlock",
              Func: () => {
                onUnlockComponent(chosenStudent, chosenCourse, chosenComp);
              },
            },
          ]}
        />
      )}
      {toggleLockConfirmation && (
        <ActionButtons
          message={`Are you sure you want to LOCK ${chosenComp.Name} for ${chosenStudent.FirstName} ${chosenStudent.LastName}?`}
          buttons={[
            {
              Type: "cancel",
              Text: "Cancel",
              Func: () => {
                setToggleLockConfirmation(false);
              },
            },
            {
              Type: "destructive",
              Text: "Lock",
              Func: () => {
                onLockComponent(chosenStudent, chosenCourse, chosenComp);
              },
            },
          ]}
        />
      )}
      <SchoolDashNavigation />
      <h1 className="no school-students-title">Student Roster</h1>
      <div className="school-students-wrap">
        {courses.map((course, c) => {
          return (
            <div key={c} className="school-students-block">
              {/* NOTIFICATIONS */}
              {notifications.length > 0 &&
                <div className="school-notifs-wrap">
                  <h4 className="no">Notifications</h4>
                  <br />
                  <div className="school-notifs">
                    {
                      sortObjects(notifications, "Date", "asc").map((notif) => {
                        return (
                          <div className="school-notif separate_v">
                            <div>
                              <p className="no notif-mess">{notif.Message}</p>
                              <br />
                            </div>
                            <div className="separate_h">
                              <p className="no notif-date">{formatDate(new Date(notif.Date.seconds * 1000))}</p>
                              <button onClick={() => {
                                onRemoveNotif(notif.id)
                              }} className="remove-notif pointer"><FaTrash size={14} /></button>
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              }
              {/* 
               */}
              <div className="school-students-course separate_h align-center">
                <p className="no">{course.Name}</p>
                {/* <IoChevronDownSharp size={20} /> */}
              </div>

              {/* STUDENTS */}
              <div className="school-students-blocks">
                <div className="school-student-row">
                  <div className="school-student-name school-table-head">
                    <p className="no">Student Name</p>
                  </div>
                  {sortObjects(plan, "Order", "asc").map((pl, p) => {
                    return (
                      <div
                        key={p}
                        className="school-student-box school-table-head"
                      >
                        <p className="no">{pl.Name}</p>
                      </div>
                    );
                  })}
                </div>
                {students
                  .filter((ting) =>
                    subscriptions
                      .filter((ting2) => ting2.CourseId === course.id)
                      .map((ting3) => {
                        return ting3.StudentId;
                      })
                      .includes(ting.id)
                  )
                  .map((student, s) => {
                    return (
                      <div key={s} className={`school-student-row`}>
                        <div className="school-student-name">
                          <p className="no">
                            {student.FirstName} {student.LastName}
                          </p>
                        </div>
                        {sortObjects(plan, "Order", "asc").map((pl, p) => {
                          return (
                            <div
                              key={p}
                              className={`school-student-box pointer ${studentPlans.find(
                                (ting) =>
                                  ting.CourseId === course.id &&
                                  ting.StudentId === student.id
                              ) &&
                                studentPlans
                                  .find(
                                    (ting) =>
                                      ting.CourseId === course.id &&
                                      ting.StudentId === student.id
                                  )
                                  .Plan.map((thisOne) => {
                                    return thisOne.id;
                                  })
                                  .includes(pl.id)
                                ? "unlocked"
                                : "locked"
                                }`}
                              onClick={() => {
                                const unlocked =
                                  studentPlans.find(
                                    (ting) =>
                                      ting.CourseId === course.id &&
                                      ting.StudentId === student.id
                                  ) &&
                                  studentPlans
                                    .find(
                                      (ting) =>
                                        ting.CourseId === course.id &&
                                        ting.StudentId === student.id
                                    )
                                    .Plan.map((thisOne) => {
                                      return thisOne.id;
                                    })
                                    .includes(pl.id);
                                setChosenCourse(course);
                                //
                                if (!unlocked) {
                                  setChosenComp(pl);
                                  setChosenStudent(student);
                                  setToggleUnlockConfirmation(true);
                                } else {
                                  setChosenComp(pl);
                                  setChosenStudent(student);
                                  setToggleLockConfirmation(true);
                                }
                              }}
                            >
                              {studentPlans.find(
                                (ting) =>
                                  ting.CourseId === course.id &&
                                  ting.StudentId === student.id
                              ) &&
                                studentPlans
                                  .find(
                                    (ting) =>
                                      ting.CourseId === course.id &&
                                      ting.StudentId === student.id
                                  )
                                  .Plan.map((thisOne) => {
                                    return thisOne.id;
                                  })
                                  .includes(pl.id) ? (
                                <FaLockOpen size={20} />
                              ) : (
                                <FaLock size={20} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
