import { useEffect, useState, ComponentType } from "react";
import SlideSelect from "./SlideSelect";
import options from "../data/SigninOpts";
import Input from "./Input";
import { Tagline } from "./Tagline";

// Types
type Option = {
  logo: ComponentType;
  text: string;
};

type AuthOptionsProps = {
  option: Option[];
  selected: "Login" | "Signup";
};

type HeaderProps = {
  selected: "Login" | "Signup";
  setSelected: (value: "Login" | "Signup") => void;
};

// Components
const AuthOptions: React.FC<AuthOptionsProps> = ({ option, selected }) => {
  return (
    <div className="flex flex-col items-center py-6 px-14 gap-4">

      {selected === "Login" ? (
        <>
          <Input label="Username" />
          <Input label="Password" type="password" />
        </>
      ) : (
        <>
          <div className="flex justify-between w-full">
            <Input label="First name" />
            <Input label="Last name" />
          </div>
          <Input label="Email" width="full" />
        </>
      )}
      
      <button className="mt-4 px-6 py-2 bg-blue-600 font-semibold text-white rounded-lg cursor-pointer">
        {selected === "Login" ? "Login" : "Sign Up"}
      </button>

      <div className="mt-4 w-full flex justify-center">
        {option.map((opt, index) => {
          const Icon = opt.logo;
          return (
            <div
              key={index}
              className="flex gap-4 justify-center items-center w-1/2 h-6 border border-gray-400 rounded-lg text-lg font-semibold py-4 active:bg-[#121212] cursor-pointer"
            >
              <Icon />
              <div>{opt.text}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AuthHeader: React.FC<HeaderProps> = ({ selected, setSelected }) => {
  return (
    <div className="flex flex-col justify-center items-center gap-5 border-b border-gray-300 p-9">
      <div className="flex flex-col gap-9">
        <div className="flex gap-2 h-10 items-center justify-center text-4xl tracking-wider font-transcity">
          <img src="/logo-blue.svg" alt="Logo" className="w-12" />
          Taskpilot
        </div>
        <Tagline />
      </div>
      <SlideSelect selected={selected} setSelected={setSelected} />
    </div>
  );
};

const LoginRight: React.FC = () => {
  const [selected, setSelected] = useState<"Login" | "Signup">("Login");
  const [option, setOption] = useState<Option[]>(options.Login);

  useEffect(() => {
    setOption(options[selected]);
  }, [selected]);

  return (
    <div className="flex flex-col items-center justify-center gap-8 h-screen px-6 w-full md:w-1/2 text-white bg-transparent">
      <div className="bg-[#1E1E1E] rounded-xl w-4/5">
        <AuthHeader selected={selected} setSelected={setSelected} />
        <AuthOptions option={option} selected={selected}/>
      </div>
      <p>
        By signing up you agree to the <a href="#" className="font-bold text-white underline">Privacy Policy</a>
      </p>
    </div>
  );
};

export default LoginRight;
