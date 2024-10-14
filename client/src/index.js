import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Login from './components/Login';
import { ChakraProvider } from "@chakra-ui/react";
import Dashboard from './components/Dashboard';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ChakraProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path='/dashboard' element={<Dashboard/>}/>
      </Routes>
    </Router>
    </ChakraProvider>
);