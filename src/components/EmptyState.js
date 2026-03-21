import { Box, Typography } from "@mui/material";

export default function EmptyState({ title, subtitle }) {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: 6,
        color: "text.secondary"
      }}
    >
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
