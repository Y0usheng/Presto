import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Dashboard from './components/Dashboard';
import TokenCheckRouter from './components/CheckToken';
import PresentationPage from './components/PresentationPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<TokenCheckRouter><Dashboard /></TokenCheckRouter>} />
        <Route path="/presentation/:id" element={<TokenCheckRouter><PresentationPage /></TokenCheckRouter>} />
      </Routes>
    </Router>
  )
}

export default App
