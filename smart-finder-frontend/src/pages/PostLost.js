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
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SendIcon from "@mui/icons-material/Send";
import api from "../services/api";
import SuccessMessage from "../ui/SuccessMessage";

/* ================= POST LOST ================= */

export default function PostLost() {
  const [form, setForm] = useState({});
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState(false);

  const submit = async () => {
    const fd = new FormData();
    Object.keys(form).forEach(key => fd.append(key, form[key]));

    await api.post("/lost", fd);

    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);

    setForm({});
    setPreview(null);
  };

  return (
    <Box>
      {/* ================= HEADER ================= */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700}>
          Report a Lost Item
        </Typography>
        <Typography color="text.secondary">
          Provide accurate details to help others identify your item
        </Typography>
      </Box>

      {/* ================= FORM CARD ================= */}
      <Card>
        <CardContent>
          {/* SECTION 1 — BASIC DETAILS */}
          <Typography variant="h6" fontWeight={600} mb={2}>
            Item Information
          </Typography>

          <Stack spacing={3}>
            <TextField
              label="Item Name"
              fullWidth
              value={form.itemName || ""}
              onChange={e =>
                setForm({ ...form, itemName: e.target.value })
              }
            />

            <TextField
              label="Location Where Lost"
              fullWidth
              value={form.location || ""}
              onChange={e =>
                setForm({ ...form, location: e.target.value })
              }
            />

            <TextField
              label="Contact Email"
              fullWidth
              value={form.contactEmail || ""}
              onChange={e =>
                setForm({ ...form, contactEmail: e.target.value })
              }
            />

            <TextField
              label="Detailed Description"
              fullWidth
              multiline
              rows={4}
              value={form.description || ""}
              onChange={e =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </Stack>

          <Divider sx={{ my: 4 }} />

          {/* SECTION 2 — IMAGE UPLOAD */}
          <Typography variant="h6" fontWeight={600} mb={2}>
            Upload Image (Optional)
          </Typography>

          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadFileIcon />}
          >
            Select Image
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={e => {
                const file = e.target.files[0];
                if (!file) return;

                setForm({ ...form, image: file });
                setPreview(URL.createObjectURL(file));
              }}
            />
          </Button>

          {preview && (
            <Box
              sx={{
                mt: 3,
                p: 2,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                backgroundColor: "#f9fafb",
                display: "flex",
                justifyContent: "center"
              }}
            >
              <img
                src={preview}
                alt="Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: 250,
                  objectFit: "contain"
                }}
              />
            </Box>
          )}

          <Divider sx={{ my: 4 }} />

          {/* SECTION 3 — SUBMIT */}
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              startIcon={<SendIcon />}
              onClick={submit}
            >
              Submit Report
            </Button>
          </Box>
        </CardContent>
      </Card>

      <SuccessMessage
        show={success}
        message="Lost item posted successfully"
      />
    </Box>
  );
}