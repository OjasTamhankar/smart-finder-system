import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Divider,
  CircularProgress,
  Stack
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import api from "../../services/api";

function formatNotificationTime(createdAt) {
  const notificationDate = new Date(createdAt);

  if (Number.isNaN(notificationDate.getTime())) {
    return "";
  }

  const elapsedMs = Date.now() - notificationDate.getTime();
  const minutes = Math.floor(elapsedMs / 60000);

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hr ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }

  return notificationDate.toLocaleDateString();
}

export default function Topbar() {
  const role = localStorage.getItem("role");
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingRead, setIsMarkingRead] = useState(false);

  const unreadCount = notifications.filter(
    notification => !notification.isRead
  ).length;

  const loadNotifications = async (showLoader = false) => {
    if (showLoader) {
      setIsLoading(true);
    }

    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications(true);

    const interval = window.setInterval(() => {
      loadNotifications();
    }, 15000);

    const refreshNotifications = () => {
      loadNotifications();
    };

    window.addEventListener(
      "notifications:refresh",
      refreshNotifications
    );

    return () => {
      window.clearInterval(interval);
      window.removeEventListener(
        "notifications:refresh",
        refreshNotifications
      );
    };
  }, []);

  const handleMarkAllAsRead = async () => {
    if (!unreadCount) {
      return;
    }

    setIsMarkingRead(true);

    try {
      await api.patch("/notifications/read-all");
      setNotifications(current =>
        current.map(notification => ({
          ...notification,
          isRead: true
        }))
      );
    } catch (err) {
      console.error("Failed to update notifications", err);
    } finally {
      setIsMarkingRead(false);
    }
  };

  return (
    <Box
      sx={{
        height: 64,
        backgroundColor: "background.paper",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 4,
        borderBottom: "1.5px solid #000000"
      }}
    >
      <Typography variant="h6" fontWeight={600}>
        {role === "admin" ? "Admin Panel" : "Dashboard"}
      </Typography>

      <Stack direction="row" spacing={1} alignItems="center">
        <IconButton onClick={event => setAnchorEl(event.currentTarget)}>
          <Badge
            badgeContent={unreadCount}
            color="error"
            max={9}
          >
            <NotificationsNoneOutlinedIcon />
          </Badge>
        </IconButton>

        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: "#111827"
          }}
        >
          <PersonIcon sx={{ fontSize: 22 }} />
        </Avatar>
      </Stack>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        PaperProps={{
          sx: {
            width: 360,
            maxWidth: "calc(100vw - 32px)",
            mt: 1
          }
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="subtitle1" fontWeight={700}>
              Notifications
            </Typography>

            <Button
              size="small"
              onClick={handleMarkAllAsRead}
              disabled={!unreadCount || isMarkingRead}
            >
              {isMarkingRead ? "Saving..." : "Mark all read"}
            </Button>
          </Stack>
        </Box>

        <Divider />

        {isLoading ? (
          <Box
            sx={{
              py: 4,
              display: "flex",
              justifyContent: "center"
            }}
          >
            <CircularProgress size={24} />
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ px: 2, py: 3 }}>
            <Typography fontWeight={600}>
              No notifications yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              New lost item posts will appear here.
            </Typography>
          </Box>
        ) : (
          notifications.map(notification => (
            <MenuItem
              key={notification._id}
              sx={{
                whiteSpace: "normal",
                alignItems: "flex-start",
                py: 1.5,
                backgroundColor: notification.isRead
                  ? "transparent"
                  : "rgba(37, 99, 235, 0.08)"
              }}
            >
              <Box sx={{ width: "100%" }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mb: 0.5 }}
                >
                  <Typography fontWeight={700}>
                    {notification.title}
                  </Typography>

                  {!notification.isRead && (
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "primary.main"
                      }}
                    />
                  )}
                </Stack>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.75 }}
                >
                  {notification.message}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  {formatNotificationTime(notification.createdAt)}
                </Typography>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>
    </Box>
  );
}
