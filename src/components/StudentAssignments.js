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

export default function StudentAssignments() {
  const [loading, setLoading] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const { user } = useAuth();
  const [selectedAssignment, setSelectedAssignment] = useState(undefined);
  const [isAddEnabled, setAddEnabled] = useState(false);

  const [submissionFile, setSubmissionFile] = useState(null);

  const getAssignments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/assignments/all`, {
        withCredentials: true,
      });
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
  async function onAddSubmission(e) {
    setLoading(true);

    e.preventDefault();

    if (
      submissionFile != null &&
      new Date(selectedAssignment.assignment_deadline) > new Date()
    ) {
      let form = new FormData();
      form.append("file", submissionFile);
      form.append("student_id", user.id);

      try {
        const res = await axios.post(
          `http://localhost:8080/assignments/${selectedAssignment.assignment_id}/submit`,
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
    } else {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAssignments();
  }, []);
  return (
    <Container style={{ margin: "20px" }} gap={4}>
      <Row>
        <Col>
          <h1>Assignments</h1>
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
                    {assignment.assignment_name}
                    {assignment.doctor_username}
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
                    {selectedAssignment.assignment_name}
                  </span>
                </p>
                <p>
                  <span style={{ fontSize: "24px", fontWeight: "bold" }}>
                    Asignment details:{" "}
                  </span>
                  <span style={{ fontSize: "20px", color: "#787878" }}>
                    {selectedAssignment.assignment_details}
                  </span>
                </p>
                <p>
                  <span style={{ fontSize: "24px", fontWeight: "bold" }}>
                    Asignment deadline:{" "}
                  </span>
                  {new Date(selectedAssignment.assignment_deadline) >
                  new Date() ? (
                    <span style={{ fontSize: "20px", color: "#787878" }}>
                      {new Date(
                        selectedAssignment.assignment_deadline
                      ).toLocaleString()}
                    </span>
                  ) : (
                    <span style={{ fontSize: "20px", color: "#d10000" }}>
                      {new Date(
                        selectedAssignment.assignment_deadline
                      ).toLocaleString()}{" "}
                      <p>
                        <b>You have passed the deadline</b>
                      </p>
                    </span>
                  )}
                </p>
                {selectedAssignment.assignment_file && (
                  <p>
                    <span style={{ fontSize: "24px", fontWeight: "bold" }}>
                      Asignment file:{" "}
                    </span>
                    <span style={{ fontSize: "20px", color: "#787878" }}>
                      {
                        <a
                          href={selectedAssignment.assignment_file}
                          className="link-primary"
                          target="_blank"
                        >
                          Click to download
                        </a>
                      }
                    </span>
                  </p>
                )}
                {new Date(selectedAssignment.assignment_deadline) >
                  new Date() && (
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <span style={{ fontSize: "24px", fontWeight: "bold" }}>
                        Submission file upload:{" "}
                      </span>
                    </Form.Label>
                    <Form.Control
                      type="file"
                      onChange={(e) => {
                        console.log(e.target.files[0]);
                        setSubmissionFile(e.target.files[0]);
                      }}
                    />
                  </Form.Group>
                )}
                <Button
                  variant="primary"
                  type="submit"
                  onClick={onAddSubmission}
                  disabled={
                    new Date(selectedAssignment.assignment_deadline) <
                    new Date()
                  }
                >
                  Submit new Assignment
                </Button>
              </div>
            ) : (
              <i>Please select an assignment</i>
            )}
          </div>
        </Row>
      )}
    </Container>
  );
}
