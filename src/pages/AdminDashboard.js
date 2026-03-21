import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia
} from "@mui/material";
import api from "../services/api";
import { getImageUrl } from "../utils/imageUrl";

export default function AdminDashboard() {
  const [items, setItems] = useState([]);

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

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", px: 2 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Admin Dashboard
      </Typography>

      {items.length === 0 && (
        <Typography color="text.secondary">
          No pending items.
        </Typography>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 3
        }}
      >
        {items.map(item => (
          <Card key={item._id}>
            {item.imageUrl && (
              <CardMedia
                component="img"
                height="180"
                image={getImageUrl(item.imageUrl)}
                alt={item.itemName}
                sx={{ objectFit: "contain", backgroundColor: "#fafafa" }}
              />
            )}

            <CardContent>
              <Typography variant="h6">
                {item.itemName}
              </Typography>

              <Typography color="text.secondary">
                {item.description}
              </Typography>

              <Typography sx={{ mt: 1 }}>
                📍 {item.location}
              </Typography>

              <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => approve(item._id)}
                >
                  Approve
                </Button>

                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  onClick={() => reject(item._id)}
                >
                  Reject
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
