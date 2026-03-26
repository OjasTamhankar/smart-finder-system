import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clearStoredPushNotificationToken } from "../firebase";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    let isActive = true;

    const logout = async () => {
      try {
        await clearStoredPushNotificationToken();
      } finally {
        localStorage.clear();
        window.dispatchEvent(new Event("auth:changed"));

        if (isActive) {
          navigate("/", { replace: true });
        }
      }
    };

    logout();

    return () => {
      isActive = false;
    };
  }, [navigate]);

  return null;
}
