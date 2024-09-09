import { useEffect, useRef, useState } from "react";
import {
  auth_CheckSignedIn,
  firebase_CreateDocument,
  firebase_GetAllDocumentsQueried,
  firebase_GetDocument,
  storage_DownloadMedia,
} from "../Firebase ";
import { useNavigate, useParams } from "react-router-dom";
import { MdDesktopWindows } from "react-icons/md";
import "../STYLES/StudentLesson.css";
import { HiOutlineLightBulb } from "react-icons/hi";
import { FaArrowRightLong } from "react-icons/fa6";
import { CancelButton } from "../COMPONENTS/CancelButton";
import {
  coco_GetResponse,
  function_GetThingsGoing,
  randomString,
  removeDuplicates,
  removeDuplicatesByProperty,
  sortObjects,
} from "../Functions";
import { PrimaryButton } from "../COMPONENTS/PrimaryButton";
import { Loading } from "../UTILITIES/Loading";
import { DestructiveButton } from "../COMPONENTS/DestructiveButton";
import ActionButtons from "../UTILITIES/ActionButtons";
import "../STYLES/StudentTest.css";
import { AsyncImage } from "../UTILITIES/AsyncImage";

export function StudentTest() {
  const { testId } = useParams();
  const intervalRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [me, setMe] = useState(null);
  const [ready, setReady] = useState(false);
  const [test, setTest] = useState(null);
  const [toggleStartTest, setToggleStartTest] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [toggleExit, setToggleExit] = useState(false);
  const startTimeRef = useRef(new Date());
  //
  const [questions, setQuestions] = useState([]);
  const [toggleFinish, setToggleFinish] = useState(false);
  //
  const formatTime = (seconds) => {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${secs}`;
  };
  const startTimer = () => {
    if (intervalRef.current) return; // Prevent multiple intervals
    intervalRef.current = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);
  };
  async function onFinishTest() {
    setLoading(true);
    const finalTime = formatTime(seconds);
    const completionId = randomString(25);
    const inputs = document.querySelectorAll("input:checked");
    const textareas = document.querySelectorAll("textarea");
    const allResponses = [];
    const allNums = []
    const allInputs = []
    for (var input of inputs) {
      const order = parseInt(input.name.split("-")[1]) + 1
      allNums.push(order)
      allInputs.push({ Order: order, Answer: input.value })
    }
    const noDupesNums = removeDuplicates(allNums)

    for (var i of noDupesNums) {
      const thisQuestion = questions.find((ting) => ting.Order === i)
      const filteredInputs = allInputs.filter((ting) => ting.Order === i)
      const answers = filteredInputs.map((ting) => { return ting.Answer }).join(", ")
      const points = parseInt(thisQuestion.Points);
      const correctAnswer = thisQuestion.Answers.length > 1 ? thisQuestion.Answers.filter((ting) => ting.Answer).map((ting) => { return ting.Choice }).join(", ") : thisQuestion.Answers.toString()


      const instructions = `Based on the correctness of the pet grooming student's answer, give me a number up to ${points} points. Question is: ${thisQuestion.Question}. Student answer: '${answers}'. The correct answer is: '${correctAnswer}'. ONLY GIVE ME AN INTEGER NUMBER. No words or characters. And`
      await coco_GetResponse(instructions, (response) => {
        const obj = { Order: i, EarnedPoints: parseInt(response), CorrectAnswer: correctAnswer, StudentAnswer: answers, Points: points }
        allResponses.push(obj)
      })
    }

    // 
    for (var ta of textareas) {
      const thisQuestion = questions.find((ting) => ting.Order === ta)
      const answer = ta.value.replaceAll("\n", "jjj");
      const thisOrder = parseInt(ta.id.split("-")[1]) + 1
      const points = parseInt(questions.find((ting) => ting.Order === thisOrder).Points)
      const correctAnswer = questions.find((ting) => ting.Order === thisOrder).Answers[0]
      const obj = { Order: thisOrder, StudentAnswer: answer, Points: points, CorrectAnswer: correctAnswer };
      allResponses.push(obj);
    }
    const orderedAnswers = sortObjects(allResponses, "Order")

    const args = {
      Time: finalTime,
      StartTime: startTimeRef.current,
      EndTime: new Date(),
      Responses: orderedAnswers,
      UserId: me.id,
      TestId: testId,
      Type: "test"
    };

    firebase_CreateDocument(
      "Completions",
      completionId,
      args,
      (success) => {
        if (success) {
          firebase_CreateDocument('Notifications', randomString(25), {
            SchoolId: me.SchoolId,
            Date: new Date(),
            Message: `${me.FirstName} ${me.LastName} has completed ${test.Name} TEST.`,
            Type: "Test"
          }, (success2) => {
            if (success2) {
              setLoading(false);
              alert(
                "Your school has been notified. You will be leave this page."
              );
              navigate("/student/tests");
            }
          })

        }
      }
    );
  }

  useEffect(() => {
    auth_CheckSignedIn((person) => {
      firebase_GetDocument('Users', person.id, (thisPerson) => {
        setMe(thisPerson)
      })
      function_GetThingsGoing(setReady);
      firebase_GetDocument("Tests", testId, (thisTest) => {
        setTest(thisTest);
        firebase_GetAllDocumentsQueried(
          "Questions",
          [{ field: "TestId", operator: "==", value: testId }],
          (theseQuests) => {
            setQuestions(theseQuests);
          }
        );
      });
    }, navigate);
  }, []);

  return (
    <div className="student-dash jakarta">
      {loading && <Loading />}
      {toggleExit && (
        <ActionButtons
          message={"Are you sure you want to exit this test?"}
          buttons={[
            {
              Type: "cancel",
              Text: "Cancel",
              Func: () => {
                setToggleExit(false);
              },
            },
            {
              Type: "destructive",
              Text: "Exit",
              Func: () => {
                navigate("/student/tests");
              },
            },
          ]}
        />
      )}
      {toggleFinish && (
        <ActionButtons
          message={"Are you sure you want to submit this test?"}
          buttons={[
            {
              Type: "cancel",
              Text: "Cancel",
              Func: () => {
                setToggleFinish(false);
              },
            },
            {
              Type: "primary",
              Text: "Submit",
              Func: () => {
                onFinishTest();
              },
            },
          ]}
        />
      )}
      <div className="mobile">
        <div></div>
        <div>
          <div>
            <MdDesktopWindows className="mobile-icon" />
          </div>
          <h1 className="no mobile-title">Only available in Desktop.</h1>
          <p className="no mobile-caption">
            Please open this page on a laptop or desktop computer.
          </p>
        </div>
        <div></div>
      </div>
      <div className="desktop">
        <div className="lesson-wrap">
          {!toggleStartTest && (
            <div className="lesson-before">
              <h1 className="no">{test !== null && test.Name}</h1>
              <div className="lesson-spacer" />
              <p className="lesson-desc">{test !== null && test.Desc}</p>
              <div className="lesson-spacer" />
              <div className="side-by">
                <HiOutlineLightBulb
                  className="icon-icon"
                  size={30}
                  color="#28D782"
                />
                <p className="no lesson-caption">
                  This timed assessment requires your focused attention to
                  complete it to the best of your ability. Take your time to
                  ensure accuracy and thoroughness in your responses, as this
                  test evaluates your understanding and application of pet
                  grooming and sanitation principles. Your careful consideration
                  and attention to detail will contribute to a successful
                  completion of this assessment.
                </p>
              </div>
              <div className="padding_v side-by">
                <CancelButton
                  text={"Go Back"}
                  classes={"fit-content"}
                  onPress={() => {
                    navigate(`/student/tests`);
                  }}
                />
                <div
                  className="side-by lesson-start-btn pointer"
                  onClick={() => {
                    if (ready) {
                      setToggleStartTest(true);
                      startTimer();
                    }
                  }}
                >
                  <p className="no">{ready ? "start test" : "loading"}</p>
                  <FaArrowRightLong className="lesson-start-btn-icon" />
                </div>
              </div>
            </div>
          )}
          {/* START LESSON HERE */}
          {toggleStartTest && (
            <div className="lesson-main-wrap">
              <div className="lesson-top separate_h">
                <div>
                  <h1 className="no">{test !== null && test.Name}</h1>
                </div>
                <div className="timer">
                  <p className="no">{formatTime(seconds)}</p>
                </div>
              </div>
              <br />
              <div className="test-main fade-in">
                {questions
                  .sort((a, b) => a.Order - b.Order)
                  .map((qui, q) => {
                    return (
                      <div className="test-block" key={q}>
                        {qui.QuestionPath !== undefined && (
                          <div>
                            <AsyncImage
                              imagePath={qui.QuestionPath}
                              width={"100%"}
                            />
                            <br />
                          </div>
                        )}

                        <p className="no test-question">
                          {q + 1}.{qui.Question}
                        </p>
                        {qui.Type === "multiple" && (
                          <div className="padding_v">
                            {/* SHOW MULTIPLE CHOICES */}
                            {qui.Answers.filter((ting) => ting.Answer)
                              .length === 1 && (
                                <div>
                                  {qui.Answers.map((ans, a) => {
                                    if (ans.Choice !== "") {
                                      return (
                                        <div key={a} className="side-by">
                                          <input
                                            type="radio"
                                            name={`rbg-${q}`}
                                            defaultChecked={false}
                                            value={ans.Choice}
                                          />
                                          <p className="no">{ans.Choice}</p>
                                        </div>
                                      );
                                    }
                                  })}
                                </div>
                              )}
                            {qui.Answers.filter((ting) => ting.Answer).length >
                              1 && (
                                <div>
                                  {qui.Answers.map((ans, a) => {
                                    if (ans.Choice !== "") {
                                      return (
                                        <div key={a} className="side-by">
                                          <input
                                            type="checkbox"
                                            name={`cbg-${q}`}
                                            defaultChecked={false}
                                            value={`${ans.Choice}`}
                                          />
                                          <p className="no">{ans.Choice}</p>
                                        </div>
                                      );
                                    }
                                  })}
                                </div>
                              )}
                          </div>
                        )}
                        {qui.Type === "short" && (
                          <div className="padding_v">
                            <textarea
                              id={`ta-${q}`}
                              className="test-textarea jakarta"
                              placeholder="Enter response here..."
                            ></textarea>
                          </div>
                        )}
                        {qui.Type == "truefalse" && (
                          <div className="padding_v">
                            <div className="side-by">
                              <input
                                type="radio"
                                name={`rgb-${q}`}
                                value={true}
                              />
                              <p className="no">true</p>
                            </div>
                            <div className="side-by">
                              <input
                                type="radio"
                                name={`rgb-${q}`}
                                value={false}
                              />
                              <p className="no">false</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
              <div className="lesson-bottom separate_h">
                <div className="side-by">
                  <DestructiveButton
                    text={"Exit"}
                    onPress={() => {
                      setToggleExit(true);
                    }}
                  />
                </div>
                <div>
                  <PrimaryButton
                    text={"Finish!"}
                    classes={"fit-content"}
                    onPress={() => {
                      setToggleFinish(true);
                    }}
                  />{" "}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
