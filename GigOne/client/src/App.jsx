import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignIn from "@/pages/auth/SignIn";
import SignUp from "@/pages/auth/SignUp";
import UserDashBoard from "@/pages/user/DashBoard";
import AdminDashBoard from "@/pages/admin/DashBoard";
import Earnings from "@/pages/user/Earnings";
import Platforms from "@/pages/user/Platforms";
import Settings from "@/pages/user/Settings";
import ShiftPlanner from "@/pages/user/ShiftPlanner";
import Suggestions from "@/pages/user/Suggestions";
import WeeklyReport from "@/pages/user/WeeklyReport";
import WorkLogs from "@/pages/user/WorkLogs";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/user/dashboard" element={<UserDashBoard />} />
        <Route path="/admin/dashboard" element={<AdminDashBoard />} />
        <Route path="/user/earnings" element={<Earnings />} />
        <Route path="/user/platforms" element={<Platforms />} />
        <Route path="/user/settings" element={<Settings />} />
        <Route path="/user/shift-planner" element={<ShiftPlanner />} />
        <Route path="/user/suggestions" element={<Suggestions />} />
        <Route path="/user/weekly-report" element={<WeeklyReport />} />
        <Route path="/user/work-logs" element={<WorkLogs />} />
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
