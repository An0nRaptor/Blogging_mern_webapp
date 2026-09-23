import { useContext, useEffect, useState } from "react";
import logo from "../imgs/logo.png";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import UserNavigationPanel from "./UserNavigationPanel";
import axios from "axios";
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { DropdownMenu, DropdownMenuTrigger } from "./ui/dropdown-menu";

const NavBar = () => {
  const [searchVisibility, setShowSearchVisibility] = useState(false);

  let navigate = useNavigate();

  // Check whether the user is logged in ot not using the user contect
  // we want userAuth to check if the value is undefined then it wont destructure the accesskey and profile img
  const { userAuth, userAuth: { access_token, profile_img, new_notification_available }, setUserAuth } = useContext(UserContext);

  useEffect(() => {
    if (access_token) {
      axios.get(import.meta.env.VITE_HOST + '/new-notification', {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      }).then(({ data }) => {

        setUserAuth({ ...userAuth, ...data })

      }).catch(err => {

        console.log(err);
      })

    }

  }, [access_token])

  const handleSearchFunc = (e) => {

    let query = e.target.value;

    if (e.keyCode == 13 && query.length) {

      navigate(`/search/${query}`)


    }
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

          <div className="relative">
            <Input
              type="text"
              placeholder="Search"
              className="w-full md:w-72 rounded-full pl-12 pr-6 bg-secondary/70"
              onKeyDown={handleSearchFunc}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
        <div className="flex items-center gap-3 md:gap-6 ml-auto">
          <Button
            variant="light"
            size="icon"
            className="md:hidden"
            onClick={() => setShowSearchVisibility((currVal) => !currVal)}>
            <Search className="h-4 w-4" />
          </Button>
          <Link to="/editor" className="hidden md:flex gap-2 link text-xl">
            <i className="fi fi-rr-file-edit"></i>
            <p>Write</p>
          </Link>

          {access_token ? (
            <>
              <Link to="/dashboard/notifications">
                <Button variant="light" size="icon" className="relative">
                  <i className="fi fi-rr-bell text-xl"></i>
                  {
                    new_notification_available ? <span className="bg-red w-3 h-3 rounded-full absolute z-10 top-1.5 right-1.5 ring-2 ring-white"></span> : ""
                  }
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <Avatar>
                      <AvatarImage src={profile_img} />
                      <AvatarFallback>{userAuth?.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <UserNavigationPanel />
              </DropdownMenu>

            </>

          ) : (

            <>
              <Button asChild variant="dark" size="sm" className="text-base">
                <Link to="signin">Sign In</Link>
              </Button>
              <Button asChild variant="light" size="sm" className="text-base hidden md:inline-flex">
                <Link to="signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default NavBar;
