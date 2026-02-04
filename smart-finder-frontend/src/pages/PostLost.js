import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import api from "../services/api";
import SuccessMessage from "../ui/SuccessMessage";

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
          Post Lost Item
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          Provide details of the lost item to help others identify it
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Item Name"
            fullWidth
            value={form.itemName || ""}
            onChange={e =>
              setForm({ ...form, itemName: e.target.value })
            }
          />

          <TextField
            label="Location"
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
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={form.description || ""}
            onChange={e =>
              setForm({ ...form, description: e.target.value })
            }
          />

          {/* Upload Button */}
          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadFileIcon />}
          >
            Upload Image
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

          {/* Image Preview */}
          {preview && (
            <Box
              sx={{
                mt: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                p: 2,
                display: "flex",
                justifyContent: "center",
                backgroundColor: "#fff"
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

          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={submit}
          >
            Submit Lost Item
          </Button>
        </Stack>
      </Box>

      <SuccessMessage
        show={success}
        message="Lost item posted successfully"
      />
    </Box>
  );
}
