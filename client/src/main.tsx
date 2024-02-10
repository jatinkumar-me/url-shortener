import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import AuthProvider from "./context/authContext.tsx";
import URLDataProvider, { initialURLDataState } from "./context/urlDataContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <URLDataProvider initialURLDataState={initialURLDataState}>
        <App />
      </URLDataProvider>
    </AuthProvider>
  </React.StrictMode>
);
