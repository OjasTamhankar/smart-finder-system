import { Box, Typography, Avatar } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

export default function Topbar() {
  const role = localStorage.getItem("role");

  return (
    <Box
      sx={{
        height: 64,
        backgroundColor: "background.paper",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 4,
        borderBottom: "1.5px solid #000000"
      }}
    >
      <Typography variant="h6" fontWeight={600}>
        {role === "admin" ? "Admin Panel" : "Dashboard"}
      </Typography>

      <Avatar
        sx={{
          width: 40,
          height: 40,
          bgcolor: "#111827"
        }}
      >
        <PersonIcon sx={{ fontSize: 22 }} />
      </Avatar>
    </Box>
  );
}