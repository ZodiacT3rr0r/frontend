import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "@pages/Login";
import Home from "@pages/Home";
import Background from "@components/Background";
import { Navbar } from "@components/Navbar";
import { Add } from "./pages/Add";
import { Tasks } from "./pages/Tasks";
import DashboardOA from "@pages/Dashboard-OA";
import { SystemAdminDashboard, OrgAdminDashboard } from "@pages/Dashboard-SA";
import Employees from "@pages/EmployeeManage";
import {Sprints} from "@pages/Sprints";
import { CustomKanban as Kanban } from "./pages/Kanban";

const App = () => {
  return (
    <>
      <Router>
        <Background />
        <Navbar />
        <div className="pl-[56px]">
          <Routes>
            <Route path="/superadmin-dashboard" element={<SystemAdminDashboard />} />
            <Route path="/org-dashboard" element={<OrgAdminDashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/sprints" element={<Sprints />} />
            <Route path="/login" element={<Login />} />
            <Route path="/add-new" element={<Add />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/kanban" element={<Kanban />} />
          </Routes>
        </div>
      </Router>
    </>
  );
};

export default App;
