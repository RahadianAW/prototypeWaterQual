import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { initializeApp } from "firebase/app";

// Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

/**
 * Request notification permission & get FCM token
 */
export async function requestNotificationPermission() {
  try {
    console.log("🔔 Requesting notification permission...");

    // Request permission
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      console.log("✅ Notification permission granted");

      // Get FCM token
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });

      if (token) {
        console.log("✅ FCM Token received:", token);
        return { success: true, token };
      } else {
        console.log("❌ No token received");
        return { success: false, error: "No token" };
      }
    } else {
      console.log("❌ Notification permission denied");
      return { success: false, error: "Permission denied" };
    }
  } catch (error) {
    console.error("❌ Error getting FCM token:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Register FCM token to backend
 */
export async function registerFCMToken(token) {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const authToken = localStorage.getItem("token"); // Your JWT token

    const response = await fetch(
      `${apiUrl}/api/notifications/register-device`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ fcm_token: token }),
      }
    );

    const data = await response.json();

    if (data.success) {
      console.log("✅ FCM token registered to backend");
      localStorage.setItem("fcm_token", token);
      return { success: true };
    } else {
      console.error("❌ Failed to register token:", data.message);
      return { success: false, error: data.message };
    }
  } catch (error) {
    console.error("❌ Error registering FCM token:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Listen for foreground messages
 */
export function onMessageListener(callback) {
  onMessage(messaging, (payload) => {
    console.log("🔔 Foreground message received:", payload);

    // Show browser notification
    if (Notification.permission === "granted") {
      new Notification(payload.notification.title, {
        body: payload.notification.body,
        icon: "/vite.svg",
        tag: payload.data?.alert_id || "notification",
      });
    }

    // Call callback for UI updates
    if (callback) {
      callback(payload);
    }
  });
}
