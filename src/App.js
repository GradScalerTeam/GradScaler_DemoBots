import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/LoginPage";
import './index.css'
import ChatHome from './Pages/homepage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductLawAI from './Pages/ProductLawAI';
import GradScaler from './Pages/GradScaler';
import MedicalAI from './Pages/MedicalLLM';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/home" element={<ChatHome />} />
        <Route exact path='ProductLawAI' element={<ProductLawAI />} />
        <Route exact path='/gradScaler' element={<GradScaler />} />
        <Route exact path='/MedicalAI' element={<MedicalAI />} />
        {/* <Route path="/register" element={<Register />} /> */}
      </Routes>
      <ToastContainer
                position="top-right"
                autoClose={10000}
                hideProgressBar={true}
                closeOnClick
                pauseOnHover
                draggable
                pauseOnFocusLoss
                toastClassName="custom-toast"
      />
    </Router>
  );
};

export default App
