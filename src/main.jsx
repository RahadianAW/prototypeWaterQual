// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

// Setup React Query Client dengan config sederhana
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000, // Data fresh selama 30 detik (sesuai backend cache)
      cacheTime: 300000, // Simpan di cache 5 menit
      refetchOnWindowFocus: false, // Jangan auto-refetch saat focus window
      retry: 1, // Retry 1x jika gagal
    },
  },
});

// Wrap dengan QueryClientProvider
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
