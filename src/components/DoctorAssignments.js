import {
  Container,
  Row,
  Col,
  Stack,
  Button,
  ListGroup,
  Form,
} from "react-bootstrap";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthConetxt";

export default function DoctorAssignments() {
  const [loading, setLoading] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const { user } = useAuth();
  const [selectedAssignment, setSelectedAssignment] = useState(undefined);
  const [submissions, setSubmissions] = useState([]);
  const [isAddEnabled, setAddEnabled] = useState(false);

  const [assignmentName, setAssignmentName] = useState("");
  const [assignmentDetails, setAssignmentDetails] = useState("");
  const [assignmentDeadline, setAssignmentDeadline] = useState("");
  const [assignmentfile, setAssignmentFile] = useState(null);

  const getAssignments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8080/assignments/byDoctor/${user.id}`,
        { withCredentials: true }
      );
      setAssignments(res.data.assignments);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };
  function onSwitchAdd(value) {
    setAddEnabled(value);
    setSelectedAssignment(false);
  }
  function onSelectAssignment(assignment) {
    setAddEnabled(false);
    setSelectedAssignment(assignment);
  }
  async function onAddAssignment(e) {
    setLoading(true);

    e.preventDefault();
    let valuesArr = [
      assignmentName.trim(),
      assignmentDetails.trim(),
      assignmentDeadline.trim(),
    ];
    if (!valuesArr.includes("")) {
      let form = new FormData();
      form.append("name", assignmentName);
      form.append("details", assignmentDetails);
      form.append("deadline", assignmentDeadline);
      form.append("doctor_id", user.id);
      if (assignmentfile != null) {
        form.append("file", assignmentfile);
      }
      try {
        const res = await axios.post(
          "http://localhost:8080/assignments",
          form,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        setLoading(false);

        console.log(res);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }
  }

  async function getAssignmentSubmissions() {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8080/assignments/${selectedAssignment.id}/submissions`
      );
      setSubmissions(res.data.submissions);
      console.log(res.data.submissions);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }
  useEffect(() => {
    getAssignments();
  }, []);
  useEffect(() => {
    getAssignmentSubmissions();
  }, [selectedAssignment]);
  return (
    <Container style={{ margin: "20px" }} gap={4}>
      <Row>
        <Col>
          <h1>Assignments</h1>
        </Col>
        <Col>
          <Button
            onClick={() => {
              onSwitchAdd(true);
            }}
          >
            Add Assignment
          </Button>
        </Col>
      </Row>
      {loading ? (
        <h1>
          <i>Loading...</i>
        </h1>
      ) : (
        <Row>
          <div
            style={{
              display: "flex",
              marginTop: "50px",
            }}
          >
            {assignments.length > 0 ? (
              <ListGroup style={{ width: "50%" }}>
                {assignments.map((assignment, idx) => (
                  <ListGroup.Item
                    key={idx}
                    onClick={() => {
                      onSelectAssignment(assignment);
                    }}
                    active={assignment == selectedAssignment}
                  >
                    {assignment.name}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <i> No Assignments are added yet.</i>
            )}

            {selectedAssignment ? (
              <div style={{ marginLeft: "20px", textAlign: "left" }}>
                <p>
                  <span style={{ fontSize: "24px", fontWeight: "bold" }}>
                    Asignment name:{" "}
                  </span>
                  <span style={{ fontSize: "20px", color: "#787878" }}>
                    {selectedAssignment.name}
                  </span>
                </p>
                <p>
                  <span style={{ fontSize: "24px", fontWeight: "bold" }}>
                    Asignment details:{" "}
                  </span>
                  <span style={{ fontSize: "20px", color: "#787878" }}>
                    {selectedAssignment.details}
                  </span>
                </p>
                <p>
                  <span style={{ fontSize: "24px", fontWeight: "bold" }}>
                    Asignment deadline:{" "}
                  </span>
                  <span style={{ fontSize: "20px", color: "#787878" }}>
                    {new Date(selectedAssignment.deadline).toLocaleString()}
                  </span>
                </p>
                {selectedAssignment.file && (
                  <p>
                    <span style={{ fontSize: "24px", fontWeight: "bold" }}>
                      Asignment file:{" "}
                    </span>
                    <span style={{ fontSize: "20px", color: "#787878" }}>
                      {
                        <a
                          href={selectedAssignment.file}
                          className="link-primary"
                          target="_blank"
                        >
                          Click to download
                        </a>
                      }
                    </span>
                  </p>
                )}
                {submissions.length > 0 && (
                  <Submissions submissions={submissions} />
                )}
              </div>
            ) : isAddEnabled ? (
              <Form style={{ marginLeft: "50px" }}>
                <Form.Group className="mb-3" >
                  <Form.Label>Assignment Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Assignment Name"
                    onChange={(e) => {
                      setAssignmentName(e.target.value);
                    }}
                  />
                </Form.Group>
                <Form.Group className="mb-3" >
                  <Form.Label>Assignment Details</Form.Label>
                  <Form.Control
                    type="textarea"
                    placeholder="Enter Assignment Details"
                    onChange={(e) => {
                      setAssignmentDetails(e.target.value);
                    }}
                  />
                </Form.Group>
                <Form.Group className="mb-3" >
                  <Form.Label>Assignment Deadline</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    onChange={(e) => {
                      setAssignmentDeadline(e.target.value);
                    }}
                  />
                </Form.Group>
                <Form.Group className="mb-3" >
                  <Form.Label>
                    Assignment File <i>(optional)</i>
                  </Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e) => {
                      console.log(e.target.files[0]);
                      setAssignmentFile(e.target.files[0]);
                    }}
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  onClick={onAddAssignment}
                >
                  Submit new Assignment
                </Button>
              </Form>
            ) : (
              <i>Please select an assignment</i>
            )}
          </div>
        </Row>
      )}
    </Container>
  );
}

function Submissions({ submissions }) {
  return (
    <div>
      <span style={{ fontSize: "24px", fontWeight: "bold" }}>Submissions</span>
      <ul>
        {submissions.map((submission) => (
          <li>
            By {submission.student_username}, at{" "}
            {new Date(submission.submission_submitted_at).toLocaleString()}
            <a
              style={{ marginLeft: "5px" }}
              href={submission.submission_submission_file}
              className="link-primary"
              target="_blank"
            >
              Link
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
