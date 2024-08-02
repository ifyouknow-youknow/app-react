import "../STYLES/Home.css";
import img1 from "../IMAGES/doggo2.jpg";
import SchoolNavigation from "../UTILITIES/SchoolNavigation";
import SchoolFooter from "../UTILITIES/SchoolFooter";
import { useEffect } from "react";

export function SchoolHome() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="main jakarta">
      <SchoolNavigation />
      <div className="home-panel-1">
        <div className="home-panel-1-left">
          <h3 className="no red">School Portal</h3>
          <h1 className="no">
            Pet
            <br />
            Grooming
            <br />
            Edu
          </h1>
          <br />
          <p className="no">
            Monitor and manage student progress and records with ease. Update
            your curriculum seamlessly or opt for our state-approved curriculum
            for efficient and swift integration.
          </p>
          <br />
          <button className="pointer">Learn More</button>
        </div>
        <div className="home-panel-1-right">
          <img src={img1} alt="Dog holding a rose." />
        </div>
      </div>
      <SchoolFooter />
    </div>
  );
}
