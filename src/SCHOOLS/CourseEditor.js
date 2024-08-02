import React, { useEffect, useState } from "react";
import "../STYLES/CourseEditor.css";
import { MdDesktopWindows } from "react-icons/md";
import { CancelButton } from "../COMPONENTS/CancelButton";
import { DestructiveButton } from "../COMPONENTS/DestructiveButton";
import { PrimaryButton } from "../COMPONENTS/PrimaryButton";
import { useNavigate, useParams } from "react-router-dom";
import {
  function_GetThingsGoing,
  function_textToSpeech,
  randomString,
  removeDuplicatesByProperty,
  scrollToAnchor,
  sortObjects,
} from "../Functions";
import {
  firebase_CreateDocument,
  firebase_DeleteDocument,
  firebase_GetAllDocumentsQueried,
  firebase_GetDocument,
  firebase_UpdateDocument,
  storage_DeleteMedia,
  storage_DownloadMedia,
  storage_UploadMedia,
} from "../Firebase ";
import { IoChevronDownSharp, IoChevronForwardSharp } from "react-icons/io5";
import { FaInfoCircle, FaListAlt } from "react-icons/fa";
import { Accordion } from "../COMPONENTS/Accordion";
import { RiSlideshowFill } from "react-icons/ri";
import { AiOutlinePlus } from "react-icons/ai";
import { Loading } from "../UTILITIES/Loading";
import { MdAddPhotoAlternate } from "react-icons/md";
import { Bubble } from "../UTILITIES/Bubble";
import { RiSpeakFill } from "react-icons/ri";
import { MdPhotoSizeSelectActual } from "react-icons/md";
import { PiVideoFill } from "react-icons/pi";
import ActionButtons from "../UTILITIES/ActionButtons";
import { HiMiniRectangleStack } from "react-icons/hi2";
import { MdTypeSpecimen } from "react-icons/md";
import { BsChatSquareTextFill, BsPatchQuestionFill } from "react-icons/bs";
import { VscSymbolBoolean } from "react-icons/vsc";
import { IoChevronUpSharp } from "react-icons/io5";
import { LuBadgeAlert } from "react-icons/lu";

export function CourseEditor() {
  // #region Declarations
  const { courseId } = useParams();
  const navigation = useNavigate();
  const [loading, setLoading] = useState(false);
  const [courseInfo, setCourseInfo] = useState(null);
  const [courseImage, setCourseImage] = useState(null);
  //
  const [toggleCourseInfo, setToggleCourseInfo] = useState(false);
  const [toggleLesson, setToggleLesson] = useState(false);
  const [toggleHomework, setToggleHomework] = useState(false);
  const [toggleTest, setToggleTest] = useState(false);
  const [togglePlan, setTogglePlan] = useState(false);
  //
  const [lessons, setLessons] = useState([]);
  const [homeworks, setHomeworks] = useState([]);
  const [tests, setTests] = useState([]);
  //
  const [chosenLesson, setChosenLesson] = useState(null);
  const [chosenHomework, setChosenHomework] = useState(null);
  const [chosenTest, setChosenTest] = useState(null);
  //
  const [chosenSlides, setChosenSlides] = useState([]);
  const [chosenPrompts, setChosenPrompts] = useState([]);
  const [chosenQuestions, setChosenQuestions] = useState([]);
  //
  const [toggleBubble, setToggleBubble] = useState(false);
  const [toggleContent, setToggleContent] = useState(true);
  const [toggleExit, setToggleExit] = useState(false);
  const [toggleRemove, setToggleRemove] = useState(false);
  const [toggleRemovePrompt, setToggleRemovePrompt] = useState(false);
  const [toggleRemoveQuestion, setToggleRemoveQuestion] = useState(false);
  //
  const [lessonName, setLessonName] = useState("");
  const [lessonDesc, setLessonDesc] = useState("");
  //
  const [homeworkName, setHomeworkName] = useState("");
  const [homeworkDesc, setHomeworkDesc] = useState("");
  //
  const [testName, setTestName] = useState("");
  const [testDesc, setTestDesc] = useState("");
  //
  const [chosenSlide, setChosenSlide] = useState(null);
  const [slideContent, setSlideContent] = useState(null);
  const [slideTitle, setSlideTitle] = useState("");
  const [slideNotes, setSlideNotes] = useState("");
  //
  const [chosenPrompt, setChosenPrompt] = useState(null);
  const [promptPrompt, setPromptPrompt] = useState("");
  const [promptAICheck, setPromptAICheck] = useState(false);
  const [promptAI, setPromptAI] = useState("");
  const placeholderText = `ex. The five most common dog groups that are groomed are Poodles, Shih Tzus, Yorkshire Terriers (Yorkies), Golden Retrievers, and Lhasa Apsos.

  Accept these answers even if mispelled.`;
  //
  const [chosenQuestion, setChosenQuestion] = useState(null);
  const [questionContent, setQuestionContent] = useState(null);
  const [questionType, setQuestionType] = useState("multiple");
  const [questionText, setQuestionText] = useState("");
  const [questionAICheck, setQuestionAICheck] = useState(false);
  const [questionAI, setQuestionAI] = useState("");
  const [choice1, setChoice1] = useState("");
  const [choice2, setChoice2] = useState("");
  const [choice3, setChoice3] = useState("");
  const [choice4, setChoice4] = useState("");
  const [answer1, setAnswer1] = useState(false);
  const [answer2, setAnswer2] = useState(false);
  const [answer3, setAnswer3] = useState(false);
  const [answer4, setAnswer4] = useState(false);
  const [trueOption, setTrueOption] = useState(false);
  const [falseOption, setFalseOption] = useState(false);
  const [points, setPoints] = useState("");
  //
  const [coursePlan, setCoursePlan] = useState([]);
  // #endregion

  // #region Functions
  function onContinue() {
    const name = document.querySelector("#tbCourseName").value;
    const desc = document.querySelector("#taCourseDesc").value;
    if (name !== "" && desc !== "") {
      setLoading(true);
      const courseId = randomString(25);

      if (courseImage !== null) {
        // HAS IMAGE
        const imagePath = `Images/${randomString(12)}.jpg`;
        const args = {
          Name: name,
          Desc: desc.replaceAll("\n", "jjj"),
          ImagePath: imagePath,
        };
        storage_UploadMedia(courseImage, imagePath, (thisOne) => {
          if (thisOne) {
            firebase_CreateDocument("Courses", courseId, args, (success) => {
              if (success) {
                setLoading(false);
                setCourseInfo({ id: courseId, ...args });
                setToggleCourseInfo(false);
                navigation(`/schools/course-editor/${courseId}`);
              }
            });
          }
        });
      } else {
        const args = {
          Name: name,
          Desc: desc,
        };
        firebase_CreateDocument("Courses", courseId, args, (success) => {
          if (success) {
            setLoading(false);
            setCourseInfo({ id: courseId, ...args });
            setToggleCourseInfo(false);
            navigation(`schools/course-editor/${courseId}`);
          }
        });
      }
    }
  }
  function onChangeCourseImage(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        setCourseImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }
  function onLessonInfoContinue() {
    const lessonName = document.querySelector("#tbLessonName").value;
    const lessonDesc = document.querySelector("#taLessonDesc").value;
    if (lessonName !== "" && lessonDesc !== "") {
      setLoading(true);
      const lessonId = randomString(25);
      const args = {
        Name: lessonName,
        Desc: lessonDesc.replaceAll("\n", "jjj"),
        CourseId: courseInfo.id,
      };
      firebase_CreateDocument("Lessons", lessonId, args, (success) => {
        if (success) {
          setLoading(false);
          setChosenLesson({ id: lessonId, ...args });
          setLessons((prev) =>
            removeDuplicatesByProperty(
              [...prev, { id: lessonId, ...args }],
              "id"
            )
          );
        }
      });
    } else {
      alert("Please provide a name and description before continuing.");
    }
  }
  function onLessonInfoUpdate() {
    const lessonName = document.querySelector("#tbLessonName").value;
    const lessonDesc = document.querySelector("#taLessonDesc").value;
    if (lessonName !== "" && lessonDesc !== "") {
      setLoading(true);
      const lessonId = chosenLesson.id;
      const args = {
        Name: lessonName,
        Desc: lessonDesc.replaceAll("\n", "jjj"),
        CourseId: chosenLesson.CourseId,
      };
      firebase_UpdateDocument("Lessons", lessonId, args, (success) => {
        setLoading(false);
        setToggleBubble(true);
        if (success) {
          setLessons((prevLessons) => {
            return prevLessons.map((lesson) =>
              lesson.id === lessonId ? { id: lessonId, ...args } : lesson
            );
          });
          setChosenLesson({ id: lessonId, ...args });
        }
      });
    } else {
      alert("Please provide all necessary info.");
    }
  }
  function onChangeSlideImage(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        setSlideContent(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }
  function onNewSlide() {
    //
    const slideTitle = document.querySelector("#tbSlideTitle").value;
    const slideNotes = document.querySelector("#taSlideNotes").value;

    if (slideTitle !== "" && slideNotes !== "" && slideContent !== null) {
      setLoading(true);
      const slideId = randomString(25);
      if (toggleContent) {
        // IMAGE WAS UPLOADED
        const slidePath = `Images/${randomString(12)}.jpg`;
        const args = {
          SlidePath: slidePath,
          Title: slideTitle,
          Notes: slideNotes.replaceAll("\n", "jjj"),
          LessonId: chosenLesson.id,
          Order: chosenSlides.length + 1,
        };
        //
        storage_UploadMedia(slideContent, slidePath, (thisOne) => {
          if (thisOne) {
            firebase_CreateDocument("Slides", slideId, args, (thisTwo) => {
              if (thisTwo) {
                setLoading(false);
                // STORE LOCALLY
                setChosenSlides((prev) => [...prev, { id: slideId, ...args }]);
                // CLEAR OUT CHOSEN SLIDE
                setSlideContent(null);
                setToggleContent(true);
                setToggleBubble(true);
                setSlideTitle("");
                setSlideNotes("");
                document.querySelector("#tbSlideTitle").value = "";
                document.querySelector("#taSlideNotes").value = "";
              }
            });
          }
        });
      } else {
        // VIDEO WAS UPLOADED
        const slidePath = `Videos/${randomString(12)}.mp4`;
        const args = {
          SlidePath: slidePath,
          Title: slideTitle,
          Notes: slideNotes.replaceAll("\n", "jjj"),
          LessonId: chosenLesson.id,
          Order: chosenSlides.length + 1,
        };
        //
        storage_UploadMedia(slideContent, slidePath, (thisOne) => {
          if (thisOne) {
            firebase_CreateDocument("Slides", slideId, args, (thisTwo) => {
              if (thisTwo) {
                setLoading(false);
                // STORE LOCALLY
                setChosenSlides((prev) => [...prev, { id: slideId, ...args }]);
                // CLEAR OUT CHOSEN SLIDE
                setSlideContent(null);
                setToggleContent(true);
                setToggleBubble(true);
                setSlideTitle("");
                setSlideNotes("");
                document.querySelector("#tbSlideTitle").value = "";
                document.querySelector("#taSlideNotes").value = "";
              }
            });
          }
        });
      }
    } else {
      alert("Please provide all slide information.");
    }
  }
  function onUpdateSlide() {
    const slideTitle = document.querySelector("#tbSlideTitle").value;
    const slideNotes = document.querySelector("#taSlideNotes").value;

    if (slideTitle !== "" && slideNotes !== "" && slideContent !== null) {
      setLoading(true);
      const slideId = chosenSlide.id;
      var oldSlidePath = chosenSlide.SlidePath;
      var newSlidePath = "";
      if (toggleContent) {
        newSlidePath = `Images/${randomString(12)}.jpg`;
        // IS IMAGE
      } else {
        // IS VIDEO
        newSlidePath = `Videos/${randomString(12)}.mp4`;
      }
      const isSameMedia = slideContent.toString().includes("firebasestorage");

      const args = {
        LessonId: chosenSlide.LessonId,
        Title: slideTitle,
        Notes: slideNotes.replaceAll("\n", "jjj"),
        SlidePath: isSameMedia ? oldSlidePath : newSlidePath,
      };

      if (isSameMedia) {
        // DIDNT CHANGE
        firebase_UpdateDocument("Slides", slideId, args, (thisTwo) => {
          if (thisTwo) {
            setLoading(false);
            setChosenSlides((prev) =>
              prev.map((slide) =>
                slide.id === slideId ? { id: slideId, ...args } : slide
              )
            );
            setChosenSlide({ id: slideId, ...args });
            setToggleBubble(true);
          }
        });
      } else {
        // NEW IMAGE
        storage_UploadMedia(slideContent, newSlidePath, (thisOne) => {
          if (thisOne) {
            firebase_UpdateDocument("Slides", slideId, args, (thisTwo) => {
              if (thisTwo) {
                storage_DeleteMedia(oldSlidePath, (thisThree) => {
                  if (thisThree) {
                    setLoading(false);
                    setChosenSlides((prev) =>
                      prev.map((slide) =>
                        slide.id === slideId ? { id: slideId, ...args } : slide
                      )
                    );
                    setChosenSlide({ id: slideId, ...args });
                    setToggleBubble(true);
                  }
                });
              }
            });
          }
        });
      }
    } else {
      alert("Please fill out all slide information.");
    }
  }
  function onHomeworkInfoContinue() {
    const homeworkName = document.querySelector("#tbHomeworkName").value;
    const homeworkDesc = document.querySelector("#taHomeworkDesc").value;
    if (homeworkName !== "" && homeworkDesc !== "") {
      setLoading(true);
      const homeworkId = randomString(25);
      const args = {
        Name: homeworkName,
        Desc: homeworkDesc.replaceAll("\n", "jjj"),
        CourseId: courseInfo.id,
      };
      firebase_CreateDocument("Homeworks", homeworkId, args, (success) => {
        if (success) {
          setLoading(false);
          setChosenHomework({ id: homeworkId, ...args });
          setHomeworks((prev) =>
            removeDuplicatesByProperty(
              [...prev, { id: homeworkId, ...args }],
              "id"
            )
          );
        }
      });
    } else {
      alert("Please provide a name and description before continuing.");
    }
  }
  function onHomeworkInfoUpdate() {
    const homeworkName = document.querySelector("#tbHomeworkName").value;
    const homeworkDesc = document.querySelector("#taHomeworkDesc").value;
    if (homeworkName !== "" && homeworkDesc !== "") {
      setLoading(true);
      const args = {
        Name: homeworkName,
        Desc: homeworkDesc,
        CourseId: courseInfo.id,
      };
      firebase_UpdateDocument(
        "Homeworks",
        chosenHomework.id,
        args,
        (thisOne) => {
          if (thisOne) {
            setChosenHomework({ id: chosenHomework.id, ...args });
            setHomeworks((prev) =>
              prev.map((homework) =>
                homework.id === chosenHomework.id
                  ? { id: chosenHomework.id, ...args }
                  : homework
              )
            );
            setLoading(false);
            setToggleBubble(true);
          }
        }
      );
    }
  }
  function onNewPrompt() {
    const thisPrompt = document.querySelector("#taPromptPrompt").value;
    // const thisAICheck = document.querySelector("#cbPromptAICheck").checked;
    if (thisPrompt !== "") {
      setLoading(true);
      const thisAI = document.querySelector("#taPromptAI").value;
      if (thisAI !== "") {
        // FINISH HERE
        const promptId = randomString(25);
        const args = {
          HomeworkId: chosenHomework.id,
          Prompt: thisPrompt.replaceAll("\n", "jjj"),
          AICheck: true,
          AIPrompt: thisAI.replaceAll("\n", "jjj"),
          Order: chosenPrompts.length + 1,
        };
        firebase_CreateDocument("Prompts", promptId, args, (thisOne) => {
          if (thisOne) {
            setChosenPrompts((prev) => [...prev, { id: promptId, ...args }]);
            setChosenPrompt(null);
            setPromptPrompt("");
            setPromptAICheck(false);
            setPromptAI("");
            if (document.querySelector("#taPromptPrompt")) {
              document.querySelector("#taPromptPrompt").value = "";
            }
            if (document.querySelector("#taPromptAI")) {
              document.querySelector("#taPromptAI").value = "";
            }
            setLoading(false);
            setToggleBubble(true);
          }
        });
      } else {
        setLoading(false);
        alert("Please provide instructions for grading this prompt.");
      }
    } else {
      alert("Please provide a prompt for this homework.");
    }
  }
  function onUpdatePrompt() {
    const thisPrompt = document.querySelector("#taPromptPrompt").value;

    if (thisPrompt !== "") {
      setLoading(true);
      // WANTS AI
      const thisAI = document.querySelector("#taPromptAI").value;
      if (thisAI !== "") {
        // FINISH HERE
        const promptId = chosenPrompt.id;
        const args = {
          HomeworkId: chosenHomework.id,
          Prompt: thisPrompt.replaceAll("\n", "jjj"),
          AICheck: true,
          AIPrompt: thisAI.replaceAll("\n", "jjj"),
        };
        firebase_UpdateDocument("Prompts", promptId, args, (thisOne) => {
          if (thisOne) {
            setChosenPrompts((prev) =>
              prev.map((prompt) =>
                prompt.id === promptId ? { id: promptId, ...args } : prompt
              )
            );
            setLoading(false);
            setToggleBubble(true);
          }
        });
      } else {
        setLoading(false);
        alert("Please provide instructions for grading this prompt.");
      }
    } else {
      alert("Please provide a prompt for this homework.");
    }
  }
  function onTestInfoContinue() {
    const testName = document.querySelector("#tbTestName").value;
    const testDesc = document.querySelector("#taTestDesc").value;
    if (testName !== "" && testName !== "") {
      setLoading(true);
      const testId = randomString(25);
      const args = {
        Name: testName,
        Desc: testDesc.replaceAll("\n", "jjj"),
        CourseId: courseInfo.id,
      };
      firebase_CreateDocument("Tests", testId, args, (success) => {
        if (success) {
          setLoading(false);
          setChosenTest({ id: testId, ...args });
          setTests((prev) =>
            removeDuplicatesByProperty([...prev, { id: testId, ...args }], "id")
          );
        }
      });
    } else {
      alert("Please provide a name and description before continuing.");
    }
  }
  function onTestInfoUpdate() {
    const testName = document.querySelector("#tbTestName").value;
    const testDesc = document.querySelector("#taTestDesc").value;
    if (testName !== "" && testDesc !== "") {
      setLoading(true);
      const args = {
        Name: testName,
        Desc: testDesc,
        CourseId: courseInfo.id,
      };
      firebase_UpdateDocument("Tests", chosenTest.id, args, (thisOne) => {
        if (thisOne) {
          setChosenTest({ id: chosenTest.id, ...args });
          setTests((prev) =>
            prev.map((test) =>
              test.id === chosenTest.id ? { id: chosenTest.id, ...args } : test
            )
          );
          setLoading(false);
          setToggleBubble(true);
        }
      });
    }
  }
  function onChangeQuestionMedia(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        setQuestionContent(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }
  function onNewQuestion() {
    setLoading(true);
    // CHECK IF THERE IS QUESTION
    const questionId = randomString(25);
    // ELEMENTS
    const _question = document.querySelector("#tbQuestion") ?? "";
    const _choice1 = document.querySelector("#tbChoice1") ?? "";
    const _choice2 = document.querySelector("#tbChoice2") ?? "";
    const _choice3 = document.querySelector("#tbChoice3") ?? "";
    const _choice4 = document.querySelector("#tbChoice4") ?? "";
    const _answer1 = document.querySelector("#cbChoice1") ?? false;
    const _answer2 = document.querySelector("#cbChoice2") ?? false;
    const _answer3 = document.querySelector("#cbChoice3") ?? false;
    const _answer4 = document.querySelector("#cbChoice4") ?? false;
    const _questionAICheck = true;
    const _questionAI = document.querySelector("#taQuestionAI") ?? "";
    const _true = document.querySelector("#rbTrue") ?? false;
    const _false = document.querySelector("#rbFalse") ?? false;
    const _points = document.querySelector("#tbPoints") ?? 0;

    if (_question.value === "") {
      setLoading(false);
      alert("Please provide a question.");
      return;
    }
    if (_points.value === "") {
      setLoading(false);
      alert("Please provide a number of points for this question.");
      return;
    }
    // CHECK IF THERE IS CONTENT
    if (questionContent !== null) {
      // HAS CONTENT
      if (questionType === "multiple") {
        if (
          _choice1.value === "" &&
          _choice2.value === "" &&
          _choice3.value === "" &&
          _choice4.value === ""
        ) {
          setLoading(false);
          alert("Please provide at least one choice.");
          return;
        }
        if (
          !_answer1.checked &&
          !_answer2.checked &&
          !_answer3.checked &&
          !_answer4.checked
        ) {
          setLoading(false);
          alert(
            "Please provide at least one correct answer using the check boxes."
          );
          return;
        }
        // GOOD TO CONTINUE
        var answers = [
          {
            Choice: _choice1.value,
            Answer: _choice1.value !== "" ? _answer1.checked : false,
          },
          {
            Choice: _choice2.value,
            Answer: _choice2.value !== "" ? _answer2.checked : false,
          },
          {
            Choice: _choice3.value,
            Answer: _choice3.value !== "" ? _answer3.checked : false,
          },
          {
            Choice: _choice4.value,
            Answer: _choice4.value !== "" ? _answer4.checked : false,
          },
        ];
        var questionPath = "";
        if (toggleContent) {
          // IS IMAGE
          questionPath = `Images/${randomString(12)}.jpg`;
        } else {
          // IS VIDEO
          questionPath = `Videos/${randomString(12)}/mp4`;
        }
        const args = {
          TestId: chosenTest.id,
          Question: _question.value,
          Answers: answers,
          AICheck: true,
          Type: "multiple",
          QuestionPath: questionPath,
          Order: chosenQuestions.length + 1,
          Points: parseInt(_points.value),
        };
        const obj = {
          id: questionId,
          ...args,
        };
        storage_UploadMedia(questionContent, questionPath, (thisOne) => {
          if (thisOne) {
            firebase_CreateDocument(
              "Questions",
              questionId,
              args,
              (thisTwo) => {
                if (thisTwo) {
                  setLoading(false);
                  setToggleBubble(true);
                  setChosenQuestion(null);
                  setQuestionContent(null);
                  setQuestionText("");
                  setChoice1("");
                  setAnswer1(false);
                  setChoice2("");
                  setAnswer2(false);
                  setChoice3("");
                  setAnswer3(false);
                  setChoice4("");
                  setAnswer4(false);
                  setChosenQuestions((prev) => [...prev, obj]);
                  setQuestionType("multiple");
                  setPoints("");
                  _question.value = "";
                  _choice1.value = "";
                  _choice2.value = "";
                  _choice3.value = "";
                  _choice4.value = "";
                  _answer1.checked = false;
                  _answer2.checked = false;
                  _answer3.checked = false;
                  _answer4.checked = false;
                }
              }
            );
          }
        });
      }
      if (questionType === "short") {
        if (_questionAI.value === "") {
          setLoading(false);
          alert(
            "Please provide guidelines or rules for grading this question using Coco AI."
          );
          return;
        }
        var questionPath = "";
        if (toggleContent) {
          // IS IMAGE
          questionPath = `Images/${randomString(12)}.jpg`;
        } else {
          // IS VIDEO
          questionPath = `Videos/${randomString(12)}/mp4`;
        }
        const args = {
          TestId: chosenTest.id,
          Question: _question.value,
          Answers: [_questionAI.value.replaceAll("\n", "jjj")],
          AICheck: true,
          Type: questionType,
          QuestionPath: questionPath,
          Order: chosenQuestions.length + 1,
          Points: _points.value,
        };
        const obj = {
          id: questionId,
          ...args,
        };
        storage_UploadMedia(questionContent, questionPath, (thisOne) => {
          firebase_CreateDocument("Questions", questionId, args, (thisTwo) => {
            if (thisTwo) {
              setLoading(false);
              setToggleBubble(true);
              setChosenQuestion(null);
              setQuestionContent(null);
              setChosenQuestions((prev) => [...prev, obj]);
              setQuestionType("short");
              setQuestionAICheck(false);
              setQuestionAI("");
              setQuestionText("");
              setPoints("");
              _question.value = "";

              if (_questionAI !== null) {
                _questionAI.value = "";
              }
            }
          });
        });
      }
      if (questionType === "truefalse") {
        if (!_true.checked && !_false.checked) {
          setLoading(false);
          alert("Please choose if the answer is true or false.");
          return;
        }
        //
        var questionPath = "";
        if (toggleContent) {
          // IS IMAGE
          questionPath = `Images/${randomString(12)}.jpg`;
        } else {
          // IS VIDEO
          questionPath = `Videos/${randomString(12)}/mp4`;
        }
        const args = {
          TestId: chosenTest.id,
          Question: _question.value,
          Answers: [_true.checked ? true : false],
          AICheck: true,
          Type: questionType,
          QuestionPath: questionPath,
          Order: chosenQuestions.length + 1,
          Points: _points.value,
        };
        const obj = {
          if: questionId,
          ...args,
        };
        storage_UploadMedia(questionContent, questionPath, (thisOne) => {
          if (thisOne) {
            firebase_CreateDocument(
              "Questions",
              questionId,
              args,
              (thisTwo) => {
                if (thisTwo) {
                  setLoading(false);
                  setToggleBubble(true);
                  setQuestionContent(null);
                  setQuestionText("");
                  _question.value = "";
                  setChosenQuestion(null);
                  setChosenQuestions((prev) => [...prev, obj]);
                  _true.checked = false;
                  _false.checked = false;
                  setPoints("");
                }
              }
            );
          }
        });
      }
    } else {
      // DOES NOT HAVE CONTENT
      if (questionType === "multiple") {
        if (
          _choice1.value === "" &&
          _choice2.value === "" &&
          _choice3.value === "" &&
          _choice4.value === ""
        ) {
          setLoading(false);
          alert("Please provide at least one choice.");
          return;
        }
        if (
          !_answer1.checked &&
          !_answer2.checked &&
          !_answer3.checked &&
          !_answer4.checked
        ) {
          setLoading(false);
          alert(
            "Please provide at least one correct answer using the check boxes."
          );
          return;
        }
        // GOOD TO CONTINUE
        var answers = [
          {
            Choice: _choice1.value,
            Answer: _choice1.value !== "" ? _answer1.checked : false,
          },
          {
            Choice: _choice2.value,
            Answer: _choice2.value !== "" ? _answer2.checked : false,
          },
          {
            Choice: _choice3.value,
            Answer: _choice3.value !== "" ? _answer3.checked : false,
          },
          {
            Choice: _choice4.value,
            Answer: _choice4.value !== "" ? _answer4.checked : false,
          },
        ];
        const args = {
          TestId: chosenTest.id,
          Question: _question.value,
          Answers: answers,
          AICheck: true,
          Type: "multiple",
          Order: chosenQuestions.length + 1,
          Points: _points.value,
        };
        const obj = {
          id: questionId,
          ...args,
        };
        firebase_CreateDocument("Questions", questionId, args, (thisOne) => {
          if (thisOne) {
            setLoading(false);
            setToggleBubble(true);
            setChosenQuestion(null);
            setChoice1("");
            setAnswer1(false);
            setChoice2("");
            setAnswer2(false);
            setChoice3("");
            setAnswer3(false);
            setChoice4("");
            setAnswer4(false);
            setChosenQuestions((prev) => [...prev, obj]);
            setQuestionType("multiple");
            setQuestionText("");
            setPoints("");
            _question.value = "";
            _choice1.value = "";
            _choice2.value = "";
            _choice3.value = "";
            _choice4.value = "";
            _answer1.checked = false;
            _answer2.checked = false;
            _answer3.checked = false;
            _answer4.checked = false;
          }
        });
        console.log(answers);
      }
      if (questionType === "short") {
        if (_questionAI.value === "") {
          setLoading(false);
          alert(
            "Please provide guidelines or rules for grading this question using Coco AI."
          );
          return;
        }
        const args = {
          TestId: chosenTest.id,
          Question: _question.value,
          Answers: [_questionAI.value.replaceAll("\n", "jjj")],
          AICheck: true,
          Type: questionType,
          Order: chosenQuestions.length + 1,
          Points: _points.value,
        };
        const obj = {
          id: questionId,
          ...args,
        };
        firebase_CreateDocument("Questions", questionId, args, (thisOne) => {
          if (thisOne) {
            setLoading(false);
            setToggleBubble(true);
            setChosenQuestion(null);
            setChosenQuestions((prev) => [...prev, obj]);
            setQuestionType("short");
            setQuestionAICheck(false);
            setQuestionAI("");
            setQuestionText("");
            setPoints("");
            _question.value = "";

            if (_questionAI !== null) {
              _questionAI.value = "";
            }
          }
        });
      }
      if (questionType === "truefalse") {
        if (!_true.checked && !_false.checked) {
          setLoading(false);
          alert("Please choose if the answer is true or false.");
          return;
        }
        //
        const args = {
          TestId: chosenTest.id,
          Question: _question.value,
          Answers: [_true.checked ? _true.checked : _false.checked],
          AICheck: true,
          Type: questionType,
          Order: chosenQuestions.length + 1,
          Points: _points.value,
        };
        const obj = {
          if: questionId,
          ...args,
        };
        firebase_CreateDocument("Questions", questionId, args, (thisOne) => {
          if (thisOne) {
            setLoading(false);
            setToggleBubble(true);
            _question.value = "";
            setChosenQuestion(null);
            setChosenQuestions((prev) => [...prev, obj]);
            setQuestionText("");
            _true.checked = false;
            _false.checked = false;
            setPoints("");
          }
        });
      }
    }
  }
  function onUpdateQuestion() {
    setLoading(true);
    // CHECK IF THERE IS QUESTION
    const questionId = chosenQuestion.id;
    const oldPath = chosenQuestion.QuestionPath;
    // ELEMENTS
    const _question = document.querySelector("#tbQuestion");
    const _choice1 = document.querySelector("#tbChoice1");
    const _choice2 = document.querySelector("#tbChoice2");
    const _choice3 = document.querySelector("#tbChoice3");
    const _choice4 = document.querySelector("#tbChoice4");
    const _answer1 = document.querySelector("#cbChoice1");
    const _answer2 = document.querySelector("#cbChoice2");
    const _answer3 = document.querySelector("#cbChoice3");
    const _answer4 = document.querySelector("#cbChoice4");

    const _questionAI = document.querySelector("#taQuestionAI");
    const _true = document.querySelector("#rbTrue");
    const _false = document.querySelector("#rbFalse");
    const _points = document.querySelector("#tbPoints");

    if (_question.value === "") {
      setLoading(false);
      alert("Please provide a question.");
      return;
    }
    if (_points.value === "") {
      setLoading(false);
      alert("Please provide a number of points for this question.");
      return;
    }

    var questionPath = "";
    if (questionContent !== null) {
      if (toggleContent) {
        // IS IMAGE
        questionPath = `Images/${randomString(12)}.jpg`;
      } else {
        // IS VIDEO
        questionPath = `Videos/${randomString(12)}.mp4`;
      }
    }

    if (questionType === "multiple") {
      if (
        _choice1.value === "" &&
        _choice2.value === "" &&
        _choice3.value === "" &&
        _choice4.value === ""
      ) {
        setLoading(false);
        alert("Provide at least one choice.");
        return;
      }
      if (
        _answer1.checked === false &&
        _answer2.checked === false &&
        _answer3.checked === false &&
        _answer4.checked === false
      ) {
        setLoading(false);
        alert("Provide at least one answer using the checkboxes.");
        return;
      }
      //
      const answers = [
        { Choice: _choice1.value, Answer: _answer1.checked },
        { Choice: _choice2.value, Answer: _answer2.checked },
        { Choice: _choice3.value, Answer: _answer3.checked },
        { Choice: _choice4.value, Answer: _answer4.checked },
      ];

      const args = {
        TestId: chosenTest.id,
        Question: _question.value,
        Answers: answers,
        AICheck: true,
        Type: questionType,
        Points: _points.value,
      };
      const obj = {
        id: questionId,
        ...args,
      };

      if (questionContent !== null) {
        // HAS MEDIA
        const hasSameMedia = questionContent.includes(
          "firebasestorage.googleapis.com"
        );
        if (hasSameMedia) {
          firebase_UpdateDocument("Questions", questionId, args, (thisTwo) => {
            if (thisTwo) {
              setLoading(false);
              setToggleBubble(true);
              setChosenQuestions((prev) =>
                prev.map((question) =>
                  question.id === questionId ? obj : question
                )
              );
              setChosenQuestion({ ...obj, QuestionPath: questionPath });
            }
          });
        } else {
          const newArgs = {
            ...args,
            QuestionPath: questionPath,
          };
          const newObj = {
            id: questionId,
            ...newArgs,
          };
          storage_UploadMedia(questionContent, questionPath, (thisOne) => {
            if (thisOne) {
              firebase_UpdateDocument(
                "Questions",
                questionId,
                newArgs,
                (thisTwo) => {
                  if (thisTwo) {
                    if (oldPath !== undefined) {
                      storage_DeleteMedia(oldPath, (thisThree) => {
                        if (thisThree) {
                          setLoading(false);
                          setToggleBubble(true);
                          setChosenQuestions((prev) =>
                            prev.map((question) =>
                              question.id === questionId ? newObj : question
                            )
                          );
                          setChosenQuestion(newObj);
                        }
                      });
                    } else {
                      setLoading(false);
                      setToggleBubble(true);
                      setChosenQuestions((prev) =>
                        prev.map((question) =>
                          question.id === questionId ? newObj : question
                        )
                      );
                      setChosenQuestion(newObj);
                    }
                  }
                }
              );
            }
          });
        }
      } else {
        // NO MEDIA
        firebase_UpdateDocument("Questions", questionId, args, (thisTwo) => {
          if (thisTwo) {
            setLoading(false);
            setToggleBubble(true);
            setChosenQuestions((prev) =>
              prev.map((question) =>
                question.id === questionId ? obj : question
              )
            );
            setChosenQuestion(obj);
          }
        });
      }
    }
    if (questionType === "short") {
      if (_questionAI.value === "") {
        setLoading(false);
        alert("Please provide guidelines or rules for the Coco AI.");
        return;
      }
      // WERE GOOD
      const args = {
        TestId: chosenTest.id,
        Question: _question.value,
        Answers: [_questionAI.value.replaceAll("\n", "jjj")],
        AICheck: true,
        Type: questionType,
        Points: _points.value,
      };
      const obj = {
        id: questionId,
        ...args,
      };
      if (questionContent !== null) {
        // HAS IMAGE
        const hasSameMedia = questionContent.includes(
          "firebasestorage.googleapis.com"
        );
        if (hasSameMedia) {
          firebase_UpdateDocument("Questions", questionId, args, (thisTwo) => {
            if (thisTwo) {
              setLoading(false);
              setToggleBubble(true);
              setChosenQuestions((prev) =>
                prev.map((question) =>
                  question.id === questionId ? obj : question
                )
              );
              setChosenQuestion(obj);
            }
          });
        } else {
          const newArgs = {
            ...args,
            QuestionPath: questionPath,
          };
          const newObj = {
            id: questionId,
            ...newArgs,
          };
          storage_UploadMedia(questionContent, questionPath, (thisOne) => {
            if (thisOne) {
              firebase_UpdateDocument(
                "Questions",
                questionId,
                newArgs,
                (thisTwo) => {
                  if (thisTwo) {
                    if (oldPath !== undefined) {
                      storage_DeleteMedia(oldPath, (thisThree) => {
                        if (thisThree) {
                          setLoading(false);
                          setToggleBubble(true);
                          setChosenQuestions((prev) =>
                            prev.map((question) =>
                              question.id === questionId ? newObj : question
                            )
                          );
                          setChosenQuestion(newObj);
                        }
                      });
                    } else {
                      setLoading(false);
                      setToggleBubble(true);
                      setChosenQuestions((prev) =>
                        prev.map((question) =>
                          question.id === questionId ? newObj : question
                        )
                      );
                      setChosenQuestion(newObj);
                    }
                  }
                }
              );
            }
          });
        }
      } else {
        // DOES NOT HAVE
        firebase_UpdateDocument("Questions", questionId, args, (thisTwo) => {
          if (thisTwo) {
            setLoading(false);
            setToggleBubble(true);
            setChosenQuestions((prev) =>
              prev.map((question) =>
                question.id === questionId ? obj : question
              )
            );
            setChosenQuestion(obj);
          }
        });
      }
    }
    if (questionType === "truefalse") {
      if (_true.checked && _false.checked) {
        setLoading(false);
        alert("Please provide an answer for this question.");
        return;
      }
      const args = {
        TestId: chosenTest.id,
        Question: _question.value,
        Answers: [_true.checked ? true : false],
        AICheck: true,
        Type: questionType,
        Points: _points.value,
      };
      const obj = {
        id: questionId,
        ...args,
      };

      if (questionContent !== null) {
        // HAS MEDIA
        const hasSameMedia = questionContent.includes(
          "firebasestorage.googleapis.com"
        );
        if (hasSameMedia) {
          firebase_UpdateDocument("Questions", questionId, args, (thisTwo) => {
            if (thisTwo) {
              setLoading(false);
              setToggleBubble(true);
              setChosenQuestions((prev) =>
                prev.map((question) =>
                  question.id === questionId ? obj : question
                )
              );
              setChosenQuestion(obj);
              if (obj.Answers[0]) {
                setFalseOption(false);
                setTrueOption(true);
              } else {
                setFalseOption(true);
                setTrueOption(false);
              }
            }
          });
        } else {
          const newArgs = {
            ...args,
            QuestionPath: questionPath,
          };
          const newObj = {
            id: questionId,
            ...newArgs,
          };
          storage_UploadMedia(questionContent, questionPath, (thisOne) => {
            if (thisOne) {
              firebase_UpdateDocument(
                "Questions",
                questionId,
                newArgs,
                (thisTwo) => {
                  if (thisTwo) {
                    if (oldPath !== undefined) {
                      storage_DeleteMedia(oldPath, (thisThree) => {
                        if (thisThree) {
                          setLoading(false);
                          setToggleBubble(true);
                          setChosenQuestions((prev) =>
                            prev.map((question) =>
                              question.id === questionId ? newObj : question
                            )
                          );
                          setChosenQuestion(newObj);
                          if (newObj.Answers[0]) {
                            setFalseOption(false);
                            setTrueOption(true);
                          } else {
                            setFalseOption(true);
                            setTrueOption(false);
                          }
                        }
                      });
                    } else {
                      setLoading(false);
                      setToggleBubble(true);
                      setChosenQuestions((prev) =>
                        prev.map((question) =>
                          question.id === questionId ? newObj : question
                        )
                      );
                      setChosenQuestion(newObj);
                    }
                  }
                }
              );
            }
          });
        }
      } else {
        // NO MEDIA
        firebase_UpdateDocument("Questions", questionId, args, (thisTwo) => {
          if (thisTwo) {
            setLoading(false);
            setToggleBubble(true);
            setChosenQuestions((prev) =>
              prev.map((question) =>
                question.id === questionId ? obj : question
              )
            );
            setChosenQuestion(obj);
            if (obj.Answers[0]) {
              setFalseOption(false);
              setTrueOption(true);
            } else {
              setFalseOption(true);
              setTrueOption(false);
            }
          }
        });
      }
    }
  }
  function onMoveSlideUp(slide) {
    const newOrder = slide.Order - 1;
    if (slide.Order > 1) {
      setLoading(true);
      // FIND THE ONE WITH A SMALLER ORDER
      firebase_GetAllDocumentsQueried(
        "Slides",
        [
          { field: "LessonId", operator: "==", value: chosenLesson.id },
          { field: "Order", operator: "==", value: newOrder },
        ],
        (smallerOne) => {
          const nextSlide = smallerOne[0];
          firebase_UpdateDocument(
            "Slides",
            nextSlide.id,
            { Order: slide.Order },
            (success) => {
              if (success) {
                firebase_UpdateDocument(
                  "Slides",
                  slide.id,
                  { Order: newOrder },
                  (successTwo) => {
                    if (successTwo) {
                      setLoading(false);
                      setChosenSlides((prev) =>
                        prev.map((ting) =>
                          ting.id === slide.id
                            ? { ...slide, Order: newOrder }
                            : ting
                        )
                      );
                      setChosenSlides((prev) =>
                        prev.map((ting) =>
                          ting.id === nextSlide.id
                            ? { ...nextSlide, Order: slide.Order }
                            : ting
                        )
                      );
                    }
                  }
                );
              }
            }
          );
        }
      );
    }
  }
  function onMoveSlideDown(slide) {
    const newOrder = slide.Order + 1;
    if (slide.Order < chosenSlides.length) {
      setLoading(true);
      // FIND THE ONE WITH A LARGER ORDER
      firebase_GetAllDocumentsQueried(
        "Slides",
        [
          { field: "LessonId", operator: "==", value: chosenLesson.id },
          { field: "Order", operator: "==", value: newOrder },
        ],
        (largerOne) => {
          const nextSlide = largerOne[0];
          firebase_UpdateDocument(
            "Slides",
            nextSlide.id,
            { Order: slide.Order },
            (success) => {
              if (success) {
                firebase_UpdateDocument(
                  "Slides",
                  slide.id,
                  { Order: newOrder },
                  (successTwo) => {
                    if (successTwo) {
                      setLoading(false);
                      setChosenSlides((prev) =>
                        prev.map((ting) =>
                          ting.id === slide.id
                            ? { ...slide, Order: newOrder }
                            : ting
                        )
                      );
                      setChosenSlides((prev) =>
                        prev.map((ting) =>
                          ting.id === nextSlide.id
                            ? { ...nextSlide, Order: slide.Order }
                            : ting
                        )
                      );
                    }
                  }
                );
              }
            }
          );
        }
      );
    }
  }
  function onMovePromptUp(slide) {
    const newOrder = slide.Order - 1;
    if (slide.Order > 1) {
      setLoading(true);
      // FIND THE ONE WITH A SMALLER ORDER
      firebase_GetAllDocumentsQueried(
        "Prompts",
        [
          { field: "HomeworkId", operator: "==", value: chosenHomework.id },
          { field: "Order", operator: "==", value: newOrder },
        ],
        (smallerOne) => {
          const nextSlide = smallerOne[0];
          firebase_UpdateDocument(
            "Prompts",
            nextSlide.id,
            { Order: slide.Order },
            (success) => {
              if (success) {
                firebase_UpdateDocument(
                  "Prompts",
                  slide.id,
                  { Order: newOrder },
                  (successTwo) => {
                    if (successTwo) {
                      setLoading(false);
                      setChosenPrompts((prev) =>
                        prev.map((ting) =>
                          ting.id === slide.id
                            ? { ...slide, Order: newOrder }
                            : ting
                        )
                      );
                      setChosenPrompts((prev) =>
                        prev.map((ting) =>
                          ting.id === nextSlide.id
                            ? { ...nextSlide, Order: slide.Order }
                            : ting
                        )
                      );
                    }
                  }
                );
              }
            }
          );
        }
      );
    }
  }
  function onMovePromptDown(slide) {
    const newOrder = slide.Order + 1;
    if (slide.Order < chosenPrompts.length) {
      setLoading(true);
      // FIND THE ONE WITH A LARGER ORDER
      firebase_GetAllDocumentsQueried(
        "Prompts",
        [
          { field: "HomeworkId", operator: "==", value: chosenHomework.id },
          { field: "Order", operator: "==", value: newOrder },
        ],
        (largerOne) => {
          const nextSlide = largerOne[0];
          firebase_UpdateDocument(
            "Prompts",
            nextSlide.id,
            { Order: slide.Order },
            (success) => {
              if (success) {
                firebase_UpdateDocument(
                  "Prompts",
                  slide.id,
                  { Order: newOrder },
                  (successTwo) => {
                    if (successTwo) {
                      setLoading(false);
                      setChosenPrompts((prev) =>
                        prev.map((ting) =>
                          ting.id === slide.id
                            ? { ...slide, Order: newOrder }
                            : ting
                        )
                      );
                      setChosenPrompts((prev) =>
                        prev.map((ting) =>
                          ting.id === nextSlide.id
                            ? { ...nextSlide, Order: slide.Order }
                            : ting
                        )
                      );
                    }
                  }
                );
              }
            }
          );
        }
      );
    }
  }
  function onMoveQuestionUp(slide) {
    const newOrder = slide.Order - 1;
    if (slide.Order > 1) {
      setLoading(true);
      // FIND THE ONE WITH A SMALLER ORDER
      firebase_GetAllDocumentsQueried(
        "Questions",
        [
          { field: "TestId", operator: "==", value: chosenTest.id },
          { field: "Order", operator: "==", value: newOrder },
        ],
        (smallerOne) => {
          const nextSlide = smallerOne[0];
          firebase_UpdateDocument(
            "Questions",
            nextSlide.id,
            { Order: slide.Order },
            (success) => {
              if (success) {
                firebase_UpdateDocument(
                  "Questions",
                  slide.id,
                  { Order: newOrder },
                  (successTwo) => {
                    if (successTwo) {
                      setLoading(false);
                      setChosenQuestions((prev) =>
                        prev.map((ting) =>
                          ting.id === slide.id
                            ? { ...slide, Order: newOrder }
                            : ting
                        )
                      );
                      setChosenQuestions((prev) =>
                        prev.map((ting) =>
                          ting.id === nextSlide.id
                            ? { ...nextSlide, Order: slide.Order }
                            : ting
                        )
                      );
                    }
                  }
                );
              }
            }
          );
        }
      );
    }
  }
  function onMoveQuestionDown(slide) {
    const newOrder = slide.Order + 1;
    if (slide.Order < chosenQuestions.length) {
      setLoading(true);
      // FIND THE ONE WITH A LARGER ORDER
      firebase_GetAllDocumentsQueried(
        "Questions",
        [
          { field: "TestId", operator: "==", value: chosenTest.id },
          { field: "Order", operator: "==", value: newOrder },
        ],
        (largerOne) => {
          const nextSlide = largerOne[0];
          firebase_UpdateDocument(
            "Questions",
            nextSlide.id,
            { Order: slide.Order },
            (success) => {
              if (success) {
                firebase_UpdateDocument(
                  "Questions",
                  slide.id,
                  { Order: newOrder },
                  (successTwo) => {
                    if (successTwo) {
                      setLoading(false);
                      setChosenQuestions((prev) =>
                        prev.map((ting) =>
                          ting.id === slide.id
                            ? { ...slide, Order: newOrder }
                            : ting
                        )
                      );
                      setChosenQuestions((prev) =>
                        prev.map((ting) =>
                          ting.id === nextSlide.id
                            ? { ...nextSlide, Order: slide.Order }
                            : ting
                        )
                      );
                    }
                  }
                );
              }
            }
          );
        }
      );
    }
  }
  function onSaveCoursePlan() {
    //
    setLoading(true);
    const newPlan = coursePlan.map((ting, idx) => {
      return {
        id: ting.id,
        Name: ting.Name,
        Order: parseInt(idx) + 1,
        Type: ting.Type,
      };
    });
    firebase_GetDocument("Plans", courseId, (plan) => {
      if (plan === null) {
        // CREATE
        firebase_CreateDocument(
          "Plans",
          courseId,
          { Plan: newPlan },
          (success) => {
            if (success) {
              setLoading(false);
              setToggleBubble(true);
            }
          }
        );
      } else {
        // UPDATE
        firebase_UpdateDocument(
          "Plans",
          courseId,
          { Plan: newPlan },
          (success) => {
            if (success) {
              setLoading(false);
              setToggleBubble(true);
            }
          }
        );
      }
    });
  }
  function onRemoveSlide() {
    setLoading(true);
    const oldImagePath = chosenSlide.SlidePath;
    const slideId = chosenSlide.id;
    firebase_DeleteDocument("Slides", slideId, (success) => {
      if (success) {
        if (oldImagePath !== undefined && oldImagePath !== "") {
          storage_DeleteMedia(oldImagePath, (success2) => {
            if (success2) {
              setLoading(false);
              setToggleBubble(true);
              setToggleRemove(false);
              setChosenSlide(null);
              setSlideContent(null);
              setSlideNotes("");
              setSlideTitle("");
              setChosenSlides((prev) =>
                removeDuplicatesByProperty(
                  [...prev.filter((ting) => ting.id !== slideId)],
                  "id"
                )
              );
            }
          });
        } else {
          setLoading(false);
          setToggleBubble(true);
          setToggleRemove(false);
          setChosenSlide(null);
          setSlideContent(null);
          setSlideNotes("");
          setSlideTitle("");

          setChosenSlides((prev) =>
            removeDuplicatesByProperty(
              [...prev.filter((ting) => ting.id !== slideId)],
              "id"
            )
          );
        }
      }
    });
  }
  function onRemovePrompt() {
    setLoading(true);
    const promptId = chosenPrompt.id;
    firebase_DeleteDocument("Prompts", promptId, (success) => {
      if (success) {
        setChosenPrompt(null);
        setToggleBubble(true);
        setLoading(false);
        setToggleRemovePrompt(false);
        setChosenPrompts((prev) =>
          removeDuplicatesByProperty(
            [...prev.filter((ting) => ting.id !== promptId)],
            "id"
          )
        );
      }
    });
  }
  function onRemoveQuestion() {
    setLoading(true);
    const oldImagePath = chosenQuestion.QuestionPath;
    const questionId = chosenQuestion.id;
    firebase_DeleteDocument("Questions", questionId, (success) => {
      if (success) {
        if (oldImagePath !== undefined && oldImagePath !== "") {
          storage_DeleteMedia(oldImagePath, (success2) => {
            if (success2) {
              setLoading(false);
              setToggleRemoveQuestion(false);
              setToggleBubble(true);
              setToggleRemove(false);
              setChosenQuestion(null);
              setQuestionContent(null);
              setQuestionAI("");
              setQuestionAICheck(false);
              setQuestionText("");
              setChosenQuestions((prev) =>
                removeDuplicatesByProperty(
                  [...prev.filter((ting) => ting.id !== questionId)],
                  "id"
                )
              );
            }
          });
        } else {
          setLoading(false);
          setToggleBubble(true);
          setToggleRemove(false);
          setChosenQuestion(null);
          setQuestionContent(null);
          setQuestionAI("");
          setQuestionAICheck(false);
          setQuestionText("");
          setChosenQuestions((prev) =>
            removeDuplicatesByProperty(
              [...prev.filter((ting) => ting.id !== questionId)],
              "id"
            )
          );
        }
      }
    });
  }
  // #endregion

  useEffect(() => {
    function_GetThingsGoing((ready) => {
      console.log("READY");
    });
    if (courseId === "new") {
      setToggleCourseInfo(true);
    } else {
      setToggleCourseInfo(false);
      firebase_GetDocument("Courses", courseId, (courseStuff) => {
        setCourseInfo(courseStuff);
        firebase_GetAllDocumentsQueried(
          "Lessons",
          [{ field: "CourseId", operator: "==", value: courseId }],
          (lessons) => {
            setLessons(lessons);
          }
        );
        firebase_GetAllDocumentsQueried(
          "Homeworks",
          [{ field: "CourseId", operator: "==", value: courseId }],
          (works) => {
            setHomeworks(works);
          }
        );
        firebase_GetAllDocumentsQueried(
          "Tests",
          [{ field: "CourseId", operator: "==", value: courseId }],
          (test) => {
            setTests(test);
          }
        );
        firebase_GetDocument("Plans", courseId, (plan) => {
          if (plan !== null) {
            setCoursePlan(plan.Plan);
          } else {
            console.log("NO PLAN");
          }
        });
      });
    }
  }, []);

  return (
    <div className="editor editor-dash jakarta fade-in">
      {toggleBubble && (
        <Bubble text={"saved changes."} setToggle={setToggleBubble} />
      )}
      {loading && <Loading />}
      {toggleExit && (
        <ActionButtons
          message={"Are you sure you want to exit this page?"}
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
              Text: "Exit Page",
              Func: () => {
                navigation("/schools/courses");
              },
            },
          ]}
        />
      )}
      {toggleRemove && (
        <ActionButtons
          message={"Are you sure you want to remove this slide?"}
          buttons={[
            {
              Type: "cancel",
              Text: "Cancel",
              Func: () => {
                setToggleRemove(false);
              },
            },
            {
              Type: "destructive",
              Text: "Remove Slide",
              Func: () => {
                onRemoveSlide();
              },
            },
          ]}
        />
      )}
      {toggleRemovePrompt && (
        <ActionButtons
          message={"Are you sure you want to remove this prompt?"}
          buttons={[
            {
              Type: "cancel",
              Text: "Cancel",
              Func: () => {
                setToggleRemovePrompt(false);
              },
            },
            {
              Type: "destructive",
              Text: "Remove Prompt",
              Func: () => {
                onRemovePrompt();
              },
            },
          ]}
        />
      )}
      {toggleRemoveQuestion && (
        <ActionButtons
          message={"Are you sure you want to remove this question?"}
          buttons={[
            {
              Type: "cancel",
              Text: "Cancel",
              Func: () => {
                setToggleRemoveQuestion(false);
              },
            },
            {
              Type: "destructive",
              Text: "Remove Prompt",
              Func: () => {
                onRemoveQuestion();
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
        <div className="editor-top separate_h">
          <h1 className="no editor-title">Course Editor</h1>
          <div className="editor-action-btns side-by">
            <DestructiveButton
              text={"Exit"}
              onPress={() => {
                setToggleExit(true);
              }}
            />
            {/* <PrimaryButton text={"Save"} /> */}
          </div>
        </div>
        <div className="editor-main">
          <div className="editor-left">
            <h1 className="no editor-head">Components</h1>
            <div className="editor-left-blocks">
              <Accordion
                top={
                  <div className="editor-left-block separate_h">
                    <h3 className="no editor-left-head">Lessons</h3>
                    <IoChevronDownSharp className="editor-left-icon" />
                  </div>
                }
                bottom={
                  <div className="">
                    <div className="editor-lessons-wrap">
                      {sortObjects(lessons, "Name").map((lesson, l) => {
                        return (
                          <div
                            key={l}
                            className="pointer"
                            onClick={() => {
                              setToggleLesson(true);
                              setToggleHomework(false);
                              setToggleTest(false);
                              setTogglePlan(false);
                              setChosenLesson(lesson);
                              setLessonName(lesson.Name);
                              setLessonDesc(lesson.Desc);
                              setToggleContent(true);
                              if (
                                document.querySelector("#tbSlideTitle") !== null
                              ) {
                                document.querySelector("#tbSlideTitle").value =
                                  "";
                              }
                              if (
                                document.querySelector("#taSlideNotes") !== null
                              ) {
                                document.querySelector("#taSlideNotes").value =
                                  "";
                              }
                              setSlideTitle("");
                              setSlideNotes("");
                              setSlideContent(null);
                              //
                              firebase_GetAllDocumentsQueried(
                                "Slides",
                                [
                                  {
                                    field: "LessonId",
                                    operator: "==",
                                    value: lesson.id,
                                  },
                                ],
                                (slides) => {
                                  setChosenSlides(slides);
                                }
                              );
                            }}
                          >
                            <p className="no">{lesson.Name}</p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="padding">
                      <PrimaryButton
                        text={"New Lesson"}
                        onPress={() => {
                          setChosenLesson(null);
                          setLessonName("");
                          setLessonDesc("");
                          if (document.querySelector("#tbLessonName")) {
                            document.querySelector("#tbLessonName").value = "";
                            document.querySelector("#taLessonDesc").value = "";
                          }
                          setChosenSlide(null);
                          setSlideTitle("");
                          setSlideNotes("");
                          setSlideContent(null);
                          if (document.querySelector("#tbSlideTitle")) {
                            document.querySelector("#tbSlideTitle").value = "";
                            document.querySelector("#taSlideNotes").value = "";
                          }
                          setChosenSlides([]);
                          setToggleLesson(true);
                          setToggleHomework(false);
                          setToggleTest(false);
                          setTogglePlan(false);
                        }}
                      />
                    </div>
                  </div>
                }
              />
              <Accordion
                top={
                  <div className="editor-left-block separate_h">
                    <h3 className="no editor-left-head">Homeworks</h3>
                    <IoChevronDownSharp className="editor-left-icon" />
                  </div>
                }
                bottom={
                  <div className="">
                    <div className="editor-lessons-wrap">
                      {sortObjects(homeworks, "Name").map((work, w) => {
                        return (
                          <div
                            key={w}
                            className="pointer"
                            onClick={() => {
                              setToggleLesson(false);
                              setToggleHomework(true);
                              setToggleTest(false);
                              setTogglePlan(false);
                              setChosenHomework(work);
                              setHomeworkName(work.Name);
                              setHomeworkDesc(work.Desc);
                              if (
                                document.querySelector("#taPromptPrompt") !==
                                null
                              ) {
                                document.querySelector(
                                  "#taPromptPrompt"
                                ).value = "";
                              }
                              if (
                                document.querySelector("#taPromptAI") !== null
                              ) {
                                document.querySelector("#taPromptAI").value =
                                  "";
                              }
                              setChosenPrompt(null);
                              setPromptPrompt("");
                              setPromptAI("");
                              setPromptAICheck(false);
                              //
                              firebase_GetAllDocumentsQueried(
                                "Prompts",
                                [
                                  {
                                    field: "HomeworkId",
                                    operator: "==",
                                    value: work.id,
                                  },
                                ],
                                (these) => {
                                  setChosenPrompts(these);
                                }
                              );
                            }}
                          >
                            <p className="no">{work.Name}</p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="padding">
                      <PrimaryButton
                        text={"New Homework"}
                        onPress={() => {
                          setChosenHomework(null);
                          setHomeworkName("");
                          setHomeworkDesc("");
                          if (document.querySelector("#tbHomeworkName")) {
                            document.querySelector("#tbHomeworkName").value =
                              "";
                            document.querySelector("#taHomeworkDesc").value =
                              "";
                          }
                          setPromptPrompt("");
                          setPromptAI("");
                          setPromptAICheck(false);
                          setChosenPrompts([]);
                          setToggleLesson(false);
                          setToggleHomework(true);
                          setToggleTest(false);
                          setTogglePlan(false);
                        }}
                      />
                    </div>
                  </div>
                }
              />
              <Accordion
                top={
                  <div className="editor-left-block separate_h">
                    <h3 className="no editor-left-head">Tests</h3>
                    <IoChevronDownSharp className="editor-left-icon" />
                  </div>
                }
                bottom={
                  <div className="">
                    <div className="editor-lessons-wrap">
                      {sortObjects(tests, "Name").map((test, t) => {
                        return (
                          <div
                            key={t}
                            className="pointer"
                            onClick={() => {
                              setToggleLesson(false);
                              setToggleHomework(false);
                              setToggleTest(true);
                              setTogglePlan(false);
                              setChosenTest(test);
                              setTestName(test.Name);
                              setTestDesc(test.Desc);
                              if (document.querySelector("#tbTestName")) {
                                document.querySelector("#tbTestName").value =
                                  test.Name;
                              }
                              if (document.querySelector("#taTestDesc")) {
                                document.querySelector("#taTestDesc").value =
                                  test.Desc;
                              }
                              // PUT REST OF THINGS HERE
                              const _question =
                                document.querySelector("#tbQuestion");
                              const _choice1 =
                                document.querySelector("#tbChoice1");
                              const _choice2 =
                                document.querySelector("#tbChoice2");
                              const _choice3 =
                                document.querySelector("#tbChoice3");
                              const _choice4 =
                                document.querySelector("#tbChoice4");
                              const _answer1 =
                                document.querySelector("#cbChoice1");
                              const _answer2 =
                                document.querySelector("#cbChoice2");
                              const _answer3 =
                                document.querySelector("#cbChoice3");
                              const _answer4 =
                                document.querySelector("#cbChoice4");
                              const _questionAI =
                                document.querySelector("#taQuestionAI");
                              const _true = document.querySelector("#rbTrue");
                              const _false = document.querySelector("#rbFalse");
                              if (_question !== null) {
                                _question.value = "";
                              }
                              if (_choice1 !== null) {
                                _choice1.value = "";
                              }
                              if (_choice2 !== null) {
                                _choice2.value = "";
                              }
                              if (_choice3 !== null) {
                                _choice3.value = "";
                              }
                              if (_choice4 !== null) {
                                _choice4.value = "";
                              }
                              if (_answer1 !== null) {
                                _answer1.checked = false;
                              }
                              if (_answer2 !== null) {
                                _answer2.checked = false;
                              }
                              if (_answer3 !== null) {
                                _answer3.checked = false;
                              }
                              if (_answer4 !== null) {
                                _answer4.checked = false;
                              }
                              if (_questionAI !== null) {
                                _questionAI.value = "";
                              }
                              if (_true !== null) {
                                _true.checked = false;
                              }
                              if (_false !== null) {
                                _false.checked = false;
                              }

                              firebase_GetAllDocumentsQueried(
                                "Questions",
                                [
                                  {
                                    field: "TestId",
                                    operator: "==",
                                    value: test.id,
                                  },
                                ],
                                (these) => {
                                  setChosenQuestions(these);
                                }
                              );
                            }}
                          >
                            <p className="no">{test.Name}</p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="padding">
                      <PrimaryButton
                        text={"New Test"}
                        onPress={() => {
                          setToggleLesson(false);
                          setToggleHomework(false);
                          setToggleTest(true);
                          setTogglePlan(false);
                          setChosenTest(null);
                          setTestName("");
                          setTestDesc("");
                          if (document.querySelector("#tbTestName")) {
                            document.querySelector("#tbTestName").value = "";
                          }
                          if (document.querySelector("#taTestDesc")) {
                            document.querySelector("#taTestDesc").value = "";
                          }
                          // OTHER STUFFS
                        }}
                      />
                    </div>
                  </div>
                }
              />
              <div
                className="editor-left-block separate_h"
                onClick={async () => {
                  var count = 0;

                  const fetchDocuments = async (
                    collection,
                    courseId,
                    type,
                    existingIds = []
                  ) => {
                    return new Promise((resolve, reject) => {
                      firebase_GetAllDocumentsQueried(
                        collection,
                        [
                          {
                            field: "CourseId",
                            operator: "==",
                            value: courseId,
                          },
                        ],
                        (documents) => {
                          const filteredDocuments = documents
                            .filter((doc) => !existingIds.includes(doc.id))
                            .map((doc, index) => ({
                              ...doc,
                              Order: count + index + 1,
                              Type: type,
                            }));
                          count += filteredDocuments.length;
                          resolve(filteredDocuments);
                        }
                      );
                    });
                  };

                  if (coursePlan.length === 0) {
                    const lessons = await fetchDocuments(
                      "Lessons",
                      courseId,
                      "Lesson"
                    );
                    const homeworks = await fetchDocuments(
                      "Homeworks",
                      courseId,
                      "Homework"
                    );
                    const tests = await fetchDocuments(
                      "Tests",
                      courseId,
                      "Test"
                    );

                    const combined = [...lessons, ...homeworks, ...tests];
                    setCoursePlan((prev) =>
                      removeDuplicatesByProperty([...prev, ...combined], "id")
                    );
                  } else {
                    var things = [];
                    firebase_GetDocument("Plans", courseId, async (thing) => {
                      things = [...thing.Plan];
                      const existingIds = things.map((ting) => ting.id);

                      const lessons = await fetchDocuments(
                        "Lessons",
                        courseId,
                        "Lesson",
                        existingIds
                      );
                      const homeworks = await fetchDocuments(
                        "Homeworks",
                        courseId,
                        "Homework",
                        existingIds
                      );
                      const tests = await fetchDocuments(
                        "Tests",
                        courseId,
                        "Test",
                        existingIds
                      );

                      const combined = [
                        ...things,
                        ...removeDuplicatesByProperty(
                          [...lessons, ...homeworks, ...tests],
                          "id"
                        ).filter(
                          (item) =>
                            !things.some((thing) => thing.id === item.id)
                        ),
                      ];
                      setCoursePlan(combined);
                    });
                  }

                  setTogglePlan(true);
                  setToggleLesson(false);
                  setToggleHomework(false);
                  setToggleTest(false);
                }}
              >
                <h3 className="no editor-left-head">Plan</h3>
                <IoChevronForwardSharp className="editor-left-icon" />
              </div>
            </div>
          </div>
          <div className="editor-right">
            <h1 className="no editor-head">Editor</h1>
            {/* EDITOR OPTIONS */}
            {toggleLesson && (
              <div className="editor-wrap">
                {/* NEW LESSON */}
                {/* INFO */}
                <div className="editor-top-block">
                  <div className="side-by">
                    <FaInfoCircle className="editor-top-block-icon" />
                    <h3 className="no">Info</h3>
                  </div>
                  <p className="no">Basic information about the lesson.</p>
                </div>
                <div className="editor-block-pair">
                  <p className="no">Lesson Name</p>
                  <input
                    type="text"
                    id="tbLessonName"
                    placeholder="ex. Hound Group"
                    value={lessonName}
                    onChange={(e) => {
                      setLessonName(e.target.value);
                    }}
                  />
                </div>
                <div className="editor-block-pair">
                  <p className="no">Description</p>
                  <textarea
                    type="text"
                    id="taLessonDesc"
                    placeholder="Provide a short description about this lesson."
                    className="jakarta"
                    value={lessonDesc}
                    onChange={(e) => {
                      setLessonDesc(e.target.value);
                    }}
                  ></textarea>
                </div>
                <div className="editor-btn">
                  <PrimaryButton
                    text={chosenLesson !== null ? "Update" : "Continue"}
                    onPress={
                      chosenLesson !== null
                        ? onLessonInfoUpdate
                        : onLessonInfoContinue
                    }
                  />
                </div>
                {/* SLIDES */}
                <div id="editor-anchor">
                  {chosenLesson !== null && (
                    <div>
                      <div className="editor-top-block">
                        <div className="side-by">
                          <RiSlideshowFill className="editor-top-block-icon" />
                          <h3 className="no">Slides</h3>
                        </div>
                        <p className="no">
                          The content presented to the student in slide format.
                        </p>
                      </div>
                      <div className="separate_h">
                        <div className="toggle-options">
                          <p
                            className={`no toggle-option pointer ${
                              toggleContent ? "chosen" : ""
                            }`}
                            onClick={() => {
                              setToggleContent(true);
                            }}
                          >
                            Image
                          </p>
                          <p
                            className={`no toggle-option pointer ${
                              toggleContent ? "" : "chosen"
                            }`}
                            onClick={() => {
                              setToggleContent(false);
                            }}
                          >
                            Video
                          </p>
                        </div>
                        {chosenSlide !== null && (
                          <div className="side-by">
                            <div className="fit-content">
                              <DestructiveButton
                                classes="padding_h"
                                text={"Remove"}
                                onPress={() => {
                                  setToggleRemove(true);
                                }}
                              />
                            </div>
                            <div className="fit-content">
                              <PrimaryButton
                                classes="padding_h"
                                text={"New Slide"}
                                onPress={() => {
                                  setChosenSlide(null);
                                  setSlideContent(null);
                                  setSlideTitle("");
                                  setSlideNotes("");
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="editor-slide-main split">
                        <input
                          type="file"
                          style={{ display: "none" }}
                          id="fpNewSlideImage"
                          accept="image/*"
                          onChange={onChangeSlideImage}
                        />
                        <input
                          type="file"
                          style={{ display: "none" }}
                          id="fpNewSlideVideo"
                          accept="video/*"
                          onChange={onChangeSlideImage}
                        />
                        {toggleContent && (
                          // IMAGE
                          <div>
                            {/* THIS IS IMAGE */}
                            {slideContent === null && (
                              <div
                                className="editor-slide-wrap pointer"
                                onClick={() => {
                                  document
                                    .querySelector("#fpNewSlideImage")
                                    .click();
                                }}
                              >
                                <div></div>
                                <div>
                                  <AiOutlinePlus className="editor-slide-wrap-icon" />
                                  <p className="no text-center">New Slide</p>
                                </div>
                                <div></div>
                              </div>
                            )}
                            {slideContent !== null && (
                              <div
                                className="editor-slide-img pointer"
                                onClick={() => {
                                  document
                                    .querySelector("#fpNewSlideImage")
                                    .click();
                                }}
                              >
                                <img src={slideContent} />
                                <p className="no text-center">
                                  tap image to change
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                        {!toggleContent && (
                          // VIDEO
                          <div>
                            {/* THIS IS VIDEO */}
                            {slideContent === null && (
                              <div
                                className="editor-slide-wrap pointer"
                                onClick={() => {
                                  document
                                    .querySelector("#fpNewSlideVideo")
                                    .click();
                                }}
                              >
                                <div></div>
                                <div>
                                  <AiOutlinePlus className="editor-slide-wrap-icon" />
                                  <p className="no text-center">New Video</p>
                                </div>
                                <div></div>
                              </div>
                            )}
                            {slideContent !== null && (
                              <div
                                className="editor-slide-img pointer"
                                onClick={() => {
                                  document
                                    .querySelector("#fpNewSlideVideo")
                                    .click();
                                }}
                              >
                                <video
                                  width="100%"
                                  height="100%"
                                  controls
                                  style={{ borderRadius: "8px" }}
                                  src={slideContent}
                                ></video>
                                <p className="no text-center">
                                  tap video to change
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                        <div className="editor-slide-details">
                          <div className="editor-block-pair">
                            <p className="no">Slide Title</p>
                            <input
                              type="text"
                              id="tbSlideTitle"
                              placeholder="ex. Essential Grooming Tips"
                              value={slideTitle}
                              onChange={(e) => {
                                setSlideTitle(e.target.value);
                              }}
                            />
                          </div>
                          <div className="editor-block-pair">
                            <div className="separate_h">
                              <p className="no">Notes</p>
                              <div
                                className="pointer"
                                onClick={() => {
                                  const text =
                                    document.querySelector(
                                      "#taSlideNotes"
                                    ).value;
                                  if (text !== "") {
                                    function_textToSpeech(text, (audio) => {
                                      const thisAudio = new Audio(audio);
                                      thisAudio.play();
                                    });
                                  }
                                }}
                              >
                                <RiSpeakFill
                                  className="icon-icon"
                                  title="text to speech"
                                />
                              </div>
                            </div>
                            <textarea
                              type="text"
                              id="taSlideNotes"
                              placeholder="Enter any notes that are paired with this slide. A text-to-speech software will be added to this section."
                              className="jakarta"
                              value={slideNotes}
                              onChange={(e) => {
                                setSlideNotes(e.target.value);
                              }}
                            />
                          </div>
                          <div
                            className="editor-btn"
                            onClick={
                              chosenSlide !== null ? onUpdateSlide : onNewSlide
                            }
                          >
                            {chosenSlide !== null ? (
                              <PrimaryButton text={"Update"} />
                            ) : (
                              <PrimaryButton text={"Create Slide"} />
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="divider"></div>
                      {/* SLIDES */}
                      <div className="editor-slides">
                        {chosenSlides
                          .sort((a, b) => a.Order - b.Order)
                          .map((slide, s) => {
                            return (
                              <div
                                key={s}
                                className="separate_h"
                                style={{ boxSizing: "border-box" }}
                              >
                                <div
                                  className="editor-slide separate_h"
                                  onClick={() => {
                                    setLoading(true);
                                    storage_DownloadMedia(
                                      slide.SlidePath,
                                      (media) => {
                                        console.log(media);
                                        setChosenSlide(slide);
                                        setSlideContent(media);
                                        if (
                                          slide.SlidePath.split("/")[0] ===
                                          "Images"
                                        ) {
                                          // IS IMAGE
                                          setToggleContent(true);
                                        } else {
                                          setToggleContent(false);
                                        }
                                        document.querySelector(
                                          "#tbSlideTitle"
                                        ).value = slide.Title;
                                        document.querySelector(
                                          "#taSlideNotes"
                                        ).value = slide.Notes.replaceAll(
                                          "jjj",
                                          "\n"
                                        );
                                        setSlideTitle(slide.Title);
                                        setSlideNotes(
                                          slide.Notes.replaceAll("jjj", "\n")
                                        );
                                        scrollToAnchor("editor-anchor");
                                        setLoading(false);
                                      }
                                    );
                                  }}
                                  style={{ width: "100%" }}
                                >
                                  {/*  */}
                                  <div className="side-by">
                                    {slide.SlidePath.split("/")[0] ===
                                    "Images" ? (
                                      <MdPhotoSizeSelectActual
                                        color="#F27400"
                                        className="icon-icon"
                                      />
                                    ) : (
                                      <PiVideoFill
                                        color="#F27400"
                                        className="icon-icon"
                                      />
                                    )}
                                    <p className="no">{slide.Title}</p>
                                  </div>
                                </div>
                                <div className="padding-h">
                                  <div
                                    className="pointer"
                                    onClick={() => {
                                      onMoveSlideUp(slide);
                                    }}
                                  >
                                    <IoChevronUpSharp
                                      size={22}
                                      color="#767D9C"
                                      className="pointer"
                                    />
                                  </div>
                                  <div
                                    className="pointer"
                                    onClick={() => {
                                      onMoveSlideDown(slide);
                                    }}
                                  >
                                    <IoChevronDownSharp
                                      size={22}
                                      className="pointer"
                                      color="#767D9C"
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {toggleHomework && (
              <div className="editor-wrap">
                {/* NEW HOMEWORK */}
                {/* INFO */}
                <div className="editor-top-block">
                  <div className="side-by">
                    <FaInfoCircle className="editor-top-block-icon" />
                    <h3 className="no">Info</h3>
                  </div>
                  <p className="no">Basic information about the homework.</p>
                </div>
                <div className="editor-block-pair">
                  <p className="no">Homework Name</p>
                  <input
                    type="text"
                    id="tbHomeworkName"
                    placeholder="ex. Homework Week 1"
                    value={homeworkName}
                    onChange={(e) => {
                      setHomeworkName(e.target.value);
                    }}
                  />
                </div>
                <div className="editor-block-pair">
                  <p className="no">Description</p>
                  <textarea
                    type="text"
                    id="taHomeworkDesc"
                    placeholder="Provide a short description or details about the homework."
                    className="jakarta"
                    value={homeworkDesc}
                    onChange={(e) => {
                      setHomeworkDesc(e.target.value);
                    }}
                  ></textarea>
                </div>
                <div className="editor-btn">
                  <PrimaryButton
                    text={chosenHomework !== null ? "Update" : "Continue"}
                    onPress={
                      chosenHomework !== null
                        ? onHomeworkInfoUpdate
                        : onHomeworkInfoContinue
                    }
                  />
                </div>
                {/* COMPONENTS */}
                {chosenHomework && (
                  <div>
                    <div className="editor-top-block">
                      <div className="side-by">
                        <HiMiniRectangleStack className="editor-top-block-icon" />
                        <h3 className="no">Prompts</h3>
                      </div>
                      <p className="no">
                        All prompts for students to complete for this homework.
                      </p>
                    </div>

                    {/* ADD COMPONENTS HERE */}

                    <div className="editor-block-pair">
                      <div className="separate_h">
                        <div>
                          <p className="no bold">Homework Prompt</p>
                        </div>
                        {chosenPrompt && (
                          <div className="side-by">
                            <DestructiveButton
                              text={"Remove Prompt"}
                              onPress={() => {
                                setToggleRemovePrompt(true);
                              }}
                            />
                            <PrimaryButton
                              text={"New Prompt"}
                              onPress={() => {
                                setChosenPrompt(null);
                                setPromptPrompt("");
                                setPromptAI("");
                                // setPromptAICheck(false);
                                if (document.querySelector("#taPromptPrompt")) {
                                  document.querySelector(
                                    "#taPromptPrompt"
                                  ).value = "";
                                }
                                if (document.querySelector("#taPromptAI")) {
                                  document.querySelector("#taPromptAI").value =
                                    "";
                                }
                                // if (
                                //   document.querySelector("#cbPromptAICheck")
                                // ) {
                                //   document.querySelector(
                                //     "#cbPromptAICheck"
                                //   ).checked = false;
                                // }
                              }}
                            />
                          </div>
                        )}
                      </div>

                      <span className="no editor-block-pair-small">
                        This prompt can be in the form of a question or a
                        statement. The student will provide an answer in text
                        form (word, short answer, paragraph).
                      </span>
                      <textarea
                        type="text"
                        id="taPromptPrompt"
                        placeholder="ex. Provide five breed names that are most frequently groomed."
                        className="jakarta"
                        value={promptPrompt}
                        onChange={(e) => {
                          setPromptPrompt(e.target.value);
                        }}
                      />
                    </div>
                    {/* <div className="editor-block-pair no-display">
                      <p className="no bold">Allow Coco Grading</p>
                      <span className="no editor-block-pair-small">
                        Coco is the integrated AI. She can help you grade
                        anything by providing grading guidelines.
                      </span>
                      <div className="side-by">
                        <input
                          type="checkbox"
                          id="cbPromptAICheck"
                          value={promptAICheck}
                          onChange={(e) => {
                            setPromptAICheck(e.target.checked);
                          }}
                          className="no"
                        />
                        <p>Allow Coco to grade student responses.</p>
                      </div>
                    </div> */}
                    <div className="editor-block-pair">
                      <div className="separate_h">
                        <div>
                          <p className="no bold">Coco AI Assistant</p>
                        </div>
                      </div>

                      <span className="no editor-block-pair-small">
                        Reduce your response time by using Coco AI to generate
                        responses for student submissions. Provide Coco AI with
                        any additional instructions. Coco AI will already be
                        given the prompt, the student's answer, and simple
                        grading instructions.
                      </span>
                      <textarea
                        type="text"
                        id="taPromptAI"
                        placeholder={placeholderText}
                        className="jakarta"
                        value={promptAI}
                        onChange={(e) => {
                          setPromptAI(e.target.value);
                        }}
                      />
                    </div>

                    <div className="editor-btn">
                      {chosenPrompt ? (
                        <PrimaryButton
                          text={"Update"}
                          onPress={onUpdatePrompt}
                        />
                      ) : (
                        <PrimaryButton text={"Create"} onPress={onNewPrompt} />
                      )}
                    </div>
                  </div>
                )}
                <div className="divider"></div>
                {/* PROMPTS */}
                <div className="editor-slides">
                  {chosenPrompts
                    .sort((a, b) => a.Order - b.Order)
                    .map((prompt, p) => {
                      return (
                        <div
                          key={p}
                          className="separate_h"
                          style={{ boxSizing: "border-box" }}
                        >
                          <div
                            className="editor-slide"
                            onClick={() => {
                              setLoading(true);
                              setChosenPrompt(prompt);
                              setPromptPrompt(
                                prompt.Prompt.replaceAll("jjj", "\n")
                              );

                              setPromptAI(prompt.AIPrompt);
                              //
                              if (document.querySelector("#taPromptPrompt")) {
                                document.querySelector(
                                  "#taPromptPrompt"
                                ).value = prompt.Prompt;
                              }

                              if (document.querySelector("#taPromptAI")) {
                                document.querySelector("#taPromptAI").value =
                                  prompt.AIPrompt;
                              }
                              setLoading(false);
                            }}
                            style={{ width: "100%" }}
                          >
                            {/*  */}
                            <div className="side-by">
                              <MdTypeSpecimen
                                color="#28D782"
                                className="icon-icon"
                              />
                              <p className="no">
                                {prompt.Prompt.slice(0, 60)}
                                {prompt.Prompt.length >= 60 && "..."}
                              </p>
                            </div>
                          </div>
                          <div className="padding-h">
                            <div
                              className="pointer"
                              onClick={() => {
                                onMovePromptUp(prompt);
                              }}
                            >
                              <IoChevronUpSharp
                                size={22}
                                color="#767D9C"
                                className="pointer"
                              />
                            </div>
                            <div
                              className="pointer"
                              onClick={() => {
                                onMovePromptDown(prompt);
                              }}
                            >
                              <IoChevronDownSharp
                                size={22}
                                className="pointer"
                                color="#767D9C"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
            {toggleTest && (
              <div className="editor-wrap">
                {/* NEW TEST */}
                {/* INFO */}
                <div className="editor-top-block">
                  <div className="side-by">
                    <FaInfoCircle className="editor-top-block-icon" />
                    <h3 className="no">Info</h3>
                  </div>
                  <p className="no">Basic information about the test.</p>
                </div>
                <div className="editor-block-pair">
                  <p className="no">Test Name</p>
                  <input
                    type="text"
                    id="tbTestName"
                    placeholder="ex. Hound Group Test"
                    value={testName}
                    onChange={(e) => {
                      setTestName(e.target.value);
                    }}
                  />
                </div>
                <div className="editor-block-pair">
                  <p className="no">Description</p>
                  <textarea
                    type="text"
                    id="taTestDesc"
                    placeholder="Provide a short description about the test objectives."
                    className="jakarta"
                    value={testDesc}
                    onChange={(e) => {
                      setTestDesc(e.target.value);
                    }}
                  ></textarea>
                </div>
                <div className="editor-btn">
                  <PrimaryButton
                    text={chosenTest !== null ? "Update" : "Continue"}
                    onPress={
                      chosenTest !== null
                        ? onTestInfoUpdate
                        : onTestInfoContinue
                    }
                  />
                </div>
                {/* QUESTIONS */}
                {chosenTest !== null && (
                  <div>
                    <div className="editor-top-block">
                      <div className="side-by">
                        <BsPatchQuestionFill className="editor-top-block-icon" />
                        <h3 className="no">Questions</h3>
                      </div>
                      <p className="no">
                        Questions that the student must answer for this test.
                      </p>
                    </div>
                    <div className="separate_h">
                      <div className="toggle-options">
                        <p
                          className={`no toggle-option pointer ${
                            toggleContent ? "chosen" : ""
                          }`}
                          onClick={() => {
                            setToggleContent(true);
                          }}
                        >
                          Image
                        </p>
                        <p
                          className={`no toggle-option pointer ${
                            toggleContent ? "" : "chosen"
                          }`}
                          onClick={() => {
                            setToggleContent(false);
                          }}
                        >
                          Video
                        </p>
                      </div>
                      {chosenQuestion !== null && (
                        <div className="fit-content side-by">
                          <DestructiveButton
                            classes="padding_h"
                            text={"Remove Question"}
                            onPress={() => {
                              setToggleRemoveQuestion(true);
                            }}
                          />
                          <PrimaryButton
                            classes="padding_h"
                            text={"New Question"}
                            onPress={() => {
                              setChosenQuestion(null);
                              setQuestionContent(null);
                              setQuestionType("multiple");
                              //  ADD ALL THESE HERE
                              const _question =
                                document.querySelector("#tbQuestion");
                              const _choice1 =
                                document.querySelector("#tbChoice1");
                              const _choice2 =
                                document.querySelector("#tbChoice2");
                              const _choice3 =
                                document.querySelector("#tbChoice3");
                              const _choice4 =
                                document.querySelector("#tbChoice4");
                              const _answer1 =
                                document.querySelector("#cbChoice1");
                              const _answer2 =
                                document.querySelector("#cbChoice2");
                              const _answer3 =
                                document.querySelector("#cbChoice3");
                              const _answer4 =
                                document.querySelector("#cbChoice4");
                              const _questionAI =
                                document.querySelector("#taQuestionAI");
                              const _true = document.querySelector("#rbTrue");
                              const _false = document.querySelector("#rbFalse");
                              if (_question !== null) {
                                _question.value = "";
                              }
                              if (_choice1 !== null) {
                                _choice1.value = "";
                              }
                              if (_choice2 !== null) {
                                _choice2.value = "";
                              }
                              if (_choice3 !== null) {
                                _choice3.value = "";
                              }
                              if (_choice4 !== null) {
                                _choice4.value = "";
                              }
                              if (_answer1 !== null) {
                                _answer1.checked = false;
                              }
                              if (_answer2 !== null) {
                                _answer2.checked = false;
                              }
                              if (_answer3 !== null) {
                                _answer3.checked = false;
                              }
                              if (_answer4 !== null) {
                                _answer4.checked = false;
                              }
                              if (_questionAI !== null) {
                                _questionAI.value = "";
                              }
                              if (_true !== null) {
                                _true.checked = false;
                              }
                              if (_false !== null) {
                                _false.checked = false;
                              }
                              setChoice1("");
                              setChoice2("");
                              setChoice3("");
                              setChoice4("");
                              setAnswer1(false);
                              setAnswer2(false);
                              setAnswer3(false);
                              setAnswer4(false);
                              setQuestionAI("");
                              setTrueOption(false);
                              setFalseOption(false);
                            }}
                          />
                        </div>
                      )}
                    </div>
                    {/* STUFF */}
                    <div className="editor-slide-main split">
                      <input
                        type="file"
                        style={{ display: "none" }}
                        id="fpNewQuestionImage"
                        accept="image/*"
                        onChange={onChangeQuestionMedia}
                      />
                      <input
                        type="file"
                        style={{ display: "none" }}
                        id="fpNewQuestionVideo"
                        accept="video/*"
                        onChange={onChangeQuestionMedia}
                      />
                      {toggleContent && (
                        // IMAGE
                        <div>
                          {/* THIS IS IMAGE */}
                          {questionContent === null && (
                            <div
                              className="editor-slide-wrap pointer"
                              onClick={() => {
                                document
                                  .querySelector("#fpNewQuestionImage")
                                  .click();
                              }}
                            >
                              <div></div>
                              <div>
                                <AiOutlinePlus className="editor-slide-wrap-icon" />
                                <p className="no text-center">Add Image</p>
                              </div>
                              <div></div>
                            </div>
                          )}
                          {questionContent !== null && (
                            <div
                              className="editor-slide-img pointer"
                              onClick={() => {
                                document
                                  .querySelector("#fpNewQuestionImage")
                                  .click();
                              }}
                            >
                              <img src={questionContent} />
                              <p className="no text-center">
                                tap image to change
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                      {!toggleContent && (
                        // VIDEO
                        <div>
                          {/* THIS IS VIDEO */}
                          {questionContent === null && (
                            <div
                              className="editor-slide-wrap pointer"
                              onClick={() => {
                                document
                                  .querySelector("#fpNewQuestionVideo")
                                  .click();
                              }}
                            >
                              <div></div>
                              <div>
                                <AiOutlinePlus className="editor-slide-wrap-icon" />
                                <p className="no text-center">Add Video</p>
                              </div>
                              <div></div>
                            </div>
                          )}
                          {questionContent !== null && (
                            <div
                              className="editor-slide-img pointer"
                              onClick={() => {
                                document
                                  .querySelector("#fpNewQuestionVideo")
                                  .click();
                              }}
                            >
                              <video
                                width="100%"
                                height="100%"
                                controls
                                style={{ borderRadius: "8px" }}
                                src={questionContent}
                              ></video>
                              <p className="no text-center">
                                tap video to change
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="editor-slide-details">
                        <div className="toggle-options">
                          <p
                            className={`no toggle-option pointer ${
                              questionType === "multiple" ? "chosen" : ""
                            }`}
                            onClick={() => {
                              setQuestionType("multiple");
                            }}
                          >
                            Multiple Choice
                          </p>
                          <p
                            className={`no toggle-option pointer ${
                              questionType === "short" ? "chosen" : ""
                            }`}
                            onClick={() => {
                              setQuestionType("short");
                            }}
                          >
                            Short Answer
                          </p>
                          <p
                            className={`no toggle-option pointer ${
                              questionType === "truefalse" ? "chosen" : ""
                            }`}
                            onClick={() => {
                              setQuestionType("truefalse");
                            }}
                          >
                            True or False
                          </p>
                        </div>
                        {/* MULTIPLE CHOICE */}
                        <div>
                          {questionType === "multiple" && (
                            <div>
                              <div className="editor-block-pair">
                                <p className="no">Question</p>
                                <input
                                  type="text"
                                  id="tbQuestion"
                                  placeholder="ex. What type of clippers are used for short hair?"
                                  value={questionText}
                                  onChange={(e) => {
                                    setQuestionText(e.target.value);
                                  }}
                                />
                              </div>
                              <div className="editor-block-pair">
                                <div className="separate_h">
                                  <p className="no">Choices</p>
                                </div>
                                <span className="no editor-block-pair-small">
                                  Use the checkboxes on the right side to
                                  indicate the correct answer. Selecting more
                                  than one will allow the student to select
                                  multiple answers. You may leave any choices
                                  blank.
                                </span>
                                <div className="editor-inputs">
                                  <div className="side-by">
                                    <input
                                      type="text"
                                      id="tbChoice1"
                                      placeholder="1. First Choice"
                                      value={choice1}
                                      onChange={(e) => {
                                        setChoice1(e.target.value);
                                      }}
                                    />
                                    <input
                                      type="checkbox"
                                      id="cbChoice1"
                                      checked={answer1}
                                      onChange={(e) => {
                                        setAnswer1(e.target.checked);
                                      }}
                                    />
                                  </div>
                                  <div className="side-by">
                                    <input
                                      type="text"
                                      id="tbChoice2"
                                      placeholder="2. Second Choice"
                                      value={choice2}
                                      onChange={(e) => {
                                        setChoice2(e.target.value);
                                      }}
                                    />
                                    <input
                                      type="checkbox"
                                      id="cbChoice2"
                                      checked={answer2}
                                      onChange={(e) => {
                                        setAnswer2(e.target.checked);
                                      }}
                                    />
                                  </div>
                                  <div className="side-by">
                                    <input
                                      type="text"
                                      id="tbChoice3"
                                      placeholder="3. Third Choice"
                                      value={choice3}
                                      onChange={(e) => {
                                        setChoice3(e.target.value);
                                      }}
                                    />
                                    <input
                                      type="checkbox"
                                      id="cbChoice3"
                                      checked={answer3}
                                      onChange={(e) => {
                                        setAnswer3(e.target.checked);
                                      }}
                                    />
                                  </div>
                                  <div className="side-by">
                                    <input
                                      type="text"
                                      id="tbChoice4"
                                      placeholder="4. Fourth Choice"
                                      value={choice4}
                                      onChange={(e) => {
                                        setChoice4(e.target.value);
                                      }}
                                    />
                                    <input
                                      type="checkbox"
                                      id="cbChoice4"
                                      checked={answer4}
                                      onChange={(e) => {
                                        setAnswer4(e.target.checked);
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {questionType === "short" && (
                            <div>
                              <div className="editor-block-pair">
                                <p className="no">Question</p>
                                <input
                                  type="text"
                                  id="tbQuestion"
                                  placeholder="ex. What type of clippers are used for short hair?"
                                  value={questionText}
                                  onChange={(e) => {
                                    setQuestionText(e.target.value);
                                  }}
                                />
                              </div>
                              {/* <div className="editor-block-pair no-display">
                                <p className="no">Allow Coco Grading</p>
                                <span className="no editor-block-pair-small">
                                  Coco is the integrated AI. She can help you
                                  grade anything by providing grading
                                  guidelines.
                                </span>
                                <div className="side-by">
                                  <input
                                    type="checkbox"
                                    id="cbQuestionAICheck"
                                    checked={questionAICheck}
                                    onChange={(e) => {
                                      setQuestionAICheck(e.target.checked);
                                    }}
                                  />
                                  <p className="no">
                                    Allow Coco to grade student responses.
                                  </p>
                                </div>
                              </div> */}
                              <div className="editor-sub">
                                <p className="no bold">
                                  Coco Grading Guidelines
                                </p>
                                <span className="no editor-block-pair-small">
                                  Here are the guidelines for Coco AI to follow
                                  when grading responses. Please use clear and
                                  complete sentences or bullet points. Coco AI
                                  will utilize these instructions to accurately
                                  assess the responses. Additionally, Coco AI
                                  will offer a detailed explanation of what
                                  constitutes an acceptable answer.
                                </span>
                                <textarea
                                  type="text"
                                  id="taQuestionAI"
                                  placeholder={placeholderText}
                                  className="jakarta editor-sub-textarea"
                                  value={questionAI}
                                  onChange={(e) => {
                                    setQuestionAI(e.target.value);
                                  }}
                                />
                              </div>
                            </div>
                          )}
                          {questionType === "truefalse" && (
                            <div>
                              <div className="editor-block-pair">
                                <p className="no">Question</p>
                                <input
                                  type="text"
                                  id="tbQuestion"
                                  placeholder="ex. What type of clippers are used for short hair?"
                                  value={questionText}
                                  onChange={(e) => {
                                    setQuestionText(e.target.value);
                                  }}
                                />
                              </div>
                              <div className="editor-block-pair">
                                <p className="no">Answer</p>
                                <div>
                                  <input
                                    type="radio"
                                    id="rbTrue"
                                    name="answer"
                                    checked={trueOption}
                                    onChange={(e) => {
                                      setTrueOption(e.target.checked);
                                    }}
                                  />
                                  <label htmlFor="true">True</label>
                                </div>

                                <div>
                                  <input
                                    type="radio"
                                    id="rbFalse"
                                    name="answer"
                                    checked={falseOption}
                                    onChange={(e) => {
                                      setFalseOption(e.target.checked);
                                    }}
                                  />
                                  <label htmlFor="false">False</label>
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="editor-block-pair">
                            <p className="no"># of Points</p>
                            <span className="no editor-block-pair-small">
                              The total points will be summed up. Grades will be
                              calculated by dividing the total correct points by
                              the overall total points.
                            </span>
                            <div className="split">
                              <input
                                type="text"
                                id="tbPoints"
                                placeholder="Please enter a number."
                                value={points}
                                onChange={(e) => {
                                  setPoints(e.target.value);
                                }}
                              />
                              <div></div>
                            </div>
                          </div>
                          <div
                            className="editor-btn"
                            onClick={
                              chosenQuestion !== null
                                ? onUpdateQuestion
                                : onNewQuestion
                            }
                          >
                            {chosenQuestion !== null ? (
                              <PrimaryButton text={"Update"} />
                            ) : (
                              <PrimaryButton text={"Create Question"} />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="divider"></div>
                    {/* QUESTIONS */}
                    <div className="editor-slides">
                      {chosenQuestions
                        .sort((a, b) => a.Order - b.Order)
                        .map((quest, q) => {
                          return (
                            <div
                              key={q}
                              className="separate_h"
                              style={{ boxSizing: "border-box" }}
                            >
                              <div
                                className="editor-slide"
                                onClick={() => {
                                  setLoading(true);
                                  setQuestionType(quest.Type);
                                  setChosenQuestion(quest);
                                  setQuestionText(quest.Question);
                                  setPoints(
                                    quest.Points !== undefined
                                      ? quest.Points
                                      : ""
                                  );
                                  if (quest.Type === "multiple") {
                                    // MULTIPLE
                                    if (quest.QuestionPath !== undefined) {
                                      // HAS MEDIA
                                      const contentType =
                                        quest.QuestionPath.split("/")[0];
                                      if (contentType === "Images") {
                                        setToggleContent(true);
                                      } else {
                                        setToggleContent(false);
                                      }
                                      storage_DownloadMedia(
                                        quest.QuestionPath,
                                        (content) => {
                                          setQuestionContent(content);
                                          // DO REST HERE
                                          setChoice1(quest.Answers[0].Choice);
                                          setChoice2(quest.Answers[1].Choice);
                                          setChoice3(quest.Answers[2].Choice);
                                          setChoice4(quest.Answers[3].Choice);
                                          setAnswer1(quest.Answers[0].Answer);
                                          setAnswer2(quest.Answers[1].Answer);
                                          setAnswer3(quest.Answers[2].Answer);
                                          setAnswer4(quest.Answers[3].Answer);
                                          //
                                          setLoading(false);
                                        }
                                      );
                                    } else {
                                      // DO REST HERE
                                      setQuestionContent(null);
                                      // DO REST HERE
                                      setQuestionText(quest.Question);
                                      setChoice1(quest.Answers[0].Choice);
                                      setChoice2(quest.Answers[1].Choice);
                                      setChoice3(quest.Answers[2].Choice);
                                      setChoice4(quest.Answers[3].Choice);
                                      setAnswer1(quest.Answers[0].Answer);
                                      setAnswer2(quest.Answers[1].Answer);
                                      setAnswer3(quest.Answers[2].Answer);
                                      setAnswer4(quest.Answers[3].Answer);
                                      //
                                      setLoading(false);
                                    }
                                  }
                                  if (quest.Type === "short") {
                                    // setQuestionAICheck(quest.AICheck);
                                    setQuestionAI(
                                      quest.Answers[0].replaceAll("jjj", "\n")
                                    );
                                    if (quest.QuestionPath !== undefined) {
                                      // HAS MEDIA
                                      const contentType =
                                        quest.QuestionPath.split("/")[0];
                                      if (contentType === "Images") {
                                        setToggleContent(true);
                                      } else {
                                        setToggleContent(false);
                                      }
                                      storage_DownloadMedia(
                                        quest.QuestionPath,
                                        (media) => {
                                          setLoading(false);
                                          setQuestionContent(media);
                                        }
                                      );
                                    } else {
                                      setLoading(false);
                                    }
                                  }
                                  if (quest.Type === "truefalse") {
                                    setQuestionText(quest.Question);
                                    setPoints(
                                      quest.Points !== undefined
                                        ? quest.Points
                                        : ""
                                    );
                                    if (quest.Answers[0]) {
                                      setTrueOption(true);
                                      setFalseOption(false);
                                    } else {
                                      setTrueOption(false);
                                      setFalseOption(true);
                                    }
                                    if (quest.QuestionPath !== undefined) {
                                      // HAS MEDIA
                                      const contentType =
                                        quest.QuestionPath.split("/")[0];
                                      if (contentType === "Images") {
                                        setToggleContent(true);
                                      } else {
                                        setToggleContent(false);
                                      }
                                      storage_DownloadMedia(
                                        quest.QuestionPath,
                                        (media) => {
                                          setLoading(false);
                                          setQuestionContent(media);
                                        }
                                      );
                                    } else {
                                      setLoading(false);
                                    }
                                  }
                                }}
                                style={{ width: "100%" }}
                              >
                                {/*  */}
                                <div className="side-by">
                                  {quest.Type === "multiple" && (
                                    <FaListAlt
                                      color="green"
                                      className="icon-icon"
                                    />
                                  )}
                                  {quest.Type === "short" && (
                                    <BsChatSquareTextFill
                                      color="orange"
                                      className="icon-icon"
                                    />
                                  )}
                                  {quest.Type === "truefalse" && (
                                    <VscSymbolBoolean
                                      color="#5469D4"
                                      className="icon-icon"
                                    />
                                  )}
                                  <p className="no">{quest.Question}</p>
                                </div>
                              </div>
                              <div className="padding-h">
                                <div
                                  className="pointer"
                                  onClick={() => {
                                    onMoveQuestionUp(quest);
                                  }}
                                >
                                  <IoChevronUpSharp
                                    size={22}
                                    color="#767D9C"
                                    className="pointer"
                                  />
                                </div>
                                <div
                                  className="pointer"
                                  onClick={() => {
                                    onMoveQuestionDown(quest);
                                  }}
                                >
                                  <IoChevronDownSharp
                                    size={22}
                                    className="pointer"
                                    color="#767D9C"
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            )}
            {togglePlan && (
              <div>
                <div className="separate_h align-center">
                  <h1 className="no editor-plan-title">Course Plan</h1>
                  <div className="padding_sm">
                    <PrimaryButton
                      text={"Save Plan"}
                      classes={"fit-content"}
                      onPress={onSaveCoursePlan}
                    />
                  </div>
                </div>
                {/* <br /> */}
                <div className="">
                  <div className="editor-notice side-by">
                    <LuBadgeAlert className="editor-notice-icon" />
                    <p>
                      Here is your course plan for students enrolled in this
                      course. Please reorder the components to reflect the
                      correct sequence for completion. Don't forget to click
                      "Save" if you make any changes or if you haven't confirmed
                      the plan yet.
                    </p>
                  </div>
                  <div className="editor-plan-wrap">
                    {coursePlan
                      .sort((a, b) => a.Order - b.Order)
                      .map((comp, c) => {
                        return (
                          <div
                            className={`editor-plan-block align-center separate_h ${
                              comp.Type === "Lesson"
                                ? "editor-bg-lesson"
                                : comp.Type === "Homework"
                                ? "editor-bg-homework"
                                : "editor-bg-test"
                            }`}
                            key={c}
                          >
                            <p className="no">{comp.Name}</p>
                            <div className="">
                              <div
                                className="pointer"
                                onClick={() => {
                                  const newOrder = comp.Order - 1;
                                  const currentOrder = comp.Order;
                                  if (newOrder >= 1) {
                                    //
                                    const otherOne = coursePlan.find(
                                      (ting) => ting.Order === newOrder
                                    );
                                    const newComp = {
                                      ...comp,
                                      Order: newOrder,
                                    };
                                    const newNewComp = {
                                      ...otherOne,
                                      Order: currentOrder,
                                    };
                                    console.log(newComp);
                                    console.log(newNewComp);

                                    setCoursePlan((prev) =>
                                      prev.map((item) =>
                                        item.id === newComp.id
                                          ? newComp
                                          : item.id === newNewComp.id
                                          ? newNewComp
                                          : item
                                      )
                                    );
                                  }
                                }}
                              >
                                <IoChevronUpSharp
                                  size={20}
                                  className="editor-plan-icon"
                                />
                              </div>
                              <div
                                className="pointer"
                                onClick={() => {
                                  const newOrder = comp.Order + 1;
                                  const currentOrder = comp.Order;
                                  if (newOrder <= coursePlan.length) {
                                    //
                                    const otherOne = coursePlan.find(
                                      (ting) => ting.Order === newOrder
                                    );
                                    const newComp = {
                                      ...comp,
                                      Order: newOrder,
                                    };
                                    const newNewComp = {
                                      ...otherOne,
                                      Order: currentOrder,
                                    };
                                    console.log(newComp);
                                    console.log(newNewComp);

                                    setCoursePlan((prev) =>
                                      prev.map((item) =>
                                        item.id === newComp.id
                                          ? newComp
                                          : item.id === newNewComp.id
                                          ? newNewComp
                                          : item
                                      )
                                    );
                                  }
                                }}
                              >
                                <IoChevronDownSharp
                                  size={20}
                                  className="editor-plan-icon"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/*  */}
      {toggleCourseInfo && (
        <div className="modal">
          <div></div>
          <div className="modal-block">
            <h2 className="no">Let's get started.</h2>
            <p className="no modal-block-caption">
              Please provide basic information to get started. As soon as you
              save, these course details will be entered into our database.
            </p>
            <p className="no modal-block-label">Course Name</p>
            <input
              type="text"
              id="tbCourseName"
              className="modal-block-input"
              placeholder="ex. Pet Grooming Basics"
            />
            <p className="no modal-block-label">Course Description</p>
            <textarea
              type="text"
              id="taCourseDesc"
              className="modal-block-textarea jakarta"
              placeholder="Give short description on what the student expects to learn in this course."
            ></textarea>
            <input
              type="file"
              id="fpCourseImage"
              style={{ display: "none" }}
              onChange={onChangeCourseImage}
            />
            <p className="no modal-block-label">Thumbnail</p>
            <div
              className="icon-btn"
              onClick={() => {
                document.querySelector("#fpCourseImage").click();
              }}
            >
              <MdAddPhotoAlternate className="icon-btn-icon" />
            </div>
            {courseImage !== null && (
              <div className="modal-img">
                <img src={courseImage} />
              </div>
            )}
            <br />
            <br />
            <div className="split">
              <CancelButton
                text={"Cancel"}
                onPress={() => {
                  navigation("/schools/courses");
                }}
              />
              <PrimaryButton text={"Continue"} onPress={onContinue} />
            </div>
          </div>
          <div></div>
        </div>
      )}
    </div>
  );
}
