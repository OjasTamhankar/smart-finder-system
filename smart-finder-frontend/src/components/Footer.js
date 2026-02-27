import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 6,
        py: 4,
        textAlign: "center",
        borderTop: "1px solid #e5e7eb",
        backgroundColor: "#ffffff"
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} Smart Finder — Digital Lost & Found Platform
      </Typography>
    </Box>
  );
}