import { Box, Typography, Button, Stack } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import SearchIcon from "@mui/icons-material/Search";
import InventoryIcon from "@mui/icons-material/Inventory";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "75vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Box sx={{ width: 420 }}>
        <Typography variant="h5" gutterBottom>
          User Dashboard
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          Select an option to manage lost items
        </Typography>

        <Stack spacing={2}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<AddBoxIcon />}
            onClick={() => navigate("/post-lost")}
          >
            Post Lost Item
          </Button>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<SearchIcon />}
            onClick={() => navigate("/lost-items")}
          >
            View Lost Items
          </Button>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<InventoryIcon />}
            onClick={() => navigate("/my-lost-items")}
          >
            My Lost Items
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
