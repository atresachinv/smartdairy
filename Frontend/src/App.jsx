import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Components/Home/Home";
import Mainapp from "./Components/Mainapp/Mainapp";
import "./App.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<Home />} />
          <Route index path="/mainapp/home" element={<Mainapp />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
