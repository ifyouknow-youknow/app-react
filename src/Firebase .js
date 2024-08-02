// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
  getDoc,
  where,
  query,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDZsnds0BQf_ntvXi3fEGoM31tBmpknlm8",
  authDomain: "petgroomingedu.firebaseapp.com",
  projectId: "petgroomingedu",
  storageBucket: "petgroomingedu.appspot.com",
  messagingSenderId: "1029444876703",
  appId: "1:1029444876703:web:098f0f163e8cd107aa25aa",
  measurementId: "G-R27RX33EJK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage();

export function auth_SignIn(email, password, person, errorMsg) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user);
      person(user);
      // ...
    })
    .catch((error) => {
      errorMsg(error.message);
      console.error("ERROR: ", error);
    });
}
export function auth_CheckSignedIn(person, navigate) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      const thisUser = { id: uid, ...user };
      person(thisUser);
      // ...
    } else {
      // User is signed out
      navigate("/");
    }
  });
}
export function auth_SignOut(success) {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      success(true);
    })
    .catch((error) => {
      // An error happened.
      alert("There was an issue with this request.");
    });
}
export function auth_CreateUser(email, password, thisUser) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
      thisUser(user);
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorCode)
      // ..
    });
}
export function auth_ResetPasword(email, success) {
  sendPasswordResetEmail(auth, email)
    .then(() => {
      // 
      success(true)
    })
    .catch((error) => {
      alert(error.message)
    });
}
//
export async function firebase_GetDocument(coll, documentId, setter) {
  const docRef = doc(db, coll, documentId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const obj = {
      id: docSnap.id,
      ...docSnap.data(),
    };
    setter(obj);
  } else {
    // docSnap.data() will be undefined in this case
    setter(null);
  }
}
export async function firebase_GetAllDocuments(coll, setter) {
  const querySnapshot = await getDocs(collection(db, coll));
  const allThings = [];
  querySnapshot.forEach((doc) => {
    const obj = {
      id: doc.id,
      ...doc.data(),
    };
    allThings.push(obj);
  });
  setter(allThings);
}
export async function firebase_GetAllDocumentsQueried(
  coll,
  whereQueries,
  setter
) {
  let q = collection(db, coll);

  whereQueries.forEach((queryCondition) => {
    q = query(
      q,
      where(queryCondition.field, queryCondition.operator, queryCondition.value)
    );
  });

  const querySnapshot = await getDocs(q);
  const allThings = [];
  querySnapshot.forEach((doc) => {
    const obj = {
      id: doc.id,
      ...doc.data(),
    };
    allThings.push(obj);
  });
  setter(allThings);
}
export async function firebase_CreateDocument(coll, documentId, args, success) {
  await setDoc(doc(db, coll, documentId), args)
    .then(() => {
      success(true);
    })
    .catch((error) => {
      console.log(error);
      alert("ERROR:", error.code);
    });
}
export async function firebase_UpdateDocument(coll, documentId, args, success) {
  const washingtonRef = doc(db, coll, documentId);
  await updateDoc(washingtonRef, args)
    .then(() => {
      success(true);
    })
    .catch((error) => {
      console.error("ERROR: ", error);
    });
}
export async function firebase_DeleteDocument(coll, documentId, success) {
  await deleteDoc(doc(db, coll, documentId))
    .then(() => {
      success(true);
    })
    .catch((error) => {
      console.error("ERROR: ", error);
    });
}
//
export async function storage_UploadMedia(media, mediaPath, success) {
  try {
    console.log("Starting upload...");

    // Convert the data URL to a Blob
    const response = await fetch(media);
    if (!response.ok) throw new Error("Failed to fetch media");

    const mediaBlob = await response.blob();
    console.log("Media Blob created:", mediaBlob);

    const storageRef = ref(storage, mediaPath);
    console.log("Storage reference created:", storageRef);

    const uploadTask = uploadBytesResumable(storageRef, mediaBlob);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Handle progress changes, if needed
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        // Handle errors
        console.error("Error uploading media:", error);
        success(false);
      },
      async () => {
        // Handle successful completion
        console.log("Upload completed successfully");
        success(true);
      }
    );
  } catch (error) {
    console.error("Error uploading media: ", error);
    success(false);
  }
}
export async function storage_DownloadMedia(mediaPath, setter) {
  try {
    const url = await getDownloadURL(ref(storage, mediaPath));
    setter(url);
  } catch (error) {
    console.error("Error downloading media:", error);
  }
}
export async function storage_DeleteMedia(mediaPath, success) {
  const desertRef = ref(storage, mediaPath);
  // Delete the file
  deleteObject(desertRef)
    .then(() => {
      // File deleted successfully
      success(true);
    })
    .catch((error) => {
      // Uh-oh, an error occurred!
      alert(`ERROR: ${error.message}`);
    });
}
