import logo from "./logo.svg";
import "./App.css";
import Login from "./components/login";
import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { AuthProvider, RequireAuth } from "./components/AuthConetxt";
import DoctorAssignments from "./components/DoctorAssignments";
import AssignmentRedirect from "./components/AssignmentRedirect";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/assignments"
            element={
              <RequireAuth>
                <AssignmentRedirect />
              </RequireAuth>
            }
          />
          <Route
            path="/doctor/assignments"
            element={
              <RequireAuth>
                <DoctorAssignments />
              </RequireAuth>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
