import AnimationWrapper from "../common/PageAnimation";
import InputBoxComponent from "../components/InputBoxComponent";
import googleIcon from "../imgs/google.png";
import fullLogo from "../imgs/full-logo.png";
import { Link, Navigate } from "react-router-dom";
import {Toaster,toast} from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/session";
import { UserContext } from "../App";
import { useContext, useRef, useState } from "react";
import { authWithGoogle } from "../common/Firebase";
import { Button } from "../components/ui/button";

const UserAuthForm = ({ type }) => {

  const [redirect, setRedirect] = useState(false);
  const formRef = useRef(null);

  // Access to the user context
  let {userAuth:{access_token},setUserAuth} = useContext(UserContext);

  const userAuthThroughServer = (serverRoute, formData) => {


      //We can use import whne working with vite dont forget to use prefix as VITE otherwise it wont work
      axios.post(import.meta.env.VITE_HOST + serverRoute , formData).then(({data})=>{

        storeInSession("user",JSON.stringify(data))

        // store Data in the session
        setUserAuth(data)
        // console.log(sessionStorage);
        setRedirect(false)

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
    let form = new FormData(formRef.current);

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

    if(type !== "sign-in" && !passwordRegex.test(password)){

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

    redirect || access_token ? <Navigate to="/" /> : <AnimationWrapper key={type}>

      <Toaster/>
      <section className="grid min-h-svh lg:grid-cols-2">

        {/* Form side */}
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex justify-center md:justify-start">
            <Link to="/" className="inline-flex">
              <img src={fullLogo} className="h-7" alt="Blogspace" />
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-center">
            <form ref={formRef} id="formElement" name="form" className="w-full max-w-sm">
              <div className="mb-8 text-center md:text-left">
                <h1 className="text-3xl font-gelasio capitalize mb-2">
                  {type === "sign-in" ? "Welcome back" : "Join us today"}
                </h1>
                <p className="text-muted-foreground">
                  {type === "sign-in"
                    ? "Sign in to continue reading and writing."
                    : "Create an account to start writing."}
                </p>
              </div>

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

              <Button className="w-full mt-2" size="lg" type="submit" onClick={handleSubmit}>
                {type.replace("-", " ")}
              </Button>

              <div className="relative w-full flex items-center gap-3 my-7 uppercase text-xs text-muted-foreground font-semibold tracking-wide">
                <hr className="w-1/2 border-border" />
                <p>or</p>
                <hr className="w-1/2 border-border" />
              </div>

              <Button variant="outline" className="w-full" size="lg" onClick={handleGoogleAuth}>
                <img src={googleIcon} className="w-5" />
                Continue with Google
              </Button>

              {type == "sign-in" ? (
                <p className="mt-8 text-muted-foreground text-sm text-center">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-primary font-medium hover:underline">
                    Join us today.
                  </Link>
                </p>

                ) : (

                <p className="mt-8 text-muted-foreground text-sm text-center">
                  Already have an account?{" "}
                  <Link to="/signin" className="text-primary font-medium hover:underline">
                    Sign in here.
                  </Link>
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Brand side, hidden on small screens */}
        <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-primary via-primary to-accent p-10 text-primary-foreground">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(circle, currentColor 1px, transparent 1px)",
              backgroundSize: "28px 28px"
            }}
          />

          <div className="relative flex items-center gap-2 text-lg font-semibold">
            <i className="fi fi-rr-feather text-xl"></i>
            Blogspace
          </div>

          <div className="relative max-w-md">
            <p className="text-3xl font-gelasio leading-snug mb-4">
              "A place to read, write, and share ideas that matter."
            </p>
            <p className="text-primary-foreground/70">
              Join a community of writers and readers publishing every day.
            </p>
          </div>

          <div className="relative text-sm text-primary-foreground/60">
            &copy; {new Date().getFullYear()} Blogspace. All rights reserved.
          </div>
        </div>

      </section>
    </AnimationWrapper>

  );
};

export default UserAuthForm;
