export default function Container({ children }) {
  return (
    <div style={{
      maxWidth: "1100px",
      margin: "0 auto",
      padding: "0 var(--space-md)"
    }}>
      {children}
    </div>
  );
}
