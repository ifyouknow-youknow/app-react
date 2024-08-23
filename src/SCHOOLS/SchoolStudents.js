import React, { useEffect, useState } from "react";
import { SchoolDashNavigation } from "../UTILITIES/SchoolDashNavigation";
import { Loading } from "../UTILITIES/Loading";
import {
  auth_CheckSignedIn,
  firebase_CreateDocument,
  firebase_GetAllDocuments,
  firebase_GetAllDocumentsQueried,
  firebase_GetDocument,
} from "../Firebase ";
import { useNavigate } from "react-router-dom";
import "../STYLES/SchoolStudents.css";
import { IoChevronDownSharp } from "react-icons/io5";
import {
  coco_GetResponse,
  csv_CreateCSV,
  formatDate,
  randomString,
  removeDuplicatesByProperty,
  server_PostAPI,
  sortObjects,
} from "../Functions";
import { BsStars } from "react-icons/bs";
import { PrimaryButton } from "../COMPONENTS/PrimaryButton";
import ActionButtons from "../UTILITIES/ActionButtons";
import { CancelButton } from "../COMPONENTS/CancelButton";

export function SchoolStudents() {
  // #region DECLARATIONS
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [students, setStudents] = useState([]);
  const [chosenStudent, setChosenStudent] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [chosenSubmission, setChosenSubmission] = useState(null);
  const [subDetails, setSubDetails] = useState(null);
  const [subComponents, setSubComponents] = useState([]);
  //
  const [toggleHomeworkRes, setToggleHomeworkRes] = useState(false);
  const [toggleTestRes, setToggleTestRes] = useState(false);
  const [responses, setResponses] = useState([]);
  //
  const [totalPoints, setTotalPoints] = useState(0);
  const [toggleRequest, setToggleRequest] = useState(false);
  const [toggleCourses, setToggleCourses] = useState(false);
  const [keyQuantity, setKeyQuantity] = useState("Select One");
  const [studentCourses, setStudentCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  //
  async function onGetStudentData(student) {
    setChosenStudent(student);
    setSelectedCourseId("");
    setStudentCourses([]);
    await firebase_GetAllDocumentsQueried(
      "Completions",
      [{ field: "UserId", operator: "==", value: student.id }],
      (completions) => {
        setSubmissions((prev) => removeDuplicatesByProperty(completions, "id"));
      }
    );
    await firebase_GetAllDocumentsQueried(
      "CourseSubscriptions",
      [{ field: "StudentId", operator: "==", value: student.id }],
      (subs) => {
        for (var sub of subs) {
          const id = sub.CourseId;
          firebase_GetDocument("Courses", id, (course) => {
            setStudentCourses((prev) =>
              removeDuplicatesByProperty([...prev, course], "id")
            );
          });
        }
      }
    );
  }
  function onGetSubData(sub) {
    if (sub.Type === "lesson") {
      firebase_GetDocument("Lessons", sub.LessonId, (details) => {
        setSubDetails(details);
      });
    } else if (sub.Type === "homework") {
      firebase_GetDocument("Homeworks", sub.HomeworkId, (details) => {
        setSubDetails(details);
        firebase_GetAllDocumentsQueried(
          "Prompts",
          [{ field: "HomeworkId", operator: "==", value: sub.HomeworkId }],
          (things) => {
            setSubComponents(things);
          }
        );
        firebase_GetAllDocumentsQueried(
          "Responses",
          [{ field: "ComponentId", operator: "==", value: sub.HomeworkId }],
          (things) => {
            setResponses(things);
          }
        );
      });
    } else if (sub.Type === "test") {
      firebase_GetDocument("Tests", sub.TestId, (details) => {
        setSubDetails(details);
        firebase_GetAllDocumentsQueried(
          "Questions",
          [{ field: "TestId", operator: "==", value: sub.TestId }],
          (things) => {
            setSubComponents(things);
          }
        );
        firebase_GetAllDocumentsQueried(
          "Responses",
          [{ field: "ComponentId", operator: "==", value: sub.TestId }],
          (things) => {
            setResponses(things);
          }
        );
      });
    }
  }
  function onCocoAIResponse(instructions, id) {
    coco_GetResponse(instructions, (res) => {
      document.querySelector(`#${id}`).value = res;
    });
  }
  function onCocoGradeForMe(instructions, id) {
    coco_GetResponse(instructions, (res) => {
      document.querySelector(`#${id}`).value = res;
      var total = 0;
      const all = document.querySelectorAll(".input-points");
      for (var input of all) {
        const value = parseInt(input.value === "" ? 0 : input.value);
        total += value;
      }
      const totalNum = subComponents.reduce((total, ting) => {
        const points = parseInt(ting.Points, 10) || 0;
        return total + points;
      }, 0);
      const totalPerc = ((total / totalNum) * 100).toFixed(0);
      setTotalPoints(totalPerc);
    });
  }
  function onSendHomeworkResponse() {
    setLoading(true);
    const grade = document.querySelector("#tbHomeworkGrade").value;
    if (grade !== "") {
      const theseResponses = [];
      for (var idx in chosenSubmission.Responses) {
        const studentResponse = chosenSubmission.Responses[idx];
        const response = document.querySelector(`#taResponse${idx}`).value;
        const obj = {
          Order: parseInt(idx) + 1,
          StudentResponse: studentResponse,
          Response: response,
        };
        theseResponses.push(obj);
      }
      const args = {
        SubmissionId: chosenSubmission.id,
        Type: "homework",
        ComponentId: chosenSubmission.HomeworkId,
        Grade: parseInt(grade),
        Responses: theseResponses,
        StudentId: chosenStudent.id,
        CourseId: subDetails.CourseId,
        Date: new Date(),
      };

      firebase_CreateDocument(
        "Responses",
        randomString(25),
        args,
        (success) => {
          if (success) {
            alert("Your responses have been posted and sent to the student.");
            setLoading(false);
            setToggleHomeworkRes(false);
            setResponses((prev) =>
              removeDuplicatesByProperty([...prev, args], "id")
            );
          }
        }
      );
    } else {
      alert("Please provide a grade before submitting.");
      setLoading(false);
      setToggleHomeworkRes(false);
    }
  }
  function onSendTestResponse() {
    //
    setLoading(true);
    const theseResponses = [];
    const tempThing = sortObjects(subComponents, "Order");
    for (var idx in tempThing) {
      const correctAnswer = tempThing[idx].Answers;
      const studentAnswers = chosenSubmission.Responses.filter(
        (ting) => ting.Order === parseInt(idx) + 1
      );
      const numPoints = parseInt(
        document.querySelector(`#tbPoints${idx}`).value
      );
      const myResponse = document.querySelector(`#taResponse${idx}`).value;

      const obj = {
        Order: parseInt(idx) + 1,
        CorrectAnswer: correctAnswer,
        StudentAnswer: studentAnswers,
        Points: numPoints,
        Response: myResponse,
      };
      theseResponses.push(obj);
    }
    const args = {
      SubmissionId: chosenSubmission.id,
      Type: "test",
      ComponentId: chosenSubmission.TestId,
      Grade: parseInt(totalPoints),
      Responses: theseResponses,
      StudentId: chosenStudent.id,
      CourseId: subDetails.CourseId,
      Date: new Date(),
    };
    firebase_CreateDocument("Responses", randomString(25), args, (success) => {
      if (success) {
        alert("Your responses have been posted and sent to the student.");
        setLoading(false);
        setToggleTestRes(false);
        setResponses((prev) =>
          removeDuplicatesByProperty([...prev, args], "id")
        );
      }
    });
  }
  function onChangePoints() {
    var total = 0;
    const all = document.querySelectorAll(".input-points");
    for (var input of all) {
      const value = parseInt(input.value === "" ? 0 : input.value);
      total += value;
    }
    const totalNum = subComponents.reduce((total, ting) => {
      const points = parseInt(ting.Points, 10) || 0;
      return total + points;
    }, 0);
    const totalPerc = ((total / totalNum) * 100).toFixed(0);
    setTotalPoints(totalPerc);
  }
  function onChangeKeyQuantity(e) {
    console.log(e.target.value);
    setKeyQuantity(e.target.value);
  }
  async function onCreateKeys() {
    setLoading(true);
    const randomKeys = ["Keys"];
    for (var i = 0; i < parseInt(keyQuantity); i += 1) {
      const code = randomString(16);
      randomKeys.push(code);
      await firebase_CreateDocument(
        "Keys",
        code,
        {
          SchoolId: me.id,
          Key: code,
        },
        (success) => {
          console.log(code);
        }
      );
    }

    const text = randomKeys.join("\n");
    csv_CreateCSV(text);
    setToggleRequest(false);
    setKeyQuantity("Select Quantity");
    setLoading(false);
  }
  function onSubscribeCourse() {
    setLoading(true);
    const subId = randomString(25);
    console.log(selectedCourseId);
    server_PostAPI(
      "stripe-link",
      {
        amount: 20000,
        currency: "usd",
        itemName: "SDGA Professional Grooming Curriculum",
        itemDescription:
          "A comprehensive pet grooming course for upcoming professionals.",
        studentId: chosenStudent.id,
        courseId: selectedCourseId,
      },
      (res) => {
        const url = res.url;
        window.open(url);
        // Reload the current page
        window.location.reload();
      }
    );
    // firebase_CreateDocument(
    //   "CourseSubscriptions",
    //   subId,
    //   {
    //     CourseId: selectedCourseId,
    //     StudentId: chosenStudent.id,
    //   },
    //   (success) => {
    //     if (success) {
    //       setLoading(false);
    //       onGetStudentData(chosenStudent);
    //       setStudentCourses((prev) =>
    //         removeDuplicatesByProperty(
    //           [
    //             ...prev,
    //             {
    //               id: subId,
    //               CourseId: selectedCourseId,
    //               StudentId: chosenStudent.id,
    //             },
    //           ],
    //           "id"
    //         )
    //       );
    //       setToggleCourses(false);
    //     }
    //   }
    // );
  }
  function onPickSubmission(sub) {
    if (chosenSubmission !== null && chosenSubmission.id === sub.id) {
      setChosenSubmission(null);
      setSubDetails(null);
      setSubComponents(null);
    } else {
      setChosenSubmission(sub);
      onGetSubData(sub);
      //
      let total = 0;
      let totalNum = 0;

      // Filter and map to get all EarnedPoints
      const allEarnedPoints = sub.Responses.filter(
        (ting) => ting.EarnedPoints !== undefined
      ).map((ting) => ting.EarnedPoints);
      const allTotalPoints = sub.Responses.filter(
        (ting) => ting.Points !== undefined
      ).map((ting) => ting.Points);

      // Calculate the total points
      total = allEarnedPoints.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      );
      totalNum = allTotalPoints.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      );

      const totalPerc = ((total / totalNum) * 100).toFixed(0);

      // Assuming setTotalPoints is a function to update the state
      setTotalPoints(totalPerc);
    }
  }
  //   #endregion

  //
  useEffect(() => {
    setLoading(true);
    firebase_GetAllDocuments("Courses", (courses) => {
      setAllCourses(courses);
    });
    auth_CheckSignedIn((person) => {
      setMe(person);
      firebase_GetAllDocumentsQueried(
        "Users",
        [{ field: "SchoolId", operator: "==", value: person.id }],
        (things) => {
          setLoading(false);
          setStudents(things);
        }
      );
    }, navigate);
  }, []);

  return (
    <div className="dash-main jakarta">
      {loading && <Loading />}

      {toggleRequest && (
        <div className="request-wrap">
          <div className="request-block">
            <h1 className="no request-title">Student Licenses</h1>
            <p className="no request-info">
              To create an account for a student, you will need to provide them
              with an access key. This key is necessary for the student to
              complete the sign-up process. Please note that while creating an
              account is free, students will not have access to any courses
              until the school purchases the required subscriptions.
            </p>
            <br />
            <select onChange={onChangeKeyQuantity}>
              <option>Select Quantity</option>
              {[...Array(100).keys()].map((num) => (
                <option key={num + 1} value={num + 1}>
                  {num + 1}
                </option>
              ))}
            </select>
            <br />
            <br />
            <div className="split">
              <CancelButton
                text={"Close"}
                onPress={() => {
                  setKeyQuantity("Select Quantity");
                  setToggleRequest(false);
                }}
              />
              {keyQuantity !== "Select Quantity" && (
                <PrimaryButton text={"Create Keys"} onPress={onCreateKeys} />
              )}
            </div>
          </div>
        </div>
      )}
      {toggleCourses && (
        <div className="request-wrap">
          <div className="request-block">
            <h1 className="no request-title">Student Course Subscription</h1>
            <p className="no request-info">
              Please choose the course that this student is intending to enroll
              in.
            </p>
            <br />
            <div className="course-pick-wrap gap_sm">
              {allCourses
                .filter(
                  (ting) =>
                    !studentCourses
                      .map((ting2) => {
                        return ting2.id;
                      })
                      .includes(ting.id)
                )
                .map((course, c) => {
                  return (
                    <div
                      className={`pointer course-pick ${
                        selectedCourseId === course.id && "bg-blue"
                      }`}
                      key={c}
                      onClick={() => {
                        if (selectedCourseId === course.id) {
                          setSelectedCourseId("");
                        } else {
                          setSelectedCourseId(course.id);
                        }
                      }}
                    >
                      <p className="no">{course.Name}</p>
                    </div>
                  );
                })}
            </div>
            {allCourses.length === studentCourses.length && (
              <p className="padding_sm no">No available courses</p>
            )}
            <br />
            <div className="split">
              <CancelButton
                text={"Close"}
                onPress={() => {
                  setSelectedCourseId("");
                  setToggleCourses(false);
                }}
              />
              {selectedCourseId !== "" && (
                <PrimaryButton text={"Continue"} onPress={onSubscribeCourse} />
              )}
            </div>
          </div>
        </div>
      )}

      <SchoolDashNavigation />

      {toggleHomeworkRes && (
        <ActionButtons
          message={"Are you sure you want to send these responses?"}
          buttons={[
            {
              Type: "cancel",
              Text: "Cancel",
              Func: () => {
                setToggleHomeworkRes(false);
              },
            },
            {
              Type: "primary",
              Text: "Send",
              Func: () => {
                onSendHomeworkResponse();
              },
            },
          ]}
        />
      )}
      {toggleTestRes && (
        <ActionButtons
          message={"Are you sure you want to send these responses and grades?"}
          buttons={[
            {
              Type: "cancel",
              Text: "Cancel",
              Func: () => {
                setToggleTestRes(false);
              },
            },
            {
              Type: "primary",
              Text: "Send",
              Func: () => {
                onSendTestResponse();
              },
            },
          ]}
        />
      )}
      <div className="separate_h">
        <div className="school-students-title">Students</div>
        <div className="fit-content padding_h">
          <PrimaryButton
            text={"Request Student Codes"}
            onPress={() => {
              setToggleRequest(true);
            }}
          />
        </div>
      </div>
      <div className="school-student-list">
        {students.map((stud, s) => {
          return (
            <div className="school-student-block" key={s}>
              <div
                className="school-student-block-top separate_h align-center pointer"
                onClick={() => {
                  if (chosenStudent && chosenStudent.id === stud.id) {
                    setChosenStudent(null);
                    setChosenSubmission(null);
                    setSubComponents([]);
                    setSubDetails(null);
                    setSubmissions([]);
                    setStudentCourses([]);
                  } else {
                    onGetStudentData(stud);
                  }
                }}
              >
                <p className="no school-student-nombre">
                  {stud.FirstName} {stud.LastName}
                </p>
                <IoChevronDownSharp size={20} />
              </div>
              {/* CHOSEN STUDENT */}
              {chosenStudent !== null && chosenStudent.id === stud.id && (
                <div className="school-student-block-content">
                  <div className="separate_h">
                    <h2
                      style={{ width: "100%" }}
                      className="no school-student-block-content-title"
                    >
                      Courses
                    </h2>
                    <PrimaryButton
                      text={"Pick Course"}
                      classes={"fit-content no-radius no-wrap"}
                      onPress={() => {
                        setToggleCourses(true);
                      }}
                    />
                  </div>
                  <div className="student-courses">
                    {studentCourses.map((course, c) => {
                      return (
                        <div className="padding" key={c}>
                          <p className="no student-course-block-name">
                            {course.Name}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  {studentCourses.length === 0 && (
                    <p className="no no-length">No courses</p>
                  )}
                  {/* SUBMISSIONS */}
                  <h2 className="no school-student-block-content-title">
                    Submissions
                  </h2>
                  <div className="school-student-sub-blocks">
                    {sortObjects(submissions, "StartTime", "desc").map(
                      (sub, s) => {
                        return (
                          <div key={s} className="school-student-sub-block">
                            {/* TYPE BLOCK: ex. Lesson Submission - Date */}
                            <div
                              className="separate_h align-center padding_sm pointer"
                              onClick={() => {
                                onPickSubmission(sub);
                              }}
                            >
                              <div className="">
                                {/* TYPE */}
                                <p className="no school-student-block-sub-type">
                                  <b
                                    style={{
                                      color:
                                        sub.Type === "lesson"
                                          ? "#289B97"
                                          : sub.Type === "homework"
                                          ? "#117DFA"
                                          : "#5443D4",
                                    }}
                                  >
                                    {sub.Type === "lesson"
                                      ? "Lesson"
                                      : sub.Type === "homework"
                                      ? "Homework"
                                      : "Test"}
                                  </b>
                                </p>
                                {/* DATE */}
                                <p className="no small_text">
                                  {formatDate(
                                    new Date(sub.StartTime.seconds * 1000)
                                  )}
                                </p>
                              </div>
                              <IoChevronDownSharp size={20} />
                            </div>
                            {chosenSubmission !== null &&
                              subDetails !== null &&
                              chosenSubmission.id === sub.id && (
                                <div className="school-student-sub-details">
                                  <div className="school-student-sub-top">
                                    <p className="no school-student-sub-detail-name">
                                      {subDetails.Name}
                                    </p>
                                    <br />
                                    {/* TIME STUFF */}
                                    <div className="gap_sm">
                                      <p className="no label">Start:</p>
                                      <p className="no normal_text">
                                        {formatDate(
                                          new Date(
                                            chosenSubmission.StartTime.seconds *
                                              1000
                                          )
                                        )}
                                      </p>
                                      <p className="no label">Finish:</p>
                                      <p className="no normal_text">
                                        {formatDate(
                                          new Date(
                                            chosenSubmission.EndTime.seconds *
                                              1000
                                          )
                                        )}
                                      </p>
                                      <p className="no label">Total Time:</p>
                                      <p className="no normal_text">
                                        {chosenSubmission.Time}
                                      </p>
                                    </div>
                                  </div>
                                  <br />
                                  {chosenSubmission.Type === "homework" && (
                                    <div className="padding_v gap_sm padding sub-details divisions">
                                      {subComponents !== null &&
                                        chosenSubmission.Responses.map(
                                          (res, r) => {
                                            const homeworkRes =
                                              subComponents.find(
                                                (ting) => ting.Order === r + 1
                                              );
                                            const responseObj = responses.find(
                                              (ting) =>
                                                ting.SubmissionId ===
                                                chosenSubmission.id
                                            );

                                            return (
                                              <div key={r} className="">
                                                <p className="no small_text">
                                                  {r + 1}. {homeworkRes?.Prompt}
                                                </p>
                                                <p className="no padding_v">
                                                  {res
                                                    .split("jjj")
                                                    .map((part, index) => (
                                                      <span key={index}>
                                                        {part}
                                                        {index <
                                                          res.split("jjj")
                                                            .length -
                                                            1 && <br />}
                                                      </span>
                                                    ))}
                                                </p>

                                                <div className="padding_v relative">
                                                  <p className="no label">
                                                    Your response:
                                                  </p>
                                                  {responseObj &&
                                                  responseObj.Responses.some(
                                                    (ting) =>
                                                      ting.Order === r + 1
                                                  ) ? (
                                                    <p className="blue no">
                                                      {responseObj.Responses.find(
                                                        (ting) =>
                                                          ting.Order === r + 1
                                                      )
                                                        .Response.split("jjj")
                                                        .map((part, index) => (
                                                          <span key={index}>
                                                            {part}
                                                            {index <
                                                              res.split("jjj")
                                                                .length -
                                                                1 && <br />}
                                                          </span>
                                                        ))}
                                                    </p>
                                                  ) : (
                                                    <>
                                                      <textarea
                                                        placeholder="Enter response here..."
                                                        className="textarea jakarta input-response"
                                                        id={`taResponse${r}`}
                                                      ></textarea>
                                                      <div
                                                        className="pointer"
                                                        title="Coco AI Assistant"
                                                        style={{
                                                          position: "absolute",
                                                          top: "0px",
                                                          right: "0px",
                                                          backgroundColor:
                                                            "#117DFA",
                                                          padding: "8px",
                                                          borderRadius: "100px",
                                                        }}
                                                        onClick={() => {
                                                          const instructions = `You are providing feedback for an answer that a pet-grooming student gave for this prompt: ${
                                                            homeworkRes.Prompt
                                                          }. If their response is empty, let them know they left the field empty and give them an appropriate answer they can learn from based on the prompt. If they only typed a few words, make sure that it is acceptable. If a longer response is better, then let them know. Go easy on the grading if it is an objective answer. Student answer was: '${res}'. Keep your response to no more than 3 sentences. ${
                                                            homeworkRes?.AIPrompt ||
                                                            ""
                                                          }.`;
                                                          onCocoAIResponse(
                                                            instructions,
                                                            `taResponse${r}`
                                                          );
                                                        }}
                                                      >
                                                        <BsStars
                                                          size={22}
                                                          color="white"
                                                          style={{
                                                            verticalAlign:
                                                              "middle",
                                                          }}
                                                        />
                                                      </div>
                                                    </>
                                                  )}
                                                </div>
                                              </div>
                                            );
                                          }
                                        )}
                                      {!responses.some(
                                        (ting) =>
                                          ting.SubmissionId ===
                                          chosenSubmission.id
                                      ) && (
                                        <div>
                                          <div className="separate_h">
                                            <div></div>
                                            <div className="side-by">
                                              <p className="no normal_text">
                                                Grade:
                                              </p>
                                              <input
                                                type="text"
                                                placeholder="% Grade"
                                                id="tbHomeworkGrade"
                                                className="input-text"
                                              />
                                            </div>
                                          </div>
                                          <br />
                                          <div className="separate_h">
                                            <div></div>
                                            <div className="fit-content">
                                              <PrimaryButton
                                                text={"Send Responses"}
                                                onPress={() =>
                                                  setToggleHomeworkRes(true)
                                                }
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  {chosenSubmission.Type === "test" && (
                                    <div className="padding_v gap_sm padding sub-details divisions">
                                      {subComponents !== null &&
                                        sortObjects(subComponents, "Order").map(
                                          (comp, c) => {
                                            const chosenResponse =
                                              chosenSubmission.Responses.find(
                                                (ting) =>
                                                  ting.Order === comp.Order
                                              )?.StudentAnswer;
                                            const earnedPoints =
                                              chosenSubmission.Responses.find(
                                                (ting) =>
                                                  ting.Order === comp.Order
                                              )?.EarnedPoints;
                                            const responseObj = responses.find(
                                              (ting) =>
                                                ting.SubmissionId ===
                                                chosenSubmission.id
                                            );
                                            const responseDetail =
                                              responseObj?.Responses.find(
                                                (ting) => ting.Order === c + 1
                                              );

                                            const correctAnswers =
                                              chosenSubmission.Responses.find(
                                                (ting) =>
                                                  ting.Order === comp.Order
                                              )?.CorrectAnswer;

                                            const formatTextWithNewLines = (
                                              text
                                            ) =>
                                              text
                                                .split("jjj")
                                                .map((part, index) => (
                                                  <React.Fragment key={index}>
                                                    {part}
                                                    {index <
                                                      text.split("jjj").length -
                                                        1 && <br />}
                                                  </React.Fragment>
                                                ));

                                            return (
                                              <div
                                                className="padding_v"
                                                key={c}
                                              >
                                                <p className="no small_text">
                                                  {c + 1}. {comp.Question}
                                                </p>
                                                <br />
                                                <p className="no label">
                                                  Answer(s):
                                                </p>
                                                <p className="no">
                                                  {chosenResponse
                                                    ? formatTextWithNewLines(
                                                        chosenResponse
                                                      )
                                                    : "No answer"}
                                                </p>
                                                <br />
                                                <p className="no label">
                                                  Correct Answer(s):
                                                </p>
                                                <p className="no green">
                                                  {correctAnswers
                                                    ? formatTextWithNewLines(
                                                        correctAnswers
                                                      )
                                                    : "No answers"}
                                                </p>
                                                <br />
                                                <p className="no label">
                                                  Your Response:
                                                </p>
                                                {responseDetail ? (
                                                  <div>
                                                    <p className="no blue">
                                                      {formatTextWithNewLines(
                                                        responseDetail.Response
                                                      )}
                                                    </p>
                                                    <br />
                                                    <div className="separate_h">
                                                      <div></div>
                                                      <p className="normal_text no green">
                                                        {responseDetail.Points}{" "}
                                                        Points
                                                      </p>
                                                    </div>
                                                  </div>
                                                ) : (
                                                  <div>
                                                    <div className="padding_v relative">
                                                      <textarea
                                                        placeholder="Enter response here..."
                                                        className="textarea jakarta input-response"
                                                        id={`taResponse${c}`}
                                                      ></textarea>
                                                      <div
                                                        className="pointer"
                                                        title="Coco AI Assistant"
                                                        style={{
                                                          position: "absolute",
                                                          top: "0px",
                                                          right: "0px",
                                                          backgroundColor:
                                                            "#117DFA",
                                                          padding: "8px",
                                                          borderRadius: "100px",
                                                        }}
                                                        onClick={() => {
                                                          const instructions = `You are grading a test answer submitted by a pet grooming student. The question is: '${comp.Question}'. The student gave the answer: '${chosenResponse}'. The correct answer is: '${correctAnswers}'. This is a ${comp.Type} question. Give an appropriate response based on their answer. Your response should not be more than 1 sentence unless it is a short answer question.`;

                                                          onCocoAIResponse(
                                                            instructions,
                                                            `taResponse${c}`
                                                          );
                                                          onCocoGradeForMe(
                                                            `Based on the correctness of the pet grooming student's answer, give me a number up to ${comp.Points} points. Student answer: '${chosenResponse}'. The correct answer is: '${correctAnswers}'. ONLY GIVE ME AN INTEGER NUMBER. No words or characters.`,
                                                            `tbPoints${c}`
                                                          );
                                                        }}
                                                      >
                                                        <BsStars
                                                          size={22}
                                                          color="white"
                                                          style={{
                                                            verticalAlign:
                                                              "middle",
                                                          }}
                                                        />
                                                      </div>
                                                    </div>
                                                    <div className="separate_h">
                                                      <div></div>
                                                      <div className="side-by">
                                                        <p className="no normal_text">
                                                          Points:
                                                        </p>
                                                        <input
                                                          type="text"
                                                          className={`input-text input-points`}
                                                          placeholder="# points"
                                                          id={`tbPoints${c}`}
                                                          onChange={
                                                            onChangePoints
                                                          }
                                                          style={{
                                                            maxWidth: "160px",
                                                            backgroundColor:
                                                              earnedPoints !==
                                                              undefined
                                                                ? "#cfdff1"
                                                                : "#F9D6C8",
                                                          }}
                                                          defaultValue={
                                                            earnedPoints !==
                                                            undefined
                                                              ? earnedPoints
                                                              : ""
                                                          }
                                                        />
                                                        <p className="no normal_text">
                                                          / {comp.Points} points
                                                        </p>
                                                      </div>
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                            );
                                          }
                                        )}
                                      {responses.filter(
                                        (ting) =>
                                          ting.SubmissionId ===
                                          chosenSubmission.id
                                      ).length === 0 && (
                                        <div>
                                          <div className="padding_v separate_h">
                                            <div></div>
                                            <div>
                                              <p className="no label">Total</p>
                                              <p className="">{totalPoints}%</p>
                                            </div>
                                          </div>
                                          <div className="separate_h">
                                            <div></div>
                                            <div className="fit-content">
                                              <PrimaryButton
                                                text={"Send Responses"}
                                                onPress={() =>
                                                  setToggleTestRes(true)
                                                }
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      {responses.find(
                                        (ting) =>
                                          ting.SubmissionId ===
                                          chosenSubmission.id
                                      ) && (
                                        <div className="separate_h">
                                          <div></div>
                                          <div className="side-by">
                                            <p>Grade:</p>
                                            <p className="no">
                                              {
                                                responses.find(
                                                  (ting) =>
                                                    ting.SubmissionId ===
                                                    chosenSubmission.id
                                                )?.Grade
                                              }
                                              %
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                          </div>
                        );
                      }
                    )}
                  </div>
                  {submissions.length === 0 && (
                    <p className="no no-length">No submissions</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
