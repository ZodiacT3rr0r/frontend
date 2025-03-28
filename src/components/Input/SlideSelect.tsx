type SlideSelectProps = {
  selected: "Login" | "Signup";
  setSelected: (value: "Login" | "Signup") => void;
};

const SlideSelect: React.FC<SlideSelectProps> = ({ selected, setSelected }) => {
  return (
    <div className="relative flex w-full h-14 rounded-lg bg-[#1E1E1E] font-medium shadow-[3px_3px_10px_rgba(0,0,0,1),-1px_-1px_6px_rgba(255,255,255,0.4)]">
      <button
        className={`flex-1 relative z-10 p-4 text-lg font-semibold transition-colors text-white`}
        onClick={() => setSelected("Login")}
      >
        Login
      </button>

      <button
        className={`flex-1 relative z-10 p-4 text-lg font-semibold transition-colors text-white`}
        onClick={() => setSelected("Signup")}
      >
        Signup
      </button>

      <div
        className="absolute top-0 left-0 w-1/2 h-full bg-blue-600 rounded-lg transition-transform"
        style={{ transform: selected === "Login" ? "translateX(0)" : "translateX(100%)" }}
      />
    </div>
  );
};

export default SlideSelect;
