import { 
  Box, Typography, Button, Grid, Card 
} from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import cityImg from "../assets/undraw_walk-in-the-city_tk65.svg";
import postImg from "../assets/undraw_add-post_prex.svg";
import findImg from "../assets/undraw_dropdown-menu_qvci.svg";
import smartImg from "../assets/undraw_post_eok2.svg";
import reportImg from "../assets/registration.svg";
import aletImg from "../assets/undraw_add-user_rbko.svg";
import adminImg from "../assets/adminlogin.svg";

/* ================= ANIMATION VARIANTS ================= */

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8 } 
  }
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.2 }
  }
};

export default function Home() {
  return (
    <Box>

      {/* ================= HERO ================= */}
      <Section gradient>
        <Grid container spacing={6} alignItems="center">

          <Grid item xs={12} md={6}>
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
            >

              <motion.div variants={fadeUp}>
                <Typography variant="h2" fontWeight={800} mb={1}>
                  Smart Finder
                </Typography>
              </motion.div>

              <motion.div variants={fadeUp}>
                <Typography variant="h5" color="primary" mb={3}>
                  Digital Lost & Found Platform
                </Typography>
              </motion.div>

              <motion.div variants={fadeUp}>
                <Typography lineHeight={1.9} color="text.secondary" mb={4}>
                  Smart Finder helps people recover lost belongings through a secure
                  digital system. Users can easily report items, search listings,
                  and connect with finders — all in one trusted platform.
                </Typography>
              </motion.div>

              <motion.div variants={fadeUp}>
                <Box display="flex" gap={2} flexWrap="wrap">
                  <Button variant="contained" size="large" component={Link} to="/login">
                    User Login
                  </Button>

                  <Button variant="outlined" size="large" component={Link} to="/register">
                    Register
                  </Button>

                  <Button size="large" component={Link} to="/admin-login">
                    Admin Login
                  </Button>
                </Box>
              </motion.div>

            </motion.div>
          </Grid>

          <Grid item xs={12} md={6} textAlign="center">
            <motion.img 
              src={cityImg}
              style={{ width: "100%", maxWidth: 500 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            />
          </Grid>

        </Grid>
      </Section>

      {/* ================= ABOUT ================= */}
      <AnimatedSection center>
        <Typography variant="h3" fontWeight={800} mb={3}>
          About Smart Finder
        </Typography>

        <Typography maxWidth={850} mx="auto" lineHeight={1.9} color="text.secondary">
          Traditional lost and found systems rely on paper registers and word of mouth.
          Smart Finder replaces this with a digital platform where lost items can be
          reported, verified and tracked in real time, making recovery faster and easier.
        </Typography>
      </AnimatedSection>

      {/* ================= STATS ================= */}
      <Section soft center>
        <Grid container spacing={4}>
          <Stat number="500+" label="Items Recovered" />
          <Stat number="1,200+" label="Active Users" />
          <Stat number="95%" label="Success Rate" />
        </Grid>
      </Section>

      {/* ================= PROBLEMS ================= */}
      <AnimatedSection>
        <Typography variant="h3" fontWeight={800} mb={6} center>
          Why Traditional Systems Fail
        </Typography>

        <Grid container spacing={4}>
          {problems.map((p, i) => (
            <Grid item xs={12} md={4} key={i}>
              <AnimatedCard>
                <CardBox text={p} />
              </AnimatedCard>
            </Grid>
          ))}
        </Grid>
      </AnimatedSection>

      {/* ================= SOLUTION ================= */}
      <AnimatedSection soft>
        <Grid container spacing={6} alignItems="center">

          <Grid item xs={12} md={6}>
            <Typography variant="h3" fontWeight={800} mb={3}>
              A Smarter Way To Recover Items
            </Typography>

            <Typography lineHeight={1.9} color="text.secondary">
              Smart Finder offers a secure digital workflow where every report is verified,
              searchable and instantly visible to users. This improves trust, saves time,
              and increases the chances of finding lost belongings.
            </Typography>
          </Grid>

          <Grid item xs={12} md={6} textAlign="center">
            <motion.img
              src={findImg}
              style={{ width: "100%", maxWidth: 420 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
            />
          </Grid>

        </Grid>
      </AnimatedSection>

      {/* ================= WHY IT WORKS ================= */}
      <AnimatedSection center>
        <Typography variant="h3" fontWeight={800} mb={6}>
          Why Smart Finder Works Better
        </Typography>

        <Grid container spacing={4}>
          <InfoCard
            title="Verified Reports"
            text="Admins review every submission to prevent fake or incorrect data."
          />
          <InfoCard
            title="Easy To Use"
            text="Simple interface for quick reporting and searching."
          />
          <InfoCard
            title="Instant Updates"
            text="Users get notified as soon as a match is found."
          />
        </Grid>
      </AnimatedSection>

      {/* ================= FEATURES ================= */}
      <AnimatedSection soft center>
        <Typography variant="h3" fontWeight={800} mb={6}>
          Platform Features
        </Typography>

        <Grid container spacing={4}>
          {features.map((f, i) => (
            <Grid item xs={12} md={4} key={i}>
              <AnimatedCard>
                <FeatureCard {...f} />
              </AnimatedCard>
            </Grid>
          ))}
        </Grid>
      </AnimatedSection>

      {/* ================= CTA ================= */}
      <Section gradient center>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="h3" fontWeight={900} mb={2}>
            Start Using Smart Finder Today
          </Typography>

          <Typography mb={4}>
            Recover lost items faster with a smart digital system.
          </Typography>

          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/register"
          >
            Get Started
          </Button>
        </motion.div>
      </Section>

    </Box>
  );
}

/* ================= DATA ================= */

const problems = [
  "There is no single place where people can check lost items.",
  "Paper registers and notice boards are slow and unreliable.",
  "Fake or wrong reports often create confusion.",
  "Many items are never returned to their owners.",
  "Only nearby people can see lost notices.",
  "Communication between finder and owner is difficult."
];

const features = [
  {
    img: postImg,
    title: "Post Lost Items",
    text: "Upload images, location and item details easily."
  },
  {
    img: adminImg,
    title: "Admin Verification",
    text: "Every report is checked for authenticity."
  },
  {
    img: reportImg,
    title: "Found Reports",
    text: "Finders can report items they discover."
  },
  {
    img: smartImg,
    title: "Smart Search",
    text: "Filter items by category and location."
  },
  {
    img: aletImg,
    title: "Instant Alerts",
    text: "Get notified when someone finds your item."
  },
  {
    img: findImg,
    title: "Responsive Design",
    text: "Works smoothly on mobile and desktop."
  }
];

/* ================= REUSABLE ================= */

function Section({ children, soft, gradient, center }) {
  return (
    <Box
      sx={{
        py: 12,
        px: 3,
        background: gradient
          ? "linear-gradient(135deg, #e8f0ff 0%, #ffffff 70%)"
          : soft
          ? "#f7f9fc"
          : "#ffffff",
        textAlign: center ? "center" : "left"
      }}
    >
      <Box maxWidth={1200} mx="auto">
        {children}
      </Box>
    </Box>
  );
}

function AnimatedSection({ children, soft, center }) {
  return (
    <Section soft={soft} center={center}>
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {children}
      </motion.div>
    </Section>
  );
}

function AnimatedCard({ children }) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

function FeatureCard({ img, title, text }) {
  return (
    <Card
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 4,
        height: "100%",
        boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
        transition: "0.3s"
      }}
    >
      <img src={img} style={{ width: 140, marginBottom: 20 }} />
      <Typography variant="h6" mb={1}>{title}</Typography>
      <Typography color="text.secondary">{text}</Typography>
    </Card>
  );
}

function CardBox({ text }) {
  return (
    <Card
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        boxShadow: "0 8px 20px rgba(0,0,0,0.05)"
      }}
    >
      <Typography color="text.secondary">{text}</Typography>
    </Card>
  );
}

function InfoCard({ title, text }) {
  return (
    <Grid item xs={12} md={4}>
      <Card
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 4,
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)"
        }}
      >
        <Typography variant="h6" mb={1}>{title}</Typography>
        <Typography color="text.secondary">{text}</Typography>
      </Card>
    </Grid>
  );
}

function Stat({ number, label }) {
  return (
    <Grid item xs={12} md={4}>
      <Typography variant="h3" fontWeight={900}>{number}</Typography>
      <Typography color="text.secondary">{label}</Typography>
    </Grid>
  );
}
