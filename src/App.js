import { BrowserRouter, Routes, Route } from "react-router-dom";
import  Login  from "./components/Login";
import Cadastro from "./components/Cadastro";
import { Postos } from "./components/Postos";

import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
    <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro/>}/>
        <Route path="/postos" element={<Postos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;