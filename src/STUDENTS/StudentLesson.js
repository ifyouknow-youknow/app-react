import { useEffect, useRef, useState } from "react";
import {
  auth_CheckSignedIn,
  firebase_CreateDocument,
  firebase_DeleteDocument,
  firebase_GetAllDocumentsQueried,
  firebase_GetDocument,
  firebase_UpdateDocument,
  storage_DownloadMedia,
} from "../Firebase ";
import { useNavigate, useParams } from "react-router-dom";
import { MdDesktopWindows } from "react-icons/md";
import "../STYLES/StudentLesson.css";
import { HiOutlineLightBulb } from "react-icons/hi";
import { FaArrowRightLong } from "react-icons/fa6";
import { CancelButton } from "../COMPONENTS/CancelButton";
import {
  function_GetThingsGoing,
  function_textToSpeech,
  randomString,
} from "../Functions";
import { PrimaryButton } from "../COMPONENTS/PrimaryButton";
import { Loading } from "../UTILITIES/Loading";
import { DestructiveButton } from "../COMPONENTS/DestructiveButton";
import ActionButtons from "../UTILITIES/ActionButtons";

export function StudentLesson() {
  // #region DECLARATIONS
  const { lessonId } = useParams();
  const intervalRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [me, setMe] = useState(null);
  const [ready, setReady] = useState(false);
  const [lesson, setLesson] = useState(null);
  const [slides, setSlides] = useState([]);
  const [toggleStartLesson, setToggleStartLesson] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [chosenSlide, setChosenSlide] = useState(null);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [chosenNotes, setChosenNotes] = useState("");
  const [slide, setSlide] = useState(null);
  const [stillPlaying, setStillPlaying] = useState(true);
  const [toggleExit, setToggleExit] = useState(false);
  const startTimeRef = useRef(new Date());
  const [lastSlide, setLastSlide] = useState(null);
  // 
  const [isSavedSlide, setIsSavedSlide] = useState(false);
  const [toggleTakeNotes, setToggleTakeNotes] = useState(false);
  // #endregion
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
  function onFinishLesson() {
    console.log(me)
    setLoading(true);
    const finalTime = formatTime(seconds);
    const completionId = randomString(25);
    const args = {
      Time: finalTime,
      UserId: me.id,
      LessonId: lesson.id,
      StartTime: startTimeRef.current,
      EndTime: new Date(),
      Type: "lesson",
    };
    firebase_DeleteDocument("LastSlides", me.id, (success) => {
      if (success) {
        console.log("BAGEL");
      }
    });
    firebase_CreateDocument("Completions", completionId, args, (success) => {
      if (success) {
        firebase_CreateDocument('Notifications', randomString(25), {
          SchoolId: me.SchoolId,
          Date: new Date(),
          Message: `${me.FirstName} ${me.LastName} has completed ${lesson.Name} LESSON.`,
          Type: 'Lesson'
        }, (success2) => {
          setLoading(false);
          alert("Your school has been notified. You will now leave this page.");
          navigate("/student/lessons");
        })

      }
    });

  }
  function onExitLesson() {
    setLoading(true);
    currentAudio.pause()
    setCurrentAudio(null)
    if (lastSlide !== null) {
      // UPDATE
      console.log(seconds);
      firebase_UpdateDocument(
        "LastSlides",
        me.id,
        { Slide: chosenSlide, Seconds: seconds },
        (success) => {
          if (success) {
            navigate("/student/lessons");
          }
        }
      );
    } else {
      // CREATE
      firebase_CreateDocument(
        "LastSlides",
        me.id,
        { Slide: chosenSlide, Seconds: seconds },
        (success) => {
          if (success) {
            navigate("/student/lessons");
          }
        }
      );
    }
  }
  function onSaveNotes() {
    const notes = document.querySelector("#taNotes").value;
    if (notes.length > 0) {
      setLoading(true)
      firebase_GetDocument('Notes', chosenSlide.id, (thisDoc) => {
        if (thisDoc !== null) {
          firebase_UpdateDocument('Notes', chosenSlide.id, {
            SlidePath: chosenSlide.SlidePath,
            UserId: me.id,
            Notes: notes.replaceAll("\n", "jjj"),
            CourseId: lesson.CourseId,
            Order: chosenSlide.Order
          }, (success) => {
            if (success) {
              setLoading(false)
              alert('Your notes have been saved.')
            }
          })
        } else {
          firebase_CreateDocument('Notes', chosenSlide.id, {
            SlidePath: chosenSlide.SlidePath,
            UserId: me.id,
            Notes: notes.replaceAll("\n", "jjj"),
            CourseId: lesson.CourseId,
            Order: chosenSlide.Order
          }, (success) => {
            if (success) {
              setLoading(false)
              alert('Your notes have been saved.')
            }
          })
        }
      })
    }


    setToggleTakeNotes(false);
  }
  async function onShowNotes() {
    await firebase_GetDocument('Notes', chosenSlide.id, (thisDoc) => {
      if (thisDoc !== null) {
        if (document.querySelector("#taNotes")) {
          document.querySelector("#taNotes").value = thisDoc.Notes.replaceAll("jjj", "\n")
        }
      }
    })
  }

  useEffect(() => {
    auth_CheckSignedIn((person) => {
      firebase_GetDocument('Users', person.id, (thisPerson) => {
        setMe(thisPerson)
      })
      function_GetThingsGoing(setReady);
      firebase_GetDocument("Lessons", lessonId, (thisLesson) => {
        setLesson(thisLesson);
        firebase_GetAllDocumentsQueried(
          "Slides",
          [{ field: "LessonId", operator: "==", value: lessonId }],
          (theseSlides) => {
            setSlides(theseSlides.sort((a, b) => a.Order - b.Order));
            // GET LAST SLIDE
            var jumpToSlide = {};
            firebase_GetDocument("LastSlides", person.id, (thing) => {
              if (thing !== null) {
                setIsSavedSlide(true)
                setLastSlide(thing);
                jumpToSlide = thing.Slide;
                setChosenSlide(jumpToSlide);
                storage_DownloadMedia(jumpToSlide.SlidePath, (img) => {
                  setSlide(img);
                });
                setChosenNotes(jumpToSlide.Notes.replaceAll("jjj", "\n"));
                setSeconds(thing.Seconds);
              } else {
                setChosenSlide(theseSlides[0]);
                storage_DownloadMedia(theseSlides[0].SlidePath, (img) => {
                  setSlide(img);
                });
                setChosenNotes(theseSlides[0].Notes.replaceAll("jjj", "\n"));
              }
            });
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
          message={
            "Are you sure you want to exit this lesson? Your progress will be bookmarked and saved for your return."
          }
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
                onExitLesson();
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
          {!toggleStartLesson && (
            <div className="lesson-before">
              <h1 className="no">{lesson !== null && lesson.Name}</h1>
              <div className="lesson-spacer" />
              <p className="lesson-desc">{lesson !== null && lesson.Desc}</p>
              <div className="lesson-spacer" />
              <div className="side-by">
                <HiOutlineLightBulb
                  className="icon-icon"
                  size={30}
                  color="#28D782"
                />
                <p className="no lesson-caption">
                  This lesson is time-bound, with each slide configured for
                  text-to-speech narration by default. You will not be able to
                  advance to the next slide until the program has completed
                  reading the accompanying notes.
                </p>
              </div>
              <div className="padding_v side-by">
                <CancelButton
                  text={"Go Back"}
                  classes={"fit-content"}
                  onPress={() => {
                    navigate(`/student/lessons`);
                  }}
                />
                <div
                  className="side-by lesson-start-btn pointer"
                  onClick={() => {
                    if (ready) {
                      setToggleStartLesson(true);
                      startTimer();
                      if (isSavedSlide) {
                        function_textToSpeech(
                          chosenSlide.Notes.replaceAll("jjj", "\n"),
                          (thisAudio) => {
                            const audio = new Audio(thisAudio);
                            if (audio.canPlayType('audio/mpeg')) {
                              setCurrentAudio(audio);
                              audio.play();
                            } else {
                              console.error('Audio format not supported by the browser.');
                            }
                            audio.addEventListener("ended", () => {
                              setStillPlaying(false);
                            });
                          }
                        );
                      } else {
                        if (slides[0].Notes !== " ") {
                          function_textToSpeech(
                            slides[0].Notes.replaceAll("jjj", "\n"),
                            (thisAudio) => {
                              const audio = new Audio(thisAudio);
                              if (audio.canPlayType('audio/mpeg')) {
                                setCurrentAudio(audio);
                                audio.play();
                              } else {
                                console.error('Audio format not supported by the browser.');
                              }
                              audio.addEventListener("ended", () => {
                                setStillPlaying(false);
                              });
                            }
                          );
                        } else {
                          setStillPlaying(false);
                          setCurrentAudio(null);
                        }
                      }

                    }
                  }}
                >
                  <p className="no">{ready ? "start lesson" : "loading"}</p>
                  <FaArrowRightLong className="lesson-start-btn-icon" />
                </div>
              </div>
            </div>
          )}
          {/* START LESSON HERE */}
          {toggleStartLesson && (
            <div className="lesson-main-wrap">
              <div className="lesson-top separate_h">
                <div>
                  <h1 className="no">{lesson !== null && lesson.Name}</h1>
                </div>
                <div className="timer">
                  <p className="no">{formatTime(seconds)}</p>
                </div>
              </div>
              <br />
              <div className="lesson-main fade-in">
                <div className="lesson-slide">
                  {slide.includes("Videos") ? (
                    <video
                      width="100%"
                      height="100%"
                      controls
                      src={slide}
                    ></video>
                  ) : (
                    <img src={slide} />
                  )}
                  <p className="no lesson-slide-info">
                    slide {chosenSlide.Order} / {slides.length}
                  </p>
                </div>
                <div className="lesson-side">
                  <p className="no lesson-label">Notes</p>
                  {toggleTakeNotes && <div className="notes-wrap">
                    <div className="notes-top">
                      <h4 className="no">Write down anything you want to remember from this slide.</h4>
                      <p className="no">This slide and your typed notes will be saved for future reference in the Notes section of your portal.</p>
                    </div>
                    <textarea id="taNotes" className="jakarta" placeholder="ex. Remember that there are 30 types of breeds in the Herding Group..">
                    </textarea>
                    <div className="separate_h padding_sm_v">
                      <div></div>
                      <div className="side-by">
                        <CancelButton text={'close'} onPress={() => {
                          setToggleTakeNotes(false)
                        }} />
                        <button onClick={() => {
                          onSaveNotes()
                        }} className="take-notes-btn no-wrap">Save Notes</button>
                      </div>
                    </div>
                  </div>}
                  <p className="lesson-slide-notes">{chosenNotes}</p>

                </div>
              </div>
              <div className="lesson-bottom separate_h">
                <div className="side-by">
                  <DestructiveButton
                    text={"Exit"}
                    onPress={() => {
                      setToggleExit(true);
                    }}
                  />
                  {chosenSlide.Order !== 1 && (
                    <CancelButton
                      text={"Back"}
                      onPress={() => {
                        setToggleTakeNotes(false)
                        if (currentAudio !== null) {
                          setStillPlaying(true);
                          currentAudio.pause();
                        }
                        const backObj = slides.find(
                          (ting) => ting.Order === chosenSlide.Order - 1
                        );
                        setChosenSlide(backObj);
                        setChosenNotes(backObj.Notes.replaceAll("jjj", "\n"));
                        if (backObj.Notes !== " ") {
                          function_textToSpeech(
                            backObj.Notes.replaceAll("jjj", "\n"),
                            (thisAudio) => {
                              const audio = new Audio(thisAudio);
                              audio.play();
                              setCurrentAudio(audio);
                              audio.addEventListener("ended", () => {
                                setStillPlaying(false);
                              });
                            }
                          );
                        } else {
                          setCurrentAudio(null);
                          setStillPlaying(false);
                        }
                        storage_DownloadMedia(backObj.SlidePath, (img) => {
                          setSlide(img);
                        });
                      }}
                    />
                  )}
                </div>
                <div className="side-by">
                  {!toggleTakeNotes && <button onClick={() => {
                    setToggleTakeNotes(true)
                    onShowNotes()
                  }} className="take-notes-btn">{toggleTakeNotes ? 'Close Notes' : 'Take Notes'}</button>}
                  {!stillPlaying && chosenSlide.Order < slides.length && (
                    <div>
                      <PrimaryButton
                        text={"Next Slide"}
                        classes={"fit-content"}
                        onPress={() => {
                          setToggleTakeNotes(false)
                          const nextIdx = chosenSlide.Order + 1;
                          if (currentAudio !== null) {
                            currentAudio.pause();
                          }
                          if (nextIdx <= slides.length) {
                            setLoading(true);
                            setStillPlaying(true);
                            const nextSlide = slides.find(
                              (ting) => ting.Order === nextIdx
                            );
                            const nextSlideNotes = nextSlide.Notes.replaceAll(
                              "jjj",
                              "\n"
                            );
                            setChosenNotes(nextSlideNotes);
                            storage_DownloadMedia(
                              nextSlide.SlidePath,
                              (img) => {
                                setLoading(false);
                                setSlide(img);
                                if (nextSlideNotes !== " ") {
                                  function_textToSpeech(
                                    nextSlideNotes,
                                    (thisAudio) => {
                                      const audio = new Audio(thisAudio);
                                      audio.play();
                                      setCurrentAudio(audio);
                                      audio.addEventListener("ended", () => {
                                        setStillPlaying(false);
                                      });
                                    }
                                  );
                                } else {
                                  setCurrentAudio(null);
                                  setStillPlaying(false);
                                }
                                setChosenSlide(nextSlide);
                              }
                            );
                          }
                        }}
                      />{" "}
                    </div>
                  )}
                  {!stillPlaying && chosenSlide.Order === slides.length && (
                    <div>
                      <PrimaryButton
                        text={"Finish!"}
                        classes={"fit-content"}
                        onPress={onFinishLesson}
                      />{" "}
                    </div>
                  )}
                  {/* <div>
                    <PrimaryButton
                      text={"SKIP"}
                      classes={"fit-content"}
                      onPress={() => {
                        const lastSlide = slides[slides.length - 1];

                        currentAudio.pause();
                        setLoading(true);
                        setStillPlaying(true);
                        const nextSlide = lastSlide;
                        const nextSlideNotes = nextSlide.Notes.replaceAll(
                          "jjj",
                          "\n"
                        );
                        setChosenNotes(nextSlideNotes);
                        storage_DownloadMedia(nextSlide.SlidePath, (img) => {
                          setLoading(false);
                          setSlide(img);
                          if (nextSlideNotes !== " ") {
                            function_textToSpeech(
                              nextSlideNotes,
                              (thisAudio) => {
                                const audio = new Audio(thisAudio);
                                audio.play();
                                setCurrentAudio(audio);
                                audio.addEventListener("ended", () => {
                                  setStillPlaying(false);
                                });
                              }
                            );
                          }
                          setChosenSlide(nextSlide);
                        });
                      }}
                    />
                  </div> */}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
