import { Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function ImageLightbox({ src, onClose }) {
  if (!src) return null;

  return (
    <Box
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      sx={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1300
      }}
    >
      <Box
        onClick={e => e.stopPropagation()}
        sx={{
          position: "relative",
          maxWidth: "90%",
          maxHeight: "90%"
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: -40,
            right: 0,
            color: "#fff"
          }}
        >
          <CloseIcon />
        </IconButton>

        <img
          src={src}
          alt="Full view"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            borderRadius: 8
          }}
        />
      </Box>
    </Box>
  );
}
