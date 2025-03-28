import { motion } from "framer-motion";

const Radar: React.FC = () => {
  return (
    <div className="relative w-36 h-36 rounded-full shadow-[25px_25px_75px_rgba(0,0,0,0.55)] border border-gray-800 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-5 bg-transparent rounded-full border border-dashed border-gray-700 shadow-[inset_-5px_-5px_25px_rgba(0,0,0,0.25),inset_5px_5px_35px_rgba(0,0,0,0.25)]"></div>
      <div className="absolute w-12 h-12 rounded-full border border-dashed border-gray-700 shadow-[inset_-5px_-5px_25px_rgba(0,0,0,0.25),inset_5px_5px_35px_rgba(0,0,0,0.25)]"></div>
      <motion.span
        className="absolute top-1/2 left-1/2 w-1/2 h-full bg-transparent origin-top-left border-t border-dashed border-white"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
      >
        <span className="absolute top-0 left-0 w-full h-full bg-green-600 origin-top-left rotate-[-55deg] blur-[30px] drop-shadow-[20px_20px_20px_seagreen]"></span>
      </motion.span>
    </div>
  );
};

export default Radar;
