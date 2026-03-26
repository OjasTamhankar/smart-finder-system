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
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function AdminLogin() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const submit = async () => {
    try {
      const res = await api.post("/auth/login", form);

      if (res.data.role !== "admin") {
        alert("Unauthorized access");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "admin");
      localStorage.setItem("name", res.data.name || "");
      localStorage.setItem("email", res.data.email || "");
      window.dispatchEvent(new Event("auth:changed"));

      navigate("/admin-dashboard");
    } catch (error) {
      console.error("Admin login error:", error);
      alert(
        error.response?.data?.message ||
          "Unable to sign in as admin right now."
      );
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 420
      }}
    >
      <Card
        sx={{
          borderTop: "4px solid #7c3aed"
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight={700} mb={1}>
            Admin Access
          </Typography>

          <Typography color="text.secondary" mb={3}>
            Sign in to manage and verify lost item reports
          </Typography>

          <Stack spacing={3}>
            <TextField
              label="Admin Email"
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
              color="secondary"
              startIcon={<AdminPanelSettingsIcon />}
              size="large"
              onClick={submit}
            >
              Login as Admin
            </Button>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Typography variant="body2" align="center">
            Go back to{" "}
            <Link
              to="/"
              style={{
                textDecoration: "none",
                fontWeight: 600
              }}
            >
              Home
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
