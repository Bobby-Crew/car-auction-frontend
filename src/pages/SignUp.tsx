import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../components/AuthContext";

const SignUp = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const requestBody = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword,
      };

      console.log("Sending signup data:", requestBody);
      const response = await fetch(
        "https://car-auction-backend.onrender.com/api/auth/signup/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();
      console.log("Signup response:", data);

      if (response.ok) {
        const loginResponse = await fetch(
          "https://car-auction-backend.onrender.com/api/auth/login/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: formData.username,
              password: formData.password,
            }),
          }
        );

        if (loginResponse.ok) {
          const data = await loginResponse.json();
          login(data.is_admin, data.tokens, {
            username: formData.username,
            email: formData.email,
          });
          navigate("/");
        }
      } else {
        setError(
          typeof data === "object"
            ? Object.values(data).flat().join(", ")
            : data.error || "Signup failed"
        );
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Network error");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Container component="main" maxWidth="xs" sx={{ my: 8 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#ffffff",
          }}
        >
          <Typography component="h1" variant="h5" color="#1a1a1a" gutterBottom>
            Create Account
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={formData.username}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mb: 2,
                backgroundColor: "#ff0000",
                "&:hover": {
                  backgroundColor: "#cc0000",
                },
              }}
            >
              Sign Up
            </Button>
            <Typography
              variant="body2"
              align="center"
              sx={{ mt: 2, color: "grey.600" }}
            >
              Already have an account?{" "}
              <RouterLink
                to="/login"
                style={{ color: "#ff0000", textDecoration: "none" }}
              >
                Sign In
              </RouterLink>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignUp;
