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
  Stack
} from "@mui/material";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import ImageLightbox from "../components/ImageLightbox";
import EmptyState from "../components/EmptyState";
import { getImageUrl } from "../utils/imageUrl"; // ✅ ADDED

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

  return (
    <Box sx={{ px: 4, py: 3 }}>
      <Typography variant="h5" gutterBottom>
        Lost Items
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Search and browse approved lost items
      </Typography>

      {/* Search & Filter */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 4 }}>
        <TextField
          label="Search by item name"
          fullWidth
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <TextField
          label="Filter by location"
          fullWidth
          value={location}
          onChange={e => setLocation(e.target.value)}
        />
      </Stack>

      {/* EMPTY STATES */}
      {items.length === 0 && (
        <EmptyState
          title="No lost items available"
          subtitle="Check back later or post a new lost item"
        />
      )}

      {items.length > 0 && filteredItems.length === 0 && (
        <EmptyState
          title="No matching results"
          subtitle="Try adjusting your search or filter"
        />
      )}

      <Grid container spacing={3}>
        {filteredItems.map(item => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Card>
              {item.imageUrl && (
                <Box
                  sx={{
                    height: 220,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderBottom: "1px solid #eee",
                    cursor: "pointer"
                  }}
                  onClick={() =>
                    setLightboxImage(getImageUrl(item.imageUrl)) // ✅ FIX
                  }
                >
                  <img
                    src={getImageUrl(item.imageUrl)}   // ✅ FIX
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
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={() =>
                    navigate(`/report-found/${item._id}`)
                  }
                >
                  Found this item
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Lightbox */}
      <ImageLightbox
        src={lightboxImage}
        onClose={() => setLightboxImage(null)}
      />
    </Box>
  );
}
