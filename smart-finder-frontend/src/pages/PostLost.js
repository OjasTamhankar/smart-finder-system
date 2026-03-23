import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
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
import { LOST_ITEM_CATEGORIES } from "../constants/lostItemCategories";

/* ================= POST LOST ================= */

export default function PostLost() {
  const [form, setForm] = useState({});
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState(false);

  const submit = async () => {
    try {
      const fd = new FormData();
      Object.keys(form).forEach(key => fd.append(key, form[key]));

      await api.post("/lost", fd);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);

      setForm({});
      setPreview(null);
      window.dispatchEvent(new Event("notifications:refresh"));
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to post lost item"
      );
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700}>
          Report a Lost Item
        </Typography>
        <Typography color="text.secondary">
          Provide accurate details to help others identify your item
        </Typography>
      </Box>

      <Card>
        <CardContent>
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
              select
              label="Category"
              fullWidth
              value={form.category || ""}
              onChange={e =>
                setForm({ ...form, category: e.target.value })
              }
              SelectProps={{ native: true }}
            >
              <option value="" aria-label="Select category" />
              {LOST_ITEM_CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </TextField>

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
              label="Reward Amount (Optional)"
              type="number"
              fullWidth
              value={form.reward || ""}
              onChange={e =>
                setForm({ ...form, reward: e.target.value })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {"\u20B9"}
                  </InputAdornment>
                )
              }}
              inputProps={{ min: 0 }}
              helperText="Leave empty if no reward is offered"
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

                if (!file) {
                  return;
                }

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
