export default function Button({
  children,
  variant = "primary",
  ...props
}) {
  const styles = {
    primary: {
      background: "var(--color-primary)",
      color: "#fff"
    },
    outline: {
      background: "#fff",
      color: "var(--color-primary)",
      border: "1px solid var(--color-primary)"
    },
    danger: {
      background: "var(--color-danger)",
      color: "#fff"
    }
  };

  return (
    <button
      {...props}
      style={{
        padding: "10px 16px",
        borderRadius: "var(--radius-sm)",
        border: "none",
        fontWeight: 500,
        ...styles[variant]
      }}
    >
      {children}
    </button>
  );
}
