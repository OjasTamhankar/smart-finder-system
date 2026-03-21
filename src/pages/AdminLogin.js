import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button
} from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

import adminImg from "../assets/adminlogin.svg";

export default function AdminLogin() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const submit = async () => {
    const res = await api.post("/auth/login", form);

    if (res.data.role !== "admin") {
      alert("Unauthorized access");
      return;
    }

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", "admin");

    navigate("/admin-dashboard");
  };

  return (
    <Box
      sx={{
        minHeight: "75vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2
      }}
    >
      {/* CENTERED CONTENT CONTAINER */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          width: "100%",
          maxWidth: 820,          // same as Login/Register
          flexDirection: { xs: "column", md: "row" }
        }}
      >
        {/* IMAGE */}
        <Box
          component="img"
          src={adminImg}
          alt="Admin login illustration"
          sx={{
            width: 280,
            height: 280,
            objectFit: "contain"
          }}
        />

        {/* FORM */}
        <Box
          sx={{
            width: 400,
            display: "flex",
            flexDirection: "column"
          }}
        >
          <Typography variant="h5" gutterBottom>
            Admin Login
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Administrative access to verify and manage lost item reports
          </Typography>

          <TextField
            fullWidth
            label="Email"
            margin="normal"
            onChange={e =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <TextField
            fullWidth
            type="password"
            label="Password"
            margin="normal"
            onChange={e =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <Button
            fullWidth
            variant="contained"
            startIcon={<AdminPanelSettingsIcon />}
            sx={{ mt: 3 }}
            onClick={submit}
          >
            Login as Admin
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
