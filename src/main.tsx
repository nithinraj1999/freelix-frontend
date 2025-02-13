import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import store from "./state/store.tsx";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const clientId = import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID;

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={clientId}>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <StrictMode>
          <App />
        </StrictMode>
      </Provider>
    </QueryClientProvider>
  </GoogleOAuthProvider>
);
