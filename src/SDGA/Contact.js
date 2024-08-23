import "../STYLES/Home.css";
import "../STYLES/Contact.css";
import Navigation from "../UTILITIES/Navigation";
import img1 from "../IMAGES/doggo3.jpg";
import Footer from "../UTILITIES/Footer";
import { useEffect } from "react";
import { firebase_CreateDocument } from "../Firebase ";
import { randomString } from "../Functions";

export function Contact() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    async function onSubmit() {
        const fullName = document.querySelector('#tbFullName').value;
        const email = document.querySelector('#tbEmail').value;
        const role = document.querySelector('#ddRole').value;
        const message = document.querySelector('#taMessage').value;

        if (fullName == "" || email == "" || role == 'Select one' || message == "") {
            alert('Please include all fields before submitted.');
            return;
        }

        await firebase_CreateDocument('ContactEntries', randomString(25), {
            FullName: fullName,
            Email: email,
            Role: role,
            Message: message.replaceAll("\n", "jjj")
        }, (success) => {
            if (success) {
                alert('Success! We will get back to you soon. Thank you!');
                document.querySelector("#tbFullName").value = "";
                document.querySelector("#tbEmail").value = "";
                document.querySelector("#ddRole").value = "Select one";
                document.querySelector("#taMessage").value = "";
            }
        })


    }

    return (
        <div className="main jakarta">
            <Navigation />
            <div className="home-panel-1">
                <div className="home-panel-1-left">
                    <h1 className="no">
                        Contact Us
                    </h1>
                    <br />
                    <p className="no">
                        Please fill out this short form if you’re interested in creating an account and gaining access to San Diego Grooming Academy’s top-rated pet grooming curriculum, designed by industry experts. We’re here to answer any questions you may have!
                    </p>
                    <br />
                    <p className="small_text no">Full Name</p>
                    <input id="tbFullName" type="text" placeholder="ex. John Doe" className="contact-input"
                    />
                    {/* <br /> */}
                    <p className="small_text no">Email</p>
                    <input id="tbEmail" type="text" placeholder="ex. jdoe@gmail.com" className="contact-input"
                    />
                    {/* <br /> */}
                    <p className="small_text no">Are you a..?</p>
                    <select id="ddRole" className="contact-drop">
                        <option>Select one</option>
                        <option>School</option>
                        <option>Groomer</option>
                        <option>Student</option>
                    </select>
                    {/* <br /> */}
                    <p className="small_text no">Message</p>
                    <textarea id="taMessage" className="contact-textarea jakarta" placeholder="Enter a message here.."></textarea>
                    <button onClick={() => { onSubmit() }} className="contact-button pointer">Submit</button>
                </div>
                <div className="home-panel-1-right">
                    <img src={img1} alt="Dog holding a rose." />
                </div>
            </div>
            <Footer />
        </div>
    );
}
