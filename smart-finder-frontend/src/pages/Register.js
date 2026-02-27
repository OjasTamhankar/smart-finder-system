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
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

/* ================= REGISTER ================= */

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
        width: "100%",
        maxWidth: 450
      }}
    >
      <Card>
        <CardContent sx={{ p: 4 }}>
          {/* HEADER */}
          <Typography variant="h5" fontWeight={700} mb={1}>
            Create Account
          </Typography>

          <Typography color="text.secondary" mb={3}>
            Register to report and track lost items
          </Typography>

          {/* FORM */}
          <Stack spacing={3}>
            <TextField
              label="Full Name"
              fullWidth
              value={form.name || ""}
              onChange={e =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <TextField
              label="Email Address"
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
              startIcon={<PersonAddIcon />}
              size="large"
              onClick={submit}
            >
              Register
            </Button>
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* LOGIN LINK */}
          <Typography variant="body2" align="center">
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                textDecoration: "none",
                fontWeight: 600
              }}
            >
              Login here
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}