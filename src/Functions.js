import emailjs from "@emailjs/browser";
import {
  emailjs_publicKey,
  emailjs_serviceId,
  emailjs_templateId,
  SDGA_email,
  serverURL,
} from "./Constants";
import axios from "axios";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import { PDFDocument, rgb } from "pdf-lib";

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_KEY);

export function randomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters[randomIndex];
  }

  return result;
}
export function removeDuplicatesByProperty(array, key) {
  const seen = new Set();
  return array.filter((item) => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    } else {
      seen.add(value);
      return true;
    }
  });
}
export function removeDuplicates(arr) {
  return [...new Set(arr)];
}
export function sortObjects(arr, property, direction = "asc") {
  return arr.slice().sort((a, b) => {
    if (a[property] < b[property]) {
      return direction === "asc" ? -1 : 1;
    }
    if (a[property] > b[property]) {
      return direction === "asc" ? 1 : -1;
    }
    return 0;
  });
}
export function swapObjects(arr, index1, index2) {
  if (index1 !== index2 && index1 >= 0 && index1 < arr.length && index2 >= 0 && index2 < arr.length) {
    const temp = arr[index1];
    arr[index1] = arr[index2];
    arr[index2] = temp;
  }
  return arr;
}
//
export function formatDate(date) {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthsOfYear = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayName = daysOfWeek[date.getDay()];
  const monthName = monthsOfYear[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";

  // Convert hours from 24-hour format to 12-hour format
  hours = hours % 12 || 12;

  return `${dayName}, ${monthName} ${day}, ${year} ${hours}:${minutes} ${period}`;
}
export function formatTime(date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Convert hours and minutes to strings
  const hoursString = hours.toString();
  const minutesString = minutes < 10 ? `0${minutes}` : minutes.toString();

  return `${hoursString}:${minutesString}`;
}
//
export const scrollToAnchor = (id) => {
  const anchor = document.getElementById(`${id}`);
  if (anchor) {
    anchor.scrollIntoView({ behavior: "smooth" });
  }
};

//
export async function emailjs_SendEmail(toEmail, subject, message, success) {
  await emailjs
    .send(
      emailjs_serviceId,
      emailjs_templateId,
      {
        toEmail: toEmail,
        fromName: "Pet Grooming Edu",
        subject: subject,
        fromEmail: SDGA_email,
        message: message,
      },
      emailjs_publicKey
    )
    .then(() => {
      success(true);
    })
    .catch((error) => {
      success(false);
    });
}
//
export async function coco_GetResponse(instructions, setter) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash", // SAFETY SETTINGS
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ],
  });
  const result = await model.generateContent(instructions);
  const response = result.response;
  const text = response.text();
  setter(text);
}
export async function coco_ChatSetup(instructions, setter) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: instructions,
    // SAFETY SETTINGS
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ],
  });
  const chat = model.startChat({
    history: [],
    generationConfig: {
      maxOutputTokens: 300,
    },
  });
  setter(chat);
}
export async function coco_ChatSendMessage(chat, message, res) {
  const result = await chat.sendMessage(message);
  const response = await result.response;
  const text = await response.text();
  console.log(text);
  res(text);
}
//
export async function csv_CreateCSV(text) {
  // Prepare CSV content
  const csvContent = `data:text/csv;charset=utf-8,${text}`;

  // Create a Blob from the CSV content
  const blob = new Blob([text], { type: "text/csv" });

  // Create a link and trigger the download
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "studentkeys.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
//
export async function function_GetThingsGoing(ready) {
  try {
    const response = await fetch(`${serverURL}/greeting`);

    // Ensure the response is okay
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data)
    if (data.success) {
      ready(true);
    }
  } catch (error) {
    console.error("Error fetching the greeting:", error);
  }
}
export async function function_textToSpeech(text, setter) {
  const body = { text: text };
  const url = `${serverURL}/synthesize`;

  try {
    const response = await axios.post(url, body, { responseType: "blob" });
    const blob = new Blob([response.data], { type: "audio/mp3" });
    const audioUrl = URL.createObjectURL(blob);
    console.log(audioUrl); // Check if this URL is valid and accessible
    setter(audioUrl);
  } catch (error) {
    console.error("Error synthesizing speech:", error);
    throw error;
  }
}
export async function function_speechToText(audioBlob, setter) {
  const formData = new FormData();
  formData.append("audio", audioBlob);

  const url = `${serverURL}/transcribe`;

  try {
    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const transcription = response.data.transcription;
    setter(transcription);
  } catch (error) {
    console.error("Error transcribing speech:", error);
  }
}
// SERVER
export function server_PostAPI(endpoint, args, setter) {
  const body = { ...args };
  const url = `${serverURL}/${endpoint}`;

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Response:", data);
      if (setter) {
        setter(data);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
