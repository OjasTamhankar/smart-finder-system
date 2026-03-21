import Header from "./Header";
import Footer from "./Footer";
import { Container } from "@mui/material";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <Container sx={{ mt: 4, mb: 4, minHeight: "75vh" }}>
        {children}
      </Container>
      <Footer />
    </>
  );
}
