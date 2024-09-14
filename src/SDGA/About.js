import "../STYLES/Home.css";
import "../STYLES/Contact.css";
import Navigation from "../UTILITIES/Navigation";
import Footer from "../UTILITIES/Footer";
import { useEffect } from "react";
import "../STYLES/About.css";

export function About() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="main jakarta">
            <Navigation />
            <div className="home-panel-1">
                <div className="home-panel-1-left">
                    <h1 className="no">
                        About SDGA
                    </h1>
                </div>

            </div>
            <div className="about-wrap">
                <h2>San Diego Grooming Academy: A Premier Dog Grooming School in the Heart of North Park</h2>
                <br />
                <p className="no">Nestled in the vibrant neighborhood of North Park, San Diego, CA, the San Diego Grooming Academy stands as a unique institution dedicated to transforming passionate individuals into skilled professional dog groomers. Established in 2016, this one-of-a-kind grooming school has quickly become a cornerstone of grooming education in the region.</p>
                <br />
                <p className="no">Though the academy itself was founded relatively recently, its roots run much deeper, tracing back to the visionary career of its founder, Myke Ross. Long before establishing the San Diego Grooming Academy, Myke built a successful career as a multi-platform entrepreneur. Over the course of several decades, he flourished across various industries, driven by a consistent rise to the top in each venture. Yet, amidst his many achievements, it was the discovery of his greatest passion—working with animals through the art of professional pet grooming—that led him to found the academy.</p>
                <br />
                <h2>
                    The San Diego Grooming Academy Experience
                </h2>
                <br />
                <p className="no">Today, the San Diego Grooming Academy continues to fulfill Myke’s vision by providing a safe, welcoming environment for post-secondary education, where students receive both comprehensive curriculum-based lectures and daily hands-on training in grooming techniques. The school is designed to equip aspiring groomers with the knowledge, skills, and confidence necessary to succeed in the grooming industry.</p>
                <br />
                <p className="no">
                    From basic grooming techniques to advanced styling, the curriculum covers every aspect of professional pet grooming, ensuring that graduates leave fully prepared for a successful career. Whether it’s learning the nuances of breed-specific grooming or mastering the tools of the trade, students benefit from an immersive learning experience that blends theory with practical application.
                </p>
                <br />
                <p className="no">
                    Additionally, the academy takes pride in offering continuous professional development for those already in the grooming industry. Through specialized workshops and advanced classes, the academy remains a hub of knowledge and growth for experienced groomers looking to refine their skills. San Diego Grooming Academy also serves as a local platform to host influential leaders in the pet grooming industry, fostering an environment of collaboration and innovation.
                </p>
                <br />
                <h2>Myke Ross: The Visionary Behind the Academy</h2>
                <br />
                <p className="no">
                    At the core of San Diego Grooming Academy’s success is Myke Ross. His entrepreneurial spirit and relentless thirst for knowledge have shaped every aspect of the school. Myke attributes his achievements not only to his drive and passion but also to his desire to share his knowledge and help others find success. For him, few things bring as much joy as seeing his students excel in their careers and reach their own personal goals.
                </p>
                <br />
                <p className="no">
                    The academy’s strong foundation in hands-on training is a direct reflection of Myke’s belief that the best way to learn is by doing. Under his guidance, students not only gain valuable technical skills but also develop the confidence needed to work with a variety of dog breeds in real-world grooming situations.
                </p>
                <br />
                <h2>Join the Grooming Community</h2>
                <br />
                <p className="no">
                    Are you considering a career in the rapidly growing pet grooming industry? San Diego Grooming Academy offers the perfect opportunity to turn your passion for animals into a fulfilling career. With a supportive environment, expert instruction, and state-of-the-art training facilities, the academy provides everything you need to succeed.
                </p>
                <br />
                <p className="no">
                    Not only does the school provide education for aspiring groomers, but it also offers grooming services performed by students under the supervision of professional instructors. If you’re interested in having your dog groomed by the next generation of master groomers, San Diego Grooming Academy is the ideal place.
                </p>
                <br />
                <h2>Contact San Diego Grooming Academy</h2>
                <br />
                <p className="no">Whether you’re ready to start your journey toward a rewarding career in dog grooming or simply want to learn more about the academy’s offerings, San Diego Grooming Academy is here to help. Call today at 619-452-2366 and take the first step toward becoming part of the vibrant grooming community.</p>
                <h1>San Diego Grooming Academy—where passion for pets meets professional grooming expertise.</h1>
                <br />
            </div>
            <Footer />
        </div>
    );
}
