import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  ThemeProvider,
  createTheme,
  CssBaseline
} from "@mui/material";
import { deepmerge } from "@mui/utils";

/* ================= LAYOUTS ================= */

import PublicLayout from "./components/layout/PublicLayout";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";

/* ================= PAGES ================= */

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import PostLost from "./pages/PostLost";
import LostItems from "./pages/LostItems";
import MyLostItems from "./pages/MyLostItems";
import ReportFound from "./pages/ReportFound";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Logout from "./pages/Logout";

/* ================= THEME ================= */

const baseTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2563eb"
    },
    secondary: {
      main: "#7c3aed"
    },
    background: {
      default: "#f5f7fb",
      paper: "#ffffff"
    }
  },
  typography: {
    fontFamily: `"Inter", "Segoe UI", sans-serif`,
    h1: { fontWeight: 800 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    body1: { lineHeight: 1.7 },
    body2: { lineHeight: 1.6 },
    button: {
      textTransform: "none",
      fontWeight: 600
    }
  },
  shape: {
    borderRadius: 12
  }
});

const theme = createTheme(
  deepmerge(baseTheme, {
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: "10px 18px"
          }
        }
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
          }
        }
      }
    }
  })
);

/* ================= APP ================= */

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <BrowserRouter>
        <Routes>

          {/* ================= PUBLIC ROUTES ================= */}

          <Route
            path="/"
            element={
              <PublicLayout>
                <Home />
              </PublicLayout>
            }
          />

          <Route
            path="/login"
            element={
              <PublicLayout>
                <Login />
              </PublicLayout>
            }
          />

          <Route
            path="/register"
            element={
              <PublicLayout>
                <Register />
              </PublicLayout>
            }
          />

          <Route
            path="/admin-login"
            element={
              <PublicLayout>
                <AdminLogin />
              </PublicLayout>
            }
          />

          {/* ================= USER ROUTES ================= */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roleRequired="user">
                <AppLayout>
                  <UserDashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/post-lost"
            element={
              <ProtectedRoute roleRequired="user">
                <AppLayout>
                  <PostLost />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/lost-items"
            element={
              <ProtectedRoute roleRequired="user">
                <AppLayout>
                  <LostItems />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-lost-items"
            element={
              <ProtectedRoute roleRequired="user">
                <AppLayout>
                  <MyLostItems />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/report-found/:id"
            element={
              <ProtectedRoute roleRequired="user">
                <AppLayout>
                  <ReportFound />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* ================= ADMIN ROUTES ================= */}

          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute roleRequired="admin">
                <AppLayout>
                  <AdminDashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* ================= LOGOUT ================= */}

          <Route path="/logout" element={<Logout />} />

        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}