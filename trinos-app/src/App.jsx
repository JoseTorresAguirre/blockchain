import React from "react";
import Home from "./Home";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Producto from "./Producto";
import Login from "./Login";
import Login2 from "./Login2";
import Registrate from "./Registrate";
import DashUser from "./DashUser";
import Pasarella from "./Pasarella";
import Compraexitosa from "./Compraexitosa";

const App = () => {
  return (
    <div>
      <NavBar></NavBar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/producto/:id" element={<Producto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login2" element={<Login2 />} />
        <Route path="/registrate" element={<Registrate />} />
        <Route path="/dashuser" element={<DashUser />} />
        <Route path="/pasarella" element={<Pasarella />} />
        <Route path="/compraexitosa" element={<Compraexitosa />} />
      </Routes>
    </div>
  );
};

export default App;
