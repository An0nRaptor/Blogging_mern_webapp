import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../App";
import { removeFromSession } from "../common/session";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";

const UserNavigationPanel = () => {
  const { userAuth: { username }, setUserAuth } = useContext(UserContext);

  let navigate = useNavigate();

  const signOutUser = () => {
    removeFromSession("user");
    setUserAuth({ access_token: null });
    navigate("/signin");
  };

  return (
    <DropdownMenuContent>
      <DropdownMenuItem asChild className="md:hidden">
        <Link to="/editor">
          <i className="fi fi-rr-file-edit"></i>
          Write
        </Link>
      </DropdownMenuItem>

      <DropdownMenuItem asChild>
        <Link to={`/user/${username}`}>
          <i className="fi fi-rr-user"></i>
          Profile
        </Link>
      </DropdownMenuItem>

      <DropdownMenuItem asChild>
        <Link to="/dashboard/blogs">
          <i className="fi fi-rr-dashboard"></i>
          Dashboard
        </Link>
      </DropdownMenuItem>

      <DropdownMenuItem asChild>
        <Link to="/settings/edit-profile">
          <i className="fi fi-rr-settings"></i>
          Settings
        </Link>
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      <DropdownMenuItem onClick={signOutUser} className="flex-col items-start gap-0">
        <h1 className="font-semibold text-black">Sign Out</h1>
        <p className="text-muted-foreground text-sm">@{username}</p>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
};

export default UserNavigationPanel;
