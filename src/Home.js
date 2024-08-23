import "./STYLES/Home.css";
import Navigation from "./UTILITIES/Navigation";
import img1 from "./IMAGES/doggo1.jpg";
import Footer from "./UTILITIES/Footer";
import { useEffect } from "react";

export function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="main jakarta">
      <Navigation />
      <div className="home-panel-1">
        <div className="home-panel-1-left">
          <h3 className="no green">SDGA Portal</h3>
          <h1 className="no">
            Pet
            <br />
            Grooming
            <br />
            Edu
          </h1>
          <br />
          <p className="no">
            Manage your established grooming schools with a fully equipped
            dashboard. Configure school capabilities, create message boards for
            communication, and create licenses for student accounts.
          </p>
          <br />
          <button className="pointer">View Articles</button>
        </div>
        <div className="home-panel-1-right">
          <img src={img1} alt="Dog holding a rose." />
        </div>
      </div>
      <Footer />
    </div>
  );
}
