import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import AxelorLogo from "../assets/images/axelor.svg";
import { login } from "app/services/rest";

import {
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  Container,
} from "@mui/material";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event, reqBody) => {
    setError(false);
    event.preventDefault();
    try {
      await login({ username, password });
      navigate("/homepage");
    } catch (error) {
      setError(true);
    }
    setUsername("");
    setPassword("");
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: 6,
            padding: 2,
            borderRadius: 2,
          }}
        >
          <img
            className="axelor_logo"
            src={AxelorLogo}
            alt="Axelor Open Suite"
          />

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <Typography color="text.secondary">Username</Typography>
            <TextField
              required
              fullWidth
              id="name"
              name="name"
              autoComplete="name"
              autoFocus
              variant="standard"
              sx={{ mb: 1 }}
              className="form_input"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
            <Typography color="text.secondary">Password</Typography>
            <TextField
              required
              fullWidth
              name="password"
              type="password"
              id="password"
              autoComplete="current-password"
              variant="standard"
              sx={{ mb: 1 }}
              className="form_input"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <FormControlLabel
              control={<Checkbox value="remember" />}
              label="Remember me"
              sx={{ color: "#57534e" }}
            />
            {error ? (
              <p className="error_message">Invalid Username or Password</p>
            ) : (
              ""
            )}
            <Button
              className="login_btn"
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mb: 1, backgroundColor: "#6366f1" }}
            >
              Log in
            </Button>
          </Box>
        </Box>
        <Typography
          sx={{ mt: 2, mb: 4, textAlign: "center", fontSize: "15px" }}
          color="text.secondary"
        >
          Copyright &copy; {new Date().getFullYear()}, Axelor. All Rights
          Reserved.
        </Typography>
      </Container>
    </>
  );
};

export default Login;
