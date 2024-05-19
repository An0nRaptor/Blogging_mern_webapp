// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {GoogleAuthProvider,getAuth, signInWithPopup} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCE5ckqzcaiT0pfm81D_bXVfXgXaolFKX8",
  authDomain: "reactjs-blog-project.firebaseapp.com",
  projectId: "reactjs-blog-project",
  storageBucket: "reactjs-blog-project.appspot.com",
  messagingSenderId: "562898701839",
  appId: "1:562898701839:web:a4a543f27abd9e89e21d7a"
};

// Initialize Firebase 
const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();

const auth = getAuth()

export const authWithGoogle = async() =>{

    let user = null;

    await signInWithPopup(auth,provider).then((result)=>{

        user = result.user;

    }).catch((error)=>{

        console.log(error);
    })

    return user;

}