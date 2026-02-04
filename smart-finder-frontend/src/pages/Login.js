import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

import loginImg from "../assets/login.svg";

export default function Login() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const submit = async () => {
    const res = await api.post("/auth/login", form);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", "user");

    navigate("/dashboard");
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
          maxWidth: 820,        // 👈 KEY FIX
          flexDirection: { xs: "column", md: "row" }
        }}
      >
        {/* IMAGE */}
        <Box
          component="img"
          src={loginImg}
          alt="User login illustration"
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
            User Login
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Login to access your dashboard and manage lost items
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
            startIcon={<LoginIcon />}
            sx={{ mt: 3 }}
            onClick={submit}
          >
            Login
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
