import { useEffect, useRef, useState } from "react";
import {
  auth_CheckSignedIn,
  firebase_CreateDocument,
  firebase_GetAllDocumentsQueried,
  firebase_GetDocument,
} from "../Firebase ";
import { useNavigate, useParams } from "react-router-dom";
import { HiOutlineLightBulb } from "react-icons/hi2";
import { CancelButton } from "../COMPONENTS/CancelButton";
import { function_GetThingsGoing, randomString } from "../Functions";
import { MdDesktopWindows } from "react-icons/md";
import { FaArrowRightLong } from "react-icons/fa6";
import { PrimaryButton } from "../COMPONENTS/PrimaryButton";
import { DestructiveButton } from "../COMPONENTS/DestructiveButton";
import { Loading } from "../UTILITIES/Loading";
import ActionButtons from "../UTILITIES/ActionButtons";
import "../STYLES/StudentHomework.css";

export function StudentHomework() {
  const { homeworkId } = useParams();
  const navigate = useNavigate();
  const intervalRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [me, setMe] = useState(null);
  const [prompts, setPrompts] = useState([]);
  const [homework, setHomework] = useState(null);
  const [ready, setReady] = useState(false);
  //
  const [toggleStartHomework, setToggleStartHomework] = useState(false);
  const [toggleExit, setToggleExit] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const startTimeRef = useRef(new Date());
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
  function onFinishHomework() {
    setLoading(true);
    const completionId = randomString(25);
    const responses = [];
    for (var idx in prompts) {
      const response = document.querySelector(`#tbPromptResponse${idx}`).value;
      responses.push(response.replaceAll("\n", "jjj"));
    }
    const args = {
      StartTime: startTimeRef.current,
      EndTime: new Date(),
      UserId: me.id,
      HomeworkId: homeworkId,
      Responses: responses,
      Time: formatTime(seconds),
      Type: "homework"
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
            Message: `${me.FirstName} ${me.LastName} has completed ${homework.Name} HOMEWORK.`,
            Type: 'Homework'
          }, (success2) => {
            if (success2) {
              setLoading(false);
              alert(
                "Your school has been notified. You will be leave this page."
              );
              navigate("/student/homeworks");
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
      firebase_GetDocument("Homeworks", homeworkId, (thisHomework) => {
        setHomework(thisHomework);
        firebase_GetAllDocumentsQueried(
          "Prompts",
          [{ field: "HomeworkId", operator: "==", value: homeworkId }],
          (thesePrompts) => {
            setPrompts(thesePrompts.sort((a, b) => a.Order - b.Order));
          }
        );
      });
    }, navigate);
  }, []);

  //
  return (
    <div className="student-dash jakarta">
      {loading && <Loading />}
      {toggleExit && (
        <ActionButtons
          message={"Are you sure you want to exit this homework?"}
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
                navigate("/student/homeworks");
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
          {!toggleStartHomework && (
            <div className="lesson-before">
              <h1 className="no">{homework !== null && homework.Name}</h1>
              <div className="lesson-spacer" />
              <p className="lesson-desc">
                {homework !== null && homework.Desc}
              </p>
              <div className="lesson-spacer" />
              <div className="side-by">
                <HiOutlineLightBulb
                  className="icon-icon"
                  size={30}
                  color="#28D782"
                />
                <p className="no lesson-caption">
                  This assignment is time-constrained; therefore, please provide
                  your responses to the best of your ability to ensure optimal
                  results. Your thorough and precise answers are crucial for
                  achieving the intended learning outcomes within the given
                  timeframe.
                </p>
              </div>
              <div className="padding_v side-by">
                <CancelButton
                  text={"Go Back"}
                  classes={"fit-content"}
                  onPress={() => {
                    navigate(`/student/homeworks`);
                  }}
                />
                <div
                  className="side-by lesson-start-btn pointer"
                  onClick={() => {
                    if (ready) {
                      setToggleStartHomework(true);
                      startTimer();
                    }
                  }}
                >
                  <p className="no">{ready ? "start homework" : "loading"}</p>
                  <FaArrowRightLong className="lesson-start-btn-icon" />
                </div>
              </div>
            </div>
          )}
          {/* START HOMEWORK HERE */}
          {toggleStartHomework && (
            <div className="lesson-main-wrap">
              <div className="lesson-top separate_h">
                <div>
                  <h1 className="no">{homework !== null && homework.Name}</h1>
                </div>
                <div className="timer">
                  <p className="no">{formatTime(seconds)}</p>
                </div>
              </div>
              <br />
              <div className="homework-main fade-in">
                {/* CONTENT HERE */}
                {prompts.sort((a, b) => a.Order - b.Order).map((prompt, p) => {
                  return (
                    <div className="homework-prompt" key={p}>
                      <h3 className="no">
                        {p + 1}. {prompt.Prompt}
                      </h3>
                      <textarea
                        placeholder="Enter response here.."
                        id={`tbPromptResponse${p}`}
                        className="jakarta"
                      />
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
                    onPress={onFinishHomework}
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
