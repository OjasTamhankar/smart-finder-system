import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Container,
  Stack,
  Divider
} from "@mui/material";
import { Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import VerifiedIcon from "@mui/icons-material/Verified";
import SecurityIcon from "@mui/icons-material/Security";

import homepageAsset from "../assets/homepageAsset.webp";

export default function Home() {
  return (
    <Box>

      {/* ================= HERO ================= */}
      <Box sx={{ py: 5, backgroundColor: "background.default" }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">

            {/* LEFT SIDE */}
            <Grid item xs={12} md={6}>
              <Typography variant="h3" fontWeight={700} gutterBottom>
                Smart Finder
              </Typography>

              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 3 }}
              >
                A structured digital platform for reporting,
                managing, and recovering lost belongings efficiently.
              </Typography>

              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  component={Link}
                  to="/register"
                >
                  Get Started
                </Button>

                <Button
                  variant="outlined"
                  component={Link}
                  to="/login"
                >
                  Login
                </Button>
              </Stack>
            </Grid>

            {/* RIGHT SIDE IMAGE */}
            <Grid item xs={12} md={6}>
              <Box display="flex" justifyContent="center">
                <Box
                  component="img"
                  src={homepageAsset}
                  alt="Smart Finder Illustration"
                  sx={{
                    width: "100%",
                    maxWidth: 450,
                    height: "auto"
                  }}
                />
              </Box>
            </Grid>

          </Grid>
        </Container>
      </Box>

      {/* ================= VALUE SECTION ================= */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            fontWeight={700}
            align="center"
            gutterBottom
          >
            Why Use Smart Finder?
          </Typography>

          <Grid container spacing={4} mt={3}>
            <ValueCard
              icon={<SearchIcon color="primary" />}
              title="Structured Dashboard"
              text="Manage lost item reports in a clean and organized interface."
            />
            <ValueCard
              icon={<VerifiedIcon color="primary" />}
              title="Verified Reports"
              text="Admin review ensures authenticity and prevents misuse."
            />
            <ValueCard
              icon={<SecurityIcon color="primary" />}
              title="Secure Platform"
              text="User data and item details are handled securely."
            />
          </Grid>
        </Container>
      </Box>

      {/* ================= PROCESS ================= */}
      <Box sx={{ py: 8, backgroundColor: "#f9fafb" }}>
        <Container maxWidth="md">
          <Typography
            variant="h4"
            fontWeight={700}
            align="center"
            gutterBottom
          >
            How It Works
          </Typography>

          <Stack spacing={3} mt={4}>
            <ProcessStep
              number="1"
              title="Report Lost Item"
              text="Submit item details including description and location."
            />
            <Divider />
            <ProcessStep
              number="2"
              title="Search & Match"
              text="Users browse and filter items to identify possible matches."
            />
            <Divider />
            <ProcessStep
              number="3"
              title="Admin Verification"
              text="Reports are verified before being displayed publicly."
            />
          </Stack>
        </Container>
      </Box>

      {/* ================= STATS ================= */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} textAlign="center">
            <Stat number="500+" label="Items Recovered" />
            <Stat number="1,200+" label="Registered Users" />
            <Stat number="95%" label="Recovery Success Rate" />
          </Grid>
        </Container>
      </Box>

      {/* ================= CTA ================= */}
      <Box sx={{ py: 8, backgroundColor: "background.default" }}>
        <Container maxWidth="sm">
          <Box textAlign="center">
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Start Using Smart Finder Today
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Create an account to report and track lost belongings.
            </Typography>

            <Button
              variant="contained"
              component={Link}
              to="/register"
            >
              Create Account
            </Button>
          </Box>
        </Container>
      </Box>

    </Box>
  );
}

/* ================= COMPONENTS ================= */

function ValueCard({ icon, title, text }) {
  return (
    <Grid item xs={12} md={4}>
      <Card sx={{ height: "100%" }}>
        <CardContent>
          <Box mb={2}>{icon}</Box>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            {title}
          </Typography>
          <Typography color="text.secondary">
            {text}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}

function ProcessStep({ number, title, text }) {
  return (
    <Box>
      <Typography
        variant="subtitle2"
        color="primary"
        fontWeight={700}
      >
        Step {number}
      </Typography>

      <Typography variant="h6" fontWeight={600}>
        {title}
      </Typography>

      <Typography color="text.secondary">
        {text}
      </Typography>
    </Box>
  );
}

function Stat({ number, label }) {
  return (
    <Grid item xs={12} md={4}>
      <Typography variant="h4" fontWeight={700}>
        {number}
      </Typography>
      <Typography color="text.secondary">
        {label}
      </Typography>
    </Grid>
  );
}