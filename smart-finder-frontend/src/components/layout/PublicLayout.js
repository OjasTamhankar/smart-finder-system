import { Box } from "@mui/material";
import Header from "../Header";
import Footer from "../Footer";

export default function PublicLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(to bottom, #f8fafc, #eef2ff)"
      }}
    >
      <Header />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2
        }}
      >
        {children}
      </Box>

      <Footer />
    </Box>
  );
}