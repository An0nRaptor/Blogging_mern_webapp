import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "./ui/input";

const InputBoxComponent = ({ name, id, type, placeholder, value, icon, disable = false }) => {

  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="relative w-[100%] mb-4">
      <Input
        type={type == "password" ? (passwordVisible ? "text" : "password") : type}
        name={name}
        placeholder={placeholder}
        defaultValue={value}
        id={id}
        disabled={disable}
        className="pl-12 pr-12 disabled:opacity-50"
      />
      <i className={"fi " + icon + " absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"}></i>
      {type == "password" ? (
        <button
          type="button"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          onClick={() => setPasswordVisible((currVal) => !currVal)}
        >
          {passwordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      ) : ""}
    </div>
  )
}


export default InputBoxComponent;
