import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Stack,
  Divider
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

/* ================= LOGIN ================= */

export default function Login() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const submit = async () => {
  try {
    const res = await api.post("/auth/login", form);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", "user");

    navigate("/dashboard");

  } catch (error) {
    console.error("Login error:", error);

    if (error.response) {
      // Backend responded with 4xx or 5xx
      alert(error.response.data.message || "Invalid email or password");
    } else if (error.request) {
      // No response from server
      alert("Server not responding. Please try again later.");
    } else {
      // Other unexpected error
      alert("Something went wrong. Please try again.");
    }
  }
};

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 420
      }}
    >
      <Card>
        <CardContent sx={{ p: 4 }}>
          {/* HEADER */}
          <Typography variant="h5" fontWeight={700} mb={1}>
            Welcome Back
          </Typography>

          <Typography color="text.secondary" mb={3}>
            Sign in to manage your lost items
          </Typography>

          {/* FORM */}
          <Stack spacing={3}>
            <TextField
              label="Email"
              fullWidth
              value={form.email || ""}
              onChange={e =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              value={form.password || ""}
              onChange={e =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <Button
              variant="contained"
              startIcon={<LoginIcon />}
              onClick={submit}
              size="large"
            >
              Login
            </Button>
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* REGISTER LINK */}
          <Typography variant="body2" align="center">
            Don’t have an account?{" "}
            <Link
              to="/register"
              style={{
                textDecoration: "none",
                fontWeight: 600
              }}
            >
              Create one
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}