import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack
} from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import SearchIcon from "@mui/icons-material/Search";
import InventoryIcon from "@mui/icons-material/Inventory";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

/* ================= DASHBOARD ================= */

export default function UserDashboard() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/lost/mine").then(res => {
      setItems(res.data);
    });
  }, []);

  const total = items.length;
  const found = items.filter(i => i.status === "Found").length;
  const active = total - found;
  const successRate =
    total > 0 ? Math.round((found / total) * 100) : 0;

  return (
    <Box>
      {/* ================= PAGE HEADER ================= */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700}>
          Welcome Back 👋
        </Typography>
        <Typography color="text.secondary">
          Here’s an overview of your lost item activity
        </Typography>
      </Box>

      {/* ================= STATS CARDS ================= */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <StatCard title="Total Reports" value={total} />
        <StatCard title="Items Found" value={found} color="success.main" />
        <StatCard title="Active Reports" value={active} color="warning.main" />
        <StatCard title="Success Rate" value={`${successRate}%`} color="primary.main" />
      </Grid>

      {/* ================= QUICK ACTIONS ================= */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Quick Actions
              </Typography>

              <Stack spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<AddBoxIcon />}
                  onClick={() => navigate("/post-lost")}
                >
                  Post Lost Item
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<SearchIcon />}
                  onClick={() => navigate("/lost-items")}
                >
                  Browse Lost Items
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<InventoryIcon />}
                  onClick={() => navigate("/my-lost-items")}
                >
                  Manage My Reports
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* ================= RECENT ACTIVITY ================= */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Recent Activity
              </Typography>

              {items.slice(0, 3).length === 0 ? (
                <Typography color="text.secondary">
                  No recent activity yet.
                </Typography>
              ) : (
                items.slice(0, 3).map(item => (
                  <Box
                    key={item._id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: "#f3f4f6"
                    }}
                  >
                    <Box>
                      <Typography fontWeight={600}>
                        {item.itemName}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {item.location}
                      </Typography>
                    </Box>

                    {item.status === "Found" && (
                      <CheckCircleIcon
                        sx={{ color: "success.main" }}
                      />
                    )}
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
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