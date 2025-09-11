import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { scheduleKeepAlive } from "@/utils/keepAlive.ts";

// @comment: Initialize Supabase keep-alive scheduler to prevent database auto-pause
// Schedule pings every 6 days (144 hours) to keep database active
if (import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY) {
  scheduleKeepAlive(144); // 6 days in hours
  console.log("Supabase keep-alive scheduler initialized");
} else {
  console.warn("Supabase service role key not found - keep-alive disabled");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
