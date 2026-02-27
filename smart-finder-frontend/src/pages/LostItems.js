import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  TextField,
  Stack,
  CardMedia
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ClearIcon from "@mui/icons-material/Clear";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import ImageLightbox from "../components/ImageLightbox";
import EmptyState from "../components/EmptyState";
import { getImageUrl } from "../utils/imageUrl";

/* ================= LOST ITEMS ================= */

export default function LostItems() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [lightboxImage, setLightboxImage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    api.get("/lost").then(res => setItems(res.data));
  }, []);

  const filteredItems = items.filter(item => {
    const matchesName = item.itemName
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesLocation = item.location
      .toLowerCase()
      .includes(location.toLowerCase());

    return matchesName && matchesLocation;
  });

  const clearFilters = () => {
    setSearch("");
    setLocation("");
  };

  return (
    <Box>
      {/* ================= HEADER ================= */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700}>
          Browse Lost Items
        </Typography>
        <Typography color="text.secondary">
          Search and explore approved lost item reports
        </Typography>
      </Box>

      {/* ================= FILTER PANEL ================= */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Search & Filters
          </Typography>

          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems="center"
          >
            <TextField
              fullWidth
              label="Search by item name"
              value={search}
              onChange={e => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1 }} />
              }}
            />

            <TextField
              fullWidth
              label="Filter by location"
              value={location}
              onChange={e => setLocation(e.target.value)}
              InputProps={{
                startAdornment: <LocationOnIcon sx={{ mr: 1 }} />
              }}
            />

            <Button
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={clearFilters}
            >
              Clear
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* ================= RESULT COUNT ================= */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredItems.length} of {items.length} items
        </Typography>
      </Box>

      {/* ================= EMPTY STATES ================= */}
      {items.length === 0 && (
        <EmptyState
          title="No lost items available"
          subtitle="Check back later or post a new report"
        />
      )}

      {items.length > 0 && filteredItems.length === 0 && (
        <EmptyState
          title="No matching results"
          subtitle="Try adjusting your search criteria"
        />
      )}

      {/* ================= GRID ================= */}
      <Grid container spacing={3}>
        {filteredItems.map(item => (
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
                <CardMedia
                  component="img"
                  height="200"
                  image={getImageUrl(item.imageUrl)}
                  alt={item.itemName}
                  sx={{
                    objectFit: "contain",
                    backgroundColor: "#f9fafb",
                    cursor: "pointer"
                  }}
                  onClick={() =>
                    setLightboxImage(getImageUrl(item.imageUrl))
                  }
                />
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

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  📍 {item.location}
                </Typography>
              </CardContent>

              <Box sx={{ p: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() =>
                    navigate(`/report-found/${item._id}`)
                  }
                >
                  I Found This Item
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ================= LIGHTBOX ================= */}
      <ImageLightbox
        src={lightboxImage}
        onClose={() => setLightboxImage(null)}
      />
    </Box>
  );
}