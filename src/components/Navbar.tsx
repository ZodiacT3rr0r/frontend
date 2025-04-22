import {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  ComponentType,
} from "react";
import {
  FiChevronsRight,
  FiHome,
} from "react-icons/fi";
import { FaTasks } from "react-icons/fa";
import { GoProjectRoadmap } from "react-icons/go";
import { IoAnalyticsSharp, IoAddOutline } from "react-icons/io5";
import { FcTodoList } from "react-icons/fc";
import { LuKanban } from "react-icons/lu";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";

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

  const [selected, setSelected] = useState<string>(
    sessionStorage.getItem("selectedMenu") || "Dashboard"
  );

  const [selectedProject, setSelectedProject] = useState<{ id: string; name: string } | null>(() => {
    const stored = sessionStorage.getItem("selectedProject");
    return stored ? JSON.parse(stored) : null;
  });

  const userRole = localStorage.getItem("role") || "DEV";

  useEffect(() => {
    sessionStorage.setItem("sidebarOpen", JSON.stringify(open));
  }, [open]);

  useEffect(() => {
    sessionStorage.setItem("selectedMenu", selected);
  }, [selected]);

  const menuItems = [
    {
      roles: ["SuperAdmin"],
      icon: FiHome,
      title: "Dashboard",
      href: "/superadmin-dashboard",
    },
    {
      roles: ["OrgAdmin"],
      icon: FiHome,
      title: "Dashboard",
      href: "/org-dashboard",
    },
    {
      roles: ["OrgAdmin"],
      icon: GoProjectRoadmap,
      title: "Employee Management",
      href: "/employees",
    },
    {
      roles: ["OrgAdmin"],
      icon: FaTasks,
      title: "Projects",
      href: "/projects",
    },
    {
      roles: ["PM", "DEV", "VIEWER"],
      icon: LuKanban,
      title: "Kanban Board",
      href: "/kanban",
    },
    {
      roles: ["PM", "DEV", "VIEWER"],
      icon: IoAnalyticsSharp,
      title: "Sprints",
      href: "/sprints",
    },
    {
      roles: ["PM", "DEV", "VIEWER"],
      icon: FcTodoList,
      title: "Task View",
      href: "/tasks",
    },
    {
      roles: ["PM", "DEV"],
      icon: IoAddOutline,
      title: "Add Task",
      href: "/add-new",
    },
  ];

  return (
    <motion.nav
      layout
      className="sticky top-0 h-screen shrink-0 bg-blue-950 p-2"
      style={{ width: open ? "225px" : "fit-content" }}
    >
      <ProjectDropdown
        open={open}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
      />

      <div className="space-y-1">
        {menuItems
          .filter((item) => item.roles.includes(userRole || ""))
          .map((item) => (
            <Option
              key={item.title}
              Icon={item.icon}
              title={item.title}
              selected={selected}
              setSelected={setSelected}
              open={open}
              href={item.href}
            />
          ))}
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
      className={`relative flex h-10 w-full items-center rounded-md transition-colors ${
        selected === title
          ? "bg-indigo-100 text-indigo-800"
          : "text-white hover:bg-slate-100 hover:text-indigo-800"
      }`}
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
          animate={{ opacity: 1, scale: 1 }}
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

const ProjectDropdown = ({
  open,
  selectedProject,
  setSelectedProject,
}: {
  open: boolean;
  selectedProject: { id: string; name: string } | null;
  setSelectedProject: Dispatch<SetStateAction<{ id: string; name: string } | null>>;
}) => {
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    fetch("")
      .then((res) => res.json())
      .then((data) => {
        const dummyProjects = data.products.map((prod: any) => ({
          id: prod.id.toString(),
          name: prod.title,
        }));
        setProjects(dummyProjects);
      });
  }, []);

  return (
    <div className="mb-3 border-b border-slate-300 pb-3">
      <div className="flex items-center gap-2 rounded-md">
        <Logo />
        {open && (
          <div className="flex-grow">
            <Select
              value={selectedProject?.id || ""}
              onValueChange={(value) => {
                const project = projects.find((p) => p.id === value);
                setSelectedProject(project || null);
                sessionStorage.setItem("selectedProject", JSON.stringify(project));
              }}
            >
              <SelectTrigger className="w-full bg-blue-950 text-white border border-white hover:bg-blue-900">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black">
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
};

const Logo = () => {
  return (
    <motion.div
      layout
      className="grid size-10 shrink-0 place-content-center rounded-md"
    >
      <img src="/logo-white.svg" alt="logo" />
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
