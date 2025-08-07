import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LandingPage from './pages/LandingPage';
import TeamsPage from './pages/TeamsPage';
import VipPage from './pages/VipPage';
import ContactPage from './pages/ContactPage';

function App() {
  return (
    <Router>
      <ToastContainer position="top-left" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/vip" element={<VipPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<div className="text-center p-10">404</div>} />
      </Routes>
    </Router>
  );
}

export default App
