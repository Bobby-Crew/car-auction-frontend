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

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("🚀 Attempting login with:", formData);
      const response = await fetch("http://localhost:8000/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log("📡 Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("🎉 Login successful! Tokens received:", {
          access: data.tokens.access.substring(0, 10) + "...",
          refresh: data.tokens.refresh.substring(0, 10) + "...",
        });
        login(data.is_admin, data.tokens, {
          username: data.username,
          email: data.email,
        });
        navigate("/");
      } else {
        const data = await response.json();
        console.log("❌ Login failed:", data);
        setError(data.error || "Login failed");
      }
    } catch (err) {
      console.error("🔥 Network error:", err);
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
        backgroundColor: "#f5f5f5",
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
            Welcome Back
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
              autoComplete="username"
              autoFocus
              name="username"
              value={formData.username}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              autoComplete="current-password"
              name="password"
              value={formData.password}
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
              Sign In
            </Button>
            <Typography
              variant="body2"
              align="center"
              sx={{ mt: 2, color: "grey.600" }}
            >
              Don't have an account?{" "}
              <RouterLink
                to="/signup"
                style={{ color: "#ff0000", textDecoration: "none" }}
              >
                Sign Up
              </RouterLink>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
