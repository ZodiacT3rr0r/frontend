import { Dispatch, SetStateAction, useState, useEffect, ComponentType } from "react";
import {
  FiChevronDown,
  FiChevronsRight,
  FiHome
} from "react-icons/fi";
import { FaTasks } from "react-icons/fa";
import { GoProjectRoadmap } from "react-icons/go";
import { IoAnalyticsSharp, IoAddOutline } from "react-icons/io5";
import { motion } from "framer-motion";

export const Navbar = () => {
  return (
    <div className="flex fixed left-0 z-40">
      <Sidebar />
    </div>
  );
};

const Sidebar = () => {
  const [open, setOpen] = useState<boolean>(() => {
    const storedOpen = sessionStorage.getItem("sidebarOpen");
    return storedOpen ? JSON.parse(storedOpen) : false;
  });
  
  const [selected, setSelected] = useState<string>(sessionStorage.getItem("selectedMenu") || "Dashboard");
  
  // Update sessionStorage when state changes
  useEffect(() => {
    sessionStorage.setItem("sidebarOpen", JSON.stringify(open));
  }, [open]);
  
  useEffect(() => {
    sessionStorage.setItem("selectedMenu", selected);
  }, [selected]);

  return (
    <motion.nav
      layout
      className="sticky top-0 h-screen shrink-0 bg-blue-950 p-2"
      style={{
        width: open ? "225px" : "fit-content",
      }}
    >
      <TitleSection open={open} />

      <div className="space-y-1">
      <Option
          Icon={FiHome}
          title="Dashboard"
          selected={selected}
          setSelected={setSelected}
          open={open}
          href="/"
        />
        <Option
          Icon={GoProjectRoadmap}
          title="Projects"
          selected={selected}
          setSelected={setSelected}
          open={open}
          href="/projects"
        />
        <Option
          Icon={FaTasks}
          title="Tasks"
          selected={selected}
          setSelected={setSelected}
          open={open}
          href="/tasks"
        />
        <Option
          Icon={IoAnalyticsSharp}
          title="Analytics"
          selected={selected}
          setSelected={setSelected}
          open={open}
          href="/analytics"
        />
        <Option
          Icon={IoAddOutline}
          title="Add Task"
          selected={selected}
          setSelected={setSelected}
          open={open}
          href="/add-new"
        />
      </div>
      
      <ToggleClose open={open} setOpen={setOpen} />
    </motion.nav>
  );
};

const Option = ({
  Icon,
  title,
  selected,
  setSelected,
  open,
  href,
  notifs,
}: {
  Icon: ComponentType;
  title: string;
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
  open: boolean;
  href: string;
  notifs?: number;
}) => {
  return (
    <motion.a
      href={href}
      layout
      onClick={() => setSelected(title)}
      className={`relative flex h-10 w-full items-center rounded-md transition-colors ${selected === title ? "bg-indigo-100 text-indigo-800" : "text-white hover:bg-slate-100 hover:text-indigo-800"}`}
    >
      <motion.div
        layout
        className="grid h-full w-10 place-content-center text-lg"
      >
        <Icon />
      </motion.div>
      {open && (
        <motion.span
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.125 }}
          className="text-xs font-medium"
        >
          {title}
        </motion.span>
      )}

      {notifs && open && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          style={{ y: "-50%" }}
          transition={{ delay: 0.5 }}
          className="absolute right-2 top-1/2 size-4 rounded bg-indigo-500 text-xs text-white"
        >
          {notifs}
        </motion.span>
      )}
    </motion.a>
  );
};

const TitleSection = ({ open }: { open: boolean }) => {
  return (
    <div className="mb-3 border-b border-slate-300 pb-3">
      <div className="flex cursor-pointer items-center justify-between rounded-md transition-colors hover:bg-slate-100">
        <div className="flex items-center gap-2">
          <Logo />
          {open && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.125 }}
            >
              <span className="block text-xs font-semibold">TomIsLoading</span>
              <span className="block text-xs text-slate-500">Pro Plan</span>
            </motion.div>
          )}
        </div>
        {open && <FiChevronDown className="mr-2" />}
      </div>
    </div>
  );
};

const Logo = () => {
  // Temp logo from https://logoipsum.com/
  return (
    <motion.div
      layout
      className="grid size-10 shrink-0 place-content-center rounded-md"
    >
      <img src="/logo-white.svg" alt="" />
    </motion.div>
  );
};

const ToggleClose = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <motion.button
      layout
      onClick={() => setOpen((pv) => !pv)}
      className="absolute bottom-0 left-0 right-0 border-t border-slate-300 transition-colors hover:bg-slate-100"
    >
      <div className="flex items-center p-2 text-white hover:text-blue-950">
        <motion.div
          layout
          className="grid size-10 place-content-center text-lg"
        >
          <FiChevronsRight
            className={`transition-transform ${open && "rotate-180"}`}
          />
        </motion.div>
        {open && (
          <motion.span
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.125 }}
            className="text-xs font-medium"
          >
            Hide
          </motion.span>
        )}
      </div>
    </motion.button>
  );
};