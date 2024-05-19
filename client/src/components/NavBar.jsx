import { useContext, useEffect, useState } from "react";
import logo from "../imgs/logo.png";
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import UserNavigationPanel from "./UserNavigationPanel";
import axios from "axios";

const NavBar = () => {
  const [searchVisibility, setShowSearchVisibility] = useState(false);

  let navigate = useNavigate()

  // Check whether the user is logged in ot not using the user contect
  // we want userAuth to check if the value is undefined then it wont destructure the accesskey and profile img
  const {userAuth,userAuth: { access_token, profile_img,new_notification_available },setUserAuth} = useContext(UserContext);
  const [userNavPanel,setUserNavPanel] = useState(false);

  useEffect(()=>{

    if(access_token){

      axios.get(import.meta.env.VITE_HOST + '/new-notification',{
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      }).then(({data})=>{
        
          setUserAuth({...userAuth,...data})

      }).catch(err=>{

        console.log(err);
      })

    }

  },[access_token])

  const handleUserNavPanel = () => {

    setUserNavPanel((currVal)=> !currVal)

  }

  const handleSearchFunc=(e)=>{

     let query = e.target.value;

     if(e.keyCode == 13 && query.length ){

        navigate(`/search/${query}`)


     }
  }

  const handleBlur =()=>{

    setTimeout(()=>{

      setUserNavPanel(false)

    },200)

  }

  

  return (
    <>
      <nav className="navbar z-50">
        <Link to="/" className=" flex-none w-10">
          <img src={logo} className="w-full" />
        </Link>

       
        <div
          className={
            "absolute mt-0.5 bg-white w-full left-0 top-full border-gray py-4 px-[5vw] md:border-0 md:relative md:block md:inset-0 md:p-0 md:w-auto md:show " +
            (searchVisibility ? "show" : "hide")
          }>

          <input
            type="text"
            placeholder="Search"
            className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12"
              onKeyDown={handleSearchFunc}
            />
          <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl"></i>
        </div>
        <div className="flex items-center gap-3 md:gap-6 ml-auto">
          <button
            className="md:hidden bg-grey w-12 h-12 rounded-full text-xl flex items-center justify-center"
            onClick={() => setShowSearchVisibility((currVal) => !currVal)}>
            <i className="fi fi-rr-search text-xl"></i>
          </button>
          <Link to="/editor" className="hidden md:flex gap-2 link text-xl">
            <i className="fi fi-rr-file-edit"></i>
            <p>Write</p>
          </Link>

          {access_token ? (
            <>
                <Link to="/dashboard/notifications">
                  <button className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/10">
                    <i className="fi fi-rr-bell text-2xl block mt-1"></i>
                    {
                      new_notification_available ? <span className="bg-red w-3 h-3 rounded-full absolute z-10 top-2 right-2"></span> : ""
                    }
                  </button>
                </Link>

                <div className="relative" onClick={handleUserNavPanel} onBlur={handleBlur}>
                    <button className="w-12 h-12 mt-1">
                      <img src={profile_img} className="w-full h-full rounded-full object-cover"/>
                    </button>

                  {userNavPanel ? <UserNavigationPanel/> : " "}

                </div>

            </>

          ) : (

            <>
              <Link className="btn-dark py-2" to="signin">
                Sign In
              </Link>
              <Link className="btn-light py-2 hidden md:block" to="signup">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default NavBar;
