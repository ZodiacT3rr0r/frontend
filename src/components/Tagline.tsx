import { motion } from "motion/react";

export const Tagline = () => {
  return (
    <h1 className="max-w-2xl text-center text-white text-3xl leading-snug">
      Get more done with{" "}
      <span className="relative">
        TaskPilot
        <svg
          viewBox="0 0 286 120"
          fill="none"
          className="absolute -left-2 -right-2 -top-4 bottom-0 translate-y-1"
        >
          <motion.path
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{
              duration: 1.25,
              ease: "easeInOut",
            }}
            d="M142.293 2C110 30 6.08202 12 1.23654 72C-2.10604 114 29.5633 120 122.688 118C215.814 116 316.298 116 275.761 62C230.14 2 97.0503 42 52.9384 2"
            stroke="#FACC15"
            strokeWidth="3"
          />
        </svg>
      </span>{" "}
      today
    </h1>
  );
};
