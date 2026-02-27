import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout({ children }) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN AREA */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "background.default"
        }}
      >
        <Topbar />

        <Box
          sx={{
            flex: 1,
            p: { xs: 2, md: 4 },
            overflowY: "auto"
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}