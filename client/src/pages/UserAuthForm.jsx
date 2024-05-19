import { useRef } from "react";
import AnimationWrapper from "../common/PageAnimation";
import InputBoxComponent from "../components/InputBoxComponent";
import googleIcon from "../imgs/google.png";
import { Link, Navigate } from "react-router-dom";
import {Toaster,toast} from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/session";
import { UserContext } from "../App";
import { useContext } from "react";
import { authWithGoogle } from "../common/Firebase";

const UserAuthForm = ({ type }) => {

  // Access to the user context
  let {userAuth:{access_token},setUserAuth} = useContext(UserContext);

  const userAuthThroughServer = (serverRoute, formData) => {
   
    console.log(import.meta.env.VITE_HOST + serverRoute , formData);

    console.log(import.meta.env.VITE_HOST);

      //We can use import whne working with vite dont forget to use prefix as VITE otherwise it wont work 
      axios.post(import.meta.env.VITE_HOST + serverRoute , formData).then(({data})=>{

        storeInSession("user",JSON.stringify(data))

        // store Data in the session
        setUserAuth(data)
        // console.log(sessionStorage);

      }).catch(({response})=>{

        console.log("Response" + response);

        // toast.error(response.data.error)

      })

  }

  //HANDLESUBMIT 
  const handleSubmit =(e)=>{

    e.preventDefault();

    let serverRoute = type == "sign-in" ? "/signin" : "/signup";
    
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password


    // formdata
    let form = new FormData(formElement);

    let formData = {};

    for(let [key,value] of form.entries()){

      formData[key] = value;

    }

    const {fullname,email,password} = formData;

    // FormValidation
    if(fullname){

      if(fullname.length < 3){

         return toast.error("Fullname must be atleast 3 letters long.")

        }
      } 

    if(!email.length){

        return toast.error("Enter Email")
    }

    if(!emailRegex.test(email)){

        return toast.error("Email is invalid")
    }

    if(!passwordRegex.test(password)){

        return toast.error("Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letter")
    }

      userAuthThroughServer(serverRoute,formData);
    
  }

  // GoogleAuth
  const handleGoogleAuth =async(e)=>{

    e.preventDefault();

     await authWithGoogle().then((user)=>{

        console.log(user);

      let serverRoute = "/googleauth";
      
      let formData = {accessToken: user.accessToken }

      userAuthThroughServer(serverRoute,formData);

    }).catch((err)=>{

      toast.error('Trouble logging through google!')

      return console.log(err);

    })

  }
  
  return (
  
    access_token ? <Navigate to="/" /> : <AnimationWrapper key={type}>

      <section className="h-cover flex items-center justify-center">
      <Toaster/>
        <form id="formElement" className="w-[80%] max-w-[480px]" name="form">
          <h1 className="text-4xl font-gelasio capitalize text-center my-5">
            {type === "sign-in" ? "Welcome Back " : " Join us today!"}
          </h1>

          {type != "sign-in" ? (
            <InputBoxComponent
              type="text"
              name="fullName"
              placeholder="Full Name"
              icon="fi-rr-user"/>
          
          ) : (" ")}

          <InputBoxComponent
            type="email"
            name="email"
            placeholder="Email"
            icon="fi-rr-envelope"/>

          <InputBoxComponent
            type="password"
            name="password"
            placeholder="Password"
            icon="fi-rr-key"/>

          <button className="btn-dark center mt-14" type="submit" onClick={handleSubmit}>
            {type.replace("-", " ")}
          </button>

          <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
            <hr className="w-1/2 border-black" />
            <p>or</p>
            <hr className="w-1/2 border-black" />
          </div>

          <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center" onClick={handleGoogleAuth}>
            <img src={googleIcon} className="w-5 " />
            continue with google
          </button>

          {type == "sign-in" ? (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Don't have an account ?
              <Link to="/signup" className="underline text-black text-xl ml-1">
                Join us today.
              </Link>
            </p>

            ) : (

            <p className="mt-6 text-dark-grey text-xl text-center">
              Already have an account ?
              <Link to="/signin" className="underline text-black text-xl ml-1">
                Sign in here.
              </Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>

  );
};

export default UserAuthForm;
