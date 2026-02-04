export default function Card({ children }) {
  return (
    <div style={{
      background: "var(--color-surface)",
      borderRadius: "var(--radius-md)",
      boxShadow: "var(--shadow-sm)",
      padding: "var(--space-lg)",
      border: "1px solid var(--color-border)"
    }}>
      {children}
    </div>
  );
}
