import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { Link } from "react-router-dom";

/* ================= PUBLIC HEADER ================= */

export default function Header() {
  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{
        borderBottom: "1px solid #e5e7eb",
        backgroundColor: "#ffffff"
      }}
    >
      <Toolbar
        sx={{
          maxWidth: 1200,
          width: "100%",
          mx: "auto",
          px: { xs: 2, md: 3 },
          display: "flex",
          justifyContent: "space-between"
        }}
      >
        {/* LOGO */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            textDecoration: "none"
          }}
        >
          <SearchRoundedIcon
            sx={{
              color: "primary.main",
              fontSize: 28
            }}
          />

          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              color: "#111827"
            }}
          >
            Smart Finder
          </Typography>
        </Box>

        {/* NAVIGATION */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button component={Link} to="/login">
            Login
          </Button>

          <Button component={Link} to="/register">
            Register
          </Button>

          <Button component={Link} to="/admin-login" color="secondary">
            Admin
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}