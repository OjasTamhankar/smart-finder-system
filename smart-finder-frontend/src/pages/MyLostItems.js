import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogContent,
  Divider,
  Stack
} from "@mui/material";
import api from "../services/api";
import ImageLightbox from "../components/ImageLightbox";
import EmptyState from "../components/EmptyState";
import { getImageUrl } from "../utils/imageUrl";

export default function MyLostItems() {
  const [items, setItems] = useState([]);
  const [responses, setResponses] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  const loadItems = () => {
    api.get("/lost/mine").then(res => setItems(res.data));
  };

  useEffect(() => {
    loadItems();
  }, []);

  const openResponses = async (item) => {
    const res = await api.get(`/found/item/${item._id}`);
    setResponses(res.data);
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const markAsFound = async (id) => {
    await api.put(`/lost/found/${id}`);
    setOpenDialog(false);
    loadItems();
  };

  return (
    <Box sx={{ px: 4, py: 3 }}>
      <Typography variant="h5" gutterBottom>
        My Lost Items
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Manage your reported lost items
      </Typography>

      {items.length === 0 && (
        <EmptyState
          title="No items reported"
          subtitle="You haven't posted any lost items yet"
        />
      )}

      <Grid container spacing={3}>
        {items.map(item => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Card>
              {item.imageUrl && (
                <Box
                  sx={{
                    height: 200,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderBottom: "1px solid #eee",
                    cursor: "pointer"
                  }}
                  onClick={() =>
                    setLightboxImage(getImageUrl(item.imageUrl))
                  }
                >
                  <img
                    src={getImageUrl(item.imageUrl)}
                    alt={item.itemName}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain"
                    }}
                  />
                </Box>
              )}

              <CardContent>
                <Typography variant="h6">
                  {item.itemName}
                </Typography>

                <Chip
                  label={item.status}
                  color={item.status === "Found" ? "success" : "default"}
                  size="small"
                  sx={{ my: 1 }}
                />

                <Typography color="text.secondary">
                  {item.description}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  Location: {item.location}
                </Typography>

                <Button
                  fullWidth
                  size="small"
                  sx={{ mt: 2 }}
                  onClick={() => openResponses(item)}
                >
                  View Details & Responses
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ================= MODAL ================= */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        BackdropProps={{
          sx: { backgroundColor: "rgba(0,0,0,0.6)" }
        }}
      >
        <DialogContent>
          {selectedItem && (
            <>
              <Typography variant="h6" gutterBottom>
                {selectedItem.itemName}
              </Typography>

              <Typography color="text.secondary">
                {selectedItem.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1">
                Responses
              </Typography>

              {responses.length === 0 && (
                <Typography color="text.secondary">
                  No responses yet
                </Typography>
              )}

              {responses.map((r, i) => (
                <Box key={i} sx={{ mt: 1 }}>
                  <Typography><b>{r.name}</b></Typography>
                  <Typography>Contact: {r.contact}</Typography>
                  <Typography color="text.secondary">
                    {r.message || "No message"}
                  </Typography>
                </Box>
              ))}

              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                {selectedItem.status !== "Found" && (
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    onClick={() => markAsFound(selectedItem._id)}
                  >
                    Mark as Found
                  </Button>
                )}

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setOpenDialog(false)}
                >
                  Close
                </Button>
              </Stack>
            </>
          )}
        </DialogContent>
      </Dialog>

      <ImageLightbox
        src={lightboxImage}
        onClose={() => setLightboxImage(null)}
      />
    </Box>
  );
}
