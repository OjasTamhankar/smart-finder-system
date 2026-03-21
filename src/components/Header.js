import { Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

export default function Header() {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const isPublicPage =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/admin-login";

  return (
    <AppBar
      position="static"
      elevation={1}
      sx={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb"
      }}
    >
      <Toolbar
        sx={{
          minHeight: 64,
          maxWidth: 1200,
          width: "100%",
          mx: "auto",
          px: { xs: 2, md: 3 },
          display: "flex",
          justifyContent: "space-between"
        }}
      >
        {/* BRAND */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.2
          }}
        >
          <SearchRoundedIcon
            sx={{
              color: "#1976d2",
              fontSize: 28
            }}
          />

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#0f172a",   // darker for visibility
              letterSpacing: "0.3px"
            }}
          >
            Smart Finder
          </Typography>
        </Box>

        {/* NAV */}
        {!isPublicPage && token && role === "user" && (
          <NavGroup>
            <NavItem to="/dashboard">Dashboard</NavItem>
            <NavItem to="/logout">Logout</NavItem>
          </NavGroup>
        )}

        {!isPublicPage && token && role === "admin" && (
          <NavGroup>
            <NavItem to="/admin-dashboard">Admin Dashboard</NavItem>
            <NavItem to="/logout">Logout</NavItem>
          </NavGroup>
        )}
      </Toolbar>
    </AppBar>
  );
}

/* ================= NAV COMPONENTS ================= */

function NavGroup({ children }) {
  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      {children}
    </Box>
  );
}

function NavItem({ to, children }) {
  return (
    <Typography
      component={Link}
      to={to}
      sx={{
        px: 2,
        py: 1,
        borderRadius: 1,
        textDecoration: "none",
        fontSize: 14.5,
        fontWeight: 500,
        color: "#334155",        // improved visibility
        transition: "background-color 0.2s ease, color 0.2s ease",
        "&:hover": {
          backgroundColor: "#e3f2fd",
          color: "#1976d2"
        }
      }}
    >
      {children}
    </Typography>
  );
}
