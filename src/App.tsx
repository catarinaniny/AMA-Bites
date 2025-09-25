import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PublicView } from './components/PublicView';
import { AdminView } from './components/AdminView';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicView />} />
        <Route path="/admin" element={<AdminView />} />
      </Routes>
    </Router>
  );
}

export default App;