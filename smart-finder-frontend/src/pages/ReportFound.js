import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack
} from "@mui/material";
import HandshakeIcon from "@mui/icons-material/Handshake";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import SuccessMessage from "../ui/SuccessMessage";

export default function ReportFound() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [success, setSuccess] = useState(false);

  const submit = async () => {
    await api.post(`/found/${id}`, form);

    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      navigate("/lost-items");
    }, 2000);
  };

  return (
    <Box
      sx={{
        minHeight: "75vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Box sx={{ width: 500 }}>
        <Typography variant="h5" gutterBottom>
          Report Found Item
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          Provide your details so the owner can contact you
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Your Name"
            fullWidth
            onChange={e =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <TextField
            label="Contact Details"
            fullWidth
            onChange={e =>
              setForm({ ...form, contact: e.target.value })
            }
          />

          <TextField
            label="Message (optional)"
            fullWidth
            multiline
            rows={4}
            onChange={e =>
              setForm({ ...form, message: e.target.value })
            }
          />

          <Button
            variant="contained"
            startIcon={<HandshakeIcon />}
            sx={{ mt: 2 }}
            onClick={submit}
          >
            Submit Found Report
          </Button>
        </Stack>
      </Box>

      <SuccessMessage
        show={success}
        message="Found report submitted successfully"
      />
    </Box>
  );
}
