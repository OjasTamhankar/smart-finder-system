import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

import registerImg from "../assets/registration.svg";

export default function Register() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const submit = async () => {
    await api.post("/auth/register", form);
    navigate("/login");
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
          maxWidth: 820,              // same as Login
          flexDirection: { xs: "column", md: "row" }
        }}
      >
        {/* IMAGE */}
        <Box
          component="img"
          src={registerImg}
          alt="User registration illustration"
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
            Create Account
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Register to report lost items and track recovery status
          </Typography>

          <TextField
            fullWidth
            label="Name"
            margin="normal"
            onChange={e =>
              setForm({ ...form, name: e.target.value })
            }
          />

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
            startIcon={<PersonAddIcon />}
            sx={{ mt: 3 }}
            onClick={submit}
          >
            Register
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
