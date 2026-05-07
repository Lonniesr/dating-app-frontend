import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // ← ADD THIS LINE

import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserAuthProvider } from "./user/context/UserAuthContext";
import { ThemeProvider } from "./user/context/ThemeContext";

// ✅ ADD THIS
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <UserAuthProvider>
          <ThemeProvider>
            <>
              <App />

              {/* ✅ TOAST MOUNT POINT */}
              <Toaster position="top-center" />
            </>
          </ThemeProvider>
        </UserAuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);