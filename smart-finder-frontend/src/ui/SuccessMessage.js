import { Snackbar, Alert } from "@mui/material";

export default function SuccessMessage({ message, show }) {
  return (
    <Snackbar
      open={show}
      autoHideDuration={2500}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert severity="success" variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
}