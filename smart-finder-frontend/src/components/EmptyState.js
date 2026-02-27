import { Box, Typography } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";

export default function EmptyState({ title, subtitle }) {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: 8,
        color: "text.secondary"
      }}
    >
      <InboxIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />

      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>

      {subtitle && (
        <Typography variant="body2">
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}