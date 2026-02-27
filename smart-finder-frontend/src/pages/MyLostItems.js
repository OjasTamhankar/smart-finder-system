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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import api from "../services/api";
import ImageLightbox from "../components/ImageLightbox";
import EmptyState from "../components/EmptyState";
import { getImageUrl } from "../utils/imageUrl";

/* ================= MY LOST ITEMS ================= */

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

  const total = items.length;
  const found = items.filter(i => i.status === "Found").length;
  const active = total - found;

  return (
    <Box>
      {/* ================= HEADER ================= */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700}>
          My Lost Reports
        </Typography>
        <Typography color="text.secondary">
          Manage your submitted lost item reports
        </Typography>
      </Box>

      {/* ================= SUMMARY ================= */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <StatCard title="Total Reports" value={total} />
        <StatCard title="Active Reports" value={active} />
        <StatCard title="Items Found" value={found} color="success.main" />
      </Grid>

      {/* ================= EMPTY STATE ================= */}
      {items.length === 0 && (
        <EmptyState
          title="No reports submitted"
          subtitle="You haven't posted any lost items yet"
        />
      )}

      {/* ================= GRID ================= */}
      <Grid container spacing={3}>
        {items.map(item => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-6px)"
                }
              }}
            >
              {item.imageUrl && (
                <Box
                  sx={{
                    height: 200,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f9fafb",
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

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" fontWeight={600}>
                  {item.itemName}
                </Typography>

                <Chip
                  label={item.status}
                  size="small"
                  sx={{
                    mt: 1,
                    mb: 2,
                    backgroundColor:
                      item.status === "Found"
                        ? "#dcfce7"
                        : "#e0e7ff",
                    color:
                      item.status === "Found"
                        ? "#166534"
                        : "#3730a3"
                  }}
                />

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {item.description}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  📍 {item.location}
                </Typography>
              </CardContent>

              <Box sx={{ p: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => openResponses(item)}
                >
                  View Details & Responses
                </Button>
              </Box>
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
      >
        <DialogContent>
          {selectedItem && (
            <>
              <Typography variant="h6" fontWeight={700}>
                {selectedItem.itemName}
              </Typography>

              <Typography color="text.secondary" sx={{ mb: 2 }}>
                {selectedItem.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" fontWeight={600}>
                Responses ({responses.length})
              </Typography>

              {responses.length === 0 && (
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  No responses yet.
                </Typography>
              )}

              {responses.map((r, i) => (
                <Card
                  key={i}
                  sx={{ mt: 2, backgroundColor: "#f9fafb" }}
                >
                  <CardContent>
                    <Typography fontWeight={600}>
                      {r.name}
                    </Typography>
                    <Typography variant="body2">
                      Contact: {r.contact}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {r.message || "No message provided"}
                    </Typography>
                  </CardContent>
                </Card>
              ))}

              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                {selectedItem.status !== "Found" && (
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    onClick={() =>
                      markAsFound(selectedItem._id)
                    }
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

/* ================= STAT CARD ================= */

function StatCard({ title, value, color }) {
  return (
    <Grid item xs={12} sm={6} md={3}>
      <Card>
        <CardContent>
          <Typography
            variant="body2"
            color="text.secondary"
            mb={1}
          >
            {title}
          </Typography>

          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ color: color || "text.primary" }}
          >
            {value}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}