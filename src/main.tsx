import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { UserAuthProvider } from "./user/context/UserAuthContext";
import { ThemeProvider } from "./user/context/ThemeContext";

import { Toaster } from "react-hot-toast";

// ✅ PWA Registration
import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  immediate: true,

  onNeedRefresh() {
    console.log("🚀 New LynQ update available.");
  },

  onOfflineReady() {
    console.log("✅ LynQ is ready for offline use.");
  },
});

const queryClient = new QueryClient();

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <UserAuthProvider>
        <ThemeProvider>
          <>
            <App />

            <Toaster position="top-center" />
          </>
        </ThemeProvider>
      </UserAuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);