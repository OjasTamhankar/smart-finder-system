import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ClearIcon from "@mui/icons-material/Clear";
import api from "../services/api";
import { useLocation, useNavigate } from "react-router-dom";
import ImageLightbox from "../components/ImageLightbox";
import EmptyState from "../components/EmptyState";
import { getImageUrl } from "../utils/imageUrl";
import { LOST_ITEM_CATEGORIES } from "../constants/lostItemCategories";

const initialFilters = {
  search: "",
  category: "",
  startDate: "",
  endDate: "",
  minReward: "",
  maxReward: "",
  location: ""
};

/* ================= LOST ITEMS ================= */

export default function LostItems() {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [focusFeedback, setFocusFeedback] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [highlightedItemId, setHighlightedItemId] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const itemRefs = useRef({});

  const requestedItemId =
    location.state?.itemId ||
    new URLSearchParams(location.search).get("itemId") ||
    "";

  useEffect(() => {
    if (!requestedItemId) {
      return;
    }

    setFilters({ ...initialFilters });
    setHighlightedItemId(requestedItemId);
    setFocusFeedback(null);
  }, [requestedItemId, location.state?.notificationClickId]);

  useEffect(() => {
    let isActive = true;

    const timer = setTimeout(async () => {
      try {
        if (isActive) {
          setLoading(true);
        }

        const params = Object.entries(filters).reduce(
          (accumulator, [key, value]) => {
            if (value !== "") {
              accumulator[key] = value;
            }

            return accumulator;
          },
          {}
        );

        const response = await api.get("/lost", { params });

        if (!isActive) {
          return;
        }

        setItems(response.data);
        setError("");
      } catch (requestError) {
        if (!isActive) {
          return;
        }

        setItems([]);
        setError(
          requestError.response?.data?.message ||
            "Failed to load lost items"
        );
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      isActive = false;
      clearTimeout(timer);
    };
  }, [filters]);

  useEffect(() => {
    if (loading || !highlightedItemId) {
      return undefined;
    }

    const matchedItem = items.find(
      item => item._id === highlightedItemId
    );

    if (!matchedItem) {
      if (!error) {
        setFocusFeedback({
          severity: "warning",
          message:
            "That item is not available in the browse list anymore."
        });
      }

      setHighlightedItemId("");
      return undefined;
    }

    setFocusFeedback({
      severity: "info",
      message: `Opened ${matchedItem.itemName} from your notification.`
    });

    const scrollTimer = window.setTimeout(() => {
      itemRefs.current[highlightedItemId]?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }, 150);

    const highlightTimer = window.setTimeout(() => {
      setHighlightedItemId(currentId =>
        currentId === matchedItem._id ? "" : currentId
      );
    }, 4000);

    return () => {
      window.clearTimeout(scrollTimer);
      window.clearTimeout(highlightTimer);
    };
  }, [error, highlightedItemId, items, loading]);

  const updateFilter = (field, value) => {
    setFilters(currentFilters => ({
      ...currentFilters,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700}>
          Browse Lost Items
        </Typography>
        <Typography color="text.secondary">
          Search and explore approved lost item reports
        </Typography>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Search & Filters
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search item details"
                value={filters.search}
                onChange={event =>
                  updateFilter("search", event.target.value)
                }
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1 }} />
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth
                label="Category"
                value={filters.category}
                onChange={event =>
                  updateFilter("category", event.target.value)
                }
                SelectProps={{ native: true }}
              >
                <option value="" aria-label="All categories" />
                {LOST_ITEM_CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Location"
                value={filters.location}
                onChange={event =>
                  updateFilter("location", event.target.value)
                }
                InputProps={{
                  startAdornment: <LocationOnIcon sx={{ mr: 1 }} />
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={filters.startDate}
                onChange={event =>
                  updateFilter("startDate", event.target.value)
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={filters.endDate}
                onChange={event =>
                  updateFilter("endDate", event.target.value)
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label="Min Reward"
                type="number"
                value={filters.minReward}
                onChange={event =>
                  updateFilter("minReward", event.target.value)
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {"\u20B9"}
                    </InputAdornment>
                  )
                }}
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label="Max Reward"
                type="number"
                value={filters.maxReward}
                onChange={event =>
                  updateFilter("maxReward", event.target.value)
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {"\u20B9"}
                    </InputAdornment>
                  )
                }}
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                sx={{ height: "100%" }}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {items.length} matching item
          {items.length === 1 ? "" : "s"}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {focusFeedback && !error && (
        <Alert severity={focusFeedback.severity} sx={{ mb: 3 }}>
          {focusFeedback.message}
        </Alert>
      )}

      {loading && (
        <Box
          sx={{
            py: 6,
            display: "flex",
            justifyContent: "center"
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {!loading && items.length === 0 && !hasActiveFilters && !error && (
        <EmptyState
          title="No lost items available"
          subtitle="Check back later or post a new report"
        />
      )}

      {!loading && items.length === 0 && hasActiveFilters && !error && (
        <EmptyState
          title="No matching results"
          subtitle="Try adjusting your search criteria"
        />
      )}

      {!loading && items.length > 0 && (
        <Grid container spacing={3}>
          {items.map(item => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <Card
                ref={node => {
                  if (node) {
                    itemRefs.current[item._id] = node;
                  } else {
                    delete itemRefs.current[item._id];
                  }
                }}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "0.3s",
                  border:
                    item._id === highlightedItemId
                      ? "2px solid #2563eb"
                      : "1px solid transparent",
                  boxShadow:
                    item._id === highlightedItemId
                      ? "0 0 0 4px rgba(37, 99, 235, 0.16)"
                      : undefined,
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
                  <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    sx={{ mb: 1 }}
                  >
                    <Chip
                      label={item.status}
                      size="small"
                      sx={{
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

                    {item.category && (
                      <Chip
                        label={item.category}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Stack>

                  <Typography variant="h6" fontWeight={600}>
                    {item.itemName}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1, mb: 2 }}
                  >
                    {item.description}
                  </Typography>

                  {item.reward > 0 && (
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{ mb: 1, color: "success.main" }}
                    >
                      Reward offered: {"\u20B9"}
                      {item.reward}
                    </Typography>
                  )}

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    sx={{ mb: 0.5 }}
                  >
                    Location: {item.location || "Not provided"}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    Posted on{" "}
                    {new Date(item.createdAt).toLocaleDateString()}
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
      )}

      <ImageLightbox
        src={lightboxImage}
        onClose={() => setLightboxImage(null)}
      />
    </Box>
  );
}
