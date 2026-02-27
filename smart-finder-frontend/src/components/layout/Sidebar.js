import { Box, Typography, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddBoxIcon from "@mui/icons-material/AddBox";
import SearchIcon from "@mui/icons-material/Search";
import InventoryIcon from "@mui/icons-material/Inventory";
import LogoutIcon from "@mui/icons-material/Logout";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");

  const menuItems =
    role === "admin"
      ? [
          { label: "Admin Dashboard", icon: <AdminPanelSettingsIcon />, path: "/admin-dashboard" },
          { label: "Logout", icon: <LogoutIcon />, path: "/logout" }
        ]
      : [
          { label: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
          { label: "Post Lost", icon: <AddBoxIcon />, path: "/post-lost" },
          { label: "Browse Items", icon: <SearchIcon />, path: "/lost-items" },
          { label: "My Reports", icon: <InventoryIcon />, path: "/my-lost-items" },
          { label: "Logout", icon: <LogoutIcon />, path: "/logout" }
        ];

  return (
    <Box
      sx={{
        width: 260,
        backgroundColor: "#111827",
        color: "#fff",
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        p: 3
      }}
    >
      <Typography variant="h6" sx={{ mb: 4, fontWeight: 700 }}>
        Smart Finder
      </Typography>

      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
            sx={{
              borderRadius: 2,
              mb: 1,
              "&.Mui-selected": {
                backgroundColor: "#1f2937"
              }
            }}
          >
            <ListItemIcon sx={{ color: "#9ca3af" }}>
              {item.icon}
            </ListItemIcon>

            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}