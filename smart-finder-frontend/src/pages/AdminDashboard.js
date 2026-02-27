import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  Stack
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import api from "../services/api";
import { getImageUrl } from "../utils/imageUrl";

/* ================= ADMIN DASHBOARD ================= */

export default function AdminDashboard() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  const loadItems = async () => {
    const res = await api.get("/admin/pending");
    setItems(res.data);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const approve = async (id) => {
    await api.put(`/admin/approve/${id}`);
    setItems(items.filter(item => item._id !== id));
  };

  const reject = async (id) => {
    await api.delete(`/admin/reject/${id}`);
    setItems(items.filter(item => item._id !== id));
  };

  const filteredItems = items.filter(item => {
    const matchesName = item.itemName
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesLocation = item.location
      .toLowerCase()
      .includes(location.toLowerCase());

    return matchesName && matchesLocation;
  });

  return (
    <Box>
      {/* ================= PAGE HEADER ================= */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700}>
          Admin Moderation Panel
        </Typography>
        <Typography color="text.secondary">
          Review and verify submitted lost item reports
        </Typography>
      </Box>

      {/* ================= STATS ================= */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <StatCard title="Pending Reviews" value={items.length} />
        <StatCard title="Currently Displayed" value={filteredItems.length} />
      </Grid>

      {/* ================= FILTER BAR ================= */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Filter Reports
          </Typography>

          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
          >
            <TextField
              fullWidth
              label="Search by item name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <TextField
              fullWidth
              label="Filter by location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* ================= EMPTY STATE ================= */}
      {items.length === 0 && (
        <Card>
          <CardContent>
            <Typography color="text.secondary">
              No pending items for review.
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* ================= ITEMS GRID ================= */}
      <Grid container spacing={3}>
        {filteredItems.map(item => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Card
              sx={{
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-4px)"
                }
              }}
            >
              {item.imageUrl && (
                <CardMedia
                  component="img"
                  height="180"
                  image={getImageUrl(item.imageUrl)}
                  alt={item.itemName}
                  sx={{
                    objectFit: "contain",
                    backgroundColor: "#f9fafb"
                  }}
                />
              )}

              <CardContent>
                <Typography variant="h6" fontWeight={600}>
                  {item.itemName}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {item.description}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  📍 {item.location}
                </Typography>

                {/* ACTION BUTTONS */}
                <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => approve(item._id)}
                  >
                    Approve
                  </Button>

                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={() => reject(item._id)}
                  >
                    Reject
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

/* ================= STAT CARD ================= */

function StatCard({ title, value }) {
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

          <Typography variant="h4" fontWeight={700}>
            {value}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}