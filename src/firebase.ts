import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCuaQAKF0pXrKWWrdRObhV158dNbIzQn4U",
  authDomain: "lynq-3ba2d.firebaseapp.com",
  projectId: "lynq-3ba2d",
  storageBucket: "lynq-3ba2d.firebasestorage.app",
  messagingSenderId: "667931253340",
  appId: "1:667931253340:web:f2905cb18779b90e222499"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export async function getPushToken() {
  try {
    const token = await getToken(messaging, {
      vapidKey: "BA1lmkJz-__UZTKqJEA83sy-Yl6EkBUYiaHrp6nYCHE5LXX4yWEdUGK5BrJJn-UU6OXnganAE_8DK3s9_ex4RW8",
    });

    console.log("🔥 PUSH TOKEN:", token);

    return token;
  } catch (err) {
    console.error("❌ Push token error:", err);
    return null;
  }
}