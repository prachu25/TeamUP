import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Hackathons from './pages/Hackathons.jsx';
import Teams from './pages/Teams.jsx';


import LeaderDashboard from './pages/LeaderDashboard.jsx';


export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="hackathons" replace />} />
        <Route path="hackathons" element={<Hackathons />} />
        <Route path="teams" element={<Teams />} />
        <Route
          path="leader-dashboard"
          element={<LeaderDashboard />}
        />
      </Route>
      <Route path="*" element={<Navigate to="/app" replace />} />
    </Routes>
  );
}
