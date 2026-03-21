import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import PostLost from "./pages/PostLost";
import LostItems from "./pages/LostItems";
import MyLostItems from "./pages/MyLostItems";   // ✅ ADD THIS
import ReportFound from "./pages/ReportFound";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Logout from "./pages/Logout";

export default function App() {
  const theme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#1976d2"
      }
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin-login" element={<AdminLogin />} />

            {/* User */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute roleRequired="user">
                  <UserDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/post-lost"
              element={
                <ProtectedRoute roleRequired="user">
                  <PostLost />
                </ProtectedRoute>
              }
            />

            <Route
              path="/lost-items"
              element={
                <ProtectedRoute roleRequired="user">
                  <LostItems />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-lost-items"
              element={
                <ProtectedRoute roleRequired="user">
                  <MyLostItems />
                </ProtectedRoute>
              }
            />

            <Route
              path="/report-found/:id"
              element={
                <ProtectedRoute roleRequired="user">
                  <ReportFound />
                </ProtectedRoute>
              }
            />

            {/* Admin */}
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute roleRequired="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="/logout" element={<Logout />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}
