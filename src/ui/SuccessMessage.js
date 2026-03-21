export default function SuccessMessage({ message, show }) {
  if (!show) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        background: "#16a34a", // green
        color: "#fff",
        padding: "12px 20px",
        borderRadius: "8px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        fontSize: 14,
        zIndex: 9999,
        transition: "opacity 200ms ease"
      }}
    >
      {message}
    </div>
  );
}
