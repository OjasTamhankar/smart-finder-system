import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Card,
  CardContent,
  Divider
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import SuccessMessage from "../ui/SuccessMessage";

export default function ReportFound() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    try {
      setIsSubmitting(true);
      await api.post(`/found/${id}`, form);

      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        navigate("/lost-items");
      }, 2000);
    } catch (error) {
      console.error("Found report submission failed:", error);
      alert(
        error.response?.data?.message ||
          "Unable to submit the found report right now."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700}>
          Report a Found Item
        </Typography>
        <Typography color="text.secondary">
          Provide your details so the owner can contact you
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Your Contact Details
          </Typography>

          <Stack spacing={3}>
            <TextField
              label="Your Name"
              fullWidth
              value={form.name || ""}
              onChange={e =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <TextField
              label="Contact Information"
              fullWidth
              value={form.contact || ""}
              onChange={e =>
                setForm({ ...form, contact: e.target.value })
              }
            />

            <TextField
              label="Message (Optional)"
              fullWidth
              multiline
              rows={4}
              value={form.message || ""}
              onChange={e =>
                setForm({ ...form, message: e.target.value })
              }
            />
          </Stack>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              startIcon={<SendIcon />}
              onClick={submit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Found Report"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <SuccessMessage
        show={success}
        message="Found report submitted successfully"
      />
    </Box>
  );
}
