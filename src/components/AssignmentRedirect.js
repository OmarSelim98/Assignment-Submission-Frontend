import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "./AuthConetxt";
import DoctorAssignments from "./DoctorAssignments";
import StudentAssignments from "./StudentAssignments";
export default function AssignmentRedirect() {
  let { user } = useAuth();
  useEffect(() => {});
  if (user.role == "doctor") {
    return <DoctorAssignments />;
  } else {
    return <StudentAssignments />;
  }
}
