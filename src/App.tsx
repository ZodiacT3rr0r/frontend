import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "@pages/Login";
import Home from "@pages/Home";
import Background from "@components/Background";

const App = () => {
  return (
    <Router>
      <Background />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
