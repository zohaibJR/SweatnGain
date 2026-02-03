import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Login from './Pages/Login.jsx';
import Signup from './Pages/Signup.jsx';
import DashBoard from './Pages/DashBoard.jsx';
import NavBar from './Components/NavBar.jsx';
import Attendence from './Pages/Attendence.jsx';
import Aboutus from './Pages/Aboutus.jsx';

// Protected Route
function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  return isLoggedIn ? children : <Navigate to="/" replace />;
}

function AppContent() {
  const location = useLocation();

  const hiddenPaths = ["/", "/signup"];
  const shouldShowNavbar = !hiddenPaths.includes(location.pathname.toLowerCase());

  return (
    <>
      {shouldShowNavbar && <NavBar />}

      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected */}
        <Route path="/dashboard" element={<ProtectedRoute><DashBoard /></ProtectedRoute>} />
        <Route path="/attendence" element={<ProtectedRoute><Attendence /></ProtectedRoute>} />
        <Route path="/aboutus" element={<ProtectedRoute><Aboutus /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
