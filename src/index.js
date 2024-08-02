import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./Home";
import { Login } from "./Login";
import { Dashboard } from "./IPG/Dashboard";
import { NewSchool } from "./IPG/NewSchool";
import { SchoolHome } from "./SCHOOLS/SchoolHome";
import { SchoolLogin } from "./SCHOOLS/SchoolLogin";
import { SchoolDashboard } from "./SCHOOLS/SchoolDashboard";
import { SchoolCourses } from "./SCHOOLS/SchoolCourses";
import { CourseEditor } from "./SCHOOLS/CourseEditor";
import { StudentHome } from "./STUDENTS/StudentHome";
import { StudentLogin } from "./STUDENTS/StudentLogin";
import { StudentDashboard } from "./STUDENTS/StudentDashboard";
import { StudentLessons } from "./STUDENTS/StudentLessons";
import { StudentLesson } from "./STUDENTS/StudentLesson";
import { StudentHomeworks } from "./STUDENTS/StudentHomeworks";
import { StudentHomework } from "./STUDENTS/StudentHomework";
import { StudentTests } from "./STUDENTS/StudentTests";
import { StudentTest } from "./STUDENTS/StudentTest";
import { SchoolStudents } from "./SCHOOLS/SchoolStudents";
import { StudentGrades } from "./STUDENTS/StudentGrades";
import { SchoolDetails } from "./IPG/SchoolDetails";
import { SignUp } from "./STUDENTS/SignUp";

//
const router = createBrowserRouter([
  {
    path: "/",
    element: <StudentHome />,
  },
  {
    path: "/student/login",
    element: <StudentLogin />,
  },
  {
    path: "/student/dashboard",
    element: <StudentDashboard />,
  },
  {
    path: "/student/lessons",
    element: <StudentLessons />,
  },
  {
    path: "/student/lesson/:lessonId",
    element: <StudentLesson />,
  },
  {
    path: "/student/homeworks",
    element: <StudentHomeworks />,
  },
  {
    path: "/student/homework/:homeworkId",
    element: <StudentHomework />,
  },
  {
    path: "/student/tests",
    element: <StudentTests />,
  },
  {
    path: "/student/test/:testId",
    element: <StudentTest />,
  },
  {
    path: "/student/grades",
    element: <StudentGrades />,
  },
  {
    path: "/ipg",
    element: <Home />,
  },
  {
    path: "/ipg/login",
    element: <Login />,
  },
  {
    path: "/ipg/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/ipg/new-school",
    element: <NewSchool />,
  },
  {
    path: "/ipg/school/:schoolId",
    element: <SchoolDetails />,
  },
  {
    path: "/schools",
    element: <SchoolHome />,
  },
  {
    path: "/schools/login",
    element: <SchoolLogin />,
  },
  {
    path: "/schools/dashboard",
    element: <SchoolDashboard />,
  },
  {
    path: "/schools/courses",
    element: <SchoolCourses />,
  },
  {
    path: "/schools/course-editor/:courseId",
    element: <CourseEditor />,
  },
  {
    path: "/schools/students",
    element: <SchoolStudents />,
  },
  {
    path: "/student/signup",
    element: <SignUp />,
  }
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
