import { Dialog } from "@mui/material";

export default function ImageViewer({ open, onClose, src }) {
  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <img
        src={src}
        alt="full view"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          backgroundColor: "black"
        }}
        onClick={onClose}
      />
    </Dialog>
  );
}
