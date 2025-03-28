import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "@pages/Login";
import Home from "@pages/Home";
import Background from "@components/Background";
import { Navbar } from "@components/Navbar";
import { Add } from "./pages/Add";

const App = () => {
  return (
    <>
      <Router>
        <Background />
        <Navbar />
        <div className="pl-[56px]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/add-new" element={<Add />} />
          </Routes>
        </div>
      </Router>
    </>
  );
};

export default App;
