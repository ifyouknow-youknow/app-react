import "../STYLES/Home.css";
import img1 from "../IMAGES/grooming2.jpg";
import StudentNavigation from "../UTILITIES/StudentNavigation";
import SchoolFooter from "../UTILITIES/SchoolFooter";
import { useEffect } from "react";
import "../STYLES/StudentHome.css";
import { FaBookBookmark } from "react-icons/fa6";
import { MdTypeSpecimen } from "react-icons/md";
import { IoSchool } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export function StudentHome() {
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="main jakarta">
      <StudentNavigation />
      <div className="home-panel-1">
        <div className="home-panel-1-left">
          <h3 className="no blue">Student Portal</h3>
          <h1 className="no">
            Pet
            <br />
            Grooming
            <br />
            Edu
          </h1>
          <br />
          <p className="no">
            Welcome grooming students! Pet Grooming Edu is your comprehensive
            portal, fully equipped to provide seamless access to lessons,
            assignments, and assessments.
          </p>
          <br />
          <button onClick={() => {
            navigate('/contact')
          }} className="pointer">Join Now</button>
        </div>
        <div className="home-panel-1-right">
          <img src={img1} alt="Dog holding a rose." />
        </div>
      </div>
      <div className="home-panel-2">
        <h1 className="no">
          All tools available to become the best grooming professional.
        </h1>
        <br />
        <div className="home-panel-2-blocks">
          <div className="home-panel-2-block padding">
            <div className="side-by">
              <h3 className="no">Lessons</h3>
              <FaBookBookmark className="home-panel-2-icon" color="#117DFA" />
            </div>
            <p className="no">
              Each lesson is accompanied by slides or videos, along with
              detailed notes to support your preferred learning style. You can
              read the notes, engage with the visual content, or utilize our
              built-in text-to-speech feature to listen to the lesson.
            </p>
          </div>
          <div className="home-panel-2-block padding">
            <div className="side-by">
              <h3 className="no">Homeworks</h3>
              <MdTypeSpecimen className="home-panel-2-icon" color="#117DFA" />
            </div>
            <p className="no">
              Homework assignments enable students to apply their knowledge in
              practice. Our Coco AI Assistant is available to provide detailed
              responses, enhancing your understanding of the subject matter.
            </p>
          </div>
          <div className="home-panel-2-block padding">
            <div className="side-by">
              <h3 className="no">Tests</h3>
              <IoSchool className="home-panel-2-icon" color="#117DFA" />
            </div>
            <p className="no">
              Assess your knowledge with our comprehensive tests, featuring
              multiple-choice, short answer, and true or false questions. The
              highly efficient Coco AI Assistant will provide valuable feedback
              on your responses.
            </p>
          </div>
        </div>
      </div>
      <SchoolFooter />
    </div>
  );
}
