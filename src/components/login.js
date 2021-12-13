import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { Container, Button, Row, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "./AuthConetxt";

export default function Login() {
  const location = useLocation();
  let auth = useAuth();
  let navigate = useNavigate();
  let from = location.state?.from?.pathname || "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (auth.user) {
      navigate("/assignments");
    }
  }, []);
  const onLogin = async (e) => {
    e.preventDefault();
    console.log(username);
    if (username.trim().length > 0 && password.trim().length > 0) {
      auth.signin({ username: username, password: password }, () => {
        navigate(from, { replace: true });
      });
    }
  };

  return (
    <Container
      style={{
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        height: "100vh",
        width: "75%",
      }}
    >
      <h1 style={{ textAlign: "left" }}>
        Assignment
        <br />
        Submission System
      </h1>
      <Form style={{ marginLeft: "25px" }}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={onLogin}>
          Submit
        </Button>
      </Form>
    </Container>
  );
}
