import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import UserAuthForm from "./pages/UserAuthForm";
import { createContext, useEffect, useState } from "react";
import { lookInSession } from "./common/session";
import EditorPage from "./pages/EditorPage";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import PageNotFound from "./pages/PageNotFound";
import ProfilePage from "./pages/ProfilePage";
import BlogPage from "./pages/BlogPage";
import SideNav from "./components/SideNav";
import ChangePassword from "./pages/ChangePassword";
import EditProfilePage from "./pages/EditProfilePage";
import NotificationsPage from "./pages/NotificationsPage";
import ManageBlogs from "./components/ManageBlogs";

export const UserContext = createContext({});

const App = () => {

  const [person, setPerson] = useState();

  const [userAuth, setUserAuth] = useState({});

  useEffect(() => {
    
    let userSession = lookInSession("user");

    userSession ? setUserAuth(JSON.parse(userSession)) : setUserAuth({ access_token: null });

  }, []);

  return (

    <UserContext.Provider value={{ userAuth, setUserAuth }}>
      <Routes>
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/editor/:blog_id" element={<EditorPage />} />
        <Route path="/" element={<NavBar />}>
          <Route index element={<HomePage />} />
          <Route path="dashboard" element={<SideNav />}>
            <Route path="blogs" element={<ManageBlogs />} />
            <Route path="notifications" element={<NotificationsPage />} />1{" "}
          </Route>
          <Route path="/settings" element={<SideNav />}>
            <Route path="edit-profile" element={<EditProfilePage />} />
            <Route path="change-password" element={<ChangePassword />} />1{" "}
          </Route>
          <Route path="signin" element={<UserAuthForm type="sign-in" />} />
          <Route path="signup" element={<UserAuthForm type="sign-up" />} />
          <Route path="search/:query" element={<SearchPage />} />
          <Route path="user/:id" element={<ProfilePage />} />
          <Route path="blog/:blog_id" element={<BlogPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </UserContext.Provider>

  );
};

export default App;
